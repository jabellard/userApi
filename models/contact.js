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
