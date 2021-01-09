const express = require('express');
const url = require('url');

const fetchUnsplashImage = require('../../services/fetchUnsplashImage');

const Router = express.Router;
const routes = new Router();

/** 
 * GET /v1/images/unsplash?keyword={keyword}
 * e.g.
 * GET /v1/images/unsplash?keyword=Barcelona
 * */

const getUnsplashImage = (req, res) => {    
    const query = url.parse(req.url, true).query;
    const { keyword } = query;

    fetchUnsplashImage(keyword)
        .then((result) => { 
            if (result === -1) throw new Error('Something went wrong...');
            else res.json(result);
    });
};

routes.get('/unsplash', getUnsplashImage);

module.exports = routes;
