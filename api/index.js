const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");

// Configuration des variables d'environnement
dotenv.config();

const app = express();

// Configuration CORS manuelle
const allowedOrigins = [
  // Développement local
  'http://localhost:3000',  // Frontend
  'http://localhost:3001',  // Service d'authentification (lui-même)
  'http://localhost:3002',  // Service AI
  'http://localhost:3003',  // Service BDD
  'http://localhost:3004',  // Service AI
  'http://localhost:3005',  // Service de paiement
  'http://localhost:3006',  // Service de notifications
  'http://localhost:3010',  // Service de monitoring
  
  // Staging Vercel
  'https://front-env-staging-climb-help.vercel.app',  // Frontend staging
  'https://autentication-service-git-develop-climb-help.vercel.app',  // Auth staging
  'https://ai-service-git-develop-climb-help.vercel.app',  // AI staging
  'https://payment-service-git-develop-climb-help.vercel.app',  // Payment staging
  'https://notifications-service-git-develop-climb-help.vercel.app',  // Notifications staging
  'https://monitoring-service-git-develop-climb-help.vercel.app',  // Monitoring staging
  
  // Production Vercel
  'https://front-climb-help.vercel.app',  // Frontend production
  'https://climb-help.vercel.app',  // Frontend production alternative
  'https://autentication-service-climb-help.vercel.app',  // Auth production
  'https://ai-service-climb-help.vercel.app',  // AI production
  'https://payment-service-climb-help.vercel.app',  // Payment production
  'https://notifications-service-climb-help.vercel.app',  // Notifications production
  'https://monitoring-service-climb-help.vercel.app',  // Monitoring production
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
  } else {
    next();
  }
});

// Pour obtenir la vraie IP derrière un proxy (x-forwarded-for)
app.set('trust proxy', true);

// Middleware de session
app.use(session({ 
  secret: process.env.JWT_SECRET || "secret", 
  resave: false, 
  saveUninitialized: true 
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration Passport basique pour éviter les erreurs
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// Routes basiques pour Vercel
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'authentication-service' });
});

app.get('/auth', (req, res) => {
  res.status(302).redirect('/auth/callback');
});

app.get('/auth/callback', (req, res) => {
  res.status(302).redirect(`${frontendUrl}/auth-callback?error=Not implemented in serverless`);
});

app.get('/logout', (req, res) => {
  res.status(302).redirect('/');
});

app.get('/profile', (req, res) => {
  res.status(302).redirect('/');
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({ 
    message: 'Authentication Service API',
    status: 'running',
    endpoints: ['/health', '/auth', '/auth/callback', '/logout', '/profile']
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong'
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Export pour Vercel
module.exports = app;
