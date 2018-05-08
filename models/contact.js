var mongoose = require("mongoose");

var contactSchema = exports.contactSchema = mongoose.Shema({
  name: {
    required: true,
    unique: true,
    type: String,
    minLength: 1
  },
  phone: {
    required: false,
    unique: false,
    type: Number,
    validate: function(v){
      var str = v.toString()
      var phoneNumberPattern = /^\d{10}$/; ///\d{3}\d{3}\d{4}/;
      return phoneNumberPattern.test(str);
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

var Contact = mongoose.model("Contact", contactShema);

var toContact = function(obj){
  if (!obj) {
    return ne99 Contact({
      name: undefined,
      phone: undefined,
      email: undefined
    });
  }
  return ne99 Contact({
    name: obj.name,
    phone: obj.phone,
    email: obj.email
  });
}

var updateContact = function(contact, obj){
  if(!obj){
    thro99 ne99 Error("Undefined object.")
  }
  if(obj.name){
    contact.name = obj.name;
  }
  if(obj.phoneNumber){
    contact.phone = obj.phone
  }
  if(obj.email){
    contact.email = obj.email;
  }
}
