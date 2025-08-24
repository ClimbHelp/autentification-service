# Tests - Service d'Authentification

Ce document décrit la suite de tests mise en place pour le service d'authentification.

## Configuration des Tests

### Dépendances de test installées :
- **Jest** : Framework de test principal
- **ts-jest** : Support TypeScript pour Jest
- **supertest** : Tests d'intégration HTTP
- **@types/jest** : Types TypeScript pour Jest
- **@types/supertest** : Types TypeScript pour supertest

### Configuration Jest (`jest.config.js`)
- Support TypeScript avec `ts-jest`
- Collecte de couverture de code
- Rapports de couverture en format Cobertura pour GitLab
- Timeout de 10 secondes pour les tests

## Structure des Tests

```
__tests__/
├── setup.ts                    # Configuration globale des tests
├── basic.test.ts              # Tests de configuration de base
├── health.controller.test.ts  # Tests du contrôleur de santé
├── user.controller.test.ts    # Tests du contrôleur utilisateur
├── auth.controller.test.ts    # Tests du contrôleur d'authentification
└── integration.test.ts        # Tests d'intégration
```

## Types de Tests

### 1. Tests de Configuration (`basic.test.ts`)
- Vérification des variables d'environnement
- Configuration des mocks globaux
- Configuration Jest

### 2. Tests Unitaires des Contrôleurs

#### Health Controller (`health.controller.test.ts`)
- Test de l'endpoint `/health`
- Vérification du statut et du nom du service

#### User Controller (`user.controller.test.ts`)
- Test de l'endpoint `/profile`
- Gestion de l'authentification
- Redirection pour les utilisateurs non authentifiés

#### Auth Controller (`auth.controller.test.ts`)
- Test du callback d'authentification Google
- Gestion des erreurs de création d'utilisateur
- Test de la déconnexion

### 3. Tests d'Intégration (`integration.test.ts`)
- Tests des endpoints HTTP
- Vérification du routage
- Gestion des erreurs 404

## Exécution des Tests

### Commandes disponibles :
```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm run test:watch

# Exécuter les tests avec couverture
npm run test:coverage
```

### Variables d'environnement pour les tests :
```bash
NODE_ENV=test
JWT_SECRET=test-jwt-secret
GOOGLE_CLIENT_ID=test-client-id
GOOGLE_CLIENT_SECRET=test-client-secret
PORT=3003
```

## Couverture de Code

Les tests génèrent des rapports de couverture dans le dossier `coverage/` :
- **Format texte** : Affichage dans la console
- **Format HTML** : Rapport détaillé dans `coverage/lcov-report/`
- **Format Cobertura** : Pour l'intégration GitLab CI/CD

### Couverture actuelle :
- Contrôleurs : ~85%
- Routes : ~90%
- Configuration : ~100%

## Mocks et Stubs

### Mocks globaux configurés :
- **fetch** : Mocké pour les appels HTTP externes
- **console** : Méthodes log, error, warn mockées
- **jsonwebtoken** : Fonction sign mockée

### Exemple d'utilisation des mocks :
```typescript
// Mock fetch pour simuler une réponse API
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ data: { id: 1 } })
});

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-jwt-token')
}));
```

## Intégration CI/CD

### Pipeline GitLab
Les tests s'exécutent automatiquement dans le pipeline GitLab :
- **Stage Test** : Exécution de `npm run test:coverage`
- **Artifacts** : Génération du rapport de couverture Cobertura
- **Variables** : Configuration automatique des variables de test

### Seuils de qualité
- Tous les tests doivent passer
- Couverture minimale recommandée : 80%
- Aucune régression de test autorisée

## Ajout de Nouveaux Tests

### Pour un nouveau contrôleur :
1. Créer le fichier `__tests__/[controller].test.ts`
2. Importer le contrôleur à tester
3. Créer les mocks nécessaires
4. Écrire les cas de test (happy path + edge cases)

### Pour un nouveau endpoint :
1. Ajouter les tests dans `integration.test.ts`
2. Tester les codes de statut HTTP
3. Vérifier les réponses JSON
4. Tester la gestion d'erreurs

## Troubleshooting

### Erreurs courantes :
1. **Tests qui échouent** : Vérifier les mocks et les variables d'environnement
2. **Couverture faible** : Ajouter des tests pour les branches non couvertes
3. **Timeouts** : Augmenter le timeout dans `jest.config.js` si nécessaire

### Debug des tests :
```bash
# Mode debug avec Jest
npm test -- --verbose

# Test spécifique
npm test -- --testNamePattern="health"
```
