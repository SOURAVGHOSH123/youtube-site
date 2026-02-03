import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
   //TODO: get all comments for a video
   const { videoId } = req.params
   let { page = 1, limit = 10 } = req.query;

   page = parseInt(page)
   limit = parseInt(limit)

   if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Is not valid videoId")
   }

   const aggregates = Comment.aggregate([
      { $match: { video: new mongoose.Types.ObjectId(videoId) } },
      {
         $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails"
         }
      },
      {
         $unwind: "$ownerDetails"
      },
      {
         $addFields: {
            username: "$ownerDetails.fullname",
            avatar: "$ownerDetails.avatar"
         }
      },
      {
         $project: {
            _id: 0,
            username: 1,
            avatar: 1,
            content: 1,
            owner: 1,
            createdAt: 1,
         }
      },
      { $sort: { createdAt: -1 } }
   ]);

   const options = { page, limit };

   const videoComments = await Comment.aggregatePaginate(aggregates, options);

   return res.status(200).json(
      new ApiResponse(200, videoComments, "Video comments fetch successfully")
   )
})

const addComment = asyncHandler(async (req, res) => {
   // TODO: add a comment to a video
   const { videoId } = req.params;
   const { content } = req.body;

   if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Not valid videoId")
   }

   const videoExist = await Video.findById(videoId);
   if (!videoExist) {
      throw new ApiError(400, "video not exist")
   }

   if (!content || content.trim() === "") {
      throw new ApiError(400, "Comment content required");
   }

   const newComment = await Comment.create({
      owner: req.user._id,
      content,
      vidoe: videoId,
   })

   return res.status(200).json(
      new ApiResponse(201, newComment, "new comment fetch successfully")
   )
})

const updateComment = asyncHandler(async (req, res) => {
   // TODO: update a comment
   const { commentId } = req.params;
   const { content } = req.body;

   if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Is not valid commentId")
   }

   if (!content || !content.trim()) {
      throw new ApiError(400, "content is required")
   }

   const comment = await Comment.findById(commentId);

   if (!comment) {
      throw new ApiError(400, "comment not exist")
   }

   if (comment.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(400, "Not Allowed")
   }

   comment.content = content.trim();
   await comment.save();

   return res.status(200).json(
      new ApiResponse(200, {}, "comment update successfully")
   )
})

const deleteComment = asyncHandler(async (req, res) => {
   // TODO: delete a comment
   const { commentId } = req.params;

   if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Is not valid commentId")
   }

   const comment = await Comment.findById(commentId);
   if (!comment) {
      throw new ApiError(400, "comment not exist")
   }

   if (comment.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(400, "Not Allowed")
   }

   await comment.deleteOne();

   return res.status(200).json(
      new ApiResponse(200, {}, "comment delete successfully")
   )
})

export {
   getVideoComments,
   addComment,
   updateComment,
   deleteComment
}