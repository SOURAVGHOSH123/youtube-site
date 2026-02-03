import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Subscription } from "../models/subscription.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js"

const toggleSubscription = asyncHandler(async (req, res) => {
   const { channelId } = req.params
   // TODO: toggle subscription
   if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Is not valid channel Id")
   }

   if (channelId === req.user._id.toString()) {
      throw new ApiError(400, "You cannot subscribe to yourself");
   }

   const existChannel = await User.findById(channelId);
   if (!existChannel) throw new ApiError(400, "channel not found")

   const existingSub = await Subscription.findOne({
      channel: channelId,
      subscriber: req.user._id
   });

   if (existingSub) {
      await existingSub.deleteOne();
      return res.status(200).json(
         new ApiResponse(200, {}, "Unsubscribed successfully")
      );
   }

   await Subscription.create({
      channel: channelId,
      subscriber: req.user._id
   })

   return res.status(200).json(
      new ApiResponse(400, {}, "Subscribed successfully")
   )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
   const { channelId } = req.params;
   // TODO: toggle subscription
   if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Is not valid channel Id")
   }

   const channel = await Subscription.findOne({ channel: channelId });
   if (!channel) {
      throw new ApiError(400, "channel doesnot exist")
   }

   const subscribers = await Subscription.aggregate([
      { $match: { channel: new mongoose.Types.ObjectId(channelId) } },
      {
         $lookup: {
            from: "users",
            localField: "subscriber",
            foreignField: "_id",
            as: "Subscribers"
         }
      },
      {
         $unwind: "$Subscribers"
      },
      {
         $addFields: {
            username: "$Subscribers.fullname",
            email: "$Subscribers.email",
            avatar: "$Subscribers.avatar",
         }
      },
      {
         $project: {
            _id: 0,
            subscriber: 1,
            username: 1,
            email: 1,
            avatar: 1
         }
      }
   ])

   // const subscribers = await Subscription.find({ channel: channelId })
   //    .populate("subscriber", "username email avatar")
   //    .sort({ createdAt: -1 });


   if (!subscribers) {
      throw new ApiError(400, "subscribers not found")
   }

   return res.status(200).json(
      new ApiResponse(200, subscribers, "subscribers channel fetch successfully")
   )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
   // controller to return channel list to which user has subscribed
   const { subscriberId } = req.params;

   if (!isValidObjectId(subscriberId)) {
      throw new ApiError(400, "Is not valid subscriber Id")
   }

   const subscription = await Subscription.findOne({ subscriber: subscriberId });
   if (!subscription) {
      throw new ApiError(400, "subsciber doesnot exist")
   }

   const subscribersChannel = await Subscription.aggregate([
      { $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) } },
      {
         $lookup: {
            from: "users",
            localField: "channel",
            foreignField: "_id",
            as: "SubscribedTo"
         }
      },
      {
         $unwind: "$SubscribedTo"  // convert array to object
      },
      {
         $addFields: {
            username: "$SubscribedTo.fullname",
            email: "$SubscribedTo.email",
            avatar: "$SubscribedTo.avatar",
         }
      },
      {
         $project: {
            channel: 1,
            // subscriber: 1,
            username: 1,
            email: 1,
            avatar: 1
         }
      },
      {
         $sort: { createdAt: -1 }
      }
   ])

   // const channels = await Subscription.find({ subscriber: subscriberId })
   //    .populate("channel", "username email avatar")
   //    .sort({ createdAt: -1 });

   if (!subscribersChannel) {
      throw new ApiError(400, "subscribed to channels not found")
   }

   return res.status(200).json(
      new ApiResponse(200, subscribersChannel, "subscribed to channel count fetch")
   )
})

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels }