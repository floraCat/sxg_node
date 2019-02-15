
var fs = require("fs");
var htmlFormat  = require("./htmlFormat.js");
var jsFormat  = require("./jsFormat.js");
var vueToHtml  = require("./vueToHtml.js");
var scssToCss  = require("./scssToCss.js");
var cssFormat  = require("./cssFormat.js");
var ES6ToJS  = require("./ES6ToJS.js");


var $path = '../../../tpl/src/_vue';
const argv = process.argv;
var _file = argv[2];

if (_file) {
	// 有多个参数逗号隔开
	if (_file.indexOf(',')>=0) {
		_file = _file.split(',');
		for (var x = 0; x < _file.length; x ++) {
			_file[x] = '/'+ _file[x].replace(/\\/g,'/') + '.vue'
		}
	} else {
		_file = ['/'+ _file.replace(/\\/g,'/') + '.vue']
	}
// 没有参数即全部
} else {
	var _file = listFile($path);
}

for (var i = 0; i < _file.length; i ++) {
	var temp = _file[i].split('/');
	var path2 = _file[i].substr(0,_file[i].length-4);
	var _url_out = '../../txts'+path2+'.txt';
	var _url_in = $path + _file[i];
	console.log('====='+ _file);
	creatOne(_url_in,_url_out)
}

// 遍历path所有文件
function listFile(path) {
	var _rs = [];
    var list = function(_path) {
        if( fs.existsSync(_path) ) {
            var files = fs.readdirSync(_path);
            files.forEach(function(file,index){
            	if (file.indexOf('__')<0) {
            		var curPath = _path + "/" + file;
	                if(fs.statSync(curPath).isDirectory()) {
	                    list(curPath);
	                } else {
	                	var tempPath = curPath.substr(path.length);
	                    _rs.push(tempPath)
	                }
            	}
            });
        } else {
            alert('没有此路径');
        }
    }
    list(path);
    return _rs
}


function creatOne (_url_in,_url_out) {

	var _code = fs.readFileSync(_url_in,'utf8');

	/*生成 vue*/
	var reg_vue = /<template>([\s\S]*?)<\/template>/;
	var vue = _code.match(reg_vue)[1].trim();
	var vue2 = '<vue>\n'+vue+'\n</vue>\n\n';

	/*生成 html & jsData*/
	var _obj = vueToHtml(_code);
	var html2 = '<html>\n'+htmlFormat(_obj.html)+'\n</html>\n\n';
	var jsData2 = '<jsData>\n'+jsFormat(JSON.stringify(_obj.data))+'\n</jsData>\n\n';

	/*生成 jsMethods & ES6Methods*/
	var reg_methods = /methods:.*?({[\s\S]*?)<\/script>/;
	var _funs = _code.match(reg_methods);
	if (_funs) {
		_funs = _funs[1].trim()
		_funs = _funs.replace(/[\r\n]*/g,'');
		_funs = _funs.replace(/\s+/g,' ');
		_funs = _funs.substr(1,_funs.length-4);
		if (_funs.trim()[_funs.trim().length-1] === ',') {
			_funs = _funs.trim().substr(0,_funs.trim().length-1)
		}
		_funs = _funs.replace(/},/,"},\n");
	} else {
		_funs = ''
	}	
	var ES6Methods2 = '<ES6Methods>\n'+_funs+'\n</ES6Methods>\n\n';
	var jsMethods = ES6ToJS(_funs) || '';
	var jsMethods2 = '<jsMethods>\n'+jsMethods.trim()+'\n</jsMethods>\n\n';
	var _funArr = jsMethods.split('},');

	/*生成 js*/
	var js = []
	for (var i = 0; i < _funArr.length; i ++) {
		var _fun = _funArr[i].split(":")
		_fun = _funArr[i].substr(_fun[0].length+1)
		js.push(_fun);
	}
	var js2 = '<js>\n'+js.join('}\n')+'\n</js>\n\n';

	/*生成 scss & less*/
	var reg_scss = /<style.*>([\s\S]*?)<\/style>/;
	var scss = _code.match(reg_scss)[1].trim();
	var scss2 = '<scss>\n'+scss+'\n</scss>\n\n';
	var less2 = '<less>\n'+scss+'\n</less>\n\n';

	/*生成 css*/
	var css = scssToCss(scss);
	var css2 = '<css>\n'+cssFormat(css).trim()+'\n</css>\n\n';

	/*dataTool*/
	var reg_tool = /<dataTool.*>([\s\S]*?)<\/dataTool>/;
	var dataTool = _code.match(reg_tool);
	if (dataTool) {
		dataTool = dataTool[1].trim();
	} else {
		dataTool = ''
	}
	var dataTool2 = '<dataTool>\n'+dataTool+'\n</dataTool>\n\n';

	/*dataMod*/
	var reg_mod = /<dataMod.*>([\s\S]*?)<\/dataMod>/;
	var dataMod = _code.match(reg_tool);
	if (dataMod) {
		dataMod = dataMod[1].trim();
	} else {
		dataMod = ''
	}
	var dataMod2 = '<dataMod>\n'+dataMod+'\n</dataMod>\n\n';

	/*最后整合生成*/
	var _result = html2+vue2+scss2+less2+css2+jsData2+js2+jsMethods2+ES6Methods2+dataTool2+dataMod2;
	fs.writeFile(_url_out,_result,function(err){
	if (err) {
	    console.log(err)
	    return
	}
	console.log('生成 ok')
	});
}
	
