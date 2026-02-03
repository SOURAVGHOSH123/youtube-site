import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
   name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
   },
   description: {
      type: String,
      required: true,
      trim: true,
   },
   videos: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Video"
      }
   ],
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
}, { timestamps: true })


export const PlayList = mongoose.model("PlayList", playlistSchema)