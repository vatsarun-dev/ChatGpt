import {
  conversationModel,
  type ConversationDocument,
} from "../models/converstation.model";
export default class ConversationRepo {
  async createConversation(input: {
    title: string;
    userId: string;
  }): Promise<ConversationDocument> {
    const conversation = await conversationModel.create(input);
    return conversation;
  }

  async findById(id: string) {
    return await conversationModel.findById(id);
  }

  async findByUserId(userId: string) {
    return await conversationModel.find({ userId }).sort({ updatedAt: -1 }).lean();
  }

  async touch(id: string) {
    await conversationModel.updateOne({ _id: id }, { $set: { updatedAt: new Date() } });
  }
}
