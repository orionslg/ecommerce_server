const router = require('express').Router();
const UserRoute = require('./UserRoutes');

router.use('/user', UserRoute);

module.exports = router;