// Fichier contenant les routes de l'API pour les données relatives aux livres

//import des différents outils, middlewares et controllers nécéssaires
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp");
const booksCtrl = require("../controllers/books");

//routes post (l'utilisateur envoie des données)
router.post("/", auth, multer, sharp, booksCtrl.createBook);
router.post("/:id/rating", auth, booksCtrl.rateBook);

//route put (l'utilisateur modifie des données existantes)
router.put("/:id", auth, multer, sharp, booksCtrl.modifyBook);

//route delete (l'utilisateur supprime des données existantes)
router.delete("/:id", auth, booksCtrl.deleteBook);

//route get (l'utilisateur demande/reçoit des données)
router.get("/bestrating", booksCtrl.getBestRating);
router.get("/:id", booksCtrl.getOneBook);
router.get("/", booksCtrl.getAllBook);

module.exports = router;
