let allData = {};

/* Function called by 'Genarate'-Button */
function performAction(event) {
    event.preventDefault();
    // Get Destination and Date from HTML
    let travelDest = document.querySelector('#dest').value;
    let travelDate = document.querySelector('#datepicker').value;

    // Calc days to departure
    let today = new Date();
    today = new Date(
        today.getMonth() + 1 + '.' + today.getDate() + '.' + today.getFullYear()
    );

    let tDate = new Date(travelDate);
    let newTravelDate = new Date(
        tDate.getMonth() + 1 + '.' + tDate.getDate() + '.' + tDate.getFullYear()
    );

    let days = (newTravelDate - today) / (1000 * 60 * 60 * 24); // Umrechnung in Tage

    // Put Travel Data in an object
    allData = {
        dest: travelDest,
        days: days
    };

    if (allData.dest == '') {
        alert('Please insert a Destination');
    } else if (isNaN(allData.days)) {
        alert('Please insert a Travel Date!');
    } else if (allData.days < 0) {
        alert('Please select a date in the future!');
    } else {
        apiRequest(allData);
    }
}

async function apiRequest(allData) {
    fetch('http://localhost:8081/apiRequest', {
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
            Object.assign(allData, result);
        })
        .then(() => {
            document.querySelector(
                '#travelTitle'
            ).innerHTML = `Your Travel Data ...`;

            document.querySelector(
                '#travelDest'
            ).innerHTML = `Your chosen travel destination:<br> <strong>${allData.city}, ${allData.country}</strong>`;

            if (allData.days === 0) {
                document.querySelector(
                    '#travelDeparture'
                ).innerHTML = `The journey starts <strong>TODAY</strong>!`;
            } else if (allData.days === 1) {
                document.querySelector(
                    '#travelDeparture'
                ).innerHTML = `The journey starts <strong>Tomorrow</strong>.`;
            } else {
                document.querySelector(
                    '#travelDeparture'
                ).innerHTML = `The journey starts in <strong>${allData.days}</strong> days.`;
            }

            if (allData.days < 7) {
                document.querySelector(
                    '#travelTemp'
                ).innerHTML = `The current temperature is <strong>${allData.temp}??</strong> with <strong>${allData.desc}</strong>!`;
            } else {
                document.querySelector(
                    '#travelTemp'
                ).innerHTML = `The temperature will be around <strong>${allData.temp}??</strong> with <strong>${allData.desc}</strong>.`;
            }

            document.querySelector('#travelTempIcon').innerHTML = `<img
                src="icons/${allData.icon}.png"
                alt="WeatherIcon"
            />`;

            document.querySelector('#travelPics').innerHTML = `<img
                src="${allData.picture_url}"
                alt="${allData.city}"
            />`;
        })

        .catch((error) => console.log('ERROR -- apiRequest: ', error));
}

export { performAction };
