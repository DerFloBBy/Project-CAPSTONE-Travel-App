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

const baseURL_GeoNames = 'http://api.geonames.org/searchJSON?q=';
// destCode = 'Berlin';

app.post('/geonames', function(req, res) {
    const response = fetch(
        baseURL_GeoNames +
            req.body.text +
            '&maxRows=1&username=' +
            process.env.userName_GeoNames
    )
        .then((response) => {
            const body = response.json();
            return body;
        })
        .then((body) => {
            console.log(body);
            return body;
        })
        .then((body) => {
            const country = body.geonames[0].countryName;
            const lat = body.geonames[0].lat;
            const lng = body.geonames[0].lng;
            const name = body.geonames[0].name;

            const geoData = { country, lat, lng, name };

            return geoData;
        })
        .then((geoData) => {
            Object.assign(projectData, geoData);
            console.log(projectData);
            return geoData;
        })
        .then((geoData) => {
            console.log(geoData);
            res.send(geoData);
        })
        .catch((error) => console.log('ERROOORRR', error));
});
