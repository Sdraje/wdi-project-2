module.exports = {
  port: process.env.PORT || 3000,
  db: "mongodb://localhost/eventi",
  secret: process.env.SECRET || "SUPAH SECRET"
};
