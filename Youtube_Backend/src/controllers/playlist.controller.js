import mongoose, { isValidObjectId } from "mongoose"
import { PlayList } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
   let { name, description } = req.body;
   //TODO: create playlist

   if (!name.trim() || !description.trim()) {
      throw new ApiError(400, "field are required")
   }

   name = name.trim()
   description = description.trim()

   const existPlaylist = await PlayList.findOne({
      name: name,
      owner: req.user?._id
   })

   if (existPlaylist) {
      throw new ApiError(400, "same playlist name is exist")
   }

   const newPlayList = await PlayList.create({
      name,
      description,
      owner: req.user?._id
   })

   return res.status(201).json(
      new ApiResponse(201, newPlayList, "Create play list successfully")
   )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
   const { userId } = req.params;
   //TODO: get user playlists

   if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Is not valid user Id")
   }

   const existPlaylist = await PlayList.find({ owner: userId })
      .populate("videos", "title thumbnail")
      .sort({ createdAt: -1 });

   if (!existPlaylist) {
      throw new ApiError(400, "playlist not found")
   }

   return res.status(200).json(
      new ApiResponse(200, existPlaylist, "user playlists fetch successully")
   )
})

const getPlaylistById = asyncHandler(async (req, res) => {
   const { playlistId } = req.params
   //TODO: get playlist by id

   if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Is not valid playlist id")
   }

   // const playlist = await PlayList.findById(playlistId)
   //    .populate("videos", "title thumbnail duration views")
   //    .populate("owner", "username avatar")

   //    if (playlist.owner.toString() !== req.user._id.toString()) {
   //       throw new ApiError(400, "Not allowed")
   //    }

   const playlist = await PlayList.findOne({
      _id: playlistId,
      owner: req.user._id
   })
      .populate("videos", "title thumbnail duration views -_id")
      .populate("owner", "username fullname avatar -_id");

   if (!playlist) {
      throw new ApiError(404, "Playlist not found or not allowed");
   }

   return res.status(200).json(
      new ApiResponse(200, playlist, "playlist fetch successfully")
   )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
   const { playlistId, videoId } = req.params;

   if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid ids")
   }

   // const playlist = await PlayList.findOne({
   //    _id: playlistId,
   //    owner: req.user._id
   // });

   const existVideo = await Video.findById(videoId);
   if (!existVideo) throw new ApiError(400, "video not found")

   const updated = await PlayList.findOneAndUpdate(
      { _id: playlistId, owner: req.user._id },
      { $addToSet: { videos: videoId } },
      { new: true }
   );

   if (!updated) {
      throw new ApiError(404, "Playlist not found or not allowed");
   }

   return res.status(200).json(
      new ApiResponse(200, updated, "add video playlist successfully")
   )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
   const { playlistId, videoId } = req.params
   // TODO: remove video from playlist

   if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid ids")
   }

   // const playlist = await PlayList.findOne({
   //    _id: playlistId,
   //    // owner: req.user._id
   // });

   const video = await Video.findById(videoId);
   if (!video) {
      throw new ApiError(400, "video not exist")
   }

   const updated = await PlayList.findOneAndUpdate(
      { _id: playlistId, owner: req.user._id },
      { $pull: { videos: videoId } },
      { new: true }
   );

   if (!updated) {
      throw new ApiError(404, "Playlist not found or not allowed");
   }

   return res.status(200).json(
      new ApiResponse(200, updated, "delete playlist video successfully")
   )
})

const deletePlaylist = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;
   // TODO: delete playlist

   if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Not valid playlist id")
   }

   const playlist = await PlayList.findById(playlistId);
   if (!playlist) {
      throw new ApiError(400, "playlist not found")
   }

   if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(400, "Not allowed")
   }

   await playlist.deleteOne();
   return res.status(200).json(
      new ApiResponse(200, {}, "playlist delete successfully")
   )
})

const updatePlaylist = asyncHandler(async (req, res) => {
   const { playlistId } = req.params
   let { name, description } = req.body
   //TODO: update playlist

   if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist Id")
   }

   if (!name.trim() || !description.trim()) {
      throw new ApiError(400, "fields are required")
   }

   name = name.trim()
   description = description.trim()

   // const playlist = await PlayList.findById(playlistId);
   // if (!playlist) throw new ApiError(400, "playlist not found");

   // if (playlist.owner.toString() !== req.user._id.toString()) {
   //    throw new ApiError(400, "Not Allowed")
   // }

   // playlist.name = name;
   // playlist.description = description;
   // await playlist.save();

   const updated = await PlayList.findOneAndUpdate(
      { _id: playlistId, owner: req.user._id },
      { name, description },
      { new: true }
   );

   if (!updated) {
      throw new ApiError(404, "Playlist not found or not allowed");
   }

   return res.status(200).json(
      new ApiResponse(200, updated, "update playlist successfully")
   )
})

export {
   createPlaylist,
   getUserPlaylists,
   getPlaylistById,
   addVideoToPlaylist,
   removeVideoFromPlaylist,
   deletePlaylist,
   updatePlaylist
}