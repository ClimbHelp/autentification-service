import express from "express";
import session from "express-session";
import passport from "passport";
import { configurePassport } from "./config/passport";
import { PORT } from "./config/env";
import routes from "./routes/index";

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

// Initialisation de Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Utilisation des routes
app.use(routes);

// Export de l'app pour Vercel
export default app;

// Démarrage du serveur seulement si on n'est pas sur Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}
