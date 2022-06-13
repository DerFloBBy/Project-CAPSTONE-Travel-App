// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
const { send } = require('process');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 3000;
/* Spin up the server */
const server = app.listen(port, listening);
function listening() {
    // console.log(server);
    console.log(`running on localhost: ${port}`);
}

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
