import { Router } from "express";
import {
   getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser,
   registerUser, updateAccountDetails, updateAvatarUrl, refreshAccessToken,
   updateCoverImageUrl, changeCurrentPassword, logoutUser
}
   from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
   upload.fields([
      {
         name: "avatar",
         maxCount: 1
      },
      {
         name: "coverImage",
         maxCount: 1
      }
   ]),
   registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJwt, changeCurrentPassword)
router.route("/profile").get(verifyJwt, getCurrentUser)
router.route("/edit-profile").patch(verifyJwt, updateAccountDetails)
router.route("/avatar").patch(verifyJwt, upload.single("avatar"), updateAvatarUrl)
router.route("/cover-image").patch(verifyJwt,
   upload.single("coverImage"), updateCoverImageUrl)
router.route("/channel/:username").get(verifyJwt, getUserChannelProfile)
router.route("/history").get(verifyJwt, getWatchHistory)

export default router;


// "email": "ghogho234@gmail.com", "password": "sumAn#123@"
// "email": "soughosh123@gmail.com", "password": "Soumya123@"