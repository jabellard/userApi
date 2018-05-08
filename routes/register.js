var express = require("express");
var createUser = require("../models/user").createUser;

var registerRouter = exports.registerRouter = express.Router();
registerRouter.route("/")
  .post(function(req, res, next){
    req.body.admin = false;
    next();
  }, createUser);
