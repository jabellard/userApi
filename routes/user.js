var express = require("express");
var jwt = require("jsonwebtoken");
var userModel = require("../models/user");
var secretKey = require("../config/keys").secretKey;

var authorize = function(req, res, next){
  var authHeader = req.get("authorization");
  if (!authHeader) {
    res.status(401);
    res.json({
      message: "Unauthorized."
    });
    res.end();
  }
  else {
    var authHeaderArr = authHeader.split(" ");
    if(token.length != 2)
    {
      res.status(401);
      res.json({
        message: "Unauthorized."
      });
      res.end();
    }
    else{
      var token = authHeaderArr[1];
      jwt.verify(token, secretKey, function(err, payload){
        if (err) {
          res.status(401);
          res.json({
            message: "Unauthorized."
          });
          res.end();
        }
        else {
          if (req.__admin) {
            if (payload.admin) {
              next();
            }
            else {
              res.status(401);
              res.json({
                message: "Unauthorized."
              });
              res.end();
            }
          }
          else {
            if (payload.admin) {
              next()
            }
            else {
              if (req.__userName == payload.userName) {
                if (req.__security && req.body && req.body.admin) {
                  req.body.admin = undefined; //payload.admin;
                  next();
                }
              }
              else {
                res.status(401);
                res.json({
                  message: "Unauthorized."
                });
                res.end();
              }
            }
          }

        }
      });
    }
  }
}

var userRouter = exports.userRouter = express.Router();
userRouter.param("userName", function(req, res, next, userName){
  req.__userName = userName;
  next();
});
userRouter.param("contactName", function(req, res, next, contactName){
  req.__contactName = contactName;
  next();
});
userRouter.use(function(req, res, next){
  req.__admin = false;
  req.__security = false;
});
userRouter.route("/")
  .get(function(req, res, next){
    req.__admin = true;
    next();
  })
  .get(authorize, userModel.getAllUsers)
  .post(function(req, res, next){
    req.body.admin = false;
    next();
  })
  .post(userModel.createUser);

userRouter.route("/:userName")
  .get(authorize, userModel.getUserByuserName)
  .put(function(req, res, next){
    req.__security = true;
    next();
  })
  .put(authorize, userModel.updateUser)
  .delete(function(req, res, next){
    req.__security = true;
    next();
  })
  .delete(authorize, userModel.deleteUser);

userRouter.route("/:userName/contacts")
  .get(authorize, userModel.getUserContacts)
  .post(authorize, userModel.createUserContact);

userRouter.route("/:userName/contacts/:contactName")
  .get(authorize, userModel.getUserContactByName)
  .put(authorize, userModel.updateUserContact)
  .delete(authorize, userModel.deleteUserContact);
