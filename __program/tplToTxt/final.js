
var fs = require("fs");
var htmlFormat  = require("./htmlFormat.js");
var jsFormat  = require("./jsFormat.js");
var vueToHtml  = require("./vueToHtml.js");
var scssToCss  = require("./scssToCss.js");
var cssFormat  = require("./cssFormat.js");
var ES6ToJS  = require("./ES6ToJS.js");


// var _url_in = './__test/_tpl2.vue';
// var _url_out = './__test/txt/cat-01-01.txt';

var $$name = 'cat-01-01';
var _url_in = '../../../tpl/src/_vue/m/1/'+$$name+'.vue';
var _url_out = '../../templates/m/1/'+$$name+'.txt';
var _code = fs.readFileSync(_url_in,'utf8');


/*生成 vue*/
var reg_vue = /<template>([\s\S]*?)<\/template>/;
var vue = _code.match(reg_vue)[1].trim();
var vue2 = '<vue>\n'+vue+'\n</vue>\n\n';

/*生成 html & jsData*/
var _obj = vueToHtml(_code);
var html2 = '<html>\n'+htmlFormat(_obj.html)+'\n</html>\n\n';
var jsData2 = '<jsData>\n'+jsFormat(JSON.stringify(_obj.data))+'\n</jsData>\n\n';

/*生成 js & jsMethods & ES6Methods*/
var reg_methods = /methods:.*?({[\s\S]*?)<\/script>/;
var _funs = _code.match(reg_methods)[1].trim();
_funs = _funs.replace(/[\r\n]*/g,'');
_funs = _funs.replace(/\s+/g,' ');
_funs = _funs.substr(1,_funs.length-3);
if (_funs) {
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

var reg_tool = /<dataTool.*>([\s\S]*?)<\/dataTool>/;
var dataTool = _code.match(reg_tool)[1].trim();
var dataTool2 = '<dataTool>\n'+dataTool+'\n</dataTool>\n\n';

var reg_mod = /<dataMod.*>([\s\S]*?)<\/dataMod>/;
var dataMod = _code.match(reg_tool)[1].trim();
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
