const { Cart, Item, Product, sequelize } = require('../models');
const { Op } = require('sequelize');
class Controller {
  static async create (req, res, next) {
    
    try {
      const { ProductId, quantity } = req.body;
      
      const product = await Product.findOne({
        where: {
          id: ProductId
        }
      });
      
      const cart = await Cart.findOne({
        where: {
          UserId: req.decoded.id,
          status: false,
        }
      });
  
      if (cart) {
        if (product) {
          const item = await Item.create({
            ProductId: ProductId,
            quantity: quantity,
            price: product.price,
            CartId: cart.id,
          });
          res.status(201).json(item);
        } else {
          next({
            status: 404,
            message: 'Product not found',
            name: 'Not Found',
          });
        }
      } else {

        if (product) {
          const result = await sequelize.transaction(async (t) => {
            const carts = await Cart.create({
              UserId: req.decoded.id,
              status: false,
            }, { transaction: t } );

            const item = await Item.create({
              ProductId: +ProductId,
              quantity: +quantity,
              price: product.price,
              CartId: carts.id,
            },{ transaction: t } );
            return item;
          })
          res.status(201).json(result);
        } else {
          next({
            status: 404,
            message: 'Product not found',
            name: 'Not Found',
          });
        }
      }

    } catch (err) {
      next(err);
    }
  }

  static async findOne (req, res, next) {
    try {
      const cart = await Cart.findOne({
        where: {
          id: req.params.id,
        },
        include: [{
          model: Item,
          order: ['id', 'ASC'],
          include: Product,
        }],
      });
  
      res.status(200).json(cart);

    } catch (err) {
      next(err);
    }


  }

  static async findByUserId (req, res, next) {
    try {
      const UserId = req.decoded.id;
      const charts = await Cart.findAll({
        where: {
          UserId: UserId,
          status: false,
        },
        include: [{
          model: Item,
          order: ['id', 'ASC'],
          include: Product,
        }]
      });
      res.status(200).json(charts);
    } catch (err) {
      next(err);
    }
  }

  static async removeItem (req, res, next) {
    try {
      const result = await Item.destroy({
        where: {
          id: req.params.item_id,
        }
      });

      if (result === 1) {
        res.status(200).json({
          message: 'Delete item success'
        })
      } else {
        next({
          status: 404,
          name: 'Not Found',
          message: 'Item not found',
        })
      }

    } catch(err) {
      next(err);
    }
  }

  static async checkout (req, res, next) {
    try {
      const CartId = req.params.id;
      const ProductIds = [];
      
      const carts = await Cart.findOne({
        where: {
          id: CartId,
        },
        include: [{
          model: Item,
          include: Product,
        }],
      });
      
      carts.Items.forEach((el) => {
        ProductIds.push(el.ProductId);
      })

      const items = await Item.findAll({
        where: {
          ProductId: {
            [Op.in]: ProductIds,
          },
        },
        include: {
          model: Product,
        }
      });

      const notEnoughStocks = [];

      items.forEach((el) => {
        if (el.quantity > el.Product.stock) {
          notEnoughStocks.push(el.Products);
        }
      });

      if (notEnoughStocks.length) {
        next({
          status: 400,
          name: 'Bad Request',
          message: 'Stock is not enough',
        });
      } else {
        const result = await sequelize.transaction(async (t) => {
          await Cart.update({
            status: true,
          }, {
            where: {
              id: CartId,
            },
            returning: true,
            transaction: t,
          });

          const promises = [];
          carts.Items.forEach((el) => {
           const promise = Product.findOne({
             where: {
               id: el.ProductId,
             },
             transaction: t,
           })
            .then(result => {
              Product.update({
                stock: result.stock - Number(el.quantity),
              }, {
                where: {
                  id: result.id,
                },
                transaction: t,
              })
              .catch(err => {
                next(err);
              })
            })
            promises.push(promise)
          });
          return Promise.all(promises);
        })
        res.status(200).json({
          message: 'Checkout Success'
        });
      }

    } catch(err) {
      next(err);
    }
  }

  static async orderHistory (req, res, next) {
    try {
      const UserId = req.decoded.id;
      const charts = await Cart.findAll({
        where: {
          UserId: UserId,
          status: true,
        },
        include: [{
          model: Item,
          order: ['id', 'ASC'],
          include: Product,
        }]
      });
      res.status(200).json(charts);
    } catch (err) {
      next(err);
    }
  }


}
module.exports = Controller;