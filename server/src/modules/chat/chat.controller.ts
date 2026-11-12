import {Request, Response } from "express"
import{ResponseType} from "../../types/response.type"
import ChatService from "./chat.service";

export default class ChatController{
    constructor(){
        this.chatController= new ChatService()
    }
    async chatController(req:Request, res:Response): Promise<ResponseType>{
        const user = await this.chatController.chatService(req,res)
        return res.status(200).json({
            message:"chat successfully",
            user:user
        })
    }
}