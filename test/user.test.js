const request = require('supertest');
const app = require('../app');
const {User, sequelize} = require('../models');
const {queryInterface} = sequelize;

describe('User routes', () => {
  describe('POST /user/register', () => {
    afterEach((done) => {
      queryInterface.bulkDelete('Users', {})
        .then(response => {
          done()
        }).catch(err => done(err))
    })
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
});