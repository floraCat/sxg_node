var path = require('path');
var express = require('express');
var app = express();
var list = require('./controlers/list.js');
var {tplHandle,fileHandle} = require('./controlers/tpl.js');
var copy = require('./controlers/copy.js');
var admin = require('./controlers/admin.js');
var listImgs = require('./__/imgListToPrint/handle.js');
// var dbHandle = require('./dbHandle.js');

// json解析中间件 for post
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.set('port',8000);
// app.set('views', path.join(__dirname,'views'));

app.get('/', function(req, res) {
   res.send('Hello World22');
});


// 模板编辑
app.get('/tpl',function (req,res) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    tplHandle('tpl',req,res);
});

// 删除临时模板文件
app.post('/delFile',function (req,res) {
	//设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
	fileHandle(req,res);
});


// 列表
app.get('/list',function (req,res) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    list('list',req,res);
});

// 代码复制
app.get('/copy',function (req,res) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    copy(req,res);
});



// 后台操作
app.get('/add',function (req,res) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    // console.log(req.query);
    admin('add',req,res);
});


// 缩略图列表打印
app.get('/print',function (req,res) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    // console.log(req.query);
    listImgs('/Users/fanghua/我的文件/www/移动端-new',req,res);
});




app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'statics')));
app.listen(app.get('port'));