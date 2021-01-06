const express = require('express');
const cheerio = require('cheerio');
const request = require('request-promise');
const url = require('url');

const scrapeBooking = require('../../services/scrapeBooking');

const Router = express.Router;
const routes = new Router();

const getHotel = (req, res) => {    
    const query = url.parse(req.url, true).query;
    const region = query.region;
    const name = query.name;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    scrapeBooking(`https://www.booking.com/hotel/${region}/${name}.html`)
        .then(function (result) { 
            if (result === -1) console.log('Something went wrong...');
            else res.json(result);
    });
};

// GET /v1/accommodation?region={region}&name={name}
    // e.g.
    // GET /v1/accommodation?region=ch&name=longemalle
routes.get('/', getHotel);

module.exports = routes;
