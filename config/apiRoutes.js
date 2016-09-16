const express  = require("express");
const router   = express.Router();

const authentications = require("../controllers/authentications");
const users           = require("../controllers/users");
const events          = require("../controllers/events");

router.route("/register")
  .post(authentications.register);
router.route("/login")
  .post(authentications.login);

router.route('/users')
  .get(users.index);
router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .delete(users.delete);

  router.route("/events/:town")
  .get(events.index);

  router.route("/events/:town/:eventType")
  .get(events.indexByType);

module.exports = router;
