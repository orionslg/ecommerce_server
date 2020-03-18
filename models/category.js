'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;

  class Category extends Model {}

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Category name is required',
        },
        notEmpty: {
          args: true,
          msg: 'Category name is required',
        },
      },
    },
  }, {
    sequelize
  })
  
  Category.associate = function(models) {
    // associations can be defined here
   Category.hasMany(models.Product, {
     foreignKey: 'id',
   });
  };
  return Category;
};