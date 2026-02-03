import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
   username: {
      type: String,
      required: [true, "username is required"],
      lowercase: true,
      trim: true,
      index: true,   // help for optimize search
      unique: true
   },
   email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true
   },
   fullname: {
      type: String,
      required: [true, "fullname is required"],
      trim: true,
      index: true
   },
   avatar: {
      type: String,   // cloudinary url
      required: true,
   },
   coverImage: {
      type: String,
   },
   password: {
      type: String,
      required: [true, "Password is required"]
   },
   refreshToken: {
      type: String,
   },
   watchHistory: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Video"
      }
   ],
}, { timestamps: true })

userSchema.pre("save", async function () {
   if (!this.isModified("password")) return;
   this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
   return await jwt.sign(
      {
         _id: this._id,
         email: this.email,
         fullname: this.fullname,
         username: this.username
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRES
      })
}

userSchema.methods.generateRefreshToken = async function () {
   return await jwt.sign(
      {
         _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRES
      })
}

export const User = mongoose.model("User", userSchema)