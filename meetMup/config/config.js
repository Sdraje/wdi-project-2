module.exports = {
  port: process.env.PORT || 3000,
  db: "mongodb://localhost/meetmup",
  secret: process.env.SECRET || "SUPAH SECRET"
};
