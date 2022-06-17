let allData = {};

/* Function called by 'Genarate'-Button */
function performAction(event) {
    event.preventDefault();
    // Get Destination and Date from HTML
    let travelDest = document.querySelector('#dest').value;
    let travelDate = document.querySelector('#datepicker').value;

    // * kann als alternative zur obigen auswahl genutzt werden * //
    // let dataPoints = document.getElementsByClassName('dataPoint');
    // console.log(dataPoints[0].value);
    // console.log(dataPoints[1].value);
    // * *************** * //

    // Calc days to departure
    let today = new Date();
    today = new Date(
        today.getMonth() + 1 + '.' + today.getDate() + '.' + today.getFullYear()
    );
    console.log('---Heute (neu):');
    console.log(today);

    let tDate = new Date(travelDate);
    let newTravelDate = new Date(
        tDate.getMonth() + 1 + '.' + tDate.getDate() + '.' + tDate.getFullYear()
    );
    console.log('---TravelDate (neu):');
    console.log(newTravelDate);

    let days = (newTravelDate - today) / (1000 * 60 * 60 * 24); // Umrechnung in Tage
    console.log('---Tage:');
    console.log(days);

    // Put Travel Data in an object
    let travelData = {
        dest: travelDest,
        // dest: 'Berlin',
        days: days
    };

    if (travelData.dest == '') {
        alert('Please insert a Destination');
    } else if (isNaN(travelData.days)) {
        alert('Please insert a Travel Date!');
    } else if (days < 0) {
        alert('Please select a date in the future!');
    } else {
        apiRequest(travelData);
    }
}

async function apiRequest(travelData) {
    console.log('---Reiseziel:');
    console.log(travelData.dest);
    fetch('http://localhost:8081/geonames', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(travelData)
    })
        .then((apiResponse) => {
            const result = apiResponse.json();
            return result;
        })
        .then((result) => {
            Object.assign(allData, result);
        })
        .then(() => {
            if (travelData.days > 7) {
                console.log('Reise beginnt nach einer Woche');
            } else if (travelData.days >= 0) {
                console.log('Reise beginnt innerhalb einer Woche');
                currentWeatherApiRequest(allData);
            }
        })
        .catch((error) => console.log('ERROOORRR: ', error));
}

async function currentWeatherApiRequest(allData) {
    console.log('---Koordinaten:');
    console.log(allData);
    fetch('http://localhost:8081/currentWeather', {
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
