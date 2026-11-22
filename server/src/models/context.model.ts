import {
  model,
  Schema,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

const contextSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    description: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
export type ContextModel = HydratedDocument<
  InferSchemaType<typeof contextSchema>
>;
export const contextModel = model("contextModel", contextSchema);
