import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../types/auth.ts";
import ChatService from "./chat.service";

export default class ChatController {
  private readonly chatControllers = new ChatService();
  async chatController(req: Request, res: Response): Promise<void> {
    await this.chatControllers.chatService(req as AuthenticatedRequest, res);
  }
}
