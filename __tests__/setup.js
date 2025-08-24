"use strict";
// Configuration globale pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.PORT = '3003';
// Mock fetch global pour les tests
global.fetch = jest.fn();
// Mock console pour éviter le bruit dans les tests
global.console = Object.assign(Object.assign({}, console), { log: jest.fn(), error: jest.fn(), warn: jest.fn() });
