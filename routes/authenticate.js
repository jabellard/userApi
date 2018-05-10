var express = require("express");
var User= require("../models/user").User;
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");
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
        bcrypt.compare(req.body.passWord, user.passWord, function(err, match){
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
                expiresIn: "7d"
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
                  res.end();
                }
              });
            }
            else {
              res.status(401);
              res.json({
                message: "Invalid passWord."
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

var authenticateRouter = exports.authenticateRouter = express.Router();
authenticateRouter.route("/")
  .post(authenticate);
