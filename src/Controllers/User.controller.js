const registerUserHandler = require("./User/RegisterUser");
const verifyUserHandler = require("./User/VerifyUser");
const { asyncHandler } = require("../utils/AsyncHandler.js");

// Handler for user registration
const registerUser = asyncHandler(registerUserHandler);

// Handler for user verification
const verifyUser = asyncHandler(verifyUserHandler);

module.exports = { registerUser, verifyUser };
