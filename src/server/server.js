// Setup empty JS object to act as endpoint for all routes
let projectData = {};

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
//

// For JestTesting the ServerSide
app.get('/helloworld', (req, res) => {
    res.status(200).send('Hello World!');
});

// Start fetching the APIs
const baseURL_GeoNames = 'http://api.geonames.org/searchJSON';
const baseURL_Weather = 'https://api.weatherbit.io/v2.0/';
const baseURL_Picture = 'https://pixabay.com/api/';

//
// Using fetch insige another fetch
// * SOURCE: https://stackoverflow.com/questions/40981040/using-a-fetch-inside-another-fetch-in-javascript
//

app.post('/apiRequest', getData);

function getData(req, res) {
    Object.assign(projectData, req.body); // Client-Body to Server-ProjectData

    // *** fetch GeonamesAPI ***
    // ***************************
    fetch(
        `${baseURL_GeoNames}?q=${projectData.dest}&maxRows=1&username=${process.env.userName_GeoNames}`
    )
        .then((response) => response.json())
        .then((body) => {
            const geoData = {
                city: body.geonames[0].name,
                country: body.geonames[0].countryName,
                lat: body.geonames[0].lat,
                lon: body.geonames[0].lng
            };
            return geoData;
        })
        .then((geoData) => {
            Object.assign(projectData, geoData);
            return projectData;
        })

        // *** fetch WeatherbitAPI ***
        // ***************************
        .then((projectData) => {
            // decision depending on which travel date was chosen
            if (projectData.days > 7) {
                return fetch(
                    `${baseURL_Weather}forecast/daily?lat=${projectData.lat}&lon=${projectData.lon}&key=${process.env.apiKey_Weather}`
                );
            } else if (projectData.days >= 0) {
                return fetch(
                    `${baseURL_Weather}current?lat=${projectData.lat}&lon=${projectData.lon}&key=${process.env.apiKey_Weather}`
                );
            }
        })
        .then((response) => response.json())
        .then((body) => {
            // decision depending on which travel date was chosen
            if (projectData.days > 15) {
                Object.assign(projectData, {
                    temp: body.data[15].temp,
                    icon: body.data[15].weather.icon,
                    desc: body.data[15].weather.description
                });
            } else if (projectData.days > 7) {
                Object.assign(projectData, {
                    temp: body.data[projectData.days].temp,
                    icon: body.data[projectData.days].weather.icon,
                    desc: body.data[projectData.days].weather.description
                });
            } else if (projectData.days >= 0) {
                Object.assign(projectData, {
                    temp: body.data[0].temp,
                    icon: body.data[0].weather.icon,
                    desc: body.data[0].weather.description
                });
            }
            return projectData;
        })

        // *** fetch PixbayAPI ***
        // ***********************
        .then((projectData) => {
            return fetch(
                `${baseURL_Picture}?key=${process.env.apiKey_Pixabay}&q=${projectData.city}&image_type=photo`
            );
        })
        .then((response) => response.json())
        .then((body) => {
            // * RandomNumber - Source: https://wiki.selfhtml.org/wiki/JavaScript/Tutorials/Zufallszahlen
            let picID = Math.floor(Math.random() * (10 - 1)) + 0;
            Object.assign(projectData, {
                picture_url: body.hits[picID].webformatURL
            });
            return projectData;
        })

        .then(() => {
            res.send(projectData);
        })

        .catch((error) => console.log('ERROR -- getData: ', error));
}

module.exports = app;
