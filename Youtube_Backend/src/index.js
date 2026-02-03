// require(dotenev).config({ path: "./env" })

import dotenev from 'dotenv'
import { mongodbDBConnect } from './db/db.js'
import cors from "cors"
import cookieParser from 'cookie-parser'
import { app } from './app.js'
dotenev.config({ path: "./.env" })

mongodbDBConnect()
   .then(() => {
      app.on("error", () => {
         console.log("Database can't talk", error)
      })
      app.listen(process.env.PORT, () => {
         `Server is running on port ${process.env.PORT}`
      })
   })
   .catch((err) => {
      console.log("Mongodb connection failed!!", err)
   })


// const githubData = {
//    "login": "SOURAVGHOSH123",
//    "id": 153526688,
//    "node_id": "U_kgDOCSahoA",
//    "avatar_url": "https://avatars.githubusercontent.com/u/153526688?v=4",
//    "gravatar_id": "",
//    "url": "https://api.github.com/users/SOURAVGHOSH123",
//    "html_url": "https://github.com/SOURAVGHOSH123",
//    "followers_url": "https://api.github.com/users/SOURAVGHOSH123/followers",
//    "following_url": "https://api.github.com/users/SOURAVGHOSH123/following{/other_user}",
//    "gists_url": "https://api.github.com/users/SOURAVGHOSH123/gists{/gist_id}",
//    "starred_url": "https://api.github.com/users/SOURAVGHOSH123/starred{/owner}{/repo}",
//    "subscriptions_url": "https://api.github.com/users/SOURAVGHOSH123/subscriptions",
//    "organizations_url": "https://api.github.com/users/SOURAVGHOSH123/orgs",
//    "repos_url": "https://api.github.com/users/SOURAVGHOSH123/repos",
//    "events_url": "https://api.github.com/users/SOURAVGHOSH123/events{/privacy}",
//    "received_events_url": "https://api.github.com/users/SOURAVGHOSH123/received_events",
//    "type": "User",
//    "user_view_type": "public",
//    "site_admin": false,
//    "name": "SOURAV GHOSH",
//    "company": null,
//    "blog": "https://github.com/SOURAVGHOSH123",
//    "location": null,
//    "email": null,
//    "hireable": null,
//    "bio": null,
//    "twitter_username": null,
//    "public_repos": 34,
//    "public_gists": 0,
//    "followers": 1,
//    "following": 4,
//    "created_at": "2023-12-11T14:30:05Z",
//    "updated_at": "2025-12-29T05:37:57Z"
// }

// app.get("/", (req, res) => {
//    res.send("This is home directory")
// })

// app.get("/login", (req, res) => {
//    res.send("Please login")
// })

// app.get("/signin", (req, res) => {
//    res.send("Please signin")
// })

// app.get("/github", (req, res) => {
//    res.json(githubData)
// })

// app.get("/other", (req, res) => {
//    res.send("Another directory")
// })

// app.listen(process.env.PORT, () => {
//    console.log(`App is listen on port ${process.env.PORT}`)
// })


// J6eSL9g7kxTaKL8u --> sg608251_db_user


/*
   ; (async () => {
      try {
         await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`)
         app.on("error", (error) => {
            console.log("Database can't talk", error)
            throw error
         })

         app.listen(process.env.PORT, () => {
            console.log(`App is running on port ${process.env.PORT}`)
         })
      } catch (error) {
         console.log(error, "Error db")
         throw error
      }
   })()
*/