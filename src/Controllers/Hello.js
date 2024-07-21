// import { ApiError } from "../utils/ApiError";
const { ApiResponse } = require("../utils/ApiResponse");

function Hello(req, res) {
  // throw new ApiError(500, "Something went wrong while generating referesh and access token")
  return res.status(200).json(new ApiResponse(200, "ss", "successfully"));
}

module.exports = { Hello };
