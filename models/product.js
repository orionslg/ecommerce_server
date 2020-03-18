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
        notEmpty: {
          args: true,
          msg: 'Price is required',
        },
        min: {
          args: '0',
          msg: 'Price should be greater than or equal to 0',
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
        notEmpty: {
          args: true,
          msg: 'Stock is required',
        },
        min: {
          args: '0',
          msg: 'Stock cannot be negative',
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Description is required',
        },
        notEmpty: {
          args: true,
          msg: 'Description is required',
        }
      }
    },
    CategoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: {
          args: true,
          msg: 'CategoryId is required',
        },
        notEmpty: {
          args: true,
          msg: 'CategoryId is required',
        },
      },
    },
  }, {
    sequelize,
    hooks: {
      beforeCreate(product) {
        if (!product.image_url) {
          product.image_url = 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081'
        } 
      }
    }
  })
 
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(models.Category, {
      foreignKey: 'CategoryId'
    });
  };
  return Product;
};