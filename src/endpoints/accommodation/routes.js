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
    })
        .then((response) => {
            if (response.data.length === 0) throw new Error(`Error: the response is empty`);

            const data = response.data[0];
            const amenities = data.hotel.amenities.map((item) => item.toLowerCase().split('_').join(' '));
            const image = data.hotel.media[0].uri;

            const hotel = new Hotel(
                amenities,
                undefined,
                undefined,
                undefined,
                undefined,
                data.hotel.contact.phone,
                checkIfCreditCardPaymentIsPossible(data),
                data.hotel.description.text,
                undefined,
                formatLocationData(data.hotel),
                image,
                capitalizeEachWord(data.hotel.name),
                undefined
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
 * GET /v1/accommodation/recommendation?adults=2&cityCode=PAR&checkInDate=2021-03-05&checkOutDate=2021-03-08&radius=10&roomQuantity=1
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
        radiusUnit: 'KM',
        roomQuantity
    })
    .then((response) => {
        if (response.data.length === 0) throw new Error(`Error: the response is empty`);

        const data = response.data[0];
        const amenities = data.hotel.amenities.map((item) => item.toLowerCase().split('_').join(' '));
        const image = data.hotel.media[0].uri;

        const hotel = new Hotel(
            amenities,
            undefined,
            undefined,
            undefined,
            undefined,
            data.hotel.contact.phone,
            checkIfCreditCardPaymentIsPossible(data),
            data.hotel.description.text,
            undefined,
            formatLocationData(data.hotel),
            image,
            capitalizeEachWord(data.hotel.name),
            getHotelOffer(data.offers)
        );

        res.json(hotel);
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
