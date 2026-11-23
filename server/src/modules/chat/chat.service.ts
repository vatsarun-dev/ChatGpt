import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/auth.ts";
import { getConversationTitle, getStream } from "../../service/ai.service.ts";
import ConversationRepo from "../../repository/conversation.repo.ts";
import MessageRepo from "../../repository/message.repo.ts";
export default class ChatService {
  private conversationRepo = new ConversationRepo();
  private messageRepo = new MessageRepo();
  async chatService(req: AuthenticatedRequest, res: Response) {
    const { message, conversationId } = req.body as {
      message: string;
      conversationId?: string;
    };
    const user = req.user;

    let activeConversationId = conversationId;
    if (!activeConversationId) {
      const title = await getConversationTitle({ message });
      const conversation = await this.conversationRepo.createConversation({
        title,
        userId: user.id,
      });
      activeConversationId = String(conversation._id);
    } else {
      const conversation =
        await this.conversationRepo.findById(activeConversationId);
      if (!conversation || String(conversation.userId) !== user.id) {
        res.status(404).json({ message: "Conversation not found" });
        return;
      }
    }

    await this.messageRepo.createMessage({
      content: message,
      author: "user",
      conversationId: activeConversationId,
    });

    const messages =
      await this.messageRepo.findByConversationId(activeConversationId);
    const stream = await getStream({ messages, userId: user.id });

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("X-Conversation-Id", activeConversationId);
    res.flushHeaders();
    let aiMessage: string = "";

    try {
      for await (const [token, metadata] of stream) {
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
      await this.messageRepo.createMessage({
        content: aiMessage,
        author: "ai",
        conversationId: activeConversationId,
      });
      await this.conversationRepo.touch(activeConversationId);
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
