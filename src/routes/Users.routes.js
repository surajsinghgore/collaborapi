const express = require("express");
const { registerUser } = require("../controllers/User.controller");
const router = express.Router();
const registerValidation = require("../middlewares/registerValidation.middleware");


router.post("/",  registerUser);

module.exports = router;
