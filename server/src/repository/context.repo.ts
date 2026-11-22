import { contextModel, type ContextModel } from "../models/context.model.ts";
import { messageModel } from "../models/message.model.ts";
export default class ContextRepo {
  async readonlyContext(user: string): Promise<string> {
    const message: Pick<ContextModel, "userId" | "description"> | null =
      await contextModel.findOne({ user }).lean();

    if (message) return String(message.description);
    else return "no context are found for the user";
  }

  async createContext(
    userId: string,
    description: string,
  ): Promise<ContextModel> {
    const context: ContextModel | null = await contextModel.findByIdAndUpdate(
      { user: userId },
      { description },
      { new: true, upsert: true },
    );

    if (!context) throw new Error("Context update failed");
    return context;
  }
}
