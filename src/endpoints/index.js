const accommodationRoutes = require('./accommodation/routes');
const weatherRoutes = require('./weather/routes');

module.exports = (app) => {
    app.use('/v1/accommodation', accommodationRoutes);
    app.use('/v1/weather', weatherRoutes);
}
