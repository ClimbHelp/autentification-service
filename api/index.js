const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");

// Configuration des variables d'environnement
dotenv.config();

const app = express();

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

// Routes basiques pour Vercel
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'authentication-service' });
});

app.get('/auth', (req, res) => {
  res.status(302).redirect('/auth/callback');
});

app.get('/auth/callback', (req, res) => {
  res.status(302).redirect('http://localhost:3000/auth-callback?error=Not implemented in serverless');
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
