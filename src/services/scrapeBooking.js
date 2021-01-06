const scrapeBooking: (url) => {
    return request({
        method: 'GET',
        uri: url,
        json: true
    })
        .then(function(html) {
            /* extract an image */
            let images = [];
            const imageRegex = new RegExp('/images/hotel/', 'i');
            cheerio("img", html).map(function() { images.push(cheerio(this).attr('src')) });
            let selectedImage = images.filter((image) => image && image.match(imageRegex))[0];
            /* extract stars rating */
            /* console.log('stars: ');
            cheerio('#wrap-hotelpage-top > div.hp__hotel-title', html).find('span').map(function() { console.log(cheerio(this).attr('aria-label')) }); */
            /* extract languages spoken */
            /* cheerio('#hp_facilities_box > div.facilitiesChecklist > div > ul > li', html).map(function() { console.log(cheerio(this).text()) }); */
            /* extract cards allowed */
            let creditCards = [];
            cheerio('.payment_methods_overall', html).find('img').map(function() { creditCards.push(cheerio(this).attr('alt'))});
            /* create a hotel instance */
            let hotel = {
                type: cheerio("#hp_hotel_name", html).text()
                    .split("\n")[1],
                name: cheerio("#hp_hotel_name", html).text()
                    .split("\n")[2],
                address: cheerio("#showMap2 > span.hp_address_subtitle.js-hp_address_subtitle.jq_tooltip", html).text()
                    .replace(/\nul. /g, '')
                    .replace(/\n/g, '')
                    .trim(),
                description: cheerio("#property_description_content", html).text()
                    .replace('\n', '')
                    .replace(/\n/g, ' ')
                    .trim(),
                bookingRating: cheerio("#js--hp-gallery-scorecard > a > div > div.bui-review-score__badge", html).text()
                    .trim(),
                //stars
                imgUrl: selectedImage,
                facilities: cheerio("#hotel_main_content > div.hp_hotel_description_hightlights_wrapper > div.hotel_description_wrapper_exp.hp-description > div.hp_desc_important_facilities.clearfix.hp_desc_important_facilities--bui > div", html).text()
                    .split("\n")
                    .filter((item) => item !== ""),
                breakfastInfo: cheerio("span.ph-item-copy-breakfast-option", html).text()
                    .split(', '),
                parking: cheerio("#hp_facilities_box > div.facilitiesChecklist > div.facilitiesChecklistSection[data-section-id=16] > ul > li.policy", html).text()
                    .replace(/\n\n/g, ''),
                wifi: cheerio("#hp_facilities_box > div.facilitiesChecklist > div.facilitiesChecklistSection[data-section-id=11] > ul > li.policy", html).text()
                    .replace(/\n\n/g, '')
                    .replace(/\n/g, ' '),
                //languagesSpoken
                frontDesk24H: cheerio("#hp_facilities_box > div.facilitiesChecklist > div.facilitiesChecklistSection[data-section-id=3] > ul > li", html).text().match(/24/) ? true : false,
                checkIn: cheerio("#checkin_policy > p:nth-child(2) > span", html).text()
                    .replace(/\n/g, ' ')
                    .trim(),
                checkInExtra: cheerio("#checkin_policy > p.hp-checkin-extra", html).text()
                    .replace(/\n/g, ' ')
                    .trim(),
                checkOut: cheerio("#checkout_policy > p:nth-child(2) > span", html).text()
                    .replace(/\n/g, ' ')
                    .trim(),
                childPolicies: cheerio("#smp_children_policy > div > div > div.c-child-policies__general > p", html).text()
                    .trim(),
                cribAndExtraBedPolicies: cheerio("#smp_children_policy > div > div > div.c-child-policies__supplements", html).text()
                    .replace(/\n/g, ' ')
                    .trim(),
                pets: cheerio("#hp_facilities_box > div.facilitiesChecklist > div.facilitiesChecklistSection[data-section-id=-2] > ul > li.policy", html).text()
                    .replace(/\n\n/g, ''),
                cardsAllowed: creditCards,
                publicTransportOptions: cheerio("#public_transport_options > ul > li", html).text() ? cheerio("#public_transport_options > ul > li", html).text().split('\n\n\n') : undefined,
            }

            if (hotel) {
                return hotel;
            } else {
                return -1;
            }
        })
        .catch(function(err) {
            console.log(err);
            return -1;
        });
}

module.exports = scrapeBooking;
