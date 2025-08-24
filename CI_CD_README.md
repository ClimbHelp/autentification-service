# Configuration CI/CD - Service d'Authentification

Ce document décrit la configuration CI/CD mise en place pour le service d'authentification.

## Architecture CI/CD

Le service d'authentification utilise la même architecture CI/CD que les services d'IA et BDD :

### 1. GitLab CI/CD Pipeline

Le pipeline GitLab est configuré dans `.gitlab-ci.yml` et comprend :

- **Stage Test** : Exécution des tests unitaires
- **Stage Build** : Construction de l'image Docker
- **Stage Deploy** : Déploiement en staging et production

#### Variables d'environnement pour les tests :
- `GOOGLE_CLIENT_ID`: ID client Google pour les tests
- `GOOGLE_CLIENT_SECRET`: Secret client Google pour les tests
- `JWT_SECRET`: Secret JWT pour les tests

### 2. Docker

Le service est conteneurisé avec Docker :

- **Image de base** : `node:18-alpine`
- **Port exposé** : `3003`
- **Commande de démarrage** : `npm start`

### 3. Vercel

Le service est déployé sur Vercel pour le serverless :

- **Point d'entrée** : `api/index.js`
- **Configuration** : `vercel.json`

## Variables d'environnement

### Variables requises :

```bash
# Configuration du serveur
PORT=3003
NODE_ENV=production

# Configuration Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Configuration JWT
JWT_SECRET=your_jwt_secret
```

### Configuration dans GitLab :

1. Allez dans votre projet GitLab
2. Naviguez vers **Settings > CI/CD > Variables**
3. Ajoutez les variables suivantes :
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `JWT_SECRET`

### Configuration dans Vercel :

1. Connectez-vous à votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans **Settings > Environment Variables**
4. Ajoutez les variables d'environnement nécessaires

## Déploiement

### Staging (automatique)
- Se déclenche sur les commits vers la branche `develop`
- URL : `https://auth-staging.votre-app.com`

### Production (manuel)
- Se déclenche manuellement sur la branche `main`
- URL : `https://auth.votre-app.com`

## Scripts disponibles

```bash
# Développement local
npm run dev

# Production
npm start

# Build TypeScript
npm run build

# Tests
npm test
```

## Structure des fichiers

```
autentication-service/
├── api/
│   └── index.js          # Point d'entrée Vercel
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   └── index.ts          # Point d'entrée local
├── .gitlab-ci.yml        # Pipeline GitLab
├── Dockerfile            # Configuration Docker
├── vercel.json           # Configuration Vercel
├── env.example           # Variables d'environnement
└── package.json          # Scripts et dépendances
```

## Monitoring

Le service expose un endpoint de santé :
- `GET /health` : Retourne le statut du service

## Troubleshooting

### Erreurs courantes :

1. **Variables d'environnement manquantes** : Vérifiez que toutes les variables sont configurées dans GitLab et Vercel
2. **Port déjà utilisé** : Vérifiez que le port 3003 est disponible
3. **Erreurs de build** : Vérifiez que TypeScript compile correctement avec `npm run build`
