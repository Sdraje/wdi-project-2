const express    = require("express");
const morgan     = require("morgan");
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const cors       = require("cors");
const path       = require("path");
const expressJWT = require('express-jwt');

const app        = express();
const config     = require("./config/config");
const webRouter  = require("./config/webRoutes");
const usersRouter  = require("./config/usersRoutes");

mongoose.connect(config.db);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());
app.use(express.static(path.join(__dirname, "./public")));

app.use('/api', expressJWT({ secret: config.secret })
   .unless({
     path: [
       { url: '/api/register', methods: ['POST'] },
       { url: '/api/login',    methods: ['POST'] }
     ]
   }));
app.use(jwtErrorHandler);

function jwtErrorHandler (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: 'Unathorized request.' });
  }
  return next();
}

app.use("/", webRouter);
app.use("/api", usersRouter);

app.listen(config.port, () => console.log(`Express started on port: ${config.port}`));
