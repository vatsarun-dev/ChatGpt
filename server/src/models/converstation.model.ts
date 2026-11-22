import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
const conversationSchema= new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minLength:2
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"userModel",
        required:true
    }
},{
    timestamps:true
})
export type ConversationDocument = HydratedDocument<
  InferSchemaType<typeof conversationSchema>
>;
export const conversationModel = model("conversationModel", conversationSchema);
