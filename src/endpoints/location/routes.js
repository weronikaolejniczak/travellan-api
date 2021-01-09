const express = require('express');
const url = require('url');
const Amadeus = require('amadeus');

const fetchCoordinates = require('../../services/fetchCoordinates');

const Router = express.Router;
const routes = new Router();
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET
});

/** 
 * GET /v1/location/cityCode?keyword={keyword}
 * e.g.
 * GET /v1/location/cityCode?keyword=Barcelona
 * */

const getCityCode = (req, res) => {    
    const query = url.parse(req.url, true).query;
    const { keyword } = query;

    amadeus.referenceData.locations.get({
        subType: 'CITY',
        keyword
    })
        .then((response) => res.json(response.data[0].address.cityCode))
        .catch((err) => {
            throw new Error(`Error ${err.code}: ${err.message}`);
        });
};

routes.get('/cityCode', getCityCode);

/** 
 * GET /v1/location/coordinates?keyword={keyword}
 * e.g.
 * GET /v1/location/coordinates?keyword=Barcelona
 * */

const getCoordinates = (req, res) => {    
    const query = url.parse(req.url, true).query;
    const { keyword } = query;

    fetchCoordinates(keyword)
        .then((result) => { 
            if (result === -1) throw new Error('Something went wrong...');
            else res.json(result);
    });
};

routes.get('/coordinates', getCoordinates);

module.exports = routes;
