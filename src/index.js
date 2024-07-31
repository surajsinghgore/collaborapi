require('dotenv').config();
const connectDB = require("./DB/index.js");
const app = require("./app.js");

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port: ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });
