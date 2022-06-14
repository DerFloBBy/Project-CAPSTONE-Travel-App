/* Global Variables */
// BaseURL & UserName for 'GeoNames.org' from OpenWeatherMap
const baseURL_GeoNames = 'http://api.geonames.org/searchJSON?q=';
const userName_GeoNames = 'fboelke';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener to add function to existing HTML DOM element
// * Wird jetzt am Button getriggert
// document.querySelector('#generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(event) {
    event.preventDefault();
    // Get dest from HTML
    let destCode = document.querySelector('#dest').value;
    destCode = {
        text: destCode
        // text: 'Berlin'
    };
    apiRequest(destCode);
}

async function apiRequest(destCode) {
    console.log('QuellText: ' + destCode.text);
    fetch('http://localhost:8081/geonames', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(destCode)
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

// * ALTE DATEN //
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

// * ALTE DATEN <-- bis hier ;) //

export { performAction };
