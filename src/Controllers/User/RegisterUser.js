const { ApiResponse } = require("../../utils/ApiResponse.js");
const { ApiError } = require("../../utils/ApiError.js");
const UserData = require("../../models/UserData.model.js");
const { asyncHandler } = require("../../utils/AsyncHandler.js");
const { uploadOnCloudinary } = require("../../utils/cloudinary.js");
const { deleteFiles, generateUniqueFilename } = require("../../utils/FileRemoveUtils.js");
const { generateVerificationEmail } = require("../../utils/EmailTemplate/VerifyUserURL.js");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../../utils/EmailService.js");

const handleFileUploads = async (req) => {
  const profileLocalPath = req.files?.profile[0]?.path;
  let bannerImageLocalPath;

  if (req.files && Array.isArray(req.files.bannerImage) && req.files.bannerImage.length > 0) {
    bannerImageLocalPath = req.files.bannerImage[0].path;
  }

  if (!profileLocalPath) {
    throw new ApiError(400, "Profile file is required");
  }

  const profileUniqueName = generateUniqueFilename(req.files.profile[0].originalname);
  const bannerImageUniqueName = bannerImageLocalPath ? generateUniqueFilename(req.files.bannerImage[0].originalname) : undefined;

  const profile = await uploadOnCloudinary(profileLocalPath, profileUniqueName);
  const bannerImage = bannerImageLocalPath ? await uploadOnCloudinary(bannerImageLocalPath, bannerImageUniqueName) : undefined;

  return { profile, bannerImage };
};

// Register USer
const registerUser = asyncHandler(async (req, res) => {
  let files = [];

  try {
    const { email, username, password } = req.body;

    const existedUser = await UserData.findOne({
      $or: [{ username }, { email }],
      active: true,
    });
    if (existedUser) {
      if (req.files) {
        files = [...(req.files.profile || []), ...(req.files.bannerImage || [])];
        deleteFiles(files);
      }
      throw new ApiError(409, "User with email or username already exists");
    }

    const { profile, bannerImage } = await handleFileUploads(req);
    const verifyToken = jwt.sign({ email }, process.env.VERIFY_KEY_TOKEN, {
      expiresIn: "20m",
    });
    const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/users/verify?token=${verifyToken}`;

    const user = await UserData.create({
      username,
      email,
      password,
      bannerImage: bannerImage?.data?.secure_url || "",
      profile: profile.data.secure_url,
      verifyUrlLink: verifyLink,
    });

    const createdUser = await UserData.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      if (req.files) {
        files = [...(req.files.profile || []), ...(req.files.bannerImage || [])];
        deleteFiles(files);
      }
      throw new ApiError(500, "Something went wrong while registering the user");
    }
    // Generate email content
    const emailContent = generateVerificationEmail(verifyLink,email);

    // Send verification email
    await sendEmail(user.email, "Account Verification", emailContent);

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    if (req.files) {
      files = [...(req.files.profile || []), ...(req.files.bannerImage || [])];
      deleteFiles(files);
    }
    console.error(error);
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
  }
});

module.exports = registerUser;
