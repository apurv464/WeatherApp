const searchForm = document.querySelector(".search-form");
const citySearched = document.querySelector(".search-form input");
const cityName = document.querySelector(".city-name p");
const cardBody = document.querySelector(".card-body");
const containerBox = document.querySelector(".container");


//  Function to check Day or Night

function isNight(icon) {
    if (icon.includes('n')) {
        return true;
    } else {
        return false;
    }
}

function isDay(icon) {
    if (icon.includes('d')) {
        return true;
    } else {
        return false;
    }
}


// Onload show weather of current Location

window.addEventListener("load", () => {
    // containerBox.style.visibility = "hidden";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            console.log(`${lat}  ${long}`);
            weatherOnLoad(lat, long);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});


// Weather of Current Location Showing

async function weatherOnLoad(lt, lng) {
    let baseUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lt}&lon=${lng}&appid=8cc90171bb8bbb6bed28dbbda9bdda5b`
    const api = await fetch(baseUrl);
    const response = await api.json();
    const data = response;

    const { name } = data;
    const { description, icon } = data.weather[0];
    const { temp, temp_max, temp_min, feels_like, humidity } = data.main;
    const iconLink = `http://openweathermap.org/img/w/${icon}.png`;

    // checking for day and night and update background
    if (isDay(icon)) {
        containerBox.classList.add("day");
        console.log("hello Day");
    } else {
        containerBox.classList.add("night");
        console.log("hello Night");
    }

    // City Name update
    cityName.textContent = name;

    // Body Update
    cardBody.innerHTML = `<div class="card-mid">
    <div class="card-mid-left">
        <span>${Math.round((temp)-273.15)} &deg;C</span>
        <img class="icon" src="${iconLink}" alt="">
    </div>

    <div class="card-mid-right">
        <p>${description}</p>
        <p><i class="fas fa-long-arrow-alt-up"></i>${Math.round((temp_max)-273.15)} &deg;C</p>
        <p><i class="fas fa-long-arrow-alt-down"></i>${Math.round((temp_min)-273.15)} &deg;C</p>
    </div>
</div>
<div class="card-bottom">
    <div class="bottom-tex-left">
        <p>${Math.round((feels_like)-273.15)} &deg;C</p>
        <span>Feels Like</span>
    </div>
    <div class="bottom-tex-right">
        <p>${Math.round(humidity)}%</p>
        <span>Humidity</span>
    </div>
</div>`;

}

// Update search Weather
updateWeatherApp = (city) => {
    const iconurl = `http://openweathermap.org/img/w/${city.weather[0].icon}.png`;
    // checking for day and night
    if (isDay(city.weather[0].icon)) {
        if (containerBox.classList.contains("night")) {
            containerBox.classList.remove("night");
            containerBox.classList.add("day");
        }

    } else {
        if (containerBox.classList.contains("day")) {
            containerBox.classList.remove("day");
            containerBox.classList.add("night");
        }
    }

    // City Name Update
    cityName.textContent = city.name;

    // body Update
    cardBody.innerHTML = ` <div class="card-mid">
    <div class="card-mid-left">
        <span>${Math.round((city.main.temp)-273.15)} &deg;C</span>
        <img class="icon" src="${iconurl}" alt="">
    </div>

    <div class="card-mid-right">
        <p>${city.weather[0].description}</p>
        <p><i class="fas fa-long-arrow-alt-up"></i>${Math.round((city.main.temp_max)-273.15)} &deg;C</p>
        <p><i class="fas fa-long-arrow-alt-down"></i>${Math.round((city.main.temp_min)-273.15)} &deg;C</p>
    </div>
</div>
<div class="card-bottom">
    <div class="bottom-tex-left">
        <p>${Math.round((city.main.feels_like)-273.15)} &deg;C</p>
        <span>Feels Like</span>
    </div>
    <div class="bottom-tex-right">
        <p>${Math.round(city.main.humidity)}%</p>
        <span>Humidity</span>
    </div>
</div>`;
}

// search Form Event 
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const cityValue = citySearched.value.trim();
    searchForm.reset();
    requestCity(cityValue)
        .then(data => {
            updateWeatherApp(data);
        })
        .catch(error => console.log(error));
});

// fetching City Data
const requestCity = async(city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8cc90171bb8bbb6bed28dbbda9bdda5b`;

    //  Make Fetch Call
    const response = await fetch(url);

    // promise data
    const data = await response.json();
    return data;
}