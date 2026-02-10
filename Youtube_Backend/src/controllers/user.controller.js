import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadFileCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = await user.generateAccessToken()
      const refreshToken = await user.generateRefreshToken()

      user.refreshToken = refreshToken;
      user.save({ validBeforeSave: false })

      return { accessToken, refreshToken }

   } catch (error) {
      // throw new ApiError("500", `Something went wrong while
      //  generate access and refresh token`)
      return res.status(400).json({
         message: "Something went wrong while generate access or refresh token"
      })
   }
}

const registerUser = asyncHandler(async (req, res) => {
   // request data from user
   // validation - check empty
   // check if user already exisr\t - email, username
   // check for avater, check for images
   // upload on the cloudinary, avatar
   // crate an object for db - create object data
   // remove the password and refresh token
   // check for user create
   // return res
   let { username, email, fullname, password } = req.body;
   // console.log(username, email, fullname, password, "deta")
   if (
      [username, email, fullname, password].some((field) =>
         field?.trim() === "")
   ) {
      // throw new ApiError(400, "All fields are required")
      return res.status(400).json({ message: "All fields are required" })
   }

   username = username.split(" ").join("")

   const existUser = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (existUser) {
      // throw new ApiError(409, "User with the email or username already exist")
      return res.status(400).json({ message: "User with this email or username alredy exist" })
   }

   console.log(req.files?.avatar, "fileA");
   console.log(req.files?.coverImage, "fileC");
   if (!req.files?.avatar) return res.status(400).json({ message: "no avatar file" })

   const avatarLocalPath = req.files?.avatar[0]?.path || null;
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
   if (!avatarLocalPath) {
      // throw new ApiError(400, "Avatar file is required!")
      return res.status(400).json({ message: "Avtar file is required" })
   }

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
   ) {
      coverImageLocalPath = req.files.coverImage[0]?.path;
   }


   const avatar = await uploadFileCloudinary(avatarLocalPath);
   const coverImage = await uploadFileCloudinary(coverImageLocalPath);
   if (!avatar) {
      // throw new ApiError(400, "avatar not found")
      return res.status(400).json({ message: "Avtar not found" })
   }

   const user = await User.create({
      username,
      email,
      password,
      fullname,
      avatar: avatar.secure_url,
      coverImage: coverImage?.secure_url || ""
   })

   const createUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if (!createUser) {
      // throw new ApiError(500, "Somethng went wrong while registering the user!")
      return res.status(400).json({ message: "something wrong while register" })
   }

   return res.status(200).json(
      new ApiResponse(200, createUser, "User Registered Successfully")
   )
})

const loginUser = asyncHandler(async (req, res) => {
   // request the data from body
   // apply the valdation
   // find the user
   // check the password
   // generate the acccess and refresh token
   // send the cookie

   const { username, email, password } = req.body;
   if (!username && !email) {
      // throw new ApiError(400, "Username or email is required!")
      return res.status(400).json({ message: "Username or email is required!" })
   }
   const user = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (!user) {
      // throw new ApiError(400, "user doesn't exist")
      return res.status(400).json({ message: "User not exist" })

   }

   const validPassworrd = await user.isPasswordCorrect(password)

   if (!validPassworrd) {
      // throw new ApiError(400, "Invalid credentials")
      return res.status(400).json({ message: "Invalid Credentials!" })

   }

   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
   const isLoginUser = await User.findById(user._id)
      .select("-password -refreshToken")
   const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
   }

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(
         200,
         {
            data: isLoginUser, accessToken, refreshToken
         },
         "User logged in Successfully"
      ))
})

// const logoutUser = asyncHandler(async (req, res) => {
//    await User.findByIdAndUpdate(
//       req.user._id,
//       {
//          /* set: {
//            refreshToken: undefined   // make refresh token undefined
//           },  */
//          $unset: {
//             refreshToken: 1         // remove the field from document
//          }
//       },
//       {
//          new: true
//       }
//    )

//    const options = {
//       httpOnly: true,
//       secure: true
//    }

//    return res.status(200)
//       .clearCookie("accessToken", options)
//       .clearCookie("refreshToken", options)
//       .json(new ApiResponse(200, {}, "logged out User"))
// })

const logoutUser = asyncHandler(async (req, res) => {
   const refreshToken = req.cookies?.refreshToken;

   if (refreshToken) {
      const decoded = jwt.verify(
         refreshToken,
         process.env.REFRESH_TOKEN_SECRET
      );

      await User.findByIdAndUpdate(decoded._id, {
         $unset: { refreshToken: 1 }
      });
   }

   const options = {
      httpOnly: true,
      secure: true,
      sameSite: "lax"
   };

   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "Logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
   const inComingRefreshToken = req.cookies?.refreshToken ||
      req.body.refreshToken;

   if (!inComingRefreshToken) {
      // throw new ApiError(401, "Unauthorized request")
      return res.status(401).json({ message: "Unauthorized request" })
   }

   try {
      const decoded = jwt.verify(
         inComingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
      )

      const user = await User.findById(decoded._id)

      if (!user) {
         // throw new ApiError(401, "invalid access token")
         return res.status(401).json({ message: "Invalid access token" })
      }

      if (inComingRefreshToken !== user?.refreshToken) {
         // throw new ApiError(401, "token is not valid or already used")
         return res.status(401).json({ message: "token is not valid or already used" })
      }

      const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

      // const options = {
      //    httpOnly: true,
      //    secure: true
      // }

      const options = {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "lax"
      };

      return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", newRefreshToken, options)
         .json(new ApiResponse(
            200,
            { accessToken, newRefreshToken },
            "Access Token refresh Successfully"
         ))
   } catch (error) {
      // throw new ApiError(400, error?.message || "Invalid Refresh Token")
      return res.status(400).json({ message: error?.message || "Invalid refresh token" })
   }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body;
   if (!oldPassword || !newPassword) {
      // throw new ApiError(40, "Fields are required")
      return res.status(400).json({ message: "fields are required" })
   }

   const user = await User.findById(req.user?._id);
   const isPasswordMatch = await user.isPasswordCorrect(oldPassword);

   if (!isPasswordMatch) {
      // throw new ApiError(400, "Invalid old password")
      return res.status(400).json({ message: "Invalid old password" })
   }

   user.password = newPassword
   await user.save({ validateBeforeSave: false })
   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password update successfully"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
   return res
      .status(200)
      .json(new ApiResponse(200, req.user, "userdate fetch successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
   const { fullname, email } = req.body;
   if (!fullname || !email) {
      throw new ApiError(400, "Fullname and email is required")
   }

   const updateUser = await User.findByIdAndUpdate(req.user?._id,
      {
         $set: {
            fullname,
            email
         }
      },
      { new: true }
   )

   return res.status(200).json(
      new ApiResponse(200, updateUser, "Account details update successfully")
   )
})

const updateAvatarUrl = asyncHandler(async (req, res) => {
   const avatarLocalPath = req.file.path || "";
   console.log(avatarLocalPath, "a-apth");
   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required")
   }

   const avatar = await uploadFileCloudinary(avatarLocalPath)
   if (!avatar || !avatar.secure_url) {
      throw new ApiError(400, "Error while uploading an avatar")
   }

   const updateUserAvatar = await User.findByIdAndUpdate(req.user?._id,
      {
         $set: {
            avatar: avatar.secure_url
         }
      },
      { new: true }
   ).select("-password -refreshToken")

   return res.status(200)
      .json(
         new ApiResponse(200, updateUserAvatar, "Avatar update successfully")
      )
})

const updateCoverImageUrl = asyncHandler(async (req, res) => {
   const coverImageLocalPath = req.file?.path;
   if (!coverImageLocalPath) {
      throw new ApiError(400, "cover image file is required")
   }

   const coverImage = await uploadFileCloudinary(coverImageLocalPath)
   if (!coverImage || !coverImage.secure_url) {
      throw new ApiError(400, "Error while uploading an avatar")
   }

   const updateUserCoverImage = await User.findByIdAndUpdate(req.user?._id,
      {
         $set: {
            coverImage: coverImage.secure_url
         }
      },
      { new: true }
   ).select("-password -refreshToken")

   return res.status(200)
      .json(
         new ApiResponse(200, updateUserCoverImage, "Cover image update successfully")
      )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
   const { username } = req.params;
   if (!username) {
      throw new ApiError(400, "Username not found")
   }

   const channel = await User.aggregate([
      {
         $match: {
            username: username?.toLowerCase()
         }
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "Subscribers"
         }
      },
      {
         $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "owner",
            as: "userVideos"
         }
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "SubscribedTo"
         }
      },
      {
         $addFields: {
            subscribersCount: {
               $size: "$Subscribers"
            },
            videoCount: {
               $size: "$userVideos"
            },
            channelSubscribedToCount: {
               $size: "$SubscribedTo"
            },
            isSubscribed: {
               $cond: {
                  if: {
                     $in: [
                        new mongoose.Types.ObjectId(req.user._id),
                        "$Subscribers.subscriber"
                     ]
                  },
                  then: true,
                  else: false
               }
            }
         }
      },
      {
         $project: {
            email: 1,
            fullname: 1,
            username: 1,
            avatar: 1,
            coverImage: 1,
            subscribersCount: 1,
            videoCount: 1,
            channelSubscribedToCount: 1,
            isSubscribed: 1
         }
      }
   ])

   if (!channel) {
      throw new ApiError(400, "Channel not exists")
   }

   return res
      .status(200)
      .json(
         new ApiResponse(200, channel, "User channel fetched Successfully")
      )

})

const getWatchHistory = asyncHandler(async (req, res) => {
   const user = await User.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(req.user?._id)
         }
      },
      {
         $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_id",
            as: "watchHistory",
            pipeline: [
               {
                  $lookup: {
                     from: "users",
                     localField: "owner",
                     foreignField: "_id",
                     as: "owner",
                     pipeline: [
                        {
                           $project: {
                              fullname: 1,
                              avtar: 1,
                              username: 1
                           }
                        }
                     ]
                  }
               },
               {
                  $addFields: {
                     owner: {
                        $first: "$owner"
                     }
                  }
               }
            ]
         }
      },
   ])

   return res
      .status(200)
      .json(new ApiResponse(
         200,
         user[0].watchHistory,
         "User watch History fetch Successfully"
      ))
})

export {
   registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser,
   changeCurrentPassword, updateAccountDetails, updateAvatarUrl,
   updateCoverImageUrl, getUserChannelProfile, getWatchHistory
};