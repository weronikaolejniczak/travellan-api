const request = require('request-promise');

const fetchCoordinates = (keyword) => {
    return request({
        method: 'GET',
        uri: `https://api.tomtom.com/search/2/geocode/${keyword}.json?key=${process.env.TOM_TOM_API_KEY}`,
        json: true
    })
    .then((data) => data.results[0].position);
}

module.exports = fetchCoordinates;
