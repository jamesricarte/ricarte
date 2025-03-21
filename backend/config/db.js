const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb Connection Successfully✅");
    } catch (error) {
        console.error("❌Error connectig to mongodb: ", error.message);
    }
}

module.exports = connectDb;