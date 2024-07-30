const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const UserData = require("../models/UserData.model.js");
const { asyncHandler } = require("../utils/AsyncHandler.js");
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;
    console.log(fullName, email, username, password)
    // throw new ApiError(400, "All fields are required")
    return res.status(201).json(new ApiResponse(200, "data", "User registered Successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token");
  }
});
// const accessToken=UserData.generateAccessToken()
// const refreshToken=UserData.generateRefreshToken()
// const isPasswordValid = await user.isPasswordCorrect(password)


module.exports= { registerUser };
