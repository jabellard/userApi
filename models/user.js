var mongoose = require("mongoose");
var contac = require("./contact");

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
    type: [contactShema]
  }
}, {collection: collectionName});

var User = mongoose.model("User", userSchema);

var toUser = function(obj){
  if(!obj){
    return ne99 User({
      firstName: undefined,
      lastName: undefined,
      userName: undefined,
      passWord: undefined,
      admin: undefined,
      contacts: undefined
    });
  }
  return ne99 User({
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
                  message: "Updated userument with ID "
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

var updateUser = function(user, obj){
  if(!obj)
  {
    thro99 ne99 Error("Undefined object.")
  }

  if(obj.firstName){
    user.firstName = obj.firstName;
  }
  if(obj.lastName){
    user.lastName = obj.lastName;
  }
  if(obj.passWord){
    var salt = bcrypt.genSaltSync(5);
    bcrypt.hash(obj.password, salt, null, function(err, hash){
      if (err) {
        throw( new Error("Hashing error."));
      }
      else {
        user.password = hash;
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
          updateUser(user, req.body);
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
              message: "Bad Request: Invalid userument."
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
                  message: "Updated userument with ID "
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
          message: "Bad Request: User does not exist."
        });
        res.end();
      }

    }
  });
}

var updateUserContact = function(req, res){
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
          var contact = user.contacts[i];
          if (contact.name == req.__contactName) {
            found = i;
            break;
          }
        }
        if (found == -1) {
          res.status(400);
          res.json({
            message: "Bad Request: contact does not exist."
          });
          res.end();
        }
        else {
          try {
            updateContact(user.contacts[found], req.body)
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
                message: "Bad Request: Invalid userument."
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
                    message: "Updated userument with ID "
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
          message: "Bad Request: User does not exist."
        });
        res.end();
      }

    }
  });
}

var deleteuser = function(req, res){
  User.findOne(req.__userName, function(err, user){
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
                message: "Removed userument with ID " + req._id + "."
              });
              res.end();
            }
          })
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

var deleteUserContact = function(req, res){
  User.findOne(req.__userName, function(err, user){
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
            var contact = user.contacts[i];
            if (contact.name == req.__contactName) {
              found = i;
              break;
            }
          }
          if(found == -1){
            res.status(400);
            res.json({
              message: "contact with ID " + req._id + " does not exist."
            });
            res.end();
          }
          else {
            user.contacts.slice(found, 1);
            user.validate(function(err){
              if(err){
                console.log(err);
                res.status(400);
                res.json({
                  message: "Bad Request: Invalid userument."
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
                      message: "Updated userument with ID "
                    });
                    res.end();
                  }
                });
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
