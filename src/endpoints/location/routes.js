const express = require('express');
const url = require('url');

const fetchCoordinates = require('../../services/fetchCoordinates');

const Router = express.Router;
const routes = new Router();

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
