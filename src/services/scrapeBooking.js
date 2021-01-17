const cheerio = require('cheerio');
const request = require('request-promise');

const Hotel = require('../models/Hotel');
const fetchCoordinates = require('./fetchCoordinates');

const isCreditCardPaymentPossible = (html) => {
    const creditCards = [];

    cheerio('.payment_methods_overall', html).find('img').map(function() {
        creditCards.push(cheerio(this).attr('alt'))
    });

    return creditCards.length > 0;
}

const parseImages = (html) => {
    const images = [];
    const imageRegex = new RegExp('/images/hotel/', 'i');

    cheerio("img", html).map(function() { 
        images.push(cheerio(this).attr('src'))
    });

    return images.filter((image) => image && image.match(imageRegex))[0];
}

const parseBreakfast = (html) => {
    const breakfast = [];
    
    const parsedBreakfast = cheerio("span.ph-item-copy-breakfast-option", html).text()
        .split(', ');
        
    parsedBreakfast.forEach(item => item && breakfast.push(item));

    return breakfast.length > 0 ? breakfast : undefined;
}

const scrapeBooking = (url) => {
    return request({
        method: 'GET',
        uri: encodeURI(url),
        json: true
    })
        .then(async (html) => {
            const address = cheerio("#showMap2 > span.hp_address_subtitle.js-hp_address_subtitle.jq_tooltip", html).text()
                .replace(/\nul. /g, '')
                .replace(/\n/g, '')
                .trim();
            const amenities = cheerio("#hotel_main_content > div.hp_hotel_description_hightlights_wrapper > div.hotel_description_wrapper_exp.hp-description > div.hp_desc_important_facilities.clearfix.hp_desc_important_facilities--bui > div", html).text()
                .split("\n")
                .filter((item) => item !== "")
                .map((item) => item.toLowerCase());
            const breakfast = parseBreakfast(html);
            const checkInHours = cheerio("#checkin_policy > p:nth-child(2) > span", html).text()
                .replace(/\n/g, ' ')
                .trim();
            const checkInExtra = cheerio("#checkin_policy > p.hp-checkin-extra", html).text()
                .replace(/\n/g, ' ')
                .trim();
            const checkOutHours = cheerio("#checkout_policy > p:nth-child(2) > span", html).text()
                .replace(/\n/g, ' ')
                .trim();
            const creditCardPaymentPossible = isCreditCardPaymentPossible(html);
            const description = cheerio("#property_description_content", html).text()
                .replace('\n', '')
                .replace(/\n/g, ' ')
                .trim();
            const frontDesk24H = cheerio("#hp_facilities_box > div.facilitiesChecklist > div.facilitiesChecklistSection[data-section-id=3] > ul > li", html).text().match(/24/)
                ? true
                : false;
            const image = parseImages(html);
            const name = cheerio("#hp_hotel_name", html).text()
                .split("\n")[2];

            const location = await fetchCoordinates(address);
            
            const hotel = new Hotel(
                amenities,
                breakfast,
                checkInExtra,
                checkInHours,
                checkOutHours,
                creditCardPaymentPossible,
                description,
                undefined,
                frontDesk24H,
                image,
                {
                    address,
                    latitude: location.lat,
                    longitude: location.lon
                },
                name,
                undefined,
                undefined,
                undefined
            );

            if (hotel) {
                return hotel;
            } else {
                return -1;
            }
        })
        .catch((err) => {
            throw err;
        });
}

module.exports = scrapeBooking;
