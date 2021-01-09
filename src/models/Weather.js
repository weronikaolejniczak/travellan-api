class Weather {
    constructor(
        date,
        sunrise,
        sunset,
        maxTemp,
        minTemp,
        tempDay,
        tempNight,
        tempDayFeelsLike,
        tempNightFeelsLike,
        pressure,
        humidity,
        windSpeed,
        cloudiness,
        description,
        rain,
        icon,
        main,
    ) {
        this.date = date;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.maxTemp = maxTemp;
        this.minTemp = minTemp;
        this.tempDay = tempDay;
        this.tempNight = tempNight;
        this.tempDayFeelsLike = tempDayFeelsLike;
        this.tempNightFeelsLike = tempNightFeelsLike;
        this.pressure = pressure;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.cloudiness = cloudiness;
        this.description = description;
        this.rain = rain;
        this.icon = icon;
        this.main = main;
    }
}
  
module.exports = Weather;
  