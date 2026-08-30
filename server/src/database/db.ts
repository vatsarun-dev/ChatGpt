import { connect } from "mongoose";
import env from "../config/env.ts";
export default async function connectDb(): Promise<void> {
  try {
    await connect(env.MONGOURL);
  } catch (error) {
    console.log(error);
  }
}
