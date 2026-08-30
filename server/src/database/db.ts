import { connect } from "mongoose";
import env from "../config/env.ts";
export default async function connectDb() {
  try {
    await connect(env.MONGOURL);
  } catch (error) {
    console.log(error);
  }
}
