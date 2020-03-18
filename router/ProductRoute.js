const router = require('express').Router();
const ProductController = require('../controllers/ProductController');
const { authentication, authorization_product } = require('../middlewares/auth');

router.get('/', ProductController.findAll);
router.get('/:id', ProductController.findOne);

router.use(authentication)
router.post('/', authorization_product, ProductController.create);
router.delete('/:id', authorization_product, ProductController.remove);
router.put('/:id', authorization_product, ProductController.update);

module.exports = router;