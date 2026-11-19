import { Request, Response } from "express";
import { getConversationTitle } from "../../service/ai.service";
import ConversationRepo from "../../repository/conversation.repo";
export default class ChatService {
  private conversationRepo = new ConversationRepo();
  async chatService(req: Request, res: Response) {
    const { message, conversationId } = req.body as {
      message: string;
      conversationId: string;
    };
    const user = (
      req as Request & {
        user?: { id: string };
      }
    ).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!conversationId) {
      const title = await getConversationTitle({ message });
      const newConversation = await this.conversationRepo.createConversation({
        title,
        userId: user.id,
      });
    }
  }
}
