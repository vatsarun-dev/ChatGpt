import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/auth.ts";
import { getConversationTitle, getStream } from "../../service/ai.service";
import ConversationRepo from "../../repository/conversation.repo";
export default class ChatService {
  private conversationRepo = new ConversationRepo();
  async chatService(req: AuthenticatedRequest, res: Response) {
    const { message, conversationId } = req.body as {
      message: string;
      conversationId: string;
    };
    const user = req.user;

    if (!conversationId) {
      const title = await getConversationTitle({ message });
      const newConversation = await this.conversationRepo.createConversation({
        title,
        userId: user.id,
      });
    }

    const stream = await getStream({ message });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      res.write(`data: ${chunk}\n\n`);
    }
  }
}
