// functions/fetchData.js

exports.handler = async (event) => {
    const { default: fetch } = await import('node-fetch');

    const apiKey = 'your_api_key_here'; // Replace with your API key
    const {city} = event.queryStringParameters

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({
                city,
            }),
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
