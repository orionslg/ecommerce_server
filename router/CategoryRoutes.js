const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController');
const { authentication, authorization_product } = require('../middlewares/auth');

router.get('/', CategoryController.findAll);
router.get('/:id', CategoryController.findOne);

router.use(authentication)
router.post('/', authorization_product, CategoryController.create);
router.delete('/:id', authorization_product, CategoryController.remove);
router.put('/:id', authorization_product, CategoryController.update);

module.exports = router;