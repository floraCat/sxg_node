
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


	var _objData = getData(_code);
	/*生成 ES6Data*/
	var ES6Data2 = '<!--------><ES6Data>\n'+formatJs(_objData.ES6Data)+'\n</ES6Data>\n\n';
	/*生成 jsData*/
	var jsData2 = '<!--------><jsData>\n'+formatJs(_objData.jsData)+'\n</jsData>\n\n';
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
	var ES6Methods2 = '<!--------><ES6Methods>\n'+formatJs(_objMethods.ES6Methods)+'\n</ES6Methods>\n\n';
	/*生成 jsMethods*/
	var jsMethods2 = '<!--------><jsMethods>\n'+formatJs(_objMethods.jsMethods)+'\n</jsMethods>\n\n';
	/*生成 ES6*/
	var ES6_2 = '<!--------><ES6>\n'+formatJs(_objMethods.ES6)+'\n</ES6>\n\n';
	/*生成 原生js*/
	var js2 = '<!--------><js>\n'+formatJs(_objMethods.nativeJs)+'\n</js>\n\n';
	/*生成 angularJsMethods*/
	var angularJsMethods = formatJs(_objMethods.angularJsMethods);
	/*生成 angularES6Methods*/
	var angularES6Methods = formatJs(_objMethods.angularES6Methods);
	/*生成 reactJsMethods*/
	var reactJsMethods = formatJs(_objMethods.reactJsMethods);
	/*生成 reactES6Methods*/
	var reactES6Methods = formatJs(_objMethods.reactES6Methods);

	/*生成 angularJs*/
	var angularJs2 = '<!--------><angularJs>\n'+angularJsData+'\n'+angularJsMethods+'\n</angularJs>\n\n';
	/*生成 angularES6*/
	var angularES6_2 = '<!--------><angularES6>\n'+angularES6Data+'\n'+angularES6Methods+'\n</angularES6>\n\n';


	/*生成 mounted*/
	var reg_mounted = /mounted \(\) {([\s\S]*?)},/;
	var match_mounted = _code.match(reg_mounted);
	var mounted = ''
	if (match_mounted) {
		mounted = formatJs(_code.match(reg_mounted)[1]);
	}
	var mounted2 = '<!--------><mounted>\n'+mounted+'\n</mounted>\n\n'


	/*生成 import*/
	var _objImport = getImport(_code);
	var jsImport = '<!--------><jsImport>\n'+_objImport.js+'\n</jsImport>\n\n'
	var vueImport = '<!--------><vueImport>\n'+_objImport.vue+'\n</vueImport>\n\n'
	var angularImport = '<!--------><angularImport>\n'+_objImport.angular+'\n</angularImport>\n\n'
	var reactImport = '<!--------><reactImport>\n'+_objImport.react+'\n</reactImport>\n\n'


	var _jsData = JSON.parse('{'+_objData.jsData+'}');
	var _objHtml = getHtml(_code,_jsData);
	/*生成 vue*/
	var vue2 = '<!--------><vue>\n'+_objHtml.vue+'\n</vue>\n\n';
	/*生成 html*/
	var html2 = '<!--------><html>\n'+formatHtml(_objHtml.html)+'\n</html>\n\n';
	/*生成 angular*/
	var angular2 = '<!--------><angular>\n'+_objHtml.angular+'\n</angular>\n\n';
	/*生成 reactJS*/
	var reactJs2 = '<!--------><reactJs>\n'+reactJsData+'\n'+_objHtml.react+'\n'+reactJsMethods+'\n</reactJs>\n\n';
	/*生成 reactES6*/
	var reactES6_2 = '<!--------><reactES6>\n'+reactES6Data+'\n'+_objHtml.react+'\n'+reactES6Methods+'\n</reactES6>\n\n';
	
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
	jsData2+ES6Data2+jsMethods2+ES6Methods2+angularJs2+angularES6_2+
	ES6_2+js2+
	mounted2+jsImport+vueImport+angularImport+reactImport+
	html2+vue2+angular2+reactJs2+reactES6_2+
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
	
