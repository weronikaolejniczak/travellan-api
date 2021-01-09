const express = require('express');
const url = require('url');

const fetchWeather = require('../../services/fetchWeather');

const Router = express.Router;
const routes = new Router();
/** 
 * GET /v1/weather?latitude={latitude}&longitude={longitude}
 * e.g.
 * GET /v1/weather?latitude=52.4064&longitude=16.9252
 * */

const getWeather = (req, res) => {    
    const query = url.parse(req.url, true).query;
    const { latitude, longitude } = query;

    fetchWeather(latitude, longitude)
        .then((result) => { 
            console.log(result);
            if (result === -1) throw new Error('Something went wrong...');
            else res.json(result);
    });
};

routes.get('/', getWeather);

module.exports = routes;
