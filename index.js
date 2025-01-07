const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectToMongoDB = require("./connect"); // Import MongoDB connection
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

// Import routes
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const profileRoute = require("./routes/profile");

// const multer = require("multer");

// Initialize Express
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 8001; // Use process.env.PORT for Vercel

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Configure multer for file uploads
//  const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Save to uploads directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
//   },
// });
// const upload = multer({ storage });

// Connect to MongoDB
const mongoURI = process.env.MONGODB || "mongodb://localhost:27017/short-url";
connectToMongoDB(mongoURI);

// Routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);
app.use("/profile", restrictToLoggedinUserOnly, profileRoute);

// Root route
app.get("/", (req, res) => res.render("index"));

// Start the server
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
