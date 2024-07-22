const mongoose = require("mongoose");
const jwt =require("jsonwebtoken")
const bcrypt=require("bcrypt")
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
    refreshToken: {
        type: String
    }
  },
  { timestamps: true }
);
// hash the password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


// password verify
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_KEY_TOKEN,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_KEY_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}








const UserData = mongoose.model("UserData", UserDataSchema);





module.exports = UserData;
