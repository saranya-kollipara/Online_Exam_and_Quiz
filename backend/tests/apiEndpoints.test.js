import request from 'supertest';
import app from '../src/app.js';

describe('Quentrix AI Core API Endpoints', () => {
  test('GET /api/health should return 200 with service metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.database).toBe('MySQL via Prisma ORM');
  });

  test('GET /api/invalid-route should return 404 with standard error response', async () => {
    const res = await request(app).get('/api/invalid-route-does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login with missing payload should return 400 validation error', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

