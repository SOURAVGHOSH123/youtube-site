import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
   videoFile: {
      type: String,    // coudinary url
      required: [true, "Videofile is required"],
   },
   thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"]
   },
   title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
   },
   description: {
      type: String,   // cloudinary url
      required: true,
      trim: true,
   },
   duration: {
      type: Number,
      required: true
   },
   views: {
      type: Number,
      default: 0
   },
   isPublished: {
      type: Boolean,
      default: true
   },
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)