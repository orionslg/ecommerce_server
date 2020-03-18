'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;

  class Product extends Model {}

  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Product name is required',
        },
        notEmpty: {
          args: true,
          msg: 'Product name is required',
        },
      }
    },
    image_url: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Price is required',
        },
        min: {
          args: 1,
          msg: 'Price should be greater than or equal to 1',
        },
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Stock is required',
        },
        min: {
          args: 1,
          msg: 'Stock cannot be negative',
        },
      },
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    hooks: {

    }
  })
 
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};