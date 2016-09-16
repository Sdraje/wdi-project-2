module.exports = {
  port:   process.env.PORT || 3000,
  db:     process.env.MONGOLAB_URI || "mongodb://localhost/eventi",
  secret: process.env.SECRET || "SUPAH SECRET"
};
