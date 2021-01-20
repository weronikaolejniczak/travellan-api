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
 * GET /v1/accommodation/hotelByName?cityCode={cityCode}&radius={radius}&hotelName={hotelName}
 * e.g.
 * GET /v1/accommodation/hotelByName?cityCode=PAR&radius=5&hotelName=CAMPANILE
 * */

const getHotelByName = (req, res) => {
    const query = url.parse(req.url, true).query;
    const { cityCode, hotelName, radius } = query;

    amadeus.shopping.hotelOffers.get({
        cityCode,
        hotelName,
        radius,
        radiusUnit: 'KM',
        includeClosed: true
    })
        .then((response) => {
            if (response.data.length === 0) throw new Error(`Error: the response is empty`);

            console.log(response.data[0]);

            const data = response.data[0];
            const offers = data.offers && data.offers[0];
            const amenities = data.hotel.amenities.map((item) => item.toLowerCase().split('_').join(' '));
            const image = data.hotel.media[0].uri;

            // $todo: check possiblity of credit card payment
            const hotel = new Hotel(
                amenities,
                undefined,
                undefined,
                undefined,
                undefined,
                offers ? checkIfCreditCardPaymentIsPossible(offers) : true,
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
 * GET /v1/accommodation/recommendation?adults={adults}&cityCode={cityCode}&checkInDate={checkInDate}&checkOutDate={checkOutDate}&radius={radius}&roomQuantity={roomQuantity}
 * e.g.
 * GET /v1/accommodation/recommendation?adults=1&cityCode=LCY&checkInDate=2021-02-05&checkOutDate=2021-02-08&radius=25&roomQuantity=1
 * */

const getHotelRecommendation = (req, res) => {
    const query = url.parse(req.url, true).query;
    const { adults, cityCode, checkInDate, checkOutDate, radius, roomQuantity } = query;

    amadeus.shopping.hotelOffers.get({
        adults,
        cityCode,
        checkInDate,
        checkOutDate,
        radius,
        page: 5,
        radiusUnit: 'KM',
        roomQuantity
    })
    .then((response) => {
        if (response.data.length === 0) res.json([]);

        const list = [];
        const data = response.data;

        for (let i = 0; i < data.length; i++) {
            const item = response.data[i];
            const amenities = item.hotel.amenities.map((item) => item.toLowerCase().split('_').join(' '));
            const image = item.hotel.media[0].uri;
    
            // $todo: check possiblity of credit card payment
            const hotel = new Hotel(
                amenities,
                undefined,
                undefined,
                undefined,
                undefined,
                checkIfCreditCardPaymentIsPossible(item.offers[0]),
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
