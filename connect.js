const mongoose = require('mongoose'); // Import mongoose directly

const connectToMongoDB = async () => {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/short-url"; // Default to local MongoDB

    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if there's an error
    }
};

module.exports = connectToMongoDB;
