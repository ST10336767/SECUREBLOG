const request = require('supertest');
const app = require('../app');  // ✅ use the Express app, not the server

describe('Health Check Endpoint', () => {
  it('should return a 200 status and "ok" message', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
