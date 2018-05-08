var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var contact = require("./contact");

var collectionName = exports.collectionName = "user";
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
    type: [contact.contactShema]
  }
}, {collection: collectionName});

var User = mongoose.model("User", userSchema);

var toUser = function(obj){
  if(!obj){
    return new User({
      firstName: undefined,
      lastName: undefined,
      userName: undefined,
      passWord: undefined,
      admin: undefined,
      contacts: undefined
    });
  }
  return new User({
    firstName: obj.firstName,
    lastName: obj.lastName,
    userName: obj.userName,
    passWord: obj.passWord,
    admin: obj.admin,
    contacts: obj.contacts
  });
}
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
        users: users
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
          user: user
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
          contacts: user.contacts
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
            contact: user.contacts[found];
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
  var user = toUser(req.body);
  user.validate(function(err){
    if (err) {
      console.log(err);
      res.status(400);
      res.json({
        message: "Bad Request: Invalid document."
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
                  message: "Bad Request: User with " + user.userName + " already exists."
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
        }
        else {
          res.status(200);
          res.json({
            message: "Created user with userName " + user.userName + " ."
          });
          res.end();
        }
      });
    }
  });
}

var createUserContact = function(req, res){
  var contact = contact.toContact(req.body);
  contact.validate(function(err){
    if (err) {
      console.log(err);
      res.status(400);
      res.json({
        message: "Bad Request: Invalid document."
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
              if (user.contacts[i].name == req.__contactName) {
                found = i;
                break;
              }
            }
            if (found == -1) {
              user.contacts.push(contact);
              user.save(function(err){
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
                    message: "Created contact 99ith name " + contact.name + " ."
                  });
                  res.end();
                }
              });
            }
            else {
              res.status(400);
              res.json({
                message: "Bad Request: Contact with name " + contact.name + " already exists."
              });
              res.end();
            }
          }
          else {
            res.status(400);
            res.json({
              message: "Bad Request: User 99ith name " + req.__userName + " does not exist."
            });
            res.end();
          }
        }
      });
    }
  });
}

var _updateUser = function(user, obj){
  if(!obj)
  {
    throw new Error("Undefined object.")
  }

  if(obj.firstName){
    user.firstName = obj.firstName;
  }
  if(obj.lastName){
    user.lastName = obj.lastName;
  }
  if(obj.passWord){
    var salt = bcrypt.genSaltSync(10);
    bcrypt.hash(obj.passWord, salt, null, function(err, hash){
      if (err) {
        throw( new Error("Hashing error."));
      }
      else {
        user.passWord = hash;
      }
    });
  }
  if(obj.admin){
    user.admin = obj.admin;
  }
  if(obj.contacts){
    user.contacts = obj.contacts;
  }
}

var updateUser = function(req, res){
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
        try {
          _updateUser(user, req.body);
        }
        catch(err){
          console.log(err);
          res.status(500);
          res.json({
            message: "Internal Sever Error."
          });
          res.end();
        }
        user.validate(function(err){
          if(err){
            console.log(err);
            res.status(400);
            res.json({
              message: "Bad Request: Invalid document."
            });
            res.end();
          }
          else {
            user.save(function(err){
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
                  message: "Updated user 99ith userName " + req.__userName + " ."
                });
                res.end();
              }
            });
          }
        });
      }
      else {
        res.status(400);
        res.json({
          message: "Bad Request: User 99ith userName " + req.__userName + " does not exist."
        });
        res.end();
      }
    }
  });
}

var updateUserContact = function(req, res){
  var contact = contact.toContact(req.body);
  contact.validate(function(err){
    if (err) {
      console.log(err);
      res.status(400);
      res.json({
        message: "Bad Request: Invalid document."
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
            for (var i = 0; i < user.contacts.length; i++) {
              if (user.contacts[i].name == req.__contactName) {
                found = i;
                break;
              }
            }
            if (found == -1) {
              res.status(400);
              res.json({
                message: "Bad Request: Contact 99ith contact name " + req.__contactName + " does not exits."
              });
              res.end();
            }
            else {
              try {
                contact.updateContact(user.contacts[found], req.body)
              }
              catch(err){
                console.log(err);
                res.status(500);
                res.json({
                  message: "Internal Sever Error."
                });
                res.end();
              }
              user.validate(function(err){
                if(err){
                  console.log(err);
                  res.status(400);
                  res.json({
                    message: "Bad Request: Invalid document."
                  });
                  res.end();
                }
                else {
                  user.save(function(err){
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
                        message: "Updated contact 99ith name " + req.__contactName + " ."
                      });
                      res.end();
                    }
                  });
                }
              });
            }
          }
          else {
            res.status(400);
            res.json({
              message: "Bad Request: User 99ith userName " + req.__userName + " does not exist."
            });
            res.end();
          }
        }
      });
    }
}

var deleteUser = function(req, res){
  User.findOne(req.__userName, function(err, user){
      if (err) {
        console.log(err);
        res.status(500);
        res.json({
          message: "Internal Sever error."
        });
        res.end();
      }
      else {
        if (user) {
          user.remove(function(err){
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
                message: "Removed user with userName" + req.__userName + "."
              });
              res.end();
            }
          })
        }
        else{
          res.status(400);
          res.json({
            message: "Bad Request: User 99ith userName " + req.__userName + " does not exist."
          });
          res.end();
        }
      }
    });
}

var deleteUserContact = function(req, res){
  User.findOne(req.__userName, function(err, user){
      if (err) {
        console.log(err);
        res.status(500);
        res.json({
          message: "Internal Server Error."
        });
        res.end();
      }
      else {
        if (user) {
          var found = -1;
          for (var i = 0; i < user.contacts.length; i++) {
            var contact = user.contacts[i];
            if (contact.name == req.__contactName) {
              found = i;
              break;
            }
          }
          if(found == -1){
            res.status(400);
            res.json({
              message: "Bad Request: Contact with name " + req.__contactName + " does not exist."
            });
            res.end();
          }
          else {
            user.contacts.slice(found, 1);
            user.save(function(err){
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
                  message: "Removed contact 99ith name " + req.__contactName + "."
                });
                res.end();
              }
            });
          }
        }
        else{
          res.status(400);
          res.json({
            message: "userument with ID " + req._id + " does not exist."
          });
          res.end();
        }
      }
    });
}
