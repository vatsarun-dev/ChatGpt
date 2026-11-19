import { Request, Response } from "express";
import { getConversationTitle } from "../../service/ai.service";
export default class ChatService {
  async chatService(req: Request, res: Response) {
    const { message, conversationId } = req.body as {
      message: string;
      conversationId: string;
    };

    if (!conversationId) {
      const title = await getConversationTitle({ message });
    }
  }
}
