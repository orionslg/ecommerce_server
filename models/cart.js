'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;

  class Cart extends Model {}

  Cart.init({
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Status is required',
        },
        notEmpty: {
          args: true,
          msg: 'Status is required',
        },
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'UserId is required',
        },
        notEmpty: {
          args: true,
          msg: 'UserId is required',
        },
      },
    }
  }, {
    sequelize,
  })

  Cart.associate = function(models) {
    // associations can be defined here
    Cart.belongsTo(models.User);
    Cart.hasMany(models.Item);
  };
  return Cart;
};