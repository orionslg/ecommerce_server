const router = require('express').Router();
const UserRoute = require('./UserRoutes');
const ProductRoute = require('./ProductRoute');

router.use('/user', UserRoute);

router.use('/product', ProductRoute);

module.exports = router;