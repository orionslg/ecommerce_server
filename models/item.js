'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;

  class Item extends Model {}

  Item.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Quantity is required',
        },
        notEmpty: {
          args: true,
          msg: 'Quantity is required',
        },
        min: {
          args: [0],
          msg: 'Minimum quantity is 0',
        },
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Price is required',
        },
        notEmpty: {
          args: true,
          msg: 'Price is required',
        },
        min: {
          args: [0],
          msg: 'Minimum price is 0',
        },
      },
    },
    total: {
      type: DataTypes.FLOAT,
    },
    CartId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
  }, {
    sequelize,
    hooks: {
      beforeCreate(item, options) {
        item.total = item.price * item.quantity;
      },
      beforeUpdate(item, options) {
        item.total = item.price * item.quantity;
      }
    }
  })

  Item.associate = function(models) {
    // associations can be defined here
    Item.belongsTo(models.Cart);
    Item.belongsTo(models.Product);
  };
  return Item;
};