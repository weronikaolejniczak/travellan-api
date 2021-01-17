const request = require('request-promise');

const Weather = require('../models/Weather');

const fetchWeather = (latitude, longitude) => {
    return request({
        method: 'GET',
        uri: encodeURI(`http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={hourly,current,minutely}&APPID=${process.env.WEATHER_API_KEY}&units=metric`),
        json: true
    })
      .then((data) => {
          console.log(data)
        const timezone = {
          timezone: data.timezone,
          offset: data.timezone_offset,
        };
        const forecast = [];
        
        data.daily.map((day) =>
            forecast.push(
                    new Weather(
                        new Date(day.dt * 1000),
                        new Date(day.sunrise * 1000),
                        new Date(day.sunset * 1000),
                        day.temp.max, // celsius
                        day.temp.min, // celsius
                        day.temp.day, // celsius
                        day.temp.night, // celsius
                        day.feels_like.day, // celsius
                        day.feels_like.night, // celsius
                        day.pressure, // hPa
                        day.humidity, // %
                        day.wind_speed, // m/s
                        day.clouds, //  %
                        day.weather[0].description, // string
                        day.pop, // probability
                        day.weather[0].icon, // icon id
                        day.weather[0].main,
                    ),
                ),
            );
  
            return [forecast, timezone];
        }
    ).catch((error) => error);
}
  
module.exports = fetchWeather;
  