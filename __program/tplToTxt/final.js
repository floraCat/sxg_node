
/*

- angular的typeScript
- 转 angular
- 转 react

- txt里的对象去掉双引号
- 测试import是否能引入外链

*/



var fs = require("fs");

var getScript  = require("./getScript.js");
var getHtml  = require("./getHtml.js");
var getImport  = require("./getImport.js");

var formatHtml  = require("./formatHtml.js");
var formatJs  = require("./formatJs.js");
var formatCss  = require("./formatCss.js");

var toCss  = require("./toCss.js");



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

/*----------------------------------------------*/

// 单个tpl转txt
function creatOne (_url_in,_url_out) {

	var _code = fs.readFileSync(_url_in,'utf8');

	var _objJs = getScript(_code);
	/*生成 jsData*/
	var ES6Data2 = '<!--------><ES6Data>\n'+formatJs(_objJs.ES6Data)+'\n</ES6Data>\n\n';
	/*生成 jsData*/
	var jsData2 = '<!--------><jsData>\n'+formatJs(_objJs.jsData)+'\n</jsData>\n\n';
	/*生成 jsData*/
	var ES6Methods2 = '<!--------><ES6Methods>\n'+formatJs(_objJs.ES6Methods)+'\n</ES6Methods>\n\n';
	/*生成 jsData*/
	var jsMethods2 = '<!--------><jsMethods>\n'+formatJs(_objJs.jsMethods)+'\n</jsMethods>\n\n';
	/*生成 原生js*/
	var js2 = '<!--------><js>\n'+formatJs(_objJs.nativeJs)+'\n</js>\n\n';
	/*生成 angular的js*/
	var angularJs2 = '<!--------><angularJs>\n'+formatJs(_objJs.angularJs)+'\n</angularJs>\n\n';


	/*生成 mounted*/
	var reg_mounted = /mounted \(\) {([\s\S]*?)},/;
	var match_mounted = _code.match(reg_mounted);
	var mounted = ''
	if (match_mounted) {
		mounted = formatJs(_code.match(reg_mounted)[1]);
	}
	var mounted2 = '<!--------><mounted>\n'+mounted+'\n</mounted>\n\n'


	// 插件调用
	var _objImport = getImport(_code);
	var jsImport = '<!--------><jsImport>\n'+_objImport.js+'\n</jsImport>\n\n'
	var vueImport = '<!--------><vueImport>\n'+_objImport.vue+'\n</vueImport>\n\n'
	var angularImport = '<!--------><angularImport>\n'+_objImport.angular+'\n</angularImport>\n\n'
	var reactImport = '<!--------><reactImport>\n'+_objImport.react+'\n</reactImport>\n\n'


	var _jsData = JSON.parse('{'+_objJs.jsData+'}');
	var _objHtml = getHtml(_code,_jsData);
	/*生成 vue*/
	var vue2 = '<!--------><vue>\n'+_objHtml.vue+'\n</vue>\n\n';
	/*生成 html*/
	var html2 = '<!--------><html>\n'+formatHtml(_objHtml.html)+'\n</html>\n\n';
	/*生成 html*/
	var angular2 = '<!--------><angular>\n'+_objHtml.angular+'\n</angular>\n\n';
	/*生成 html*/
	var react2 = '<!--------><react>\n'+_objHtml.react+'\n</react>\n\n';
	
	/*生成 scss & less*/
	var reg_scss = /<style.*>([\s\S]*?)<\/style>/;
	var scss = _code.match(reg_scss)[1].trim();
	var scss2 = '<!--------><scss>\n'+scss+'\n</scss>\n\n';
	var less2 = '<!--------><less>\n'+scss+'\n</less>\n\n';

	/*生成 css*/
	var css = toCss(scss);
	var css2 = '<!--------><css>\n'+formatCss(css).trim()+'\n</css>\n\n';

	/*dataTool*/
	var reg_tool = /<dataTool.*>([\s\S]*?)<\/dataTool>/;
	var dataTool = _code.match(reg_tool);
	if (dataTool) {
		dataTool = dataTool[1].trim();
	} else {
		dataTool = ''
	}
	var dataTool2 = '<!--------><dataTool>\n'+dataTool+'\n</dataTool>\n\n';

	/*dataMod*/
	var reg_mod = /<dataMod.*>([\s\S]*?)<\/dataMod>/;
	var dataMod = _code.match(reg_tool);
	if (dataMod) {
		dataMod = dataMod[1].trim();
	} else {
		dataMod = ''
	}
	var dataMod2 = '<!--------><dataMod>\n'+dataMod+'\n</dataMod>\n\n';

	// return '---未完---'

	/*最后整合生成*/
	var _result = 
	jsData2+ES6Data2+js2+jsMethods2+ES6Methods2+angularJs2+
	mounted2+jsImport+vueImport+angularImport+reactImport+
	html2+vue2+angular2+react2+
	scss2+less2+css2+
	dataTool2+dataMod2;
	fs.writeFile(_url_out,_result,function(err){
	if (err) {
	    console.log(err)
	    return
	}
	console.log('生成 ok')
	});
}
	
