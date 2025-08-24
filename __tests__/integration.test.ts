import request from 'supertest';
import express from 'express';
import session from 'express-session';

// Mock passport pour éviter les erreurs de configuration
jest.mock('passport', () => ({
  initialize: jest.fn(() => (req: any, res: any, next: any) => next()),
  session: jest.fn(() => (req: any, res: any, next: any) => next()),
  authenticate: jest.fn(() => (req: any, res: any, next: any) => {
    res.status(302).redirect('/auth/callback');
  })
}));

// Mock des contrôleurs pour simplifier les tests
jest.mock('../src/controllers/auth.controller', () => ({
  authCallback: jest.fn((req: any, res: any) => {
    res.status(302).redirect('/auth-callback');
  }),
  logout: jest.fn((req: any, res: any) => {
    res.status(302).redirect('/');
  })
}));

jest.mock('../src/controllers/user.controller', () => ({
  getProfile: jest.fn((req: any, res: any) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(302).redirect('/');
    }
  })
}));

// Import des routes après les mocks
import routes from '../src/routes/index';

describe('Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    
    // Configuration de base pour les tests
    app.use(session({ 
      secret: 'test-secret', 
      resave: false, 
      saveUninitialized: true 
    }));
    
    // Utilisation des routes
    app.use(routes);
  });

  describe('Health Endpoint', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        service: 'autentication-service'
      });
    });
  });

  describe('Auth Routes', () => {
    it('should have auth route configured', async () => {
      const response = await request(app)
        .get('/auth')
        .expect(302); // Redirect to Google OAuth

      expect(response.status).toBe(302);
    });

    it('should have logout route configured', async () => {
      const response = await request(app)
        .get('/logout')
        .expect(302); // Redirect to home

      expect(response.status).toBe(302);
    });
  });

  describe('Profile Route', () => {
    it('should redirect to home when not authenticated', async () => {
      const response = await request(app)
        .get('/profile')
        .expect(302);

      expect(response.status).toBe(302);
    });
  });

  describe('404 Handling', () => {
    it('should handle unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.status).toBe(404);
    });
  });
});
