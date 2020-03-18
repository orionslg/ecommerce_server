const router = require('express').Router();
const ProductController = require('../controllers/ProductController');
const { authentication, authorization_product } = require('../middlewares/auth');

router.get('/', ProductController.findAll);

router.use(authentication)
router.post('/', authorization_product, ProductController.create);

module.exports = router;