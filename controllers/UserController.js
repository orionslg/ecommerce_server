const { User } = require('../models');

class Controller {
  static async register(req, res, next) {
    try {
      const { email, password, role } = req.body;
      const user = await User.findOne({
        where: {
          email,
        }
      })

      if (user) {
        next({
          message: 'Email has already been taken',
          status: 400,
          name: 'Bad Request'
        })
      }
      const newUser = await User.create({
        email,
        password,
        role,
      });
  
      const payload = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };

      res.status(201).json(payload);

    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;