import { model, Schema, type InferSchemaType } from "mongoose";
import type { NextFunction } from "express";
import bcrypt from "bcrypt";
const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next: NextFunction): void {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

export type UserDocument = InferSchemaType<typeof userSchema>;
export const userModel = model("userModel", userSchema);
