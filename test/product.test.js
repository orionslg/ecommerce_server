const request = require('supertest');
const app = require('../app');
const {User, Product, sequelize} = require('../models');
const {queryInterface} = sequelize;