// backend/__tests__/app.test.js
const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../models'); // Import sequelize from models

describe('Test the root endpoint', () => {
  it('should respond with status 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

afterAll(async () => {
    // Ensure Sequelize connection is closed after all tests
    await sequelize.close();
  });
});

