# Guide de démarrage - Application Full Stack

Ce projet contient une application full stack avec un frontend Angular et un backend Spring Boot.

## Prérequis

- Java 17
- Node.js (version 18 ou supérieure)
- npm (installé avec Node.js)
- Maven

## Backend (Spring Boot)

### Installation et démarrage

1. Naviguer vers le dossier backend :
```bash
cd back
```

2. Installer les dépendances avec Maven :
```bash
mvn clean install
```

3. Lancer l'application :
```bash
mvn spring-boot:run
```

Le serveur backend démarre sur `http://localhost:8080`

### Tests

Pour exécuter les tests du backend :
```bash
mvn test
```

## Frontend (Angular)

### Installation et démarrage

1. Naviguer vers le dossier frontend :
```bash
cd front
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer l'application :
```bash
npm start
```

L'application frontend est accessible sur `http://localhost:4200`

### Tests

1. Tests unitaires avec Jest :
```bash
npm run test
```

2. Tests end-to-end avec Cypress :
```bash
# Ouvrir l'interface Cypress
npm run e2e

# Lancer les tests en mode headless
npm run e2e:ci
```

3. Voir la couverture des tests :
```bash
npm run test:coverage
```

## Accès à l'application

Une fois les deux serveurs démarrés, vous pouvez accéder à l'application complète via :
`http://localhost:4200`
