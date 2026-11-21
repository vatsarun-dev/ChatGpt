import { messageModel, type messageDocument } from "../models/message.model.ts";
import type { messageResponse } from "../types/chat.ts";
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

  async findByConversationId(conversationId: string) {
    return await messageModel.find({ conversationId }).sort({ createdAt: 1 }).lean();
  }
}
