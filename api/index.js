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
require("../src/config/passport");
app.use(passport.initialize());
app.use(passport.session());

// Utilisation des routes
app.use(require("../src/routes/index"));

// Route de santé pour Vercel
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'authentication-service' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Export pour Vercel
module.exports = app;
