// Fichier contenant les routes de l'API pour les données relatives à l'authentification des utilisateurs

//import des différents outils, middlewares et controllers nécéssaires
const express = require("express");
const router = express.Router();
const useCtrl = require("../controllers/user");
const loginLimiter = require("../middleware/loginLimiter.js");
const controlerSignup = require("../middleware/controlerSignup.js");

// routes post pour la création de compte utilisateur et la connexion au compte utilisateur créé
router.post("/signup", controlerSignup, useCtrl.signup);
router.post("/login", loginLimiter, useCtrl.login);

module.exports = router;
