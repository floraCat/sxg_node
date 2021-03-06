
/*

- angular的typeScript
- 转 angular
- 转 react

- 测试import是否能引入外链
- v-for的index未考虑

*/



var fs = require("fs");

var getData  = require("./getData.js");
var getMethods  = require("./getMethods.js");
var getHtml  = require("./getHtml.js");
var getImport  = require("./getImport.js");

var toCss  = require("./toCss.js");

var formatHtml  = require("./formatHtml.js");
var formatJs  = require("./formatJs.js");
var formatCss  = require("./formatCss.js");

var createToTpl = require("./createToTpl.js");


var $name = '';
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
	$name = _file.toString().split('/');
	$name = $name[$name.length-1].split('.')[0];
	console.log($name);
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

/*----------------------------------------------*/

// 单个tpl转txt
function creatOne (_url_in,_url_out) {

	var _code = fs.readFileSync(_url_in,'utf8');

	var _rsObj = {};


	var _objData = getData(_code);
	/*生成 ES6Data*/
	_rsObj.ES6Data = formatJs(_objData.ES6Data);
	/*生成 jsData*/
	_rsObj.jsData = formatJs(_objData.jsData);
	/*生成 angularJsData*/
	var angularJsData = formatJs(_objData.angularJsData);
	/*生成 angularES6Data*/
	var angularES6Data = formatJs(_objData.angularES6Data);
	/*生成 reactJsData*/
	var reactJsData = formatJs(_objData.reactJsData);
	/*生成 reactES6Data*/
	var reactES6Data = formatJs(_objData.reactES6Data);


	var _objMethods = getMethods(_code);
	/*生成 ES6Methods*/
	_rsObj.ES6Methods = formatJs(_objMethods.ES6Methods);
	/*生成 jsMethods*/
	_rsObj.jsMethods = formatJs(_objMethods.jsMethods);
	/*生成 ES6*/
	_rsObj.ES6 = formatJs(_objMethods.ES6);
	/*生成 原生js*/
	_rsObj.js = formatJs(_objMethods.nativeJs);
	/*生成 angularJsMethods*/
	var angularJsMethods = formatJs(_objMethods.angularJsMethods);
	/*生成 angularES6Methods*/
	var angularES6Methods = formatJs(_objMethods.angularES6Methods);
	/*生成 reactJsMethods*/
	var reactJsMethods = formatJs(_objMethods.reactJsMethods);
	/*生成 reactES6Methods*/
	var reactES6Methods = formatJs(_objMethods.reactES6Methods);

	/*生成 angularJs*/
	_rsObj.angularJs = angularJsData+'\n'+angularJsMethods;
	/*生成 angularES6*/
	_rsObj.angularES6 = angularES6Data+'\n'+angularES6Methods;


	/*生成 mounted*/
	var reg_mounted = /mounted \(\) {([\s\S]*?)},/;
	var match_mounted = _code.match(reg_mounted);
	var mounted = ''
	if (match_mounted) {
		mounted = formatJs(_code.match(reg_mounted)[1]);
	}
	_rsObj.mounted = mounted


	/*生成 import*/
	var _objImport = getImport(_code);
	_rsObj.jsImport = _objImport.js
	_rsObj.vueImport = _objImport.vue
	_rsObj.angularImport = _objImport.angular
	_rsObj.reactImport = _objImport.react


	var _jsData = JSON.parse('{'+_objData.jsData+'}');
	var _objHtml = getHtml(_code,_jsData);
	/*生成 vue*/
	_rsObj.vue = _objHtml.vue;
	/*生成 html*/
	_rsObj.html = formatHtml(_objHtml.html);
	/*生成 angular*/
	_rsObj.angular = _objHtml.angular;
	/*生成 reactJS*/
	_rsObj.reactJs = reactJsData+'\n'+_objHtml.react+'\n'+reactJsMethods;
	/*生成 reactES6*/
	_rsObj.reactES6 = reactES6Data+'\n'+_objHtml.react+'\n'+reactES6Methods;
	
	/*生成 scss & less*/
	var reg_scss = /<style.*>([\s\S]*?)<\/style>/;
	var scss = _code.match(reg_scss)[1].trim();
	_rsObj.scss = scss;
	_rsObj.less = scss;

	/*生成 css*/
	var css = toCss(scss);
	_rsObj.css = formatCss(css).trim();

	/*dataTool*/
	var reg_tool = /<dataTool.*>([\s\S]*?)<\/dataTool>/;
	var dataTool = _code.match(reg_tool);
	if (dataTool) {
		dataTool = dataTool[1].trim();
	} else {
		dataTool = ''
	}
	_rsObj.dataTool = dataTool;

	/*dataMod*/
	var reg_mod = /<dataMod.*>([\s\S]*?)<\/dataMod>/;
	var dataMod = _code.match(reg_tool);
	if (dataMod) {
		dataMod = dataMod[1].trim();
	} else {
		dataMod = ''
	}
	_rsObj.dataMod = dataMod;

	// return '---未完---'

	/*最后整合生成*/
	// var _result = 
	// jsData2+ES6Data2+jsMethods2+ES6Methods2+angularJs2+angularES6_2+
	// ES6_2+js2+
	// mounted2+jsImport+vueImport+angularImport+reactImport+
	// html2+vue2+angular2+reactJs2+reactES6_2+
	// scss2+less2+css2+
	// dataTool2+dataMod2;

	var _rsArr = [
		'html',
		'vue',
		'angular',
		'reactJs',
		'reactES6',
		'js',
		'ES6',
		'jsData',
		'ES6Data',
		'jsMethods',
		'ES6Methods',
		'angularJs',
		'angularES6',
		'mounted',
		'jsImport',
		'vueImport',
		'angularImport',
		'css',
		'less',
		'scss',
		'reactImport',
		'dataTool',
		'dataMod'
	];

	let _result = '';
	for (let x = 0; x < _rsArr.length; x ++) {
		_result += '<!--------><'+_rsArr[x]+'>\n'+_rsObj[_rsArr[x]]+'\n</'+_rsArr[x]+'>\n\n';
	}

/******方便测试用*****/
	// var _rsTpl = {};
	// for (let x = 0; x < _rsArr.length; x ++) {
	// 	_rsTpl[_rsArr[x]] = _rsObj[_rsArr[x]];
	// }
	// createToTpl(_rsTpl,$name);
	// return
/******\方便测试用*****/


	fs.writeFile(_url_out,_result,function(err){
		if (err) {
		    console.log(err)
		    return
		}
		console.log('生成 ok')
	});
}
	
