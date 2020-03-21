const { Category, Product } = require('../models');

class Controller {
  static async create (req, res, next) {
    try {
      const { name } = req.body;
  
      const newCategory = await Category.create({
          name,
        });
      res.status(201).json(newCategory);

    } catch (err) {
      next(err);
    }
  }

  static async findAll(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch(err) {
      next(err);
    }
  }

  static async findOne(req, res, next) {
    try {
      const category = await Category.findOne({
        where: {
          id: req.params.id,
        },
      });
      
      if(category) {
        res.status(200).json(category);
      } else {
        next({
          status: 404,
          message: 'Category not found',
          name: 'Not found'
        });
      }
    } catch(err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { name, } = req.body;
      const category = await Category.update({
        name,
      }, {
        where: {
          id: req.params.id,
        },
        returning: true,
      });

      const categoryData = category[1][0]

      if(category[0] === 1) {
        res.status(200).json(categoryData);
      } else {
        next({
          status: 404,
          message: 'Category not found',
          name: 'Not found',
        });
      }
    } catch (err) {
      next(err);
    }
    
  }

  static async remove(req, res, next) {
    try {
      await Product.destroy({
        where: {
          CategoryId: req.params.id,
        },
      })
      await Category.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({
        message: `Success deleting category ${req.params.id}`,
      })
    } catch (err) {
      next(err);
    }

  }
}

module.exports = Controller;