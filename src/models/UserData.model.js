const mongoose = require("mongoose");

const UserDataSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profile: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserData = mongoose.model("UserData", UserDataSchema);

module.exports = UserData;
