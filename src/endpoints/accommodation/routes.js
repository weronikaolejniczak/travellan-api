const express = require('express');
const url = require('url');
const Amadeus = require('amadeus');

const Hotel = require('../../models/Hotel');
const scrapeBooking = require('../../services/scrapeBooking');
const countryCodes = require('../../data/countryCodes.json');

const Router = express.Router;
const routes = new Router();
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET
});

/** 
 * GET /v1/accommodation/hotelByName?cityCode={cityCode}&radius={radius}&hotelName={hotelName}
 * e.g.
 * GET /v1/accommodation/hotelByName?cityCode=POZ&radius=5&hotelName=CAMPANILE
 * */

const checkIfCreditCardPaymentIsPossible = (data) => !!(
    Array.isArray(data.offers) && data.offers.length > 0
        && data.offers[0].policies.guarantee
        && Array.isArray(data.offers[0].policies.guarantee.acceptedPayments)
        && data.offers[0].policies.guarantee.acceptedPayments.methods.includes('CREDIT_CARD')
);

const formatName = (name) => 
    name.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');

const formatLocationData = (hotelData) => {
    const latitude = hotelData.latitude;
    const longitude = hotelData.longitude;

    const addressLines = formatName(hotelData.address.lines.join(' '));
    const postalCode = hotelData.address.postalCode;
    const cityName = formatName(hotelData.address.cityName);
    const countryName = countryCodes[hotelData.address.countryCode];

    const address = `${addressLines}, ${postalCode} ${cityName}, ${countryName}`;

    return { address, latitude, longitude };
}

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
            if (response.data.length === 0) {
                throw new Error(`Error: the response is empty`);
            }

            const data = response.data[0];
            const amenities = data.hotel.amenities.map((item) => item.toLowerCase().split('_').join(' '));
            const phone = data.hotel.contact.phone;
            const creditCardPaymentPossible = checkIfCreditCardPaymentIsPossible(data);
            const description = data.hotel.description.text;
            const location = formatLocationData(data.hotel);
            const image = data.hotel.media[0].uri;
            const name = formatName(data.hotel.name);

            const hotel = new Hotel(
                amenities,
                undefined,
                undefined,
                undefined,
                undefined,
                phone,
                creditCardPaymentPossible,
                description,
                undefined,
                location,
                image,
                name
            );

            res.json(hotel);
        })
        .catch((err) => {
            throw new Error(`Error ${err.code}: ${err.message}`);
        });
}

routes.get('/hotelByName', getHotelByName);

/** 
 * GET /v1/accommodation/recommendation?adults={adults}&cityCode={cityCode}&checkInDate={checkInDate}&checkOutDate={checkOutDate}&radius={radius}
 * e.g.
 * GET /v1/accommodation/recommendation?adults=2&cityCode=PAR&checkInDate=2021-03-05&checkOutDate=2021-03-08&radius=10
 * */

const getHotelRecommendation = (req, res) => {
    const query = url.parse(req.url, true).query;
    const { adults, cityCode, checkInDate, checkOutDate, radius } = query;

    amadeus.shopping.hotelOffers.get({
        adults,
        cityCode,
        checkInDate,
        checkOutDate,
        radius,
        radiusUnit: 'KM',
    })
    .then((response) => res.json(response.data))
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
