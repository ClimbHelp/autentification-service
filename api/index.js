const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect').Strategy;
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

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
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

// Configuration Passport
passport.use(new OpenIDConnectStrategy({
  issuer: 'https://accounts.google.com',
  authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenURL: 'https://oauth2.googleapis.com/token',
  userInfoURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://autentication-service-climb-help.vercel.app/auth/callback',
  scope: 'openid email profile'
}, async (issuer, profile, done) => {
  try {
    // Vérifier si l'utilisateur existe déjà dans la BDD
    const bddServiceUrl = process.env.BDD_SERVICE_URL || 'http://localhost:3003';
    const checkResponse = await fetch(`${bddServiceUrl}/api/users/email/${profile.emails[0].value}`);
    
    if (checkResponse.ok) {
      // L'utilisateur existe, on le récupère
      const user = await checkResponse.json();
      return done(null, user);
    } else {
      // L'utilisateur n'existe pas, on le crée
      const newUser = {
        email: profile.emails[0].value,
        nom: profile.displayName,
        prenom: profile.name?.givenName || '',
        google_id: profile.id,
        avatar_url: profile.photos?.[0]?.value || null
      };
      
      const createResponse = await fetch(`${bddServiceUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });
      
      if (createResponse.ok) {
        const createdUser = await createResponse.json();
        return done(null, createdUser);
      } else {
        return done(new Error('Erreur lors de la création de l\'utilisateur'));
      }
    }
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Route d'authentification Google
app.get('/auth', passport.authenticate('openidconnect'));

// Callback Google OAuth
app.get('/auth/callback', 
  passport.authenticate('openidconnect', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Générer un JWT
      const token = jwt.sign(
        { 
          userId: req.user.id, 
          email: req.user.email,
          nom: req.user.nom,
          prenom: req.user.prenom
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Rediriger vers le frontend avec le token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth-callback?token=${token}`);
    } catch (error) {
      console.error('Erreur lors de la génération du token:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }
  }
);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Service d\'authentification fonctionnel' });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'authentication' });
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: 'Service d\'authentification Climb Help' });
});

module.exports = app;
