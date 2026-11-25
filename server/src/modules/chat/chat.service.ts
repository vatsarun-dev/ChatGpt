import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/auth.ts";
import { getConversationTitle, getStream } from "../../service/ai.service.ts";
import ConversationRepo from "../../repository/conversation.repo.ts";
import MessageRepo from "../../repository/message.repo.ts";
import UserRepo from "../../repository/user.repo.ts";
import * as error from "../../shared/error/globalError.ts";
export default class ChatService {
  private conversationRepo = new ConversationRepo();
  private messageRepo = new MessageRepo();
  private userRepo = new UserRepo();
  async chatService(req: AuthenticatedRequest, res: Response) {
    const { message, conversationId } = req.body as {
      message: string;
      conversationId?: string;
    };
    const user = req.user;

    // A valid JWT can outlive the account in the database it was issued from
    // (for example, after switching the deployed database). Do not start an
    // AI request or write conversation data for a missing account.
    const [existingUser, existingConversation, priorMessages] = await Promise.all([
      this.userRepo.findById(user.id),
      conversationId
        ? this.conversationRepo.findById(conversationId)
        : Promise.resolve(null),
      conversationId
        ? this.messageRepo.findByConversationId(conversationId)
        : Promise.resolve([]),
    ]);

    if (!existingUser) {
      throw new error.UNAUTHORIZED("User not found. Please sign in again.");
    }

    let activeConversationId = conversationId;
    if (!activeConversationId) {
      const fallbackTitle =
        message.trim().slice(0, 30) || "New conversation";
      const conversation = await this.conversationRepo.createConversation({
        title: fallbackTitle,
        userId: user.id,
      });
      activeConversationId = String(conversation._id);

      // Generate the AI title in the background so it never delays the stream.
      void getConversationTitle({ message })
        .then((title) =>
          this.conversationRepo.updateTitle(activeConversationId!, title),
        )
        .catch(() => {});
    } else if (
      !existingConversation ||
      String(existingConversation.userId) !== user.id
    ) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    const promptMessages = [
      ...priorMessages,
      { author: "user" as const, content: message },
    ];

    const [, stream] = await Promise.all([
      this.messageRepo.createMessage({
        content: message,
        author: "user",
        conversationId: activeConversationId,
      }),
      getStream({ messages: promptMessages, userId: user.id }),
    ]);

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("X-Conversation-Id", activeConversationId);
    res.flushHeaders();
    let aiMessage: string = "";

    try {
      for await (const [token] of stream) {
        if (
          typeof token?.getType === "function" &&
          token.getType() !== "ai"
        ) {
          continue;
        }
        const content = token.content;
        if (typeof content !== "string" || !content) continue;

        aiMessage += content;
        const event = content
          .split("\n")
          .map((line) => `data: ${line}`)
          .join("\n");
        res.write(`${event}\n\n`);
        (res as Response & { flush?: () => void }).flush?.();
      }
      await Promise.all([
        this.messageRepo.createMessage({
          content: aiMessage,
          author: "ai",
          conversationId: activeConversationId,
        }),
        this.conversationRepo.touch(activeConversationId),
      ]);
      res.end();
    } catch (error) {
      // Once SSE headers/chunks have been sent, Express cannot send a JSON error
      // response. Close the stream so the client can detect the interrupted reply.
      res.destroy(error instanceof Error ? error : undefined);
    }
  }

  async getConversations(req: AuthenticatedRequest) {
    return this.conversationRepo.findByUserId(req.user.id);
  }

  async getConversationMessages(
    req: AuthenticatedRequest,
    conversationId: string,
  ) {
    const conversation = await this.conversationRepo.findById(conversationId);
    if (!conversation || String(conversation.userId) !== req.user.id) {
      return null;
    }
    return this.messageRepo.findByConversationId(conversationId);
  }
}
