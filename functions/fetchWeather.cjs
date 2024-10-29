// functions/fetchData.js

exports.handler = async (event) => {
    const { default: fetch } = await import('node-fetch');

    const apiKey = process.env.WEATHER_API_KEY
    const {city} = event.queryStringParameters

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // CORS header
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching data', error: error.message }),
        };
    }
};
