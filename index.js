const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectToMongoDB = require("./connect"); // Import MongoDB connection
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");

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

// Set the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);
app.use("/profile", restrictToLoggedinUserOnly, profileRoute);

// Root route
// Define routes
app.get('/', (req, res) => {
  res.render('index');  // Main homepage (if you have index.ejs)
});

app.get('/inventory', (req, res) => {
  res.render('inventory');  // Renders inventory.ejs from the views folder
});

app.get('/labtour', (req, res) => {
  res.render('labtour');  // Renders inventory.ejs from the views folder
});

app.get('/labnotes', (req, res) => {
  res.render('labnotes');  // Renders inventory.ejs from the views folder
});

app.get('/index', (req, res) => {
  res.render('index');  // Renders inventory.ejs from the views folder
});

app.get('/getItemDetails', (req, res) => {
  const qrData = req.query.qrData;

  // Fetch item from the database based on qrData (this is just a mock example)
  const item = database.find(item => item.qrCode === qrData); // Replace with actual DB lookup

  if (item) {
      res.json({
          success: true,
          item: {
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              price: item.price,
              expiry: item.expiry,
              shelf: item.shelf
          }
      });
  } else {
      res.json({ success: false, message: 'Item not found' });
  }
});





// In your server-side code (e.g., app.js)
app.post('/addItem', (req, res) => {
  const qrData = req.body.qrData;

  // Assuming you have a function to add item to the inventory
  addItemToInventory(qrData)
      .then(() => res.json({ success: true }))
      .catch(err => {
          console.error('Error adding item:', err);
          res.json({ success: false });
      });
});

function addItemToInventory(qrData) {
  // Parse the QR data and save it to your database
  // Example: Assuming `inventory` is a database or an array
  const newItem = parseQRData(qrData);

  // Save item to inventory (this can be in memory, database, etc.)
  inventory.push(newItem);

  // Return a promise or just resolve the operation
  return Promise.resolve();
}

// Start the server
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
