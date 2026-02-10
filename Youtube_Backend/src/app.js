import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"

const app = express();

app.use(cors({
   origin: process.env.CORS_ORIGIN,
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
   credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

// import routes
import userRoutes from "./routes/user.routes.js"
import videoRoutes from "./routes/video.routes.js"
import tweetRoutes from "./routes/tweet.routes.js"
import subscriptionRoutes from "./routes/subscription.routes.js"
import likeRoutes from "./routes/like.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import commentRoutes from "./routes/comment.routes.js"

// asign routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/videos", videoRoutes)
app.use("/api/v1/tweets", tweetRoutes)
app.use("/api/v1/comments", commentRoutes)
app.use("/api/v1/subscriptions", subscriptionRoutes)
app.use("/api/v1/likes", likeRoutes)
app.use("/api/v1/playlists", playlistRoutes)
app.use("/api/v1/dashboard", dashboardRoutes)
app.use("/api/v1/healthcheck", healthcheckRouter)

export { app }