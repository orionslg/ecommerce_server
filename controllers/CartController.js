const { Cart, Item, Product, sequelize } = require('../models');

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
        console.log('Masuk di ada cart');
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
            console.log('Not here yet');
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

      res.status(201).json(charts);
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
        next({
          status: 200,
          message: 'Delete Success',
        });
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

    } catch(err) {

    }
  }

  // static async updateItem (req, res, next) {
  //   try {
  //     const CartId = req.params.id;
  //     const { ProductId, quantity } = req.body;

  //     const item = await Item.findOne({
  //       where: {
  //         CartId,
  //         ProductId,
  //       }
  //     });

  //     if (item) {
  //       const updated = await Item.update({

  //       })
  //     }
  //   } catch(err) {
  //     next(err);
  //   }

    
  // }
}
module.exports = Controller;