var fs = require("fs");
var path = require('path');
const opn = require('opn');
var proxy = require('html2canvas-proxy');
var express = require('express');
var app = express();

app.use('/', proxy());

app.set('port',8083);


app.get("/getData",function (req,res) {
	//设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");

	var path = '../../templates/m/1/';
	var _rs = [];
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
            } else {
            	if (file.split('.')[1] === 'txt') {
            		_rs.push(file.split('.')[0])
            	}
            }
        });
    }
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
	var path = '../../templates/m/1/';
	var _code = fs.readFileSync(path+_name+'.txt','utf8');

var el = _name.split('-')[0];

var reg_css = /<css>([\s\S]*?)<\/css>/;
var css = _code.match(reg_css)[1].trim();

var reg_html = /<html>([\s\S]*?)<\/html>/;
var html = _code.match(reg_html)[1].trim();

var reg_js = /<js>([\s\S]*?)<\/js>/;
var js = _code.match(reg_js)[1].trim();



var _html = `
<html lang="zh-cn">
<head>
<meta charset="utf-8">
<title>效果展示</title>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="http://localhost:8000/style/reset.css" />
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



	var _name = 'sxg-' + el;
	var _script = `<script type="text/javascript" src="https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.min.js"></script>
<script>
setTimeout(function () {
	var imgs = document.getElementsByTagName('img');
    var len_imgs = imgs.length;
    console.log('11111---'+len_imgs);
    for (var x = 0; x < len_imgs; x ++) {
    	imgs[x].setAttribute("crossOrigin", 'anonymous');
    }
	var canvas2 = document.createElement("canvas");
	var _canvas = document.querySelector('.${_name}');
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
	html2canvas(document.querySelector('.${_name}'), { canvas: canvas2 }).then(function(canvas) {
		var _btn = document.createElement("a");
		_btn.innerHTML='下载';
	    _btn.setAttribute('id', 'btn');
	    // _btn.setAttribute('href', canvas.toDataURL());
	    _btn.setAttribute('download', '${_name}');
	    document.body.appendChild(_btn);
	    setTimeout(function () {
	    	document.getElementById('btn').setAttribute('href', canvas.toDataURL());
	    	document.getElementById('btn').click();
	    	setTimeout(function () {
	    		// window.close();
	    	}, 500);
	    }, 1000);
	});
}, 2000);
	
	</script>`;

	var _rs = _html+_script;
	res.send(_rs);
});

app.use(express.static(path.join(__dirname,'./templates/')));

app.listen(app.get('port'));

// opn('http://localhost:8083');