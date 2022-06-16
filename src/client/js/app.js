let allData = {};

/* Global Variables */
// BaseURL & UserName for 'GeoNames.org' from OpenWeatherMap
const baseURL_GeoNames = 'http://api.geonames.org/searchJSON?q=';
const userName_GeoNames = 'fboelke';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();
console.log(d);
console.log(newDate);

// Event listener to add function to existing HTML DOM element
// * Wird jetzt am Button getriggert
// document.querySelector('#generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(event) {
    event.preventDefault();
    // Get dest from HTML
    let destCode = document.querySelector('#dest').value;
    let travelDate = document.querySelector('#datepicker').value;

    // * kann als alternative zur obigen auswahl genutzt werden * //
    // let dataPoints = document.getElementsByClassName('dataPoint');
    // console.log(dataPoints[0].value);
    // console.log(dataPoints[1].value);
    // * *************** * //

    destCode = {
        // text: destCode
        text: 'Berlin'
    };
    console.log(travelDate);

    if (destCode.text == '') {
        alert('Please insert a Destination');
    } else {
        apiRequest(destCode);
    }
}

async function apiRequest(destCode) {
    console.log('Reiseziel:');
    console.log(destCode.text);
    fetch('http://localhost:8081/geonames', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(destCode)
    })
        .then((apiResponse) => {
            const result = apiResponse.json();
            return result;
        })
        .then((result) => {
            Object.assign(allData, result);
        })
        .then(() => {
            weatherApiRequest(allData);
        })
        .catch((error) => console.log('ERROOORRR: ', error));
}

async function weatherApiRequest(allData) {
    console.log('Koordinaten:');
    console.log(allData);
    fetch('http://localhost:8081/weather', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(allData)
    })
        .then((apiResponse) => {
            const result = apiResponse.json();
            return result;
        })
        .then((result) => {
            console.log(result);
        })
        .catch((error) => console.log('ERROOORRR: ', error));
}

export { performAction };
