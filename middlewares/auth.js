const { User, Product } = require('../models');
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

  authorization_product:  (req, res, next) => {
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
  }
}