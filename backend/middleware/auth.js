// Chargement des variables d'environnement depuis un fichier .env
require("dotenv").config();
// Utilisation de JWT pour la gestion des tokens d'authentification
const jwt = require("jsonwebtoken");
// Récupération de la clé secrète JWT depuis les variables d'environnement
const jwtSecret = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  try {
    // Extraction du token depuis le header Authorization
    const token = req.headers.authorization.split(" ")[1];
    // Vérification et décodage du token avec la clé secrète
    const decodedToken = jwt.verify(token, jwtSecret);
    // Récupération de l'ID utilisateur depuis le token décodé
    const userId = decodedToken.userId;
    // Ajout de l'ID utilisateur à l'objet req pour les prochaines étapes du middleware
    req.auth = {
      userId: userId,
    };
  } catch (error) {
    res.status(401).json({ error });
  }
  next();
};
