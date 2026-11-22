import {Schema, model, type InferSchemaType} from "mongoose"
const messageSchema= new Schema({
    conversationId:{
        type:Schema.Types.ObjectId,
        ref:"conversationModel",
    },
    author:{
        type:String,
        enum:["ai", "user"],
        required:true,
        trim:true,
    },
    content:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})
export type messageDocument=InferSchemaType<typeof messageSchema>
export const messageModel=model("messageModel",messageSchema)
