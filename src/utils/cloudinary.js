const cloudinary = require("cloudinary").v2; // Use CommonJS `require` syntax
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate a unique filename using file path and timestamp
const generateUniqueFilename = (filePath) => {
  const extname = path.extname(filePath);
  const basename = path.basename(filePath, extname);
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.-]/g, ""); // Generate a timestamp string including current time
  return `${basename}-${timestamp}${extname}`;
};

// Check if a file with the same name already exists
const checkFileExists = (filePath) => {
  return fs.existsSync(filePath);
};

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    return { statusCode: 400, message: "Invalid file path provided." };
  }

  const uniqueFilename = generateUniqueFilename(localFilePath);
  const fileWithUniqueName = path.join(path.dirname(localFilePath), uniqueFilename);

  // Check if file with the same name already exists
  if (checkFileExists(fileWithUniqueName)) {
    console.log(`File with the name ${uniqueFilename} already exists locally.`);
    return { statusCode: 409, message: `File with the name ${uniqueFilename} already exists locally.` };
  }

  try {
    // Rename the local file to include the unique filename
    fs.renameSync(localFilePath, fileWithUniqueName);

    // Upload the file to Cloudinary and place it in the 'collaborApi' folder
    const response = await cloudinary.uploader.upload(fileWithUniqueName, {
      resource_type: "auto",
      folder: "collaborApi", // Specify the folder name
    });

    // File has been uploaded successfully
    // console.log("File is uploaded on Cloudinary: ", response.url);

    // Remove the locally saved temporary file
    fs.unlinkSync(fileWithUniqueName);

    return { statusCode: 200, message: "File uploaded successfully.", data: response };
  } catch (error) {
    console.error("Error uploading file to Cloudinary: ", error);

    // Ensure to remove the locally saved temporary file if it was renamed
    try {
      if (fs.existsSync(fileWithUniqueName)) {
        fs.unlinkSync(fileWithUniqueName);
      }
    } catch (unlinkError) {
      console.error("Error removing temporary file: ", unlinkError);
    }

    return { statusCode: 500, message: "Error uploading file to Cloudinary.", error: error.message };
  }
};

module.exports = { uploadOnCloudinary }; // Export using CommonJS `module.exports`
