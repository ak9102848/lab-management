const mongoose = require('mongoose'); // Import mongoose directly
mongoose.set('strictQuery', true); // Or false, based on your use case
const connectToMongoDB = async () => {
    const mongoURI = process.env.MONGODB_URI || "mongodb+srv://ak9102848:QW%4012.45a@cluster0.4pdkg.mongodb.net/"; // Default to local MongoDB

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
