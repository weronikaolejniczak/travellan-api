const accommodationRoutes = require('./accommodation/routes');

module.exports = (app) => {
    app.use('/v1/accommodation', accommodationRoutes);
}
