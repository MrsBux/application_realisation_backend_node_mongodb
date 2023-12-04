const http = require("http");
const app = require("./app");

// Normalisation du port pour l'écoute du serveur
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// Définition du port d'écoute
const port = normalizePort(process.env.PORT || "4000");
// Configuration du port pour l'application Express
app.set("port", port);

// Gestion des erreurs liées au serveur HTTP
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP avec l'application Express
const server = http.createServer(app);

// Gestionnaire d'erreurs pour le serveur
server.on("error", errorHandler);

server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind); // Affichage du port ou du chemin d'écoute lors du démarrage du serveur
});

// Mise en écoute du serveur sur le port spécifié
server.listen(port);
