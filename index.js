const http = require('http');
let { requestListener } = require('./src/callback.js');

const PORT = process.env.PORT || 4001;

const server = http.createServer(requestListener);
server.listen(PORT);
