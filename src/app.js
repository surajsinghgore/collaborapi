const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
//routes import
const usersRouter = require("./routes/Users.routes.js");
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


// app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(express.static("public"))
// app.use(cookieParser())

//routes declaration
app.use("/api/v1/users", usersRouter);

// app.use("/api/v1/tweets", tweetRouter)
// app.use("/api/v1/subscriptions", subscriptionRouter)
// app.use("/api/v1/videos", videoRouter)
// app.use("/api/v1/comments", commentRouter)
// app.use("/api/v1/likes", likeRouter)
// app.use("/api/v1/playlist", playlistRouter)
// app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

module.exports = app;
