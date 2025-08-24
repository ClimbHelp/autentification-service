"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./config/passport");
const env_1 = require("./config/env");
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
// Configuration CORS manuelle
const allowedOrigins = [
    // Développement local
    'http://localhost:3000', // Frontend
    'http://localhost:3001', // Service d'authentification (lui-même)
    'http://localhost:3002', // Service AI
    'http://localhost:3003', // Service BDD
    'http://localhost:3004', // Service AI
    'http://localhost:3005', // Service de paiement
    'http://localhost:3006', // Service de notifications
    'http://localhost:3010', // Service de monitoring
    // Staging Vercel
    'https://front-env-staging-climb-help.vercel.app', // Frontend staging
    'https://autentication-service-git-develop-climb-help.vercel.app', // Auth staging
    'https://ai-service-git-develop-climb-help.vercel.app', // AI staging
    'https://payment-service-git-develop-climb-help.vercel.app', // Payment staging
    'https://notifications-service-git-develop-climb-help.vercel.app', // Notifications staging
    'https://monitoring-service-git-develop-climb-help.vercel.app', // Monitoring staging
    // Production Vercel
    'https://front-climb-help.vercel.app', // Frontend production
    'https://climb-help.vercel.app', // Frontend production alternative
    'https://autentication-service-climb-help.vercel.app', // Auth production
    'https://ai-service-climb-help.vercel.app', // AI production
    'https://payment-service-climb-help.vercel.app', // Payment production
    'https://notifications-service-climb-help.vercel.app', // Notifications production
    'https://monitoring-service-climb-help.vercel.app', // Monitoring production
];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
// Pour obtenir la vraie IP derrière un proxy (x-forwarded-for)
app.set('trust proxy', true);
// Middleware de session
app.use((0, express_session_1.default)({ secret: "secret", resave: false, saveUninitialized: true }));
// Initialisation de Passport
(0, passport_2.configurePassport)();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Utilisation des routes
app.use(index_1.default);
app.listen(env_1.PORT, () => console.log(`Server running on http://localhost:${env_1.PORT}`));
