const url = require('url');
const {scrape} = require('./scraper.js');

// localhost:4001?region={region}&name={name}
// e.g.
// localhost:4001?region=ch&name=longemalle
module.exports = {
  requestListener: (req, res) => {
    const query = url.parse(req.url, true).query;
    const region = query.region;
    const name = query.name;
    res.writeHead(200, {'Content-Type': 'application/json'});
    // scrape website at url, extract information about accommodation
    scrape(`https://www.booking.com/hotel/${region}/${name}.html`).then(function (result) { 
      if (result === -1) console.log('Something went wrong...');
      else {
        res.write(JSON.stringify(result));
        res.end();
      }
    });
  }
};
