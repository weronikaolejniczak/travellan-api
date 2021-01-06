let { requestListener } = require('./callback.js');

const express = require('express');
const constants = require('./config/constants');
const apiEndpoints = require('./endpoints');

const app = express();
apiEndpoints(app);

const PORT = constants.PORT;

app.listen(PORT, (err) => {
    if (err) {
        console.log('Error!');
        throw err;
    } else {
        console.log(`Server is running at http://localhost:${PORT}/`);
    }
});
