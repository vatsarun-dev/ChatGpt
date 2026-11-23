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
      ref: "userModel",
      required: true,
      unique: true,
    },
    description: {
      type: String,
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
