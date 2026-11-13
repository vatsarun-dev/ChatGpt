import { Request, Response } from "express";
import ChatService from "./chat.service";
import { StatusCodes } from "http-status-codes";

export default class ChatController {
  private readonly chatControllers = new ChatService();
  async chatController(req: Request, res: Response) {
    const user = await this.chatControllers.chatService(req, res);
    res.status(StatusCodes.OK).json({
      message: "chat successfully",
      user: user,
    });
  }
}
