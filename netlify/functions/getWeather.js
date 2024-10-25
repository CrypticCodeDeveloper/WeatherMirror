
const fetch = require('node-fetch')

exports.handler = async (event) => {
    const { lat,lon } = event.queryStringParameters; // Get location parameter from request
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch weather data" }),
        };
    }
};
