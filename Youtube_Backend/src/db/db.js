import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export async function mongodbDBConnect() {
   try {
      const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`);
      console.log(`\n Mongodb is connected !! DB Host: ${connectionInstance.connection.host}`)
   } catch (error) {
      console.log(error, "Mongodb connection error")
      process.exit(1)
   }
}