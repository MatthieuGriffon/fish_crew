# 🎣 Fish Crew

Fish Crew 🐟 est une application Web conçue pour les passionnés de pêche qui souhaitent partager leurs spots de pêche préférés avec leurs amis.
L'application permet de créer des groupes publics ou privés pour inviter des personnes à se joindre et à partager des emplacements de pêche. 
Les utilisateurs peuvent marquer des points sur la carte 🗺️ et décider de leur visibilité en fonction de leur groupe ou de la disponibilité publique.

## Fonctionnalités clés

- Création de groupes publics et privés pour partager des emplacements de pêche 🐠
- Marquage de points sur la carte avec des détails sur les spots de pêche 📍
- Gestion des membres des groupes, y compris l'invitation et la suppression de membres 👥
- Visibilité sélective des spots de pêche en fonction des paramètres de confidentialité du groupe 🔒
- Communication en temps réel entre les membres grâce à Socket.IO ⚡

## Technologies utilisées

- Next.js pour le développement de l'application web
- React pour la construction de l'interface utilisateur
- Leaflet pour l'intégration de la cartographie interactive
- Socket.IO pour la communication en temps réel entre le serveur et le client
- Prisma pour l'interaction avec la base de données MySQL
- JSON Web Tokens (jsonwebtoken) pour l'authentification et la sécurité
- bcrypt pour le hachage des mots de passe
- Node.js pour exécuter du code JavaScript côté serveur
- UUID pour la génération d'identifiants uniques
- Dotenv pour la gestion des variables d'environnement
- TypeScript pour ajouter un typage statique à JavaScript
- Tailwind CSS pour la conception et la stylisation de l'interface utilisateur
- Eslint pour l'analyse statique du code JavaScript

## Installation

Assurez-vous d'avoir Node.js et npm installés localement. Clonez le référentiel, puis exécutez les commandes suivantes :

```bash
npm install
npm run dev
```
Le serveur de développement devrait démarrer à l'adresse http://localhost:3000.
