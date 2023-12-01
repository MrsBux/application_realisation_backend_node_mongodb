// Fichier contenant les routes de l'API pour les données relatives à l'authentification des utilisateurs

//import des différents outils, middlewares et controllers nécéssaires
const express = require("express");
const router = express.Router();
const useCtrl = require("../controllers/user");

// routes post pour la création de compte utilisateur et la connexion au compte utilisateur créé
router.post("/signup", useCtrl.signup);
router.post("/login", useCtrl.login);

module.exports = router;
