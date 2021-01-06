let { requestListener } = require('./callback.js');

const express = require('express');
const constants = require('./config/constants');

const app = express();
const PORT = constants.PORT;

app.listen(PORT, requestListener);
