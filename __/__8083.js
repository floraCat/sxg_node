var fs = require("fs");
var path = require('path');
const opn = require('opn');
var express = require('express');
var app = express();

app.set('port',8083);


app.get("/getData",function (req,res) {

	var path = './templates/html/';
	var _rs = [];
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
            } else {
                _rs.push(file.split('.')[0])
            }
        });
    }
    res.send(_rs);
});


app.get("/getHtml",function (req,res) {

	var _name = req.query.name;
	var _html = fs.readFileSync('./templates/html/'+_name+'.html','utf8');

	var _script = `<script type="text/javascript" src="https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.min.js"></script>
<script>
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
	    _btn.setAttribute('href', canvas.toDataURL());
	    _btn.setAttribute('download', '${_name}');
	    document.body.appendChild(_btn);
	    setTimeout(function () {
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

app.use(express.static(path.join(__dirname,'./templates/')));

app.listen(app.get('port'));

// opn('http://localhost:8083');