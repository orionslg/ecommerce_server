const { Product, User } = require('../models');

class Controller {
  static async create (req, res, next) {
    try {
      const { name, image_url, price, stock, description, CategoryId } = req.body;
      const newProduct = await Product.create({
          name,
          image_url,
          price,
          stock,
          description,
          CategoryId
        });
      
      const payload = {
        name: newProduct.name,
        image_url: newProduct.image_url,
        price: newProduct.price,
        stock: newProduct.stock,
        description: newProduct.description,
        CategoryId: newProduct.CategoryId,
      };

      res.status(201).json(payload);

    } catch (err) {
      next(err);
    }
  }

  static async findAll(req, res, next) {
    try {
      const products = await Product.findAll({
        include: ['Category']
      });
      res.status(200).json(products);
    } catch(err) {
      next(err);
    }
  }

  static async findOne(req, res, next) {
    try {
      const product = await Product.findOne({
        where: {
          id: req.params.id,
        },
        include: ['Category']
      });

      if(product) {
        res.status(200).json(product);
      } else {
        next({
          status: 404,
          message: 'Product not found',
          name: 'Not found'
        });
      }
    } catch(err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { name, image_url, price, stock, description, CategoryId } = req.body;
      const product = await Product.update({
        name,
        image_url,
        price,
        stock,
        description,
        CategoryId
      }, {
        where: {
          id: req.params.id,
        },
        returning: true,
      });

      const productData = product[1][0]

      if(product[0] === 1) {
        res.status(200).json(productData);
      } else {
        next({
          status: 404,
          message: 'Product not found',
          name: 'Not found',
        });
      }
    } catch (err) {
      next(err);
    }
    
  }

  static async remove(req, res, next) {
    try {
      const product = await Product.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (product) {
        await Product.destroy({
          where: {
            id: req.params.id,
          },
        });
        
        res.status(200).json({
          message: `Success deleting product ${req.params.id}`,
        });
      } else {
        next({
          status: 404,
          name: 'Not found',
          message: 'Product not found',
        });
      }
    } catch (err) {
      next(err);
    }

  }
}

module.exports = Controller;
