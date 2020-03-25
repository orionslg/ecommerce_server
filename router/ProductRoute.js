const router = require('express').Router();
const ProductController = require('../controllers/ProductController');
const { authentication, admin_authorization } = require('../middlewares/auth');

router.get('/', ProductController.findAll);
router.get('/:id', ProductController.findOne);

router.use(authentication)
router.post('/', admin_authorization, ProductController.create);
router.delete('/:id', admin_authorization, ProductController.remove);
router.put('/:id', admin_authorization, ProductController.update);

module.exports = router;