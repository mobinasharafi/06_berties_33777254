const express = require('express');
const router = express.Router();
const request = require('request');

// default city set to London
router.get('/weather', function (req, res, next) {
    const city = req.query.city || 'london';
    const apiKey = 'c0e11688ac63d3fbc44470a93e047606';

    // API returns Celsius by default
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) return next(err);

        const data = JSON.parse(body);

        // OpenWeather sends a JSON object even if the city is non-existent
        if (!data || !data.main) {
            return res.send(`
                <div style="font-family:sans-serif;padding:40px;">
                    <form method="GET" action="/weather" style="margin-bottom:40px;">
                        <input type="text" name="city" placeholder="Enter city" style="padding:8px;width:200px;">
                        <button type="submit" style="padding:8px 12px;">Get Weather</button>
                    </form>
                    <h3 style="margin-top:0;">Oops, “${city}” couldn’t be found as a valid city name .</h3>
                    <p style="color:#555;margin-top:4px;">Maybe try another city name?</p>
                </div>
            `);
        }

        // this is the little icon for the visual aspect of the weather condition
        const icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

        // converting the timestamps into human-readable time
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        // constructing a little HTML snippet to show the weather summary
        const summary = `
            <div style="max-width:380px;font-family:sans-serif;padding:20px;border:1px solid #ddd;border-radius:6px;background:white;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                <h2 style="margin-top:0;margin-bottom:10px;">${data.name}, ${data.sys.country}</h2>
                <div>
                    <img src="${icon}" style="width:60px;height:60px;vertical-align:middle;margin-right:10px;">
                    <span style="font-size:18px;">${data.weather[0].description}</span>
                </div>
                <h1 style="margin:15px 0;font-size:42px;">${data.main.temp}°C</h1>
                <p style="margin:4px 0;">Feels like: ${data.main.feels_like}°C</p>
                <p style="margin:4px 0;">Humidity: ${data.main.humidity}%</p>
                <p style="margin:4px 0;">Sunrise: ${sunrise}</p>
                <p style="margin:4px 0;">Sunset: ${sunset}</p>
            </div>
        `;

        // simple layout with a form at the top and the weather summary below
        res.send(`
            <div style="padding:50px;background:#f7f9fc;">
                <form method="GET" action="/weather" style="margin-bottom:50px;">
                    <input type="text" name="city" placeholder="Enter city" style="padding:8px;width:200px;">
                    <button type="submit" style="padding:8px 12px;">Get Weather</button>
                </form>

                ${summary}
            </div>
        `);
    });
});

module.exports = router;


