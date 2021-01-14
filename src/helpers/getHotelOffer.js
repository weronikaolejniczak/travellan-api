//offers: guests, price, currency, base, changes, startDate, endDate

const getHotelOffer = (offers) => {
    if (Array.isArray(offers) && offers.length > 0) {
        const guests = offers[0].guests;
        const price = offers[0].price;

        return { guests, price };
    } else {
        return {};
    }
}

module.exports = getHotelOffer;
