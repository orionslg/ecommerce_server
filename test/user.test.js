const request = require('supertest');
const app = require('../app');
const {User, sequelize} = require('../models');
const {queryInterface} = sequelize;
const { hashPassword } = require('../helpers/bcrypt');
afterEach((done) => {
  queryInterface.bulkDelete('Users', {})
    .then(response => {
      done()
    }).catch(err => done(err))
})

describe('User routes', () => {
  describe('POST /user/register', () => {
    describe('Success process', () => {
      test('Should send an object (id, email, roles', (done) => {
        request(app)
          .post('/user/register')
          .send({
            email: 'admin@gmail.com',
            password: 'abcdefg',
            role: 'admin',
          })
          .end((err, res) => {
            expect(err).toBe(null);
            expect(res.body).toHaveProperty('email', 'admin@gmail.com');
            expect(res.body).toHaveProperty('role', 'admin');
            expect(res.body).toHaveProperty('id', expect.any(Number));
            expect(res.status).toBe(201);
            done();
          })
      })
    })
    describe('Failed processes', () => {
      test('Should return not empty validation error', (done) => {
        request(app)
          .post('/user/register')
          .send({
            email: '',
            password: '',
            role: '',
          })
          .end((err, res) => {
            expect(err).toBe(null);
            expect(res.body).toHaveProperty('message', 'Bad Request');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Email is required');
            expect(res.body.errors).toContain('Password is required');
            expect(res.body.errors).toContain('Role is required');
            expect(res.status).toBe(400);
            done();
          });
      });
      test('Should return email format validation error', (done) => {
        request(app)
          .post('/user/register')
          .send({
            email: 'admin@gmail',
            password: 'abcdefg',
            role: 'admin',
          })
          .end((err, res) => {
            expect(err).toBe(null);
            expect(res.body).toHaveProperty('message', 'Bad Request');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Email format is wrong');
            expect(res.status).toBe(400);
            done();
          });
      });
      test('Should return password length validation error', (done) => {
        request(app)
          .post('/user/register')
          .send({
            email: 'admin@gmail.com',
            password: '12345',
            role: 'admin',
          })
          .end((err, res) => {
            expect(err).toBe(null);
            expect(res.body).toHaveProperty('message', 'Bad Request');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Minimum password length is 6');
            expect(res.status).toBe(400);
            done();
          });
      });
      test('Should return invalid role validation error', (done) => {
        request(app)
          .post('/user/register')
          .send({
            email: 'admin@gmail.com',
            password: '123456',
            role: 'customer',
          })
          .end((err, res) => {
            expect(err).toBe(null);
            expect(res.body).toHaveProperty('message', 'Bad Request');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Role can only be admin or client');
            expect(res.status).toBe(400);
            done();
          });
      });
      test('Should return unique email validation error', async (done) => {
        try {
          await User.create({
            email: 'user@gmail.com',
            password: 'abcdefg',
            role: 'client'
          });
        } catch (err) {
          done(err);
        }
        request(app)
          .post('/user/register')
          .send({
            email: 'user@gmail.com',
            password: 'abcdefg',
            role: 'client',
          })
          .end((err, res) => {
            expect(err).toBe(null);
            expect(res.body).toHaveProperty('message', 'Bad Request');
            expect(res.body).toHaveProperty('errors', expect.any(Array));
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.errors).toContain('Email has already been taken');
            expect(res.status).toBe(400);
            done();
          });
      });
    });
  });

  describe('POST /user/login', () => {
    describe('Success process', () => {
      test('Should return email and access token', () => {
        return User.create({
          email: 'client@gmail.com',
          password: '123456',
          role: 'client',
        })
        .then(result => {
          return request(app)
          .post('/user/login')
          .send({
            email: 'client@gmail.com',
            password: '123456',
          })
          .then(res => {
            expect(res.body).toHaveProperty('email', 'client@gmail.com');
            expect(res.body).toHaveProperty('access_token', expect.any(String));
            expect(res.status).toBe(200);
          })
          .catch(err => {
            expect(err).toBe(null);
          })
        })
      });
    })

    describe('Failed proccess', () => {
      test('Should return wrong email response', async () => {
        try {
          await User.create({
            email: 'client@gmail.com',
            password: 'abcdefg',
            role: 'client'
          });

          const res = await request(app)
          .post('/user/login')
          .send({
            email: 'client2@gmail.com',
            password: 'abcdefg'
          })
          expect(res.body).toHaveProperty('errors', expect.any(Array));
          expect(res.body.errors.length).toBeGreaterThan(0);
          expect(res.body.errors).toContain('Email or password is wrong');
          expect(res.body).toHaveProperty('message', 'Unauthorized');
          expect(res.status).toBe(401);
        } catch (err) {
          expect(err).toBe(null)
        }
      });
      test('Should return wrong password response', async () => {
        try {
          await User.create({
            email: 'client2@gmail.com',
            password: 'abcdefg',
            role: 'client'
          });

          const res = await request(app)
          .post('/user/login')
          .send({
            email: 'client2@gmail.com',
            password: 'abcdefghij'
          })
          expect(res.body).toHaveProperty('errors', expect.any(Array));
          expect(res.body.errors.length).toBeGreaterThan(0);
          expect(res.body.errors).toContain('Email or password is wrong');
          expect(res.body).toHaveProperty('message', 'Unauthorized');
          expect(res.status).toBe(401);
        } catch (err) {
          expect(err).toBe(null)
        }
      });
      test('Should return wrong password response', async () => {
        try {
          const res = await request(app)
          .post('/user/login')
          .send({
            email: '',
            password: ''
          })
          expect(res.body).toHaveProperty('errors', expect.any(Array));
          expect(res.body.errors.length).toBeGreaterThan(0);
          expect(res.body.errors).toContain('Email and password should be filled');
          expect(res.body).toHaveProperty('message', 'Bad Request');
          expect(res.status).toBe(400);
        } catch (err) {
          expect(err).toBe(null)
        }
      });
    })

    // describe('Failed processes', () => {
    //   test('Should return not empty validation error', (done) => {
    //     request(app)
    //       .post('/user/register')
    //       .send({
    //         email: '',
    //         password: '',
    //         role: '',
    //       })
    //       .end((err, res) => {
    //         expect(err).toBe(null);
    //         expect(res.body).toHaveProperty('message', 'Bad Request');
    //         expect(res.body).toHaveProperty('errors', expect.any(Array));
    //         expect(res.body.errors.length).toBeGreaterThan(0);
    //         expect(res.body.errors).toContain('Email is required');
    //         expect(res.body.errors).toContain('Password is required');
    //         expect(res.body.errors).toContain('Role is required');
    //         expect(res.status).toBe(400);
    //         done();
    //       });
    //   });
    //   test('Should return email format validation error', (done) => {
    //     request(app)
    //       .post('/user/register')
    //       .send({
    //         email: 'admin@gmail',
    //         password: 'abcdefg',
    //         role: 'admin',
    //       })
    //       .end((err, res) => {
    //         expect(err).toBe(null);
    //         expect(res.body).toHaveProperty('message', 'Bad Request');
    //         expect(res.body).toHaveProperty('errors', expect.any(Array));
    //         expect(res.body.errors.length).toBeGreaterThan(0);
    //         expect(res.body.errors).toContain('Email format is wrong');
    //         expect(res.status).toBe(400);
    //         done();
    //       });
    //   });
    //   test('Should return password length validation error', (done) => {
    //     request(app)
    //       .post('/user/register')
    //       .send({
    //         email: 'admin@gmail.com',
    //         password: '12345',
    //         role: 'admin',
    //       })
    //       .end((err, res) => {
    //         expect(err).toBe(null);
    //         expect(res.body).toHaveProperty('message', 'Bad Request');
    //         expect(res.body).toHaveProperty('errors', expect.any(Array));
    //         expect(res.body.errors.length).toBeGreaterThan(0);
    //         expect(res.body.errors).toContain('Minimum password length is 6');
    //         expect(res.status).toBe(400);
    //         done();
    //       });
    //   });
    //   test('Should return invalid role validation error', (done) => {
    //     request(app)
    //       .post('/user/register')
    //       .send({
    //         email: 'admin@gmail.com',
    //         password: '123456',
    //         role: 'customer',
    //       })
    //       .end((err, res) => {
    //         expect(err).toBe(null);
    //         expect(res.body).toHaveProperty('message', 'Bad Request');
    //         expect(res.body).toHaveProperty('errors', expect.any(Array));
    //         expect(res.body.errors.length).toBeGreaterThan(0);
    //         expect(res.body.errors).toContain('Role can only be admin or client');
    //         expect(res.status).toBe(400);
    //         done();
    //       });
    //   });
    //   test('Should return unique email validation error', async (done) => {
    //     try {
    //       await User.create({
    //         email: 'user@gmail.com',
    //         password: 'abcdefg',
    //         role: 'client'
    //       });
    //     } catch (err) {
    //       done(err);
    //     }
    //     request(app)
    //       .post('/user/register')
    //       .send({
    //         email: 'user@gmail.com',
    //         password: 'abcdefg',
    //         role: 'client',
    //       })
    //       .end((err, res) => {
    //         expect(err).toBe(null);
    //         expect(res.body).toHaveProperty('message', 'Bad Request');
    //         expect(res.body).toHaveProperty('errors', expect.any(Array));
    //         expect(res.body.errors.length).toBeGreaterThan(0);
    //         expect(res.body.errors).toContain('Email has already been taken');
    //         expect(res.status).toBe(400);
    //         done();
    //       });
    //   });
    // });
  });
});