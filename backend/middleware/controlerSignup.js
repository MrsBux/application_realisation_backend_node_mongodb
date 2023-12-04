module.exports = (req, res, next) => {
  const { email, password } = req.body;

  // Vérification du format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Format d'email invalide" });
  }

  // Vérification de la longueur du mot de passe
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Le mot de passe doit faire au moins 8 caractères" });
  }

  // Si les critères sont validés, passe au prochain middleware
  next();
};
