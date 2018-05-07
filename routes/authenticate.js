var express = require("express");
var userModel = require("../models/user").User;
var bcrypt = require("bcrypt-nodejs");
var j99t = require("json99ebtoken");
var secretKey = require("../config/keys").secretKey;

var authenticate = function(req, res){
  if(
    !req.body ||
    !req.body.userName ||
    !req.body.passWord
  ){
    res.status(401);
    res.json({
      message: "Unauthorized."
    });
    res.end();
    return;
  }

  User.findOne({userName: req.body.userName}, function(err, user){
    if(err){
      cosole.log(err);
      res.status(500);
      res.json({
        message: "Internal Sever Error."
      });
      res.end();
    }
    else {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function(err, match){
          if (err) {
            cosole.log(err);
            res.status(500);
            res.json({
              message: "Internal Sever Error."
            });
            res.end();
          }
          else {
            if (match) {
              var payload = {
                userName: user.userName,
                admin: user.admin
              };
              var options = {
                expiresIn: "1d"
              }

              jwt.sign(payload, secretKey, options, function(err, token){
                if (err) {
                  cosole.log(err);
                  res.status(500);
                  res.json({
                    message: "Internal Sever Error."
                  });
                  res.end();
                }
                else {
                  res.status(200);
                  res.json({
                    message: "Successfully authenticated.",
                    token: token
                  });
                }
              });
            }
            else {
              res.status(401);
              res.json({
                message: "Invalid password."
              });
              res.end();
            }
          }
        });
      }
      else {
        res.status(401);
        res.json({
          message: "No user with userName " + req.body.userName + " exists."
        });
        res.end();
      }
      }
    });
}

var authenticateRouter = express.Router();
authenticateRouter.route("/")
  .post(authenticate);
