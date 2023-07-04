require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("MongoDB connection Successfull")
    } catch (error) {
        console.log("No connection ", error.message)
    }
}

module.exports = connectDB;

