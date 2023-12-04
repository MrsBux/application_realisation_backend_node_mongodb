// Fichier controllers Books
const Book = require("../models/Book");
const fs = require("fs");

//Création d'un livre
exports.createBook = (req, res, next) => {
  // Extraction de l'objet livre du corps de la requête
  const bookObject = JSON.parse(req.body.book);

  // Suppression de la propriété _userId de l'objet livre
  delete bookObject._userId;

  // Création d'une nouvelle instance de Book
  const book = new Book({
    ...bookObject,
    // Assignation de l'ID de l'utilisateur authentifié comme l'ID de l'utilisateur du livre
    userId: req.auth.userId,
    // Création de l'URL de l'image du livre
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  //Enregistrement du livre créé dans la base de données
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Modification d'un livre par son créateur
exports.modifyBook = (req, res, next) => {
  console.log("affiche");
  //Vérification de s'il y a un fichier attaché à la requête
  const bookObject = req.file
    ? {
        // si fichier attaché à la requête, conversion la chaîne JSON en un objet js et création d'un nouvel objet js
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        //sinon création d'un nouvel objet bookObject en copiant données corps requête
        ...req.body,
      };
  delete bookObject._userId;

  // Recherche du livre à modifier en utilisant son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification pou savoir si l'utilisateur authentifié est le propriétaire du livre
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Not authorized" });
      } else {
        // Met à jour le livre avec les nouvelles données
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Suppression d'un livre par son créateur
exports.deleteBook = (req, res, next) => {
  // Recherche du livre à supprimer en utilisant son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification de si l'utilisateur authentifié est le propriétaire du livre
      if (book.userId != req.auth.userId) {
        // Si l'utilisateur n'est pas le propriétaire, renvoie un statut d'interdiction (403)
        res.status(403).json({ message: "Not authorized" });
      } else {
        // Si l'utilisateur est le propriétaire, procède à la suppression du livre

        // Extraction du nom du fichier à partir de l'URL de l'image
        const filename = book.imageUrl.split("/images/")[1];

        // Suppression du fichier correspondant à l'image du livre depuis le système de fichiers
        fs.unlink(`images/${filename}`, () => {
          // Suppression du livre de la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Obtenir la page d'information d'un livre précis, disponible non connect&
exports.getOneBook = (req, res, next) => {
  // Recherche du livre en utilisant son ID
  Book.findOne({ _id: req.params.id })
    // Renvoie le livre trouvé
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json("Livre non trouvé"));
};

//Obtenir la galerie avec tous les livres proposé sur le site, disponible non connecté
exports.getAllBook = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

//Notation d'un livre que l'on a pas créé
exports.rateBook = (req, res, next) => {
  // Extraction de l'ID de l'utilisateur et de la note à partir de la requête
  const userId = req.auth.userId;
  const grade = parseInt(req.body.rating, 10);

  // Vérification de si la note est valide (un nombre, et entre 1 et 5)
  if (isNaN(grade) || grade < 1 || grade > 5) {
    return res.status(400).json({ message: "La note doit être entre 1 et 5." });
  }

  // Création d'un objet représentant la note de l'utilisateur
  const userRating = { userId, grade };

  // Recherche du livre à noter en utilisant son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification de si le livre existe
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérification de si l'utilisateur a déjà noté ce livre
      if (book.ratings.some((rating) => rating.userId === userId)) {
        return res
          .status(403)
          .json({ message: "Vous avez déjà noté ce livre !" });
      } else {
        // Ajout de la nouvelle note à la liste des notes du livre
        book.ratings.push(userRating);

        // Calcul de la nouvelle moyenne de notation du livre
        const sumOfRatings = book.ratings.reduce(
          (total, rating) => total + rating.grade,
          0
        );
        book.averageRating = sumOfRatings / book.ratings.length;

        // Sauvegarde du livre avec la nouvelle note et la moyenne mise à jour
        return book
          .save()
          .then(() => res.status(200).json(book))
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ message: "Livre non trouvé" }));
};

//Obtenir un tableau des trois livres les mieux notés, disponible non connecté
exports.getBestRating = (req, res, next) => {
  // Recherche de tous les livres disponibles dans la base de données
  Book.find()
    .then((books) => {
      // Tri des livres par ordre décroissant de moyenne de notation
      books.sort((a, b) => b.averageRating - a.averageRating);

      // Extraction des trois livres les mieux notés, les trois premiers du tableau réarrangé
      const bestRatedBooks = books.slice(0, 3);

      // Envoi des trois livres les mieux notés en réponse
      res.status(200).json(bestRatedBooks);
    })
    .catch((error) => res.status(500).json({ error }));
};
