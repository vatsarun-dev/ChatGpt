import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler.ts";
import ChatController from "./chat.controller.ts";
import { chatValidation } from "../../validation/chat.validation.ts";
import authMiddleware from "../../middlewares/auth.middleware.ts";
const chatRoutes = Router();
const chatController = new ChatController();
chatRoutes.get(
  "/conversations",
  authMiddleware,
  asyncHandler(chatController.conversationsController.bind(chatController)),
);
chatRoutes.get(
  "/conversations/:conversationId/messages",
  authMiddleware,
  asyncHandler(chatController.messagesController.bind(chatController)),
);
chatRoutes.post(
  "/chat",
  authMiddleware,
  chatValidation,
  asyncHandler(chatController.chatController.bind(chatController)),
);
export default chatRoutes;
