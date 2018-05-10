var mongoose = require("mongoose");

var contactSchema = exports.contactSchema = mongoose.Schema({
  name: {
    required: true,
    unique: true,
    type: String,
    minLength: 1
  },
  phoneNumber: {
    required: false,
    unique: false,
    type: Number,
    validate: function(v){
      var str = v.toString()
      var phoneNumberNumberPattern = /^\d{10}$/; ///\d{3}\d{3}\d{4}/;
      return phoneNumberNumberPattern.test(str);
    }
  },
  email: {
    required: false,
    unique: false,
    type: String,
    validate: function(v){
      var emailPattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailPattern.test(v);
    }
  }
});

var Contact = exports.Contact = mongoose.model("Contact", contactSchema);

var toContact = exports.toContact = function(obj){
  if (!obj) {
    return {
      name: undefined,
      phoneNumber: undefined,
      email: undefined
    };
  }
  return {
    name: obj.name,
    phoneNumber: obj.phoneNumber,
    email: obj.email
  };
}

var updateContact = exports.updateContact = function(contact, obj){
  if(!obj){
    throw new Error("Undefined object.")
  }
  if(obj.name){
    contact.name = obj.name;
  }
  if(obj.phoneNumberNumber){
    contact.phoneNumber = obj.phoneNumber
  }
  if(obj.email){
    contact.email = obj.email;
  }
}
