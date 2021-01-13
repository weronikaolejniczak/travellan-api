const capitalizeEachWord = require('./capitalizeEachWord');
const countryCodes = require('../data/countryCodes.json');

const formatLocationData = (hotelData) => {
    const latitude = hotelData.latitude;
    const longitude = hotelData.longitude;

    const addressLines = capitalizeEachWord(hotelData.address.lines.join(' '));
    const postalCode = hotelData.address.postalCode;
    const cityName = capitalizeEachWord(hotelData.address.cityName);
    const countryName = countryCodes[hotelData.address.countryCode];

    const address = `${addressLines}, ${postalCode} ${cityName}, ${countryName}`;

    return { address, latitude, longitude };
}

module.exports = formatLocationData;
