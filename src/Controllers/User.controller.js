const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const UserData = require("../models/UserData.model.js");
const { asyncHandler } = require("../utils/AsyncHandler.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const path = require("path"); // To handle file paths

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await UserData.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await UserData.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token");
  }
};

const handleFileUploads = async (req) => {
  const profileLocalPath = req.files?.profile[0]?.path;
  let bannerImageLocalPath;

  if (req.files && Array.isArray(req.files.bannerImage) && req.files.bannerImage.length > 0) {
    bannerImageLocalPath = req.files.bannerImage[0].path;
  }

  if (!profileLocalPath) {
    throw new ApiError(400, "Profile file is required");
  }

  // Generate unique filenames
  const profileUniqueName = generateUniqueFilename(req.files.profile[0].originalname);
  const bannerImageUniqueName = bannerImageLocalPath ? generateUniqueFilename(req.files.bannerImage[0].originalname) : undefined;

  // Upload files to Cloudinary
  const profile = await uploadOnCloudinary(profileLocalPath, profileUniqueName);
  const bannerImage = bannerImageLocalPath ? await uploadOnCloudinary(bannerImageLocalPath, bannerImageUniqueName) : undefined;

  return { profile, bannerImage };
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existedUser = await UserData.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    //console.log(req.files);

    const profileLocalPath = req.files?.profile[0]?.path;
    let bannerImageLocalPath;
    if (req.files && Array.isArray(req.files.bannerImage) && req.files.bannerImage.length > 0) {
      bannerImageLocalPath = req.files.bannerImage[0].path;
    }

    if (!profileLocalPath) {
      throw new ApiError(400, "profile file is required");
    }

    const profile = await uploadOnCloudinary(profileLocalPath);
    const bannerImage = await uploadOnCloudinary(bannerImageLocalPath);
    if (!profile) {
      throw new ApiError(400, "profile file is required");
    }
    const user = await UserData.create({
      username,
      email,
      password,
      bannerImage: bannerImage?.data?.secure_url || "",
      profile: profile.data.secure_url,
    });

    const createdUser = await UserData.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Internal Server Error");
  }
});
// const accessToken=UserData.generateAccessToken()
// const refreshToken=UserData.generateRefreshToken()
// const isPasswordValid = await user.isPasswordCorrect(password)

module.exports = { registerUser };
