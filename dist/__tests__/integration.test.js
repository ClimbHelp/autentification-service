"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
// Mock passport pour éviter les erreurs de configuration
jest.mock('passport', () => ({
    initialize: jest.fn(() => (req, res, next) => next()),
    session: jest.fn(() => (req, res, next) => next()),
    authenticate: jest.fn(() => (req, res, next) => {
        res.status(302).redirect('/auth/callback');
    })
}));
// Mock des contrôleurs pour simplifier les tests
jest.mock('../src/controllers/auth.controller', () => ({
    authCallback: jest.fn((req, res) => {
        res.status(302).redirect('/auth-callback');
    }),
    logout: jest.fn((req, res) => {
        res.status(302).redirect('/');
    })
}));
jest.mock('../src/controllers/user.controller', () => ({
    getProfile: jest.fn((req, res) => {
        if (req.isAuthenticated && req.isAuthenticated()) {
            res.json(req.user);
        }
        else {
            res.status(302).redirect('/');
        }
    })
}));
// Import des routes après les mocks
const index_1 = __importDefault(require("../src/routes/index"));
describe('Integration Tests', () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        // Configuration de base pour les tests
        app.use((0, express_session_1.default)({
            secret: 'test-secret',
            resave: false,
            saveUninitialized: true
        }));
        // Utilisation des routes
        app.use(index_1.default);
    });
    describe('Health Endpoint', () => {
        it('should return health status', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/health')
                .expect(200);
            expect(response.body).toEqual({
                status: 'OK',
                service: 'autentication-service'
            });
        }));
    });
    describe('Auth Routes', () => {
        it('should have auth route configured', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/auth')
                .expect(302); // Redirect to Google OAuth
            expect(response.status).toBe(302);
        }));
        it('should have logout route configured', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/logout')
                .expect(302); // Redirect to home
            expect(response.status).toBe(302);
        }));
    });
    describe('Profile Route', () => {
        it('should redirect to home when not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/profile')
                .expect(302);
            expect(response.status).toBe(302);
        }));
    });
    describe('404 Handling', () => {
        it('should handle unknown routes', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/unknown-route')
                .expect(404);
            expect(response.status).toBe(404);
        }));
    });
});
