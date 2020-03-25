const { User, Product, Cart } = require('../models');
const { verivyToken, generateToken } = require('../helpers/jwtoken');

module.exports = {
  authentication : async (req, res, next) => {
    try {
      const token = req.headers.access_token;
      if (token) {
        const decoded = verivyToken(token);

        const user = await User.findOne({
          where: { id: decoded.id },
        });

        if (user) {
          req.decoded = decoded;
          next();
        } else {
          next({
            status: 401,
            name: 'Unauthorized',
            message: 'Please register first',
          });
        }

      } else {
        next({
          status: 401,
          name: 'Unauthorized',
          message: 'Please login first',
        })
      }

    } catch (err) {
      next(err);
    }
  },

  admin_authorization:  (req, res, next) => {
    const role = req.decoded.role;
    if (role === 'admin') {
      next();
    } else {
      next({
        status: 401,
        name: 'Unauthorized',
        message: 'Admin access required',
      })
    }
  },

  cart_authorization: async (req, res, next) => {
    try {
      const UserId = req.decoded.id;

      const cart = await Cart.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (cart) {
        if (cart.UserId === UserId) {
          next();
        } else {
          next({
            status: 401,
            message: 'You are not authorized to access this cart',
            name: 'Unauthorized',
          });
        }
      } else {
        next({
          status: 404,
          message: 'Cart not found',
          name: 'Not Found',
        })
      }
    } catch(err) {
      next(err);
    }

  }
}