var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const path=require("path");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
const publicdirectory = path.join(__dirname,'./public')
app.use(express.static(publicdirectory));


app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.render("index",{ message_login: ""});
});


var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Server started at: http://localhost:" + String(port) + "/");
});
