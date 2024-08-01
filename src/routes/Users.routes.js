const express = require("express");
const { registerUser } = require("../controllers/User.controller");
const router = express.Router();
const registerValidation = require("../middlewares/registerValidation.middleware");
const { upload } = require("../middlewares/multer.middleware");
const multer = require("multer"); // Use CommonJS `require` syntax

// POST USER [REGISTER USER]
router.post(
  "/",
  upload.fields([
    {
      name: "profile",
      maxCount: 1,
    },
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  registerValidation,
  registerUser,
  (error, req, res, next) => {
    // Error-handling middleware for Multer errors
    if (error) {
      if (error instanceof multer.MulterError) {
        // Multer-specific error
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File size exceeds the limit of 2 MB." });
        }
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({ message: "Unexpected field encountered during upload." });
        }
        // Handle other Multer errors
        return res.status(400).json({ message: `Multer error: ${error.message}` });
      } else {
        // Non-Multer error
        return res.status(400).json({ message: `Error: ${error.message}` });
      }
    }
    // If there's no error, proceed to the next middleware
    next();
  }
);

module.exports = router;
