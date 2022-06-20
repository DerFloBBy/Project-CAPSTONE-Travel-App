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

const baseURL_GeoNames = 'http://api.geonames.org/searchJSON';
const baseURL_Weather = 'https://api.weatherbit.io/v2.0/';
const baseURL_Picture = 'https://pixabay.com/api/';

// * EXAMPLE: https://api.weatherbit.io/v2.0/current?lat=52.52437&lon=13.41053&key=bd6c074fe9ad4fb88baca0323764482d
// * EXAMPLE: https://api.weatherbit.io/v2.0/forecast/daily?lat=52.52437&lon=13.41053&key=bd6c074fe9ad4fb88baca0323764482d
// * EXAMPLE: https://pixabay.com/api/?key=28156191-7d4384a79e79de40a1f5945d2&q=berlin&image_type=photo

//
// Using fetch insige another fetch
// * SOURCE: https://stackoverflow.com/questions/40981040/using-a-fetch-inside-another-fetch-in-javascript
//

app.post('/geonames', getCoordinates);

function getCoordinates(req, res) {
    Object.assign(projectData, req.body); // Client-Body to Server-ProjectData
    console.log(
        '-----------------------------------------------------------------------'
    );
    console.log('LOG: projectData #1');
    console.log(projectData, '\n');

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
            console.log('LOG: projectData #2');
            console.log(projectData, '\n');
            return projectData;
        })

        // *** fetch WeatherbitAPI ***
        // ***************************
        .then((projectData) => {
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
            if (projectData.days > 15) {
                Object.assign(projectData, {
                    temp: body.data[15].temp
                });
            } else if (projectData.days > 7) {
                Object.assign(projectData, {
                    temp: body.data[projectData.days].temp
                });
            } else if (projectData.days >= 0) {
                Object.assign(projectData, {
                    temp: body.data[0].temp
                });
            }

            console.log('LOG: projectData #3');
            console.log(projectData, '\n');
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
            // * ZUFALLSZAHL - Source: https://wiki.selfhtml.org/wiki/JavaScript/Tutorials/Zufallszahlen
            let picID = Math.floor(Math.random() * (10 - 1)) + 0;
            Object.assign(projectData, {
                picture_url: body.hits[picID].webformatURL
            });

            console.log('LOG: projectData #4');
            console.log(projectData, '\n');
            return projectData;
        })

        .then(() => {
            res.send(projectData);
        })

        .catch((error) => console.log('ERROR -- getCoordinates: ', error));
}

app.post('/currentWeather', getCurrentWeather);

function getCurrentWeather(req, res) {
    // const weather = fetch(
    //     `${baseURL_Weather}current?lat=${req.body.lat}&lon=${req.body.lon}&key=${process.env.apiKey_Weather}`
    // )
    console.log('LOG: projectData #xxx');
    console.log(projectData, '\n');

    const weather = fetch(
        `${baseURL_Weather}current?lat=${projectData.lat}&lon=${projectData.lon}&key=${process.env.apiKey_Weather}`
    ).then((response) => response.json());
    // .then((body) => {
    //     const weatherData = {
    //         temp: body.data[0].temp
    //     };
    //     return weatherData;
    // })
    // .then((weatherData) => {
    //     Object.assign(projectData, weatherData);
    //     console.log('LOG: getCurrentWeather');

    //     console.log(projectData);
    //     return projectData;
    // })
    // .then(() => {
    //     res.send(projectData);
    // })

    // .catch((error) => console.log('ERROR -- getCurrentWeather: ', error));
}

app.post('/forecastWeather', getForecastWeather);

function getForecastWeather(req, res) {
    const weather = fetch(
        `${baseURL_Weather}forecast/daily?lat=${req.body.lat}&lon=${req.body.lon}&key=${process.env.apiKey_Weather}`
    )
        .then((response) => {
            const body = response.json();
            return body;
        })
        .then((body) => {
            const temp_fc = body.data[req.body.days].temp;
            const weatherData = { temp_fc };
            return weatherData;
        })
        .then((weatherData) => {
            Object.assign(projectData, weatherData);
            console.log('LOG: getForecastWeather');

            console.log(projectData);
            return projectData;
        })
        .then(() => {
            res.send(projectData);
        })

        .catch((error) => console.log('ERROR -- getForecastWeather: ', error));
}

app.post('/picture', getPicture);

function getPicture(req, res) {
    console.log(
        `${baseURL_Picture}?key=${process.env.apiKey_Pixabay}&q=${req.body.city}&image_type=photo`
    );

    const picture = fetch(
        `${baseURL_Picture}?key=${process.env.apiKey_Pixabay}&q=${req.body.city}&image_type=photo`
    )
        .then((response) => {
            const body = response.json();
            return body;
        })
        .then((body) => {
            const picture_url = body.hits[0].webformatURL;
            const pictureData = { picture_url };
            return pictureData;
        })
        .then((pictureData) => {
            Object.assign(projectData, pictureData);
            console.log('LOG: getPicture');

            console.log(projectData);
            return projectData;
        })
        .then(() => {
            res.send(projectData);
        })

        .catch((error) => console.log('ERROR -- getPicture: ', error));
}
