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
          const res = await request(app)
            .post('/product')
            .set('access_token', token_admin)
            .send({
              name: 'You-C 1000',
              image_url: 'http://imgurl.com/abcdefg',
              price: 7500,
              stock: 100,
              description: 'Liquid vitamin C for your daily wellbeing',
              CategoryId: 1,
            });
            expect(res.body).toHaveProperty('name', 'You-C 1000');
            expect(res.body).toHaveProperty('image_url', 'http://imgurl.com/abcdefg');
            expect(res.body).toHaveProperty('price', 7500);
            expect(res.body).toHaveProperty('stock', 100);
            expect(res.body).toHaveProperty('CategoryId', 1);
            expect(res.body).toHaveProperty('description', 'Liquid vitamin C for your daily wellbeing');
            expect(res.status).toBe(201);

        } catch (err) {
          expect(err).toBe(null);
        }
      });

      test('Create new product with empty image_url, should return product object with status 201 with default image link', async () => {
        try {
          const res = await request(app)
            .post('/product')
            .set('access_token', token_admin)
            .send({
              name: 'You-C 1000',
              image_url: '',
              price: 7500,
              stock: 100,
              description: 'Liquid vitamin C for your daily wellbeing',
              CategoryId: 1,
            });
            expect(res.body).toHaveProperty('name', 'You-C 1000');
            expect(res.body).toHaveProperty('image_url', 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081');
            expect(res.body).toHaveProperty('price', 7500);
            expect(res.body).toHaveProperty('stock', 100);
            expect(res.body).toHaveProperty('CategoryId', 1);
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
          const res = await request(app)
            .post('/product')
            .set('access_token', token_admin)
            .send({
              name: '',
              image_url: '',
              price: null,
              stock: null,
              description: '',
              CategoryId: null,
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
          await Product.create({
            name: 'You-C 1000',
            image_url: 'http://imgurl.com/abcdefg',
            price: 7500,
            stock: 100,
            description: 'Liquid vitamin C for your daily wellbeing',
            CategoryId: 1,
          });

          await Category.create({
            name: 'Drink'
          });

          const res = await request(app)
            .get('/product')
            .set('access_token', token_admin)
            expect(Array.isArray(res.body)).toBe(true);
            console.log(res.body);
            // expect(res.body[res.body.length - 1]).toHaveProperty('name', 'You-C 1000')
        } catch (err) {
          expect(err).toBe(null);
        }
      })
    })
  })
})