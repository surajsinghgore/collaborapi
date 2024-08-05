const fs = require('fs');
const path = require('path');

const deleteFiles = (files) => {
  files.forEach((file) => {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(`Error deleting file ${file.path}:`, err);
      }
    });
  });
};

const generateUniqueFilename = (originalname) => {
  // Implement unique filename generation logic
  return `${Date.now()}_${path.basename(originalname)}`;
};

module.exports = { deleteFiles, generateUniqueFilename };
