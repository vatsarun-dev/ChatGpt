import {Request, Response} from "express"
export default class ChatService{
async chatService(req:Request, res:Response){
    const {message}= req.body as {message:string}
    if(!message) throw new Error("please fill all the details")
    return message
}
}