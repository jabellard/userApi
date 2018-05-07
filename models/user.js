var mongoose = require("mongoose");
var contac = require("./contact");

var collectionName = "user";
var userSchema = mongoose.Schema({
  firstName: {
    required: true,
    unique: false,
    type: String,
    minLength: 1
  },
  lastName: {
    required: true,
    unique: false,
    type: String,
    minLength: 1
  },
  firstName: {
    required: true,
    unique: false,
    type: String,
    minLength: 1
  },
  userName: {
    required: true,
    unique: true,
    type: String,
    minLength: 1
  },
  passWord: {
    required: true,
    unique: false,
    type: String,
    minLength: 1
  }
  admin: {
    required: true,
    unique: false,
    type: Boolean
  },
  contacts: {
    required: true,
    unique: false,
    type: [contactShema]
  }
}, {collection: collectionName});

var User = mongoose.model("User", userSchema);

var getAllUsers = function(req, res){
  User.find({}, {_id: false, __v: false}, function(err, users){
    if (err) {
      console.log(err);
      res.status(500);
      res.json({
        message: "Internal Sever Error."
      });
      res.end();
    }
    else {
      res.status(200);
      res.json({
        result: user
      });
      res.end();
    }
  });
}

var getUserByuserName = function(req, res){
  User.findOne({userName: req.__userName}, {_id: false, __v: false}, function(err, user){
    if (err) {
      console.log(err);
      res.status(500);
      res.json({
        message: "Internal Sever Error."
      });
      res.end();
    }
    else {
      if (user) {
        res.status(200);
        res.json({
          result: user
        });
        res.end();
      }
      else {
        res.status(400);
        res.json({
          message: "Bad Request: User does not exist."
        });
        res.end();
      }

    }
  });
}

var getUserContacts = function(req, res){
  User.findOne({userName: req.__userName}, {_id: false, __v: false}, function(err, user){
    if (err) {
      console.log(err);
      res.status(500);
      res.json({
        message: "Internal Sever Error."
      });
      res.end();
    }
    else {
      if (user) {
        res.status(200);
        res.json({
          result: user.contacts
        });
        res.end();
      }
      else {
        res.status(400);
        res.json({
          message: "Bad Request: User does not exist."
        });
        res.end();
      }

    }
  });
}

var getUserContactByName = function(req, res){
  User.findOne({userName: req.__userName}, {_id: false, __v: false}, function(err, user){
    if (err) {
      console.log(err);
      res.status(500);
      res.json({
        message: "Internal Sever Error."
      });
      res.end();
    }
    else {
      if (user) {
        var found = -1;
        for(var i = 0; i < user.contacts.length; i++){
          var contact = user.contacts[i];
          if (contact.name == req.__contactName) {
            found = i;
            break;
          }
        }
        if (found == -1) {
          res.status(400);
          res.json({
            message: "Bad Request: Contact does not exist."
          });
          res.end();
        }
        else {
          res.status(200);
          res.json({
            result: user.contacts[found];
          });
          res.end();
        }
      }
      else {
        res.status(400);
        res.json({
          message: "Bad Request: User does not exist."
        });
        res.end();
      }

    }
  });
}

var createUser = exports.createUser = function(req, res){
  var user = req.__user;
  if(!user){
    res.status(400);
    res.json({
      message: "Bad Request: Invalid userument."
    });
    res.end();
    return;
  }
  user.validate(function(err){
    if (err) {
      console.log(err);
      res.status(400);
      res.json({
        message: "Bad Request: Invalid user."
      });
      res.end();
    }
    else{
      user.save(function(err){
        if(err){
          console.log(err);
          var query = {
            userName: user.userName;
          };
          User.findOne(query, function(err, user){
            if (err) {
              console.log(err);
              res.status(500);
              res.json({
                message: "Internal Sever Error."
              });
              res.end();
            }
            else {
              if (user) {
                res.status(400);
                res.json({
                  message: "Bad Request: userument with ID already exists."
                });
                res.end();
              }
              else {
                res.status(500);
                res.json({
                  message: "Internal Sever Error."
                });
                res.end();
              }
            }
          });
          return;
        }
        else {
          res.status(200);
          res.json({
            message: "Created userument with ID "
          });
          res.end();
        }
      });
    }
    return;
  });
}

var createUserContact = function(req, res){
  var contact;
  contact.validate(function(err){
    if (err) {
      console.log(err);
      res.status(400);
      res.json({
        message: "Bad Request: Invalid userument."
      });
      res.end();
    }
    else {
      User.findOne({userName: req.__userName}, {_id: false, __v: false}, function(err, user){
        if (err) {
          console.log(err);
          res.status(500);
          res.json({
            message: "Internal Sever Error."
          });
          res.end();
        }
        else {
          if (user) {
            var found = -1;
            for(var i = 0; i < user.contacts.length; i++){
              var contact = user.contacts[i];
              if (contact.name == req.__contactName) {
                found = i;
                break;
              }
            }
            if (found == -1) {
              user.contacts.push(contact);
              doc.save(function(err){
              if (err) {
                console.log(err);
                res.status(500);
                res.json({
                  message: "Internal Sever Error."
                });
                res.end();
              }
              else {
                res.status(200);
                res.json({
                  message: "Updated document with ID "
                });
                res.end();
              }
            });
            }
            else {
              res.status(400);
              res.json({
                message: "Bad Request: Contact 99ith name already exist."
              });
              res.end();
            }
          }
          else {
            res.status(400);
            res.json({
              message: "Bad Request: User does not exist."
            });
            res.end();
          }

        }
      });
    }
  });
}

var updateUser = function(req, res){

}

var updateUserContact = function(req, res){

}

var deleteuser = function(req, res){

}

var deleteUserContact = function(req, res){

}
