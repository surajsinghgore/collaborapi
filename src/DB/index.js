require('dotenv').config()
const mongoose = require("mongoose");

const  {DB_NAME} = require("../Constant");
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        // console.log(`MongoDB connected! DB HOST: ${mongoose.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection failed:", error);
        process.exit(1);
    }
};

module.exports=connectDB;
