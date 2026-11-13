import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ChatController from "./chat.controller";
import { chatValidation } from "../../validation/chat.validation";
const chatRoutes = Router();
const chatController = new ChatController();
chatRoutes.post(
  "chat",
  chatValidation,
  asyncHandler(chatController.chatController.bind(chatController)),
);
export default chatRoutes;
