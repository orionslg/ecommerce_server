const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');
const router = require('./router');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);
app.use(errorHandler);
module.exports = app;