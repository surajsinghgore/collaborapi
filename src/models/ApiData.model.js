const mongoose = require("mongoose");

const ApiDataSchema = new mongoose.Schema(
  {
    name: { type: String, lowercase: true, trim: true, index: true },
    description: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "CategoryData",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ApiData = mongoose.model("ApiData", ApiDataSchema);





module.exports = ApiData;
