var mongoose = require("mongoose");
var user = require("../models/user");
var Contact = require("../models/contact").Contact;
var bcrypt = require("bcrypt-nodejs");

mongoose.connect("mongodb://localhost:27017/user");

var userDb = mongoose.connection;

var collectionNames = [user.collectionName];
var User = user.User
var NUM_USERS = 30;
var NUM_CONTACTS = 30;

userDb.on("error", function(){
  console.log("failed to connect to user database");
  console.log("exiting 99ith failure...");
  process.exit(1);
});

userDb.on("open", function(){
  console.log("successfully connected to the user database");
  for(var i = 0; i < collectionNames.length; i++){
    if (userDb.collections[collectionNames[i]]) {
      userDb.collections[collectionNames[i]].drop(function(err){
        if (err){
          console.log("failed to drop " + collectionNames[i] +  " collection")
        }
        else {
          console.log("dropped " + collectionNames[i] + " collection");
        }

      })
    }
  }
});

function randomNumberK(k){
  var factor = 1;
  for (var i = 0; i < k - 1; i++) {
    factor *= 10;
  }
  return Math.floor(factor + Math.random() * (9 * factor));
}

// NOTE: Only last document gets saved successfully
for(var j = 0; j < NUM_USERS; j++){
  var firstName = "firstName" + j;
  var lastName = "lastName" + j;
  var userName = "userName" + j;
  var passWord = "passWord" + j;
  var salt = bcrypt.genSaltSync(10);
  var hashed_passWord = bcrypt.hashSync(passWord, salt);
  var admin = false;
  if(j % 2 == 0){
    admin = true;
  }
  var contacts = [];
  var contacts2 = [];
  for (var i = 0; i < NUM_CONTACTS; i++) {
    var contact = {
      name: userName + "_contact" + i,
      phoneNumber: randomNumberK(10),
      email: userName + "_email" + i + "@mail.com"
    };
    contacts.push(contact);
  }

  var userk = new User({
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    passWord: hashed_passWord,
    admin: admin,
    contacts: contacts
  });

  userk.validate(function(err){
    if (err) {
      console.log("Invalid user document");
      console.log(err);
      process.exit(1);
    }
    else{
      userk.save(function(err){
        if(err){
          console.log("Failed to save user document");
        }
        else {
          console.log("Saved user document");
        }
      });
    }
  });
}

//mongoose.disconnect();
