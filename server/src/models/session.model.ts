import {Schema, model, type InferSchemaType} from "mongoose";
import type { NextFunction } from "express";
const sessionSchema= new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"userModel",
        required:true
    },
    refreshToken:{
        type:String,
        required:true
    }
},{
    timestamps:true
})
export type sessionDocument=InferSchemaType<typeof sessionSchema>
export const sessionModel=model("sessionModel",sessionSchema)