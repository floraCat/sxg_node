var path = require('path');
var fs = require("fs");
var express = require('express');
var app = express();

// app.set('views', path.join(__dirname,'views'));

// json解析中间件 for post
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.set('port', process.env.PORT || 8000);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","content-type");
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    next();
});

// app.all("*", function(req, res, next) {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   next();
// });

var routes = require('./routes')(app);

// app.use(function(req, res) {
//   response.writeHead(404, { "Content-Type": "text/plain" });
//   response.end("404 error!\n");
// });

app.use(express.static(path.join(__dirname,'./')));
app.use(express.static(path.join(__dirname,'statics')));
app.use(express.static(path.join(__dirname,'public')));
app.listen(app.get('port'));