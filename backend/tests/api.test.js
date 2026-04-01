const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  it('GET /api/health — should return 200 with success message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('FinMetrics API is running');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('404 Handler', () => {
  it('GET /api/nonexistent — should return 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('not found');
  });
});

describe('Authentication — POST /api/auth/login', () => {
  it('should reject login with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('should reject login with invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'Password@123' });
    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('should reject login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@email.com', password: 'WrongPass@123' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should login with valid admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@finmetrics.com', password: 'Admin@2025!' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('admin@finmetrics.com');
    expect(res.body.data.role).toBe('ADMIN');
    expect(res.body.data.password).toBeUndefined();
  });

  it('should not expose password in response', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@finmetrics.com', password: 'Admin@2025!' });
    expect(res.body.data.password).toBeUndefined();
    expect(res.body.data.hasOwnProperty('password')).toBe(false);
  });
});

describe('RBAC — Protected Routes (Unauthenticated)', () => {
  it('GET /api/users — should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/dashboard/summary — should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/transactions — should reject unauthenticated request', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({ amount: 100, type: 'INCOME', category: 'Test', date: '2025-01-01' });
    expect(res.statusCode).toBe(401);
  });
});

describe('RBAC — Role-based Access Enforcement', () => {
  let viewerCookie;
  let analystCookie;
  let adminCookie;

  beforeAll(async () => {
    const viewerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'viewer@finmetrics.com', password: 'Viewer@2025!' });
    viewerCookie = viewerRes.headers['set-cookie'];

    const analystRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'analyst@finmetrics.com', password: 'Analyst@2025!' });
    analystCookie = analystRes.headers['set-cookie'];

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@finmetrics.com', password: 'Admin@2025!' });
    adminCookie = adminRes.headers['set-cookie'];
  });

  // Dashboard — Viewer access
  it('Viewer CAN access dashboard summary', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary')
      .set('Cookie', viewerCookie);
    expect(res.statusCode).toBe(200);
  });

  it('Viewer CANNOT access category-totals (Analyst+ only)', async () => {
    const res = await request(app)
      .get('/api/dashboard/category-totals')
      .set('Cookie', viewerCookie);
    expect(res.statusCode).toBe(403);
  });

  it('Viewer CANNOT access trends (Analyst+ only)', async () => {
    const res = await request(app)
      .get('/api/dashboard/trends')
      .set('Cookie', viewerCookie);
    expect(res.statusCode).toBe(403);
  });

  // Dashboard — Analyst access
  it('Analyst CAN access category-totals', async () => {
    const res = await request(app)
      .get('/api/dashboard/category-totals')
      .set('Cookie', analystCookie);
    expect(res.statusCode).toBe(200);
  });

  it('Analyst CAN access trends', async () => {
    const res = await request(app)
      .get('/api/dashboard/trends')
      .set('Cookie', analystCookie);
    expect(res.statusCode).toBe(200);
  });

  // Transactions — write access
  it('Viewer CANNOT create transactions', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', viewerCookie)
      .send({ amount: 100, type: 'INCOME', category: 'Test', date: '2025-01-01' });
    expect(res.statusCode).toBe(403);
  });

  it('Analyst CANNOT create transactions', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', analystCookie)
      .send({ amount: 100, type: 'INCOME', category: 'Test', date: '2025-01-01' });
    expect(res.statusCode).toBe(403);
  });

  it('Admin CAN create transactions', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', adminCookie)
      .send({ amount: 500, type: 'INCOME', category: 'Salary', date: '2025-03-15' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.category).toBe('Salary');
  });

  // User Management
  it('Viewer CANNOT access user management', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Cookie', viewerCookie);
    expect(res.statusCode).toBe(403);
  });

  it('Analyst CANNOT access user management', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Cookie', analystCookie);
    expect(res.statusCode).toBe(403);
  });

  it('Admin CAN access user management', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Cookie', adminCookie);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Validation — Transaction Input', () => {
  let adminCookie;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@finmetrics.com', password: 'Admin@2025!' });
    adminCookie = res.headers['set-cookie'];
  });

  it('should reject negative amount', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', adminCookie)
      .send({ amount: -100, type: 'INCOME', category: 'Test', date: '2025-01-01' });
    expect(res.statusCode).toBe(422);
  });

  it('should reject invalid type', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', adminCookie)
      .send({ amount: 100, type: 'INVALID', category: 'Test', date: '2025-01-01' });
    expect(res.statusCode).toBe(422);
  });

  it('should reject amount exceeding Decimal(12,2) max', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', adminCookie)
      .send({ amount: 99999999999, type: 'INCOME', category: 'Test', date: '2025-01-01' });
    expect(res.statusCode).toBe(422);
  });

  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', adminCookie)
      .send({ amount: 100 });
    expect(res.statusCode).toBe(422);
  });

  it('should reject invalid date format', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', adminCookie)
      .send({ amount: 100, type: 'INCOME', category: 'Test', date: 'not-a-date' });
    expect(res.statusCode).toBe(422);
  });
});

describe('Dashboard APIs — Response Shape', () => {
  let adminCookie;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@finmetrics.com', password: 'Admin@2025!' });
    adminCookie = res.headers['set-cookie'];
  });

  it('GET /api/dashboard/summary — returns income, expenses, balance, count', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary')
      .set('Cookie', adminCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('totalIncome');
    expect(res.body.data).toHaveProperty('totalExpenses');
    expect(res.body.data).toHaveProperty('netBalance');
    expect(res.body.data).toHaveProperty('transactionCount');
    expect(typeof res.body.data.totalIncome).toBe('number');
  });

  it('GET /api/dashboard/recent — returns array of transactions', async () => {
    const res = await request(app)
      .get('/api/dashboard/recent')
      .set('Cookie', adminCookie);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/dashboard/category-totals — returns category breakdown', async () => {
    const res = await request(app)
      .get('/api/dashboard/category-totals')
      .set('Cookie', adminCookie);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/dashboard/trends — returns monthly trend data', async () => {
    const res = await request(app)
      .get('/api/dashboard/trends')
      .set('Cookie', adminCookie);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/transactions — returns paginated response with metadata', async () => {
    const res = await request(app)
      .get('/api/transactions?page=1&limit=5')
      .set('Cookie', adminCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.pagination).toHaveProperty('page');
    expect(res.body.pagination).toHaveProperty('limit');
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.pagination).toHaveProperty('totalPages');
    expect(res.body.pagination.limit).toBe(5);
  });
});
