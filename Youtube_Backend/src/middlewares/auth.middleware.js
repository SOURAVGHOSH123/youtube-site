import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

export const verifyJwt = asyncHandler(async (req, _, next) => {
   const token = await req.cookies?.accessToken ||
      req.header("Authorization")?.split(" ")[1];

   if (!token) {
      throw new ApiError(400, "unauthorized access token")
   }

   const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

   const user = await User.findById(decoded?._id)
      .select("-password -refreshToken")

   if (!user) {
      throw new ApiError(400, "Invalid Access Token")
   }

   req.user = user
   next()
})