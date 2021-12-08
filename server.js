///////////////////////////////////////////
// Dependencies
//////////////////////////////////////////
// dotenv to get our env variables
require("dotenv").config()
// PULL PORT variable from .env
const {PORT = 3000, MONGODB_URL} = process.env
// import express
const express = require("express")
// create app object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import middleware
const cors = require("cors") // cors headers
const morgan = require("morgan") // logging

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
// Connection Events
mongoose.connection
    .on("open", () => console.log("Your are connected to mongoose"))
    .on("close", () => console.log("Your are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
  });
  
const Cheese = mongoose.model("Cheese", CheeseSchema);
  
///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
  
/////////////////////////////////////////
// Routes and Routers
/////////////////////////////////////////
// test routes
app.get("/", (req, res) => {
    res.send("hello world")
})

// Index Route - get request to /cheese
app.get("/cheese", async (req, res) => {
    try {
    // send all cheese
      res.json(await Cheese.find({}));
    } catch (error) {
    // send error
      res.status(400).json(error);
    }
});

// Create Route - post request to /cheese
app.post("/cheese", async (req, res) => {
    try {
        // create a new cheese
        res.json(await Cheese.create(req.body))
    } catch (error){
        //send error
        res.status(400).json({error})
    }
})

// update route - put request to /cheese/:id
app.put("/cheese/:id", async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body,
            {new: true})
            )
    } catch (error) {
        res.status(400).json({error})
    }
})

// destroy route - delete request to /cheese/:id
app.delete("/cheese/:id", async(req, res) => {
    try{
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json({error})
    }
})

///////////////////////////////
//Server listener
////////////////////////////////
app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
})