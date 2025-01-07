const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose'); // Import mongoose directly
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");
mongoose.set('strictQuery', true); // Or false, based on your use case

const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const urlRoute = require("./routes/url");
const dbName = 'inventory';
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://ak9102848:QW%4012.45a@cluster0.4pdkg.mongodb.net/';
const app = express();

// Connect to the MongoDB server
MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    
    const db = client.db(dbName); // Access the database
    const inventoryCollection = db.collection('items'); // Access the collection

    // POST route to add item via barcode scan
    app.post('/addItem', (req, res) => {
        const barcodeData = req.body.barcodeData;

        // Parse the item details from the barcode data
        let newItem;
        try {
            newItem = JSON.parse(barcodeData);
        } catch (error) {
            return res.json({ success: false, message: 'Invalid barcode data' });
        }

        // Insert the item into the collection
        inventoryCollection.insertOne(newItem, (err, result) => {
            if (err) {
                return res.json({ success: false, message: 'Failed to add item to inventory' });
            }
            res.json({ success: true });
        });
    });

    // Route to fetch inventory (already part of your code)
    app.get('/inventory', (req, res) => {
        inventoryCollection.find().toArray((err, items) => {
            if (err) return console.error(err);
            res.render('inventory', { items });
        });
    });
  })
  .catch(error => {
    console.error('Failed to connect to the database:', error);
  });

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

// Connect to MongoDB
connectToMongoDB(process.env.MONGODB ?? "mongodb+srv://ak9102848:QW%4012.45a@cluster0.4pdkg.mongodb.net/");


// Set the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Route handling
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );
    if (entry) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).send('URL not found'); // Handle case where entry is not found
    }
});

module.exports = connectToMongoDB;
