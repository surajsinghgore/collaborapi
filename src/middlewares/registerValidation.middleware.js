const { check, validationResult } = require("express-validator");
const fs = require("fs");

// List of popular and trusted email domains
const trustedEmailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com", "mail.com", "zoho.com", "protonmail.com", "tutanota.com", "gmx.com", "inbox.com", "mail.ru"];

// Custom function to check for trusted emails
const isTrustedEmail = (email) => {
  const domain = email.split("@")[1];
  return trustedEmailDomains.includes(domain);
};

// Validation middleware
const validateUser = [
  // Validate username (must be alphanumeric and between 3 and 20 characters long)
  check("username").exists().withMessage("Username is required.").notEmpty().withMessage("Username cannot be empty.").isAlphanumeric().withMessage("Username must be alphanumeric.").isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters long."),

  // Validate email (must be a valid email and from a trusted provider)
  check("email")
    .exists()
    .withMessage("Email is required.")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Invalid email address.")
    .custom((value) => {
      if (!isTrustedEmail(value)) {
        throw new Error("Email address must be from a trusted provider.");
      }
      return true;
    }),

  // Validate password (must contain at least one special character and be at least 5 characters long)
  check("password")
    .exists()
    .withMessage("Password is required.")
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character."),

  // Middleware to handle validation results
  (req, res, next) => {
    const errors = validationResult(req);

    // Collect error messages
    const resultErrors = errors.array();

    // Add specific error messages for undefined fields if not handled by validation
    ["username", "email", "password"].forEach((field) => {
      if (req.body[field] === undefined || req.body[field] === null) {
        resultErrors.push({ msg: `${field.charAt(0).toUpperCase() + field.slice(1)} is required.` });
      }
    });

    // Check if 'profile' file is provided if it is required
    if (!req.files || !req.files["profile"] || req.files["profile"].length === 0) {
      resultErrors.push({ msg: "Profile image is required." });
    }

    if (resultErrors.length > 0) {
      // Unlink all files if validation errors occur
      if (req.files) {
        Object.values(req.files).forEach((filesArray) => {
          filesArray.forEach((file) => {
            fs.unlink(file.path, (err) => {
              if (err) {
                console.error(`Error deleting file ${file.path}:`, err);
              }
            });
          });
        });
      }

      return res.status(400).json({ errors: resultErrors });
    }

    next();
  },
];

module.exports = validateUser;
