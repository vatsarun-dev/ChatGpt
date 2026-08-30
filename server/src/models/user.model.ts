import { model, Schema, type InferSchemaType } from "mongoose";
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

userSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compareSync(password, this.password);
};

export type UserDocument = InferSchemaType<typeof userSchema> & { id: string };
export const userModel = model("userModel", userSchema);
