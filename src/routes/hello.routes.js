const express=require('express');
const router = express.Router();
const Hello = require("../controllers/Hello.js");

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.get("/",(req,res)=>{
    res.status(200).json({message:"ss"})
});

module.exports = router;
