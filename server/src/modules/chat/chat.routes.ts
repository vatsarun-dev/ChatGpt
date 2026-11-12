import {Router} from "express"
import asyncHandler from "../../utils/asyncHandler";
import ChatController from "./chat.controller";
const chatRoutes= Router()
const chatController= new ChatController()
chatRoutes.post("chat",
    asyncHandler(chatController.ChatController.bind(chatController)))
export default chatRoutes