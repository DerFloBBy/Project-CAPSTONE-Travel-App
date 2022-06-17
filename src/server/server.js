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
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
});

// * EXAMPLE: http://api.geonames.org/searchJSON?q=berlin&maxRows=10&username=fboelke
const baseURL_GeoNames = 'http://api.geonames.org/searchJSON?q=';

app.post('/geonames', getCoordinates);

function getCoordinates(req, res) {
    const coordinates = fetch(
        `${baseURL_GeoNames}${req.body.dest}&maxRows=1&username=${process.env.userName_GeoNames}`
    )
        .then((response) => {
            const body = response.json();
            return body;
        })
        .then((body) => {
            const city = body.geonames[0].name;
            const country = body.geonames[0].countryName;
            const lat = body.geonames[0].lat;
            const lon = body.geonames[0].lng;
            const geoData = { city, country, lat, lon };
            return geoData;
        })
        .then((geoData) => {
            Object.assign(projectData, geoData);
            console.log(projectData);
            return projectData;
        })
        .then(() => {
            res.send(projectData);
        })
        .catch((error) => console.log('ERROOORRR', error));
}

// * EXAMPLE: https://api.weatherbit.io/v2.0/current?lat=52.52437&lon=13.41053&key=bd6c074fe9ad4fb88baca0323764482d
const baseURL_Weather = 'https://api.weatherbit.io/v2.0/current?';

app.post('/currentWeather', getCurrentWeather);

function getCurrentWeather(req, res) {
    console.log(req.body.lat);

    const weather = fetch(
        `${baseURL_Weather}lat=${req.body.lat}&lon=${req.body.lon}&key=${process.env.apiKey_Weather}`
    )
        .then((response) => {
            const body = response.json();
            return body;
        })
        .then((body) => {
            const temp = body.data[0].temp;
            const weatherData = { temp };
            return weatherData;
        })
        .then((weatherData) => {
            Object.assign(projectData, weatherData);
            console.log('LOG: getCurrentWeather');

            console.log(projectData);
            return projectData;
        })
        .then(() => {
            res.send(projectData);
        })

        .catch((error) => console.log('ERROOORRR', error));
}
