const express = require('express');
const url = require('url');
const Amadeus = require('amadeus');

const Hotel = require('../../models/Hotel');
const scrapeBooking = require('../../services/scrapeBooking');
const checkIfCreditCardPaymentIsPossible = require('../../helpers/checkIfCreditCardPaymentIsPossible');
const formatLocationData = require('../../helpers/formatLocationData');
const capitalizeEachWord = require('../../helpers/capitalizeEachWord');
const getHotelOffer = require('../../helpers/getHotelOffer');

const Router = express.Router;
const routes = new Router();
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET
});

/** 
 * GET /v1/accommodation/hotelByName?latitude={latitude}&longitude={longitude}&radius={radius}&hotelName={hotelName}
 * e.g.
 * GET /v1/accommodation/hotelByName?latitude=53.4285&longitude=14.5528&radius=5&hotelName=CAMPANILE
 * */

const getHotelByName = (req, res) => {
    const query = url.parse(req.url, true).query;
    const { latitude, longitude, hotelName, radius } = query;

    amadeus.shopping.hotelOffers.get({
        latitude,
        longitude,
        hotelName,
        radius,
        radiusUnit: 'KM',
        includeClosed: true
    })
        .then((response) => {
            if (response.data.length === 0) throw new Error(`Error: the response is empty`);

            const data = response.data[0];
            const offers = data.offers && data.offers[0];
            const amenities = data.hotel.amenities.map((item) => item.toLowerCase().split('_').join(' '));
            // const image = data.hotel.media[0].uri;
            const image = 'https://images.unsplash.com/photo-1445991842772-097fea258e7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

            // $todo: check possiblity of credit card payment
            const hotel = new Hotel(
                amenities,
                undefined,
                undefined,
                undefined,
                undefined,
                true, // offers ? checkIfCreditCardPaymentIsPossible(offers) : true,
                data.hotel.description.text,
                undefined,
                undefined,
                image,
                formatLocationData(data.hotel),
                capitalizeEachWord(data.hotel.name),
                undefined,
                data.hotel.contact.phone,
                undefined,
            );

            res.json(hotel);
        })
        .catch((err) => {
            throw new Error(`Error ${err.code}: ${err.message}`);
        });
}

routes.get('/hotelByName', getHotelByName);

/** 
 * GET /v1/accommodation/recommendation?latitude={latitude}&longitude={longitude}&radius={radius}&checkInDate={checkInDate}&checkOutDate={checkOutDate}&roomQuantity={roomQuantity}&adults={adults}
 * e.g.
 * GET /v1/accommodation/recommendation?latitude=53.4285&longitude=14.5528&radius=30&checkInDate=2021-03-15&checkOutDate=2021-03-18&roomQuantity=1&adults=1
 * */

const getHotelRecommendation = (req, res) => {
    const query = url.parse(req.url, true).query;
    const { latitude, longitude, radius, checkInDate, checkOutDate, roomQuantity, adults } = query;

    amadeus.shopping.hotelOffers.get({
        latitude,
        longitude,
        radius,
        radiusUnit: 'KM',
        checkInDate,
        checkOutDate,
        roomQuantity,
        adults,
        page: 7,
    })
    .then((response) => {
        if (response.data.length === 0) res.json([]);

        const list = [];
        const data = response.data;

        for (let i = 0; i < data.length; i++) {
            const item = response.data[i];
            const amenities = item.hotel.amenities.map((item) => item.toLowerCase().split('_').join(' '));
            // const image = item.hotel.media[0].uri;
            const image = 'https://images.unsplash.com/photo-1445991842772-097fea258e7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
    
            // $todo: check possiblity of credit card payment
            const hotel = new Hotel(
                amenities,
                undefined,
                undefined,
                undefined,
                undefined,
                true, // checkIfCreditCardPaymentIsPossible(item.offers[0]),
                item.hotel.description.text,
                item.hotel.dupeId,
                undefined,
                image,
                formatLocationData(item.hotel),
                capitalizeEachWord(item.hotel.name),
                getHotelOffer(item.offers),
                item.hotel.contact.phone,
                item.hotel.rating,
            );

            list.push(hotel);
        }

        res.json(list);
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
