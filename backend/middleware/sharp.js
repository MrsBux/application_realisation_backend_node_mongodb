const sharp = require("sharp");
const path = require("path");

module.exports = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please provide an image file" });
  }
  const filename = req.file.filename.split(".")[0] + "_" + Date.now() + ".webp";

  sharp(req.file.path)
    .resize(600)
    .toFormat("webp", { quality: 80 })
    .toFile(path.join("images", filename), (sharpErr, info) => {
      if (sharpErr) {
        return res.status(400).json({ error: sharpErr.message });
      }
      req.file.filename = filename;
      next();
    });
};
