import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../types/auth.ts";
import ChatService from "./chat.service";

export default class ChatController {
  private readonly chatControllers = new ChatService();
  async chatController(req: Request, res: Response): Promise<void> {
    await this.chatControllers.chatService(req as AuthenticatedRequest, res);
  }

  async conversationsController(req: Request, res: Response): Promise<void> {
    const conversations = await this.chatControllers.getConversations(req as AuthenticatedRequest);
    res.json({ conversations });
  }

  async messagesController(req: Request, res: Response): Promise<void> {
    const messages = await this.chatControllers.getConversationMessages(
      req as AuthenticatedRequest,
      String(req.params.conversationId),
    );
    if (!messages) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }
    res.json({ messages });
  }
}
