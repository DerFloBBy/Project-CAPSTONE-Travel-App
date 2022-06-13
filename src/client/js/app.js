/* Global Variables */
// BaseURL for 'Current weather data' from OpenWeatherMap
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?q=';
// Personal API Key for OpenWeatherMap API
const apiKey = '273ac0cab962762527c58f48b36712ff&units=imperial';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.querySelector('#generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e) {
    // Get ZIP from HTML
    const zipCode = document.querySelector('#zip').value;
    getWeatherData(baseURL, zipCode, apiKey);
}

/* Function to GET Web API Data*/
const getWeatherData = async (baseURL, zipCode, apiKey) => {
    const res = await fetch(baseURL + zipCode + '&appid=' + apiKey);
    try {
        const data = await res.json();
        console.log(data);
        // Get FEELINGS from HTML
        const feelings = document.querySelector('#feelings').value;
        // Add newEntry to Server (POST)
        const newEntry = postData('/addEntry', {
            date: newDate,
            feel: feelings,
            temp: data.main.temp
        });
        // Get Data from Server and Update UI with Recent Entry
        retrieveData();
    } catch (error) {
        // appropriately handle the error
        console.log('error', error);
    }
};

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    console.log(data);
    const res = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(data)
    });

    try {
        const newData = await res.json();
        // console.log(newData);
        return newData;
    } catch (error) {
        console.log('error', error);
    }
};

const retrieveData = async () => {
    const res = await fetch('/getProjectData');
    try {
        // Transform into JSON
        const allData = await res.json();
        console.log(allData);
        // Write updated data (recent Entry) to DOM elements
        document.querySelector('#temp').innerHTML =
            Math.round(allData.TEMP) + '°';
        document.querySelector('#content').innerHTML = allData.FEEL;
        document.querySelector('#date').innerHTML = allData.DATE;
    } catch (error) {
        // appropriately handle the error
        console.log('error', error);
    }
};
