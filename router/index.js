const router = require('express').Router();
const UserRoute = require('./UserRoutes');
const ProductRoute = require('./ProductRoute');
const CategoryRoute = require('./CategoryRoutes');
const CartRoute = require('./CartRoutes');

router.use('/user', UserRoute);
router.use('/category', CategoryRoute);
router.use('/product', ProductRoute);
router.use('/cart', CartRoute);

module.exports = router;