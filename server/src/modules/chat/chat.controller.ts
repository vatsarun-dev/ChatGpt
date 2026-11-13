import {Request, Response } from "express"
import ChatService from "./chat.service";

export default class ChatController{
    private readonly chatControllers = new ChatService();
    async chatController(req:Request, res:Response){
        const user = await this.chatControllers.chatService(req,res)
          res.status(200).json({
            message:"chat successfully",
            user:user
        })
    }
}