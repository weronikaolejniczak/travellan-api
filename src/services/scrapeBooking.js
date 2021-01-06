const cheerio = require('cheerio');
const request = require('request-promise');

const parsePublicTransport = (html) => {
    const publicTransportOptions = cheerio("#public_transport_options > ul > li", html).text();
    
    return publicTransportOptions ? publicTransportOptions.split('\n\n\n') : undefined;
}

const parseCreditCards = (html) => {
    const creditCards = [];

    cheerio('.payment_methods_overall', html).find('img').map(function() {
        creditCards.push(cheerio(this).attr('alt'))
    });

    return creditCards;
}

const parseImages = (html) => {
    const images = [];
    const imageRegex = new RegExp('/images/hotel/', 'i');

    cheerio("img", html).map(function() { 
        images.push(cheerio(this).attr('src'))
    });

    return images.filter((image) => image && image.match(imageRegex))[0];
}

const scrapeBooking = (url) => {
    return request({
        method: 'GET',
        uri: url,
        json: true
    })
        .then((html) => {
            const address = cheerio("#showMap2 > span.hp_address_subtitle.js-hp_address_subtitle.jq_tooltip", html).text()
                .replace(/\nul. /g, '')
                .replace(/\n/g, '')
                .trim();
            const ammenities = cheerio("#hotel_main_content > div.hp_hotel_description_hightlights_wrapper > div.hotel_description_wrapper_exp.hp-description > div.hp_desc_important_facilities.clearfix.hp_desc_important_facilities--bui > div", html).text()
                .split("\n")
                .filter((item) => item !== "");
            const breakfast = cheerio("span.ph-item-copy-breakfast-option", html).text()
                .split(', ');
            const checkIn = cheerio("#checkin_policy > p:nth-child(2) > span", html).text()
                .replace(/\n/g, ' ')
                .trim();
            const checkInExtra = cheerio("#checkin_policy > p.hp-checkin-extra", html).text()
                .replace(/\n/g, ' ')
                .trim();
            const checkOut = cheerio("#checkout_policy > p:nth-child(2) > span", html).text()
                .replace(/\n/g, ' ')
                .trim();
            const childPolicies = cheerio("#smp_children_policy > div > div > div.c-child-policies__general > p", html).text()
                .trim();
            const creditsAllowed = parseCreditCards(html);
            const cribAndExtraBedPolicies = cheerio("#smp_children_policy > div > div > div.c-child-policies__supplements", html).text()
                .replace(/\n/g, ' ')
                .trim();
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
            const parking = cheerio("#hp_facilities_box > div.facilitiesChecklist > div.facilitiesChecklistSection[data-section-id=16] > ul > li.policy", html).text()
                .replace(/\n\n/g, '');
            const pets = cheerio("#hp_facilities_box > div.facilitiesChecklist > div.facilitiesChecklistSection[data-section-id=-2] > ul > li.policy", html).text()
                .replace(/\n\n/g, '');
            const publicTransportOptions = parsePublicTransport(html);
            const rating = cheerio("#js--hp-gallery-scorecard > a > div > div.bui-review-score__badge", html).text()
                .trim();
            const type = cheerio("#hp_hotel_name", html).text()
                .split("\n")[1];
            const wifi = cheerio("#hp_facilities_box > div.facilitiesChecklist > div.facilitiesChecklistSection[data-section-id=11] > ul > li.policy", html).text()
                .replace(/\n\n/g, '')
                .replace(/\n/g, ' ');
            
            const hotel = {
                address,
                ammenities,
                breakfast,
                description,
                checkIn,
                checkInExtra,
                checkOut,
                childPolicies,
                creditsAllowed,
                cribAndExtraBedPolicies,
                frontDesk24H,
                image,
                name,
                parking,
                pets,
                publicTransportOptions,
                rating,
                type,
                wifi,
            }

            if (hotel) {
                return hotel;
            } else {
                return -1;
            }
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
}

module.exports = scrapeBooking;
