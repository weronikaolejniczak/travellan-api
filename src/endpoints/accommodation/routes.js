const express = require('express');
const url = require('url');

const scrapeBooking = require('../../services/scrapeBooking');

const Router = express.Router;
const routes = new Router();

const getBookingHotel = (req, res) => {    
    const query = url.parse(req.url, true).query;
    const region = query.region;
    const name = query.name;

    scrapeBooking(`https://www.booking.com/hotel/${region}/${name}.html`)
        .then(function (result) { 
            if (result === -1) console.log('Something went wrong...');
            else res.json(result);
    });
};

// GET /v1/accommodation/booking?region={region}&name={name}
    // e.g.
    // GET /v1/accommodation/booking?region=ch&name=longemalle
routes.get('/booking', getBookingHotel);

module.exports = routes;
