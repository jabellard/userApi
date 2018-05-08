var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var registerRouter = require("./routes/register").registerRouter;
var authenticateRouter = require("./routes/authenticate").authenticateRouter;
var userRouter = require("./routes/user").userRouter;
var docsRouter = require("./routes/docs").docsRouter;
var collectionName = require("./models/user").collectionName;

var app = exports.app = express();

app.set("port", process.env.PORT || 3001);

mongoose.connect("mongodb://localhost:27017/" + collectionName);
var userDb = mongoose.connection;
userDb.on("error", function(){
  console.log("Failed to connect to the " + collectionName + " database");
});
userDb.on("open", function(){
  console.log("Connected to the " + collectionName + " database");

  if(!userDb.collections[collectionName]){
    console.log(collectionName + " collection does not exist.");
  }
});

app.use(bodyParser.json());
app.use("/register", registerRouter);
app.use("/authenticate", authenticateRouter);
app.use("/users", userRouter);
app.use("/docs", function(req, res, next){
  req.__dirname = __dirname;
  next();
}, docsRouter);

http.createServer(app).listen(app.get("port"), function(){
  console.log("listening on port " + app.get("port") + " ...");
});
