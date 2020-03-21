const request = require('supertest');
const app = require('../app');
const {User, Product, Category, sequelize} = require('../models');
const {queryInterface} = sequelize;
const { generateToken } = require('../helpers/jwtoken');

let token_admin;
let token_client;

beforeAll(async (done) => {
  try {
    const admin = await User.create({
      email: 'admin@gmail.com',
      password: '123456',
      role: 'admin',
    });
    
    token_admin = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const client = await User.create({
      email: 'client@gmail.com',
      password: '123456',
      role: 'client',
    });

    token_client = generateToken({
      id: client.id,
      email: client.email,
      role: client.role,
    });

    done();
  } catch (err) {
    done(err);
  }
})

afterAll((done) => {
  queryInterface.bulkDelete('Products', {})
    .then(_ => {
      return queryInterface.bulkDelete('Users', {})
        .then(_=> {
          done()
        })
    })
    .catch(err => done(err))
})

describe('Product endpoint test', () => {
  describe('POST /product', () => {
    
    describe('Success processes', () => {
      test('Should return product object with status 201', async () => {
        try {
          const category = await Category.create({
            name: 'New Category 2',
          });

          const res = await request(app)
            .post('/product')
            .set('access_token', token_admin)
            .send({
              name: 'You-C 1000',
              image_url: 'http://imgurl.com/abcdefg',
              price: 7500,
              stock: 100,
              description: 'Liquid vitamin C for your daily wellbeing',
              CategoryId: category.id,
            });
            expect(res.body).toHaveProperty('id', expect.any(Number));
            expect(res.body).toHaveProperty('name', 'You-C 1000');
            expect(res.body).toHaveProperty('image_url', 'http://imgurl.com/abcdefg');
            expect(res.body).toHaveProperty('price', 7500);
            expect(res.body).toHaveProperty('stock', 100);
            expect(res.body).toHaveProperty('CategoryId', category.id);
            expect(res.body).toHaveProperty('description', 'Liquid vitamin C for your daily wellbeing');
            expect(res.status).toBe(201);

        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Create new product with empty image_url, should return product object with status 201 with default image link', async () => {
        try {
          const category = await Category.create({
            name: 'New Category',
          });

          const res = await request(app)
            .post('/product')
            .set('access_token', token_admin)
            .send({
              name: 'You-C 1000',
              image_url: '',
              price: 7500,
              stock: 100,
              description: 'Liquid vitamin C for your daily wellbeing',
              CategoryId: category.id,
            });
            expect(res.body).toHaveProperty('id', expect.any(Number));
            expect(res.body).toHaveProperty('name', 'You-C 1000');
            expect(res.body).toHaveProperty('image_url', 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081');
            expect(res.body).toHaveProperty('price', 7500);
            expect(res.body).toHaveProperty('stock', 100);
            expect(res.body).toHaveProperty('CategoryId', category.id);
            expect(res.body).toHaveProperty('description', 'Liquid vitamin C for your daily wellbeing');
            expect(res.status).toBe(201);

        } catch (err) {
          expect(err).toBe(null);
        }
      })
    });

    describe('Failed processes', () => {
      test('Should return authenticaiton error', async () => {
        try {
          const res = await request(app)
            .post('/product')
            .send({
              name: 'You-C 1000',
              image_url: 'http://imgurl.com/abcdefg',
              price: 7500,
              stock: 100,
              description: 'Liquid vitamin C for your daily wellbeing',
              CategoryId: 1,
            })

            expect(res.body).toHaveProperty('message', 'Unauthorized');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Please login first');
            expect(res.status).toBe(401);

        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Should return authorization error', async () => {
        try {
          const res = await request(app)
            .post('/product')
            .set('access_token', token_client)
            .send({
              name: 'You-C 1000',
              image_url: 'http://imgurl.com/abcdefg',
              price: 7500,
              stock: 100,
              description: 'Liquid vitamin C for your daily wellbeing',
              CategoryId: 1,
            })

            expect(res.body).toHaveProperty('message', 'Unauthorized');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Admin access required');
            expect(res.status).toBe(401);

        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Should return empty value validation error', async () => {
        try {
          const category = await Category.create({
            name: 'Category 3',
          });
          const res = await request(app)
            .post('/product')
            .set('access_token', token_admin)
            .send({
              name: '',
              image_url: '',
              price: null,
              stock: null,
              description: '',
              CategoryId: category.id,
            })
            expect(res.body).toHaveProperty('message', 'Bad Request');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Product name is required');
            expect(res.body.errors).toContain('Description is required');
            expect(res.body.errors).toContain('Price is required');
            expect(res.body.errors).toContain('Stock is required');
            expect(res.status).toBe(400);

        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Should return minimum stock value error', async () => {
        try {
          const res = await request(app)
            .post('/product')
            .set('access_token', token_admin)
            .send({
              name: 'You-C 1000',
              image_url: 'http://imgurl.com/abcdefg',
              price: 7500,
              stock: -1,
              description: 'Liquid vitamin C for your daily wellbeing',
              CategoryId: 1,
            })

            expect(res.body).toHaveProperty('message', 'Bad Request');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Stock cannot be negative');
            expect(res.status).toBe(400);

        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Should return minimum price value error', async () => {
        try {
          const res = await request(app)
            .post('/product')
            .set('access_token', token_admin)
            .send({
              name: 'You-C 1000',
              image_url: 'http://imgurl.com/abcdefg',
              price: -1000,
              stock: 20,
              description: 'Liquid vitamin C for your daily wellbeing',
              CategoryId: 1,
            })

            expect(res.body).toHaveProperty('message', 'Bad Request');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Price should be greater than or equal to 0');
            expect(res.status).toBe(400);

        } catch (err) {
          expect(err).toBe(null);
        }
      });

    })
  });

  describe('GET /product', () => {
    describe('Success responses', () => {
      test('Return an array of object of products', async () => {
        try {
          
          const category = await Category.create({
            name: 'Drink'
          });

          await Product.create({
            name: 'You-C 1000',
            image_url: 'http://imgurl.com/abcdefg',
            price: 7500,
            stock: 100,
            description: 'Liquid vitamin C for your daily wellbeing',
            CategoryId: category.id,
          });

          const res = await request(app)
            .get('/product')
            .set('access_token', token_admin)
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[res.body.length - 1]).toHaveProperty('id', expect.any(Number));
            expect(res.body[res.body.length - 1]).toHaveProperty('name', 'You-C 1000');
            expect(res.body[res.body.length - 1]).toHaveProperty('image_url', 'http://imgurl.com/abcdefg');
            expect(res.body[res.body.length - 1]).toHaveProperty('price', 7500);
            expect(res.body[res.body.length - 1]).toHaveProperty('stock', 100);
            expect(res.body[res.body.length - 1]).toHaveProperty('description', 'Liquid vitamin C for your daily wellbeing');
            expect(res.body[res.body.length - 1]).toHaveProperty('CategoryId', category.id);
            expect(typeof res.body[res.body.length - 1].Category).toBe('object');
            expect(res.body[res.body.length - 1].Category).toHaveProperty('name', 'Drink');
            expect(res.status).toBe(200);
        } catch (err) {
          expect(err).toBe(null);
        }
      })
    });
  });

  describe('DELETE /product/:id', () => {
    describe('Success response', () => {
      test('Return success deleting message', async () => {
        try {
          const product = await Product.create({
            name: 'You-C 1000',
            image_url: 'http://imgurl.com/abcdefg',
            price: 7500,
            stock: 100,
            description: 'Liquid vitamin C for your daily wellbeing',
            CategoryId: 1,
          });
  
          const res = await request(app)
            .delete(`/product/${product.id}`)
            .set('access_token', token_admin)
  
            expect(res.body).toHaveProperty('message', `Success deleting product ${product.id}`);
            expect(res.status).toBe(200);
        } catch (err) {
          expect(err).toBe(null);
        }
      });
    });

    describe('Failed responses', () => {
      test('Return product not found message', async () => {
        try {
          const products = await Product.findAll();

          const res = await request(app)
            .delete(`/product/${products.length+1}`)
            .set('access_token', token_admin)

            expect(res.body).toHaveProperty('message', 'Not found');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors).toContain('Product not found');
            expect(res.status).toBe(404);
        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Return not authenticated message', async () => {
        try {
          const res = await request(app)
            .delete(`/product/1`)

            expect(res.body).toHaveProperty('message', 'Unauthorized');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors).toContain('Please login first');
            expect(res.status).toBe(401);
        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Return not authorized message', async () => {
        try {
          const res = await request(app)
            .delete(`/product/1`)
            .set('access_token', token_client);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors).toContain('Admin access required');
            expect(res.status).toBe(401);
        } catch (err) {
          expect(err).toBe(null);
        }
      });
    })
  });

  describe('GET /product/:id', () => {
    describe('Success response', () => {
      test('Return an object with product data', async () => {
        try {
          const category = await Product.create({
            name: 'Drink',
          });

          const product = await Product.create({
            name: 'You-C 1000',
            image_url: 'http://imgurl.com/abcdefg',
            price: 7500,
            stock: 100,
            description: 'Liquid vitamin C for your daily wellbeing',
            CategoryId: category.id,
          });
  
          const res = await request(app)
            .get(`/product/${product.id}`)
            .set('access_token', token_admin)

            expect(res.body).toHaveProperty('id', expect.any(Number));
            expect(res.body).toHaveProperty('name', 'You-C 1000');
            expect(res.body).toHaveProperty('image_url', 'http://imgurl.com/abcdefg');
            expect(res.body).toHaveProperty('price', 7500);
            expect(res.body).toHaveProperty('stock', 100);
            expect(res.body).toHaveProperty('description', 'Liquid vitamin C for your daily wellbeing');
            expect(res.body).toHaveProperty('CategoryId', category.id);
            expect(typeof res.body.Category).toBe('object');
            expect(res.body.Category).toHaveProperty('name', 'Drink');
            expect(res.status).toBe(200);
        } catch (err) {
          expect(err).toBe(null);
        }
      });
    });

    describe('Failed responses', () => {
      test('Return product not found message', async () => {
        try {
          const products = await Product.findAll();

          const res = await request(app)
            .get(`/product/${products.length+10}`)
            .set('access_token', token_admin)

            expect(res.body).toHaveProperty('message', 'Not found');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors).toContain('Product not found');
            expect(res.status).toBe(404);
        } catch (err) {
          expect(err).toBe(null);
        }
      });

    })
  })

  describe('PUT /product/:id', () => {
    describe('Success response', () => {
      test('Return success updating product message', async () => {
        try {
          const product = await Product.create({
            name: 'You-C 1000',
            image_url: 'http://imgurl.com/abcdefg',
            price: 7500,
            stock: 100,
            description: 'Liquid vitamin C for your daily wellbeing',
            CategoryId: 1,
          });
  
          const res = await request(app)
            .put(`/product/${product.id}`)
            .set('access_token', token_admin)
            .send({
              name: 'You-C 2000',
              image_url: 'http://google.com/image.png',
              price: 8000,
              stock: 300,
              description: 'Vitamin C untuk diminum setiap hari',
              CategoryId: 1,
            })
            expect(res.body).toHaveProperty('name', 'You-C 2000');
            expect(res.body).toHaveProperty('image_url', 'http://google.com/image.png');
            expect(res.body).toHaveProperty('price', 8000);
            expect(res.body).toHaveProperty('stock', 300);
            expect(res.body).toHaveProperty('CategoryId', 1);
            expect(res.body).toHaveProperty('description', 'Vitamin C untuk diminum setiap hari');
            expect(res.status).toBe(200);
        } catch (err) {
          expect(err).toBe(null);
        }
      });

    describe('Failed responses', () => {
      test('Return authorization failed message', async () => {
        try {
          const product = await Product.create({
            name: 'You-C 1000',
            image_url: 'http://imgurl.com/abcdefg',
            price: 7500,
            stock: 100,
            description: 'Liquid vitamin C for your daily wellbeing',
            CategoryId: 1,
          });
  
          const res = await request(app)
            .put(`/product/${product.id}`)
            .set('access_token', token_client)
            .send({
              name: 'You-C 2000',
              image_url: 'http://google.com/image.png',
              price: 8000,
              stock: 300,
              description: 'Vitamin C untuk diminum setiap hari',
              CategoryId: 1,
            })
            expect(res.body).toHaveProperty('message', 'Unauthorized');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors).toContain('Admin access required');
            expect(res.status).toBe(401);
        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Return authentication failed message', async () => {
        try {
          const product = await Product.create({
            name: 'You-C 1000',
            image_url: 'http://imgurl.com/abcdefg',
            price: 7500,
            stock: 100,
            description: 'Liquid vitamin C for your daily wellbeing',
            CategoryId: 1,
          });
  
          const res = await request(app)
            .put(`/product/${product.id}`)
            .send({
              name: 'You-C 2000',
              image_url: 'http://google.com/image.png',
              price: 8000,
              stock: 300,
              description: 'Vitamin C untuk diminum setiap hari',
              CategoryId: 1,
            })
            expect(res.body).toHaveProperty('message', 'Unauthorized');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors).toContain('Please login first');
            expect(res.status).toBe(401);
        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Return product not found message', async () => {
        try {
          const product = await Product.create({
            name: 'You-C 1000',
            image_url: 'http://imgurl.com/abcdefg',
            price: 7500,
            stock: 100,
            description: 'Liquid vitamin C for your daily wellbeing',
            CategoryId: 1,
          });
  
          const res = await request(app)
            .put(`/product/${product.id + 1}`)
            .set('access_token', token_admin)
            .send({
              name: 'You-C 2000',
              image_url: 'http://google.com/image.png',
              price: 8000,
              stock: 300,
              description: 'Vitamin C untuk diminum setiap hari',
              CategoryId: 1,
            })
            expect(res.body).toHaveProperty('message', 'Not found');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors).toContain('Product not found');
            expect(res.status).toBe(404);
        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Return empty value error message', async () => {
        try {
          const product = await Product.create({
            name: 'You-C 1000',
            image_url: 'http://imgurl.com/abcdefg',
            price: 7500,
            stock: 100,
            description: 'Liquid vitamin C for your daily wellbeing',
            CategoryId: 1,
          });
  
          const res = await request(app)
            .put(`/product/${product.id}`)
            .set('access_token', token_admin)
            .send({
              name: '',
              image_url: '',
              price:'',
              stock: '',
              description: '',
              CategoryId: '',
            })
            expect(res.body).toHaveProperty('message', 'Bad Request');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Product name is required');
            expect(res.body.errors).toContain('Description is required');
            expect(res.body.errors).toContain('Price is required');
            expect(res.body.errors).toContain('Stock is required');
            expect(res.body.errors).toContain('CategoryId is required');
            expect(res.status).toBe(400);
        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Return minimum value error message', async () => {
        try {
          const product = await Product.create({
            name: 'You-C 1000',
            image_url: 'http://imgurl.com/abcdefg',
            price: 7500,
            stock: 100,
            description: 'Liquid vitamin C for your daily wellbeing',
            CategoryId: 1,
          });
  
          const res = await request(app)
            .put(`/product/${product.id}`)
            .set('access_token', token_admin)
            .send({
              name: 'You-C 1000',
              image_url: 'http://imgurl.com/abcdefg',
              price: -5,
              stock: -2,
              description: 'Liquid vitamin C for your daily wellbeing',
              CategoryId: 1,
            })
            expect(res.body).toHaveProperty('message', 'Bad Request');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Stock cannot be negative');
            expect(res.body.errors).toContain('Price should be greater than or equal to 0');
            expect(res.status).toBe(400);
        } catch (err) {
          expect(err).toBe(null);
        }
      });

    })
    })
  });
});
