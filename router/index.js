const router = require('express').Router();
const UserRoute = require('./UserRoutes');
const ProductRoute = require('./ProductRoute');
const CategoryRoute = require('./CategoryRoutes');

router.use('/user', UserRoute);
router.use('/category', CategoryRoute);
router.use('/product', ProductRoute);

module.exports = router;