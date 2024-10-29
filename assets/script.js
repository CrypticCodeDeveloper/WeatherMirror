
document.addEventListener("DOMContentLoaded",() => {

    const searchBtn = document.getElementById('search-btn')
    const cityInput = document.getElementById('city-input')
    const popup = document.getElementById('popup')

     // check internet connection
     if(!navigator.onLine){
        showPopup('You are offline. Weather data may not be up to date.')
    }

    // visit link on click
    const visitLink = (url) => {
        window.open(url, '_blank')
    }

    document.getElementById('linkedinBtn').addEventListener("click",()=>{
        visitLink('https://www.linkedin.com/in/abraham-bishop/');
    })

    document.getElementById('gitBtn').addEventListener("click",()=>{
        visitLink('https://github.com/crypticcodedeveloper');
    })

    // function to showPopup
    const showPopup = (message) => {
        document.getElementById('error-title').textContent = message
        popup.classList.add('show')
        setTimeout(() => popup.classList.remove('show'), 4000)
    }

    // hide popup
    const hidePopup = () => {
        popup.classList.remove('show')
    }

    document.getElementById('error-close').addEventListener('click', async () => {
        hidePopup()
     })

    const getLocation = async () => {
        try {
            const response = await fetch('/.netlify/functions/getLocation')
            const json = await response.json()
            const {country, lat, lon} = json
            fetchLatLon(lat, lon)

            // display country
            document.getElementById('country').textContent = country
        } catch (error) {
            console.error(error)
        }
    }

    getLocation()

    // getting the user's weather data based on latitude and longitude
    const fetchLatLon = async (lat,lon) => {
                try {
                    const response = await fetch(`/.netlify/functions/fetchLatLon?lat=${lat}&lon=${lon}`);
                    const data = await response.json()
                    displayWeatherData(data)
                } catch (error) {
                    console.error(error)
                }
    }

    // fetch api data
    const fetchWeatherData = async (city) => {
        if(!navigator.onLine){
            showPopup('No internet connection. Please check your network settings.')
        } else {
            try {
                const response = await fetch(`/.netlify/functions/fetchWeather?city=${city}`);
                const data = await response.json()
                displayWeatherData(data)
            } catch (error) {
                console.error(error)
                showPopup('Unable to retrieve location data')
            }
        }
    }

    // display data to the DOM
    const displayWeatherData = (data) => {

        // destructuring data
        const {name,coord:{lon, lat}, main:{temp, humidity,temp_max,temp_min,pressure,sea_level,grnd_level,feels_like}, weather:[{description,icon}], sys:{sunrise, sunset, country}, wind:{deg, gust,speed}, timezone} = data

        // convert to celsius
        const convertToCelsius = (kelvin) => {
            return parseFloat(kelvin - 273.15).toFixed(1)+'°C';
        }

        function convertToUTC(offsetInSeconds) {
            // Calculate the offset in hours
        const offsetInHours = offsetInSeconds / 3600;

        // Format the output string
        const formattedOffset = `${offsetInHours >= 0 ? '+' : ''}${offsetInHours} UTC`;
        return formattedOffset;
        }

        // return sunrise or sunset based on timezone
        function convertTimestampToLocalTime(timestamp, timezoneOffset) {
            const localDate = new Date((timestamp + timezoneOffset) * 1000);

            // Extract hours, minutes, and seconds
            let hours = localDate.getUTCHours(); // Get hours in UTC
            const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
            const seconds = String(localDate.getUTCSeconds()).padStart(2, '0');

            // Determine AM or PM
            const ampm = hours >= 12 ? 'PM' : 'AM';

            // Convert to 12-hour format
            hours = hours % 12;
            hours = hours ? String(hours).padStart(2, '0') : '12';

            // Return the formatted time
            return `${hours}:${minutes}:${seconds} ${ampm}`;
        }

        // updating DOM elements with data
        document.getElementById('city-name').textContent = name + ', ' + country
        document.getElementById('temp').textContent = convertToCelsius(temp)
        document.getElementById('temp-max').textContent = convertToCelsius(temp_max)
        document.getElementById('temp-min').textContent = convertToCelsius(temp_min)
        document.getElementById('humidity').textContent = humidity+'%'
        document.getElementById('weather-description').textContent = description
        document.getElementById('feels-like').textContent = convertToCelsius(feels_like)
        document.getElementById('pressure').textContent = pressure+' hPa'
        document.getElementById('sea-level').textContent = sea_level+' hPa'
        document.getElementById('grnd-level').textContent = grnd_level+' hPa'
        document.getElementById('latitude').textContent = lat+'°'
        document.getElementById('longitude').textContent = lon+'°'
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`
        document.getElementById('sunrise').textContent = convertTimestampToLocalTime(sunrise, timezone);
        document.getElementById('sunset').textContent = convertTimestampToLocalTime(sunset, timezone);
        document.getElementById('wind-deg').textContent = deg+'°'
        document.getElementById('wind-gust').textContent = gust == undefined? 'N/A' : gust+' km/h'
        document.getElementById('wind-speed').textContent = speed+' km/h'
        document.getElementById('timezone').textContent = convertToUTC(timezone)
    }

    // add event listener to the search button
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim()
        cityInput.value = '' // clear input field after search

        if(city){
            fetchWeatherData(city)
        } else {
            showPopup('Please enter a city name')
        }
    })

    // function for digital clock
    const updateClock = () => {
        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes()

        // greeting based on time of day
        const greeting = hours >= 0 && hours < 12? 'Good Morning' : hours >= 12 && hours < 18? 'Good Afternoon' : 'Good Evening'
        document.getElementById('greetings').textContent = greeting


        // change icon depending on time
        // day
        hours >= 0 && hours < 18? document.getElementById('time-icon').innerHTML = '<i class="fa-solid fa-sun time-icon"></i>' : document.getElementById('time-icon').innerHTML = '<i class="fa-solid fa-moon time-icon"></i>'

        // insert hours and minutes into the DOM
        document.getElementById('hours').textContent = hours < 10? `0${hours}` : hours
        document.getElementById('minutes').textContent = minutes < 10? `0${minutes}` : minutes

        // determine whether it is am or pm
        const ampm = hours >= 12? 'PM' : 'AM'
        document.getElementById('ampm').textContent = ampm

        // day of the week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const dayOfWeek = daysOfWeek[now.getDay()]
        document.getElementById('day-of-week').textContent = dayOfWeek

        // precise date
        const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const month = monthsOfYear[now.getMonth()]
        const date = now.getDate()
        const preciseDate = `${date}th of ${month}`
        document.getElementById('precise-date').textContent = preciseDate
    }

    setInterval(updateClock, 1000) // update clock every second
})
