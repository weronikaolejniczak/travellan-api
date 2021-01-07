const express = require('express');
const url = require('url');
const Amadeus = require('amadeus');

const scrapeBooking = require('../../services/scrapeBooking');

const Router = express.Router;
const routes = new Router();
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET
});

/** 
 * GET /v1/accommodation/recommendation?
 * e.g.
 * GET /v1/accommodation/recommendation?
 * */

const getHotelRecommendation = (req, res) => {
    /* const query = url.parse(req.url, true).query;
    const region = query.region;
    const name = query.name; */

    amadeus.shopping.flightOffersSearch
        .get({
            originLocationCode: 'SYD',
            destinationLocationCode: 'BKK',
            departureDate: '2021-04-01',
            adults: '2'
        })
        .then((response) => {
            res.json(response.data);
        })
        .catch((err) => {
            throw new Error(`Error ${err.code}: ${err.message}`);
        });
}

routes.get('/recommendation', getHotelRecommendation);

/** 
 * GET /v1/accommodation/booking?region={region}&name={name}
 * e.g.
 * GET /v1/accommodation/booking?region=ch&name=longemalle
 * */

const getBookingHotel = (req, res) => {    
    const query = url.parse(req.url, true).query;
    const region = query.region;
    const name = query.name;

    scrapeBooking(`https://www.booking.com/hotel/${region}/${name}.html`)
        .then((result) => { 
            if (result === -1) throw new Error('Something went wrong...');
            else res.json(result);
    });
};

routes.get('/booking', getBookingHotel);

module.exports = routes;
