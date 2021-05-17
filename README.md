⛅ 🌱 Farmbot-Weather-Server 🌱 ⛅

Une interface permettant de visualiser les données météo ainsi que de gérer l'arrosage automatique du Farmbot de l'INSA Rennes

⚠️ Ce repository contient uniquement le code de la partie serveur, le code client se situe ici : Farmbot-Weather-Client

Table des matières

A propos du projet

L'équipe
Technologies utilisées
Mise en place

Prérequis
Fichier environnement
Installation
Architecture du code

Contact

A propos du projet

FarmBot est un robot potager. Il permet de prendre soin des plantes à distance en autonomie. Dans le cadre des études pratiques de l'INSA Rennes, nous, quatre étudiants en Informatique, avons pu travailler sur ce robot afin d'héberger notre propre serveur pour la gestion du FarmBot sur un VPS de l'INSA, évitant de passer à chaque fois par les serveur de la compagnie situés aux Etats Unis. Nous avons aussi ajouté une fonctionnalité d'arrosage automatique ainsi qu'une interface web pour gérer celui-ci, dont le code se trouve sur le repository où vous vous trouvez actuellement.

L'équipe

Quatre étudiants en informatique en 3ème année INSA Rennes :

Juliette BONNARD - juliette99bonnard@hotmail.fr
Manuel POISSON - mpoissonmanuel@gmail.com
Pierre DUC-MARTIN - contact@pierredm.fr
Pablo CANCOIN - pablo.cancoin@gmail.com
Technologies utilisées

NodeJS
ExpressJS
FarmbotJS
MongoDB avec Mongoose
Mise en place

Envie de déployer cette interface pour votre FarmBot ?

Prérequis

Docker Engine
Fichier environnement

darkskyKey : Clé API Darksky pour récupérer les données météo
mongodb : URL de connexion au serveur MongoDB (par défaut mongodb://mongodb:27017, pour une configuration locale avec Docker)
cookieKey : Clé secrète pour les cookies (ex générée avec openssl rand -hex 64)
serverUrl : URL sur laquelle est déployée Farmbot-Web-App (pour les accès à l'API FarmBot)
farmbotMail : Mail de connexion au serveur Farmbot-Web-App (pour les accès à l'API FarmBot)
farmbotPassword : Mot de passe de connexion au serveur Farmbot-Web-App
adminPass : Mot de passe de connexion à l'interface météo, pour le compte admin créé lors du déploiement du serveur
Installation

Cloner le repository du serveur :
git clone --depth=1 https://github.com/pcancoin/Farmbot-Weather-Server.git
Rentrer dans le dossier
cd Farmbot-Weather-Server/
Créer le fichier .env
cp .env.example .env
⚠️ Bien remplir tous les champs du .env

Build et lancement du serveur

sudo docker-compose up -d
Architecture du code

gestionArrosage/ : Contient le code principal de l'arrosage automatique, qui vérifie s'il faut arroser et donne les ordres au robot

middlewares/ : Regroupe les différents middlewares

models/ : Différents modèles utilisés pour le stockage de données (librairie Mongoose)

node_modules/ : Toutes les dépendances du projets, installées avec npm install

routes/ : Différentes routes ou URI que désert le serveur

services/ : Différents services utilisés par le serveur web et/ou par la gestion de l'arrosage automatique

index.js : Fichier principal, lie le serveur à l'arrosage automatique

Contact

Pablo Cancoin - pablo.cancoin@gmail.com
