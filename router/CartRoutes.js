const router = require('express').Router();
const CartController = require('../controllers/CartController');
const { authentication, cart_authorization } = require('../middlewares/auth');

// router.get('/', CartController.findAll);
// router.get('/:id', CartController.findOne);

router.use(authentication)

router.post('/', CartController.create);
router.get('/', CartController.findByUserId);

router.get('/:id', cart_authorization, CartController.findOne);
router.delete('/:id/:item_id', cart_authorization, CartController.removeItem);
module.exports = router;