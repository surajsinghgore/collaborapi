const { ApiResponse } = require("../../utils/ApiResponse.js");
const { ApiError } = require("../../utils/ApiError.js");
const UserData = require("../../models/UserData.model.js");
const { asyncHandler } = require("../../utils/AsyncHandler.js");
const jwt = require("jsonwebtoken");

const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.VERIFY_KEY_TOKEN);
    const { email, exp } = decoded;

    // Check if token has expired
    if (Date.now() >= exp * 1000) {
      throw new ApiError(400, "Verification link has expired"); // 400 Bad Request
    }

    const userVerifyCheck = await UserData.findOne({ email });

    if (userVerifyCheck) {
      if (userVerifyCheck.verifyUrlLink === null && userVerifyCheck.active === true) {
        throw new ApiError(409, `Your email address ${email} is already verified`); // 400 Bad Request
      }

      if (userVerifyCheck.verifyUrlLink === null && userVerifyCheck.active === false) {
        throw new ApiError(410, "Verification link has expired"); // 410 Gone (more appropriate for expired links)
      }
    }

    const user = await UserData.findOneAndUpdate({ email }, { active: true, verifyUrlLink: null }, { new: true });

    if (!user) {
      throw new ApiError(400, "Invalid verification link"); // 400 Bad Request
    }

    return res.status(200).json(new ApiResponse(200, null, "Account verified successfully")); // 200 OK
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error")); // 500 Internal Server Error
  }
});

module.exports = verifyUser;
