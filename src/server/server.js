// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Submit forms and file uploads | Fetch API to node.js
const FormData = require('form-data');
const fetch = require('node-fetch');

// log in console
const { log } = require('console');

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
const { send } = require('process');
app.use(cors());

// ! To not get an 'self signed certificate in certificate chain' error when fetching
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
// designates what port the app will listen to for incoming requests
app.listen(8081, function() {
    console.log('Example app listening on port 8081!');
});

//
//
//
// Respond with JS object when a GET request is made to the homepage
app.get('/getProjectData', function(req, res) {
    res.send(projectData);
    // console.log(projectData);
});

// Update JS object when a POST request is made to the homepage
app.post('/addEntry', addEntry);

function addEntry(req, res) {
    // console.log(req.body);
    newEntry = {
        DATE: req.body.date,
        FEEL: req.body.feel,
        TEMP: req.body.temp
    };
    Object.assign(projectData, newEntry);
    res.send(projectData);
    console.log(projectData);
}
