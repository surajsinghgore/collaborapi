const mongoose = require("mongoose");

const { Schema } = mongoose;

const VerifyUserSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    verifyLink: {
      type: String,
      required: false, // Make verifyLink optional
    }
  },
  { timestamps: true }
);

// Create a TTL index on the createdAt field to automatically remove documents after 20 minutes
VerifyUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 20 * 60 });

const VerifyUserData = mongoose.model("VerifyUserData", VerifyUserSchema);

module.exports = VerifyUserData;
