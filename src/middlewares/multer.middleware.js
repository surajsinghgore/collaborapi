const multer = require("multer"); // Use CommonJS `require` syntax
const path = require("path");

// Define allowed image types
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
// Create a storage engine with destination and filename settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create a file filter function to validate file types
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, JPEG, and WEBP are allowed.")); // Reject the file
  }
};

// Define file size limit
const limits = {
  fileSize: 2 * 1024 * 1024, // 2 MB
};

// Create an instance of multer with storage, fileFilter, and limits
const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = { upload }; // Export the configured multer instance
