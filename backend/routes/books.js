const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp");
const booksCtrl = require("../controllers/books");

router.post("/", auth, multer, sharp, booksCtrl.createBook);
router.post("/:id/rating", auth, booksCtrl.rateBook);
router.put("/:id", auth, multer, sharp, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.get("/bestrating", booksCtrl.getBestRating);
router.get("/:id", booksCtrl.getOneBook);
router.get("/", booksCtrl.getAllBook);

module.exports = router;
