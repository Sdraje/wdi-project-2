module.exports = {
  register: authenticationsRegister,
  login:    authenticationsLogin
};

const User   = require("../models/user");
const jwt    = require('jsonwebtoken');
const config = require('../config/config');

function authenticationsRegister(req, res){
  User.create(req.body.user, (err, user) => {
    if (err) return res.status(500).json({ message: "Something went wrong." });

    let token = jwt.sign(user._id, config.secret, { expiresIn: 60*60*24 });

    return res.status(201).json({
      message: `Welcome ${user.username}!`,
      user,
      token
    });
  });
}

function authenticationsLogin(req, res){
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).json({ message: "Something went wrong." });
    if (!user || !user.validatePassword(req.body.password)) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    let token = jwt.sign(user._id, config.secret, { expiresIn: 60*60*24 });

    return res.status(200).json({
      message: `Welcome back, ${user.username}!`,
      user,
      token
    });
  });
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYnNvbnR5cGUiOiJPYmplY3RJRCIsImlkIjoiV8OOw57Dt3jDv2TCtlx1MDAxNFxiVMKRIiwiaWF0IjoxNDczMTc1Mjg3LCJleHAiOjE0NzMyNjE2ODd9.JyU07s6jcjKMeMrVr6nTHcRcsuwJ7oAT3FCjt3OjTXU
