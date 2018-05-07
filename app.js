var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var userRouter = require("./routes/user");
var docsRouter = require("./routes/docs");

var app = exports.app = express();

app.set("port", process.env.PORT || 3000);

mongoose.connect("mongodb://localhost:27017/user");
var userDb = mongoose.connection;
userDb.on("error", function(){
  console.log("Failed to connect to the user database.");
});
profileDb.on("open", function(){
  console.log("Connected to the user database.");

  if(!userDb.collections[userModel.collectionName]){
    console.log(userModel.collectionName + " collection does not exist.");
  }
});

app.use(bodyParser.json());
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/users", userRouter);
app.use("/docs", function(req, res, next){
  req.__dirname = __dirname;
  next();
}, docsRouter);

http.createServer(app).listen(app.get("port"), function(){
  console.log("listening on port " + app.get("port") + " ...");
});
