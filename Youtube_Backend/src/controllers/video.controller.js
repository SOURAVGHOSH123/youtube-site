import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadFileCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
   let {
      page = 1,
      limit = 10,
      query = "",
      sortBy = "createdAt",
      sortType = "desc",
      userId
   } = req.query;

   page = parseInt(page);
   limit = parseInt(limit);

   let matchStages = {
      isPublished: true
   };

   if (userId && isValidObjectId(userId)) {
      matchStages.owner = new mongoose.Types.ObjectId(userId);
   }

   if (query) {
      matchStages.$or = [
         { title: { $regex: query, $options: "i" } },
         { description: { $regex: query, $options: "i" } }
      ];
   }

   // ❗ DO NOT await here
   const aggregate = Video.aggregate([
      { $match: matchStages },
      { $sort: { [sortBy]: sortType === "asc" ? 1 : -1 } }
   ]);

   const options = { page, limit };

   const videos = await Video.aggregatePaginate(aggregate, options);

   return res.status(200).json(
      new ApiResponse(200, videos, "Fetch all videos successfully")
   );
});

const publishAVideo = asyncHandler(async (req, res) => {
   const { title, description } = req.body
   // TODO: get video, upload to cloudinary, create video

   if (!title || !description) {
      throw new ApiError(400, "All fields are required")
   }

   const video = await Video.findOne({
      $or: [
         { title: title },
         { description: description }
      ]
   })

   if (video) {
      throw new ApiError(400, "Video with same Title & Description already exist")
   }

   const thumbnailPath = req.files?.thumbnail[0]?.path;
   // console.log(thumbnailPath, "t-path")
   if (!thumbnailPath) {
      throw new ApiError(400, "thumbnail is required")
   }

   const videoFilePath = req.files?.videoFile[0]?.path || "";
   if (!videoFilePath) {
      throw new ApiError(400, "video file is required")
   }
   // console.log(videoFilePath, "v-path")

   const thumbnail = await uploadFileCloudinary(thumbnailPath)
   const videoFile = await uploadFileCloudinary(videoFilePath)
   // console.log(thumbnail, "thumbnail")
   // console.log(videoFile, "videofile")
   if (!thumbnail || !thumbnail.secure_url) {
      throw new ApiError(400, "thumbnail file is required")
   }
   if (!videoFile || !videoFile.secure_url) {
      throw new ApiError(400, "video file is required")
   }

   const newVideo = await Video.create({
      title,
      description,
      videoFile: videoFile?.secure_url,
      thumbnail: thumbnail?.secure_url,
      duration: videoFile?.duration,
      owner: req.user?._id
   })

   return res.status(200).json(
      new ApiResponse(200, newVideo, "Video fetch Successfully")
   )
})

const getVideoById = asyncHandler(async (req, res) => {
   const { videoId } = req.params
   //TODO: get video by id

   if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   const video = await Video.findByIdAndUpdate(videoId,
      { $inc: { views: 1 } },
      { new: true }
   );
   if (!video) {
      throw new ApiError(400, "Video does not exist")
   }

   return res.status(200)
      .json(new ApiResponse(200, video, "video fetch successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
   const { videoId } = req.params;
   let { title, description } = req.body;
   //TODO: update video details like title, description, thumbnail
   title = title.trim()
   description = description.trim()

   if (!title || !description) {
      throw new ApiError(400, "All fields are required")
   }

   if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   const video = await Video.findById(videoId);
   if (!video) throw new ApiError(404, "Video not found");
   if (video.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not allowed");
   }

   const thumbnailPath = req.file.path;
   if (!thumbnailPath) {
      throw new ApiError(400, "thumbnail is required")
   }

   const thumbnail = await uploadFileCloudinary(thumbnailPath);
   if (!thumbnail) {
      throw new ApiError(404, "thumbnail not found");
   }

   video.title = title
   video.description = description
   video.thumbnail = thumbnail?.secure_url

   await video.save()
   // const video = await Video.findOneAndUpdate(
   //    {
   //       _id: videoId,
   //       owner: req.user?._id
   //    },
   //    {
   //       $set: {
   //          title,
   //          description,
   //          thumbnail: thumbnail?.url
   //       }
   //    },
   //    { new: true }
   // );

   return res.status(200).json(
      new ApiResponse(200, video, "update video details successfully")
   )
})

// const deleteVideo = asyncHandler(async (req, res) => {
//    const { videoId } = req.params;
//    //TODO: delete video
//    try {
//       const video = await Video.findOneAndDelete(
//          { _id: videoId, owner: req.user?._id }
//       )
//       if (!video) {
//          throw new ApiError(400, "delete video unsuccessfully")
//       }
//       return res.status(200).json(
//          new ApiResponse(200, "delete video successfully")
//       )
//    } catch (error) {
//       throw new ApiError(400, "Delete video error")
//    }
// })

const deleteVideo = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   const video = await Video.findById(videoId);
   if (!video) throw new ApiError(404, "Video not found");

   if (video.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not allowed");
   }

   await video.deleteOne();

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   const video = await Video.findById(videoId);

   if (!video) throw new ApiError(404, "Video not found");

   if (video.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not allowed");
   }

   video.isPublished = !video.isPublished;
   await video.save();

   return res.status(200).json(
      new ApiResponse(200, video, "Publish status toggled")
   );
});

export {
   getAllVideos, publishAVideo, getVideoById,
   updateVideo, deleteVideo, togglePublishStatus
}