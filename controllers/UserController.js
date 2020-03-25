const { User, Product } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwtoken');

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

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) next({
        status: 400,
        message: 'Email and password should be filled',
        name: 'Bad Request',
      })
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (user) {
        const passwordCheck = comparePassword(password, user.password);
        if (passwordCheck) {
          const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
          };
          const token = generateToken(payload);
          res.status(200).json({
            email: user.email,
            access_token: token,
          });
        } else {
          next({
            status: 401,
            name: 'Unauthorized',
            message: 'Email or password is wrong',
          })
        }
      } else {
        next({
          status: 401,
          name: 'Unauthorized',
          message: 'Email or password is wrong',
        })
      }

    } catch (err) {
      next(err);
    }
  }

  // static async findAll(req, res, next) {
  //   const users = await User.findAll()
  // }
}

module.exports = Controller;