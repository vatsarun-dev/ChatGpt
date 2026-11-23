import { contextModel, type ContextModel } from "../models/context.model.ts";
export default class ContextRepo {
  async readonlyContext(userId: string): Promise<string> {
    const context = await contextModel.findOne({ userId }).lean();
    return context?.description ?? "No saved context for this user.";
  }

  async createContext({ userId, description }: {
    userId: string;
    description: string;
  }): Promise<ContextModel> {
    const context = await contextModel.findOneAndUpdate(
      { userId },
      { $set: { description } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    if (!context) throw new Error("Context update failed");
    return context;
  }
}
