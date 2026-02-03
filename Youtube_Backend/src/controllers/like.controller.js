import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
   const { videoId } = req.params
   //TODO: toggle like on video

   if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Is not valid videoId")
   }

   const video = await Video.findById(videoId);

   if (!video) {
      throw new ApiError(404, "Video not found");
   }

   const existVideoLike = await Like.findOne({
      video: new mongoose.Types.ObjectId(videoId),
      likedBy: new mongoose.Types.ObjectId(req.user._id)
   })

   if (existVideoLike) {
      await existVideoLike.deleteOne();
      return res.status(200).json(
         new ApiResponse(200, {}, "Unlike successfully")
      )
   }

   await Like.create({
      video: videoId,
      likedBy: req.user._id
   })

   return res.status(201).json(
      new ApiResponse(201, {}, "video liked Successfully")
   )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
   const { commentId } = req.params
   //TODO: toggle like on comment

   if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Is not valid comment id")
   }

   const comment = await Comment.findById(commentId);

   if (!comment) {
      throw new ApiError(404, "comment not found");
   }

   const existCommentLike = await Like.findOne({
      comment: new mongoose.Types.ObjectId(commentId),
      likedBy: new mongoose.Types.ObjectId(req.user._id)
   })

   if (existCommentLike) {
      await existCommentLike.deleteOne();
      return res.status(200).json(
         new ApiResponse(200, {}, "unlike successfully")
      )
   }

   await Like.create({
      comment: commentId,
      likedBy: req.user._id
   })

   return res.status(201).json(
      new ApiResponse(201, {}, "comment liked successfully")
   )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
   const { tweetId } = req.params
   //TODO: toggle like on tweet
   if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Is not valid tweet id")
   }

   const tweet = await Tweet.findById(tweetId);

   if (!tweet) {
      throw new ApiError(404, "tweet not found");
   }

   const existTweetLike = await Like.findOne({
      tweet: new mongoose.Types.ObjectId(tweetId),
      likedBy: new mongoose.Types.ObjectId(req.user._id)
   })

   if (existTweetLike) {
      await existTweetLike.deleteOne();
      return res.status(200).json(
         new ApiResponse(200, {}, "unlike successfully")
      )
   }

   await Like.create({
      tweet: tweetId,
      likedBy: req.user._id
   })

   return res.status(201).json(
      new ApiResponse(201, {}, "tweet liked successfully")
   )
})

const getLikedVideos = asyncHandler(async (req, res) => {
   const likesVideos = await Like.aggregate([
      {
         $match: {
            likedBy: new mongoose.Types.ObjectId(req.user._id),
            video: { $ne: null }
         }
      },
      {
         $lookup: {
            from: "videos",
            localField: "video",
            foreignField: "_id",
            as: "videoDetails"
         }
      },
      { $unwind: "$videoDetails" },
      {
         $project: {
            _id: 0,
            videoId: "$videoDetails._id",
            title: "$videoDetails.title",
            views: "$videoDetails.views",
            thumbnail: "$videoDetails.thumbnail",
            createdAt: "$videoDetails.createdAt"
         }
      }
   ]);

   return res.status(200).json(
      new ApiResponse(200, likesVideos, "Liked videos fetched successfully")
   );
});


export {
   toggleCommentLike,
   toggleTweetLike,
   toggleVideoLike,
   getLikedVideos
}