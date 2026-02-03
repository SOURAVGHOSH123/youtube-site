import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
   // TODO: Get the channel stats like total video views, total subscribers,
   //  total videos, total likes etc.
   const userId = req.user?._id;
   if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid channel Id");

   const stats = await Video.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId) } },
      {
         $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "likeDetails"
         }
      },
      // {
      //    $addFields: {
      //       totalVideos: {
      //          $size: "$videoDetails"
      //       },
      //       totalSubscribers: {
      //          $size: "$ownerDetails"
      //       },
      //       totalLikes: {
      //          $size: "$likeDetails"
      //       },
      //       totalViews: {
      //          $count: "$videoDetails.views"
      //       }
      //    }
      // },
      // {
      //    $project: {
      //       totalVideos: 1,
      //       totalSubscribers: 1,
      //       totalLikes: 1,
      //       totalViews: 1,
      //    }
      // }
      {
         $group: {
            _id: null,
            totalLikes: { $sum: { $size: "$likeDetails" } },
            totalViews: { $sum: "$views" },
            totalVideos: { $sum: 1 }
         }
      }
   ])

   const result = await Subscription.aggregate([
      { $match: { channel: new mongoose.Types.ObjectId(userId) } },
      { $count: "totalSubscribers" }
   ]);

   const totalSubscribers = result[0]?.totalSubscribers || 0;

   if (!stats) throw new ApiError(400, "stats not found")
   // if (!totalSubscribers) throw new ApiError(400, "subscribers not found")

   return res.status(200).json(
      new ApiResponse(200, {
         totalVideos: stats[0]?.totalVideos || 0,
         totalViews: stats[0]?.totalViews || 0,
         totalLikes: stats[0]?.totalLikes || 0,
         totalSubscribers
      }, "fetch channel stats successfully")
   )
})

const getChannelVideos = asyncHandler(async (req, res) => {
   // TODO: Get all the videos uploaded by the channel
   const channelId = req.user?._id;
   if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Invalid channel Id")
   }

   const getVideos = await Video.find({ owner: req.user?._id })
      .select("title description thumbnail views createdAt")
      .sort({ createdAt: -1 })

   if (!getVideos) throw new ApiError(400, "no videos find")

   return res.status(200).json(
      new ApiResponse(200, getVideos, "videos fetch successfully")
   )
})

export {
   getChannelStats,
   getChannelVideos
}