'use strict';
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;
  class User extends Model {}

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Email format is wrong'
        },
        notNull: {
          args: true,
          msg: 'Email is required',
        },
        notEmpty: {
          args: true,
          msg: 'Email is required',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Password is required',
        },
        notEmpty: {
          args: true,
          msg: 'Password is required',
        },
        len: {
          args: [6],
          msg: 'Minimum password length is 6',
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Role is required',
        },
        notEmpty: {
          args: true,
          msg: 'Role is required',
        },
        isIn: {
          args: [['admin', 'client']],
          msg: 'Role can only be admin or client',
        },
      },
    }
  }, {
    sequelize,
    hooks: {
      beforeCreate(user, option) {
        user.password = hashPassword(user.password);
      }
    }
  })
  
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};