import { connect } from "mongoose";
import env from "../config/env.ts";
export default async function connectDb(): Promise<void> {
  await connect(env.MONGOURL);
}
