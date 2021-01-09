const accommodationRoutes = require('./accommodation/routes');
const weatherRoutes = require('./weather/routes');
const imagesRoutes = require('./images/routes');
const locationRoutes = require('./location/routes');

module.exports = (app) => {
    const version = process.env.API_VERSION;

    app.use(`/v${version}/accommodation`, accommodationRoutes);
    app.use(`/v${version}/weather`, weatherRoutes);
    app.use(`/v${version}/images`, imagesRoutes);
    app.use(`/v${version}/location`, locationRoutes);
}
