if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
};

const app = require('../app');
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
})