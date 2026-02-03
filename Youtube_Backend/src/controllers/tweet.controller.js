import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
   //TODO: create tweet
   const { content } = req.body;
   if (!content || content.trim().length === 0) {
      throw new ApiError(400, "content is required")
   }

   const tweet = await Tweet.create({
      content,
      owner: req.user?._id
   })

   return res.status(200).json(
      new ApiResponse(201, tweet, "Tweet create successfully")
   )
})

const getUserTweets = asyncHandler(async (req, res) => {
   // TODO: get user tweets
   let {
      page = "1",
      limit = "10",
      query = "",
      sortBy = "createdAt",
      sortType = "desc",
      userId = req.user._id
   } = req.query;

   page = parseInt(page);
   limit = parseInt(limit);

   let matchStages = {};

   if (!userId || !isValidObjectId(userId)) {
      throw new ApiError(400, "Not valid userId")
   }

   matchStages.owner = new mongoose.Types.ObjectId(userId);

   const aggregates = Tweet.aggregate([
      { $match: matchStages },
      { $sort: { [sortBy]: sortType === "asc" ? 1 : -1 } }
   ]);

   const options = { page, limit }
   const tweets = await Tweet.aggregatePaginate(aggregates, options);

   return res.status(200).json(
      new ApiResponse(200, tweets, "users tweets fetch successfully")
   )
})

const updateTweet = asyncHandler(async (req, res) => {
   //TODO: update tweet
   const { tweetId } = req.params;
   const { content } = req.body;

   if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweet id");
   }

   if (!content || content.trim().length === 0) {
      throw new ApiError(400, "content is required")
   }

   const tweet = await Tweet.findById(tweetId);
   if (!tweet) {
      throw new ApiError(400, "tweet is not found")
   }
   if (tweet.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(400, "Not allowed")
   }

   tweet.content = content;
   await tweet.save();

   return res.status(200).json(
      new ApiResponse(400, tweet, "tweet update successfully")
   )
})

const deleteTweet = asyncHandler(async (req, res) => {
   //TODO: delete tweet
   const { tweetId } = req.params;

   if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweet id");
   }

   const tweet = await Tweet.findById(tweetId);
   if (!tweet) {
      throw new ApiError(400, "tweet is not available")
   }
   if (tweet.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(400, "user not allowed")
   }

   await tweet.deleteOne()

   return res.status(200).json(
      new ApiResponse(200, {}, "tweet delete successfully")
   )
})

export {
   createTweet, getUserTweets, updateTweet, deleteTweet
}