var path = require('path');
var fs = require("fs");
var express = require('express');
var app = express();
var list = require('./controlers/list.js');
var {tplHandle,fileHandle} = require('./controlers/tpl.js');
var copy = require('./controlers/copy.js');
var admin = require('./controlers/admin.js');
var listImgs = require('./__program/imgListToPrint/handle.js');
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
    // listImgs('/Users/fanghua/我的文件/www/移动端-new',req,res);
    listImgs('D:/_phpStudy/WWW/__x/模板收集/移动截图2-10',req,res);
});






app.get("/getData",function (req,res) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");

    // 遍历$path所有txt文件
    var $path = './templates';
    var _rs = [];
    function listTxt(path) {
        var list = function(_path) {
            if( fs.existsSync(_path) ) {
                var files = fs.readdirSync(_path);
                files.forEach(function(file,index){
                    var curPath = _path + "/" + file;
                    if(fs.statSync(curPath).isDirectory()) {
                        list(curPath);
                    } else {
                        console.log(curPath);
                        _rs.push(curPath)
                    }
                });
            } else {
                alert('没有此路径');
            }
        }
        list(path);
    }
    listTxt($path);
    res.send(_rs);
});


app.get("/getHtml",function (req,res) {

    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");

    res.header("Access-Control-Allow-Credentials",true);
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");

    var _name = req.query.name;
    var _code = fs.readFileSync(_name,'utf8');

var temp = _name.split('/');
if (temp[temp.length-1].indexOf('-')>=0) {
    var el = temp[temp.length-1].split('-')[0];
} else {
    var el = temp[temp.length-1].split('.')[0];
}

var reg_css = /<css>([\s\S]*?)<\/css>/;
if (_code.match(reg_css)) {
    var css = _code.match(reg_css)[1].trim();
} else {
    var css = '';
}

var reg_html = /<html>([\s\S]*?)<\/html>/;
if (_code.match(reg_html)) {
    var html = _code.match(reg_html)[1].trim();
} else {
    var html = '';
}

var reg_js = /<js>([\s\S]*?)<\/js>/;
if (_code.match(reg_js)) {
    var js = _code.match(reg_js)[1].trim();
} else {
    var js = '';
}




var _html = `
<html lang="zh-cn">
<head>
<meta charset="utf-8">
<title>效果展示</title>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="http://localhost:8000/style/reset.css" />
<script src="http://localhost:8000/js/rem.js"></script>
<style>
${css}
</style>
</head>

<body>
${html}
</body>

<script>
${js}
</script>

</html>
`

    var _name2 = 'sxg-' + el;
    var _name3 = temp[temp.length-1].split('.')[0];
    console.log(_name3);
    var _script = `<script type="text/javascript" src="https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.min.js"></script>
<script>
    // var imgs = document.getElementsByTagName('img');
    // var len_imgs = imgs.length;
    // console.log('11111---'+len_imgs);
    // for (var x = 0; x < len_imgs; x ++) {
    //     imgs[x].setAttribute("crossOrigin", 'anonymous');
    // }
    var canvas2 = document.createElement("canvas");
    var _canvas = document.querySelector('.${_name2}');
    var w = parseInt(window.getComputedStyle(_canvas).width);
    var h = parseInt(window.getComputedStyle(_canvas).height);
    canvas2.width = w * 1;
    canvas2.height = h * 1;
    canvas2.style.width = w + "px";
    canvas2.style.height = h + "px";
    var context = canvas2.getContext("2d");
    context.fillStyle = '#fff';
    context.fillRect(0,0,canvas2.width,canvas2.height);
    context.scale(1, 1);
    html2canvas(document.querySelector('.${_name2}'), { canvas: canvas2 }).then(function(canvas) {
        var _btn = document.createElement("a");
        _btn.innerHTML='下载';
        _btn.setAttribute('id', 'btn');
        _btn.setAttribute('href', canvas.toDataURL());
        _btn.setAttribute('download', '${_name3}');
        document.body.appendChild(_btn);
        setTimeout(function () {
            // document.getElementById('btn').setAttribute('href', canvas.toDataURL());
            document.getElementById('btn').click();
            setTimeout(function () {
                // window.close();
            }, 500);
        }, 1000);
    });
</script>`;

    var _rs = _html+_script;
    res.send(_rs);
});


app.use(express.static(path.join(__dirname,'./')));
app.use(express.static(path.join(__dirname,'statics')));
app.use(express.static(path.join(__dirname,'public')));
app.listen(app.get('port'));