var express = require("express");

var serveDocs = function(req, res){
  res.sendFile(req.__dirname + "/docs/docs.html");
}
var docsRouter = exports.docsRouter = express.Router();
docsRouter.route("/")
  .get(serveDocs);
