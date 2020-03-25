const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController');
const { authentication, admin_authorization } = require('../middlewares/auth');

router.get('/', CategoryController.findAll);
router.get('/:id', CategoryController.findOne);

router.use(authentication)
router.post('/', admin_authorization, CategoryController.create);
router.delete('/:id', admin_authorization, CategoryController.remove);
router.put('/:id', admin_authorization, CategoryController.update);

module.exports = router;