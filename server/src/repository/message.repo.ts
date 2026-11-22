import { messageModel, type messageDocument } from "../models/message.model.ts";
import type { messageResponse } from "../types/chat.ts";
import type { Message } from "../types/chat.ts";
export default class MessageRepo {
  async createMessage(message: messageResponse): Promise<messageDocument> {
    const { author, content, conversationId } = message;
    const createdMessage = await messageModel.create({
      author,
      content,
      conversationId,
    });
    return createdMessage;
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    const messages = await messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();
    return messages.map((message) => {
      if (message.author !== "ai" && message.author !== "user") {
        throw new Error(`Unexpected message author: ${message.author}`);
      }

      return {
        _id: String(message._id),
        content: message.content,
        author: message.author,
        conversationId: String(message.conversationId),
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      };
    });
  }
}
