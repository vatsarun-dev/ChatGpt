import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/auth.ts";
import { getConversationTitle, getStream } from "../../service/ai.service";
import ConversationRepo from "../../repository/conversation.repo";
import MessageRepo from "../../repository/message.repo.ts";
export default class ChatService {
  private conversationRepo = new ConversationRepo();
  private messageRepo = new MessageRepo();
  async chatService(req: AuthenticatedRequest, res: Response) {
    const { message, conversationId } = req.body as {
      message: string;
      conversationId: string;
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
    }

    await this.messageRepo.createMessage({
      content: message,
      author: "user",
      conversationId: activeConversationId,
    });
    const stream = await getStream({ message });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    let aiMessage: string = "";

    try {
      for await (const chunk of stream) {
        const content = chunk.content;
        if (typeof content !== "string" || !content) continue;

        aiMessage += content;
        res.write(`data: ${content}\n\n`);
      }
      await this.messageRepo.createMessage({
        content: aiMessage,
        author: "ai",
        conversationId: activeConversationId,
      });
      res.end();
    } catch (error) {
      // Once SSE headers/chunks have been sent, Express cannot send a JSON error
      // response. Close the stream so the client can detect the interrupted reply.
      res.destroy(error instanceof Error ? error : undefined);
    }
  }
}
