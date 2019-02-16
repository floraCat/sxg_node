var babel = require("babel-core");

function getES6Data (_Code) {
	var _rs = ''
	// 匹配脚本中的djsData字符串
	if (_Code.indexOf('mounted ()')>=0) {
		var reg_script = /data[\s\S]*?\(\)[\s\S]*?{[\s\S]*?return[\s\S]*?{([\s\S]*)}[\s\S]*?},[\s\S]*?mounted/;
	} else {
		var reg_script = /data[\s\S]*?\(\)[\s\S]*?{[\s\S]*?return[\s\S]*?({[\s\S]*})[\s\S]*?},[\s\S]*?methods:/;
	}
	var _str = _Code.match(reg_script)
	if (_str) {
		_rs = _str[1]
		_rs = _rs.replace(/\'/g,'"');
		_rs = strToObj(_rs);
	} else {
		_rs = ''
	}
	return _rs;
}


function getjsData (_Code) {
	return getES6Data(_Code);
}


function getES6Methods (_Code) {
	var reg_methods = /methods:.*?({[\s\S]*?)<\/script>/;
	var _rs = _Code.match(reg_methods);
	if (_rs) {
		_rs = _rs[1].trim()
		_rs = _rs.replace(/[\r\n]*/g,'');
		_rs = _rs.replace(/\s+/g,' ');
		_rs = _rs.substr(1,_rs.length-4);
		if (_rs.trim()[_rs.trim().length-1] === ',') {
			_rs = _rs.trim().substr(0,_rs.trim().length-1)
		}
	} else {
		_rs = ''
	}	
	return _rs;
}


function getjsMethods (_Code) {	
	var _rs = '';
	var _ES6 = getES6Methods(_Code);
	if (_ES6) {
		_rs = ES6ToJs(_ES6).join('\n');
	}
	return _rs;
}


function getNativeJs(_Code) {
	var _rs = '';
	var _ES6 = getES6Methods(_Code);
	if (_ES6) {
		var _js = ES6ToJs(_ES6);
		var _funs = []
		for (var x = 0; x < _js.length; x ++) {
			_funs.push(_js[x].split(': function')[1]);
		}
		for (let y = 0; y < _funs.length; y ++) {
			_funs[y] = 'function'+_funs[y];
		}
		_rs = _funs.join('\n');
	}
	return _rs;
}

function getAngularJs (_Code) {
	var _jsData = JSON.parse("{"+getjsData(_Code)+"}");
	var _arr = [];
	for (var key in _jsData) {
		_arr.push('const '+key+' = '+JSON.stringify(_jsData[key])+';');
	}
	return _arr.join('\n')
}

/*-------------------------------------------------------------*/

// 转成带双引号的对象字符串
function strToObj (_str) {
	var _reg = /(\w+?):\s/g;
	_str.replace(_reg,function () {
		var _arg = arguments;
		_str = _str.replace(eval("/(?<![\"])"+_arg[1]+"/"),'"'+_arg[1]+'"');
	})
	return _str;
}

// ES6转原生
function ES6ToJs (ES6) {
	var _jsMethods = 'export default {'+ES6+'}';
	var result = babel.transform(_jsMethods, {"presets":["es2015"]});
	var reg_1 = /[\s\S]*?exports.default = {([\s\S]*?)};/
	var _rs = result.code.replace(reg_1,"$1");
	var _arr = _rs.split('},');
	for (var x = 0; x < _arr.length; x ++) {
		if (x < _arr.length-1) {
			_arr[x] = _arr[x] + '}';
		}
	}
	return _arr;
}
/*-------------------------------------------------------------*/

function getScript (_Code) {
	return {
		ES6Data: getES6Data(_Code),
		jsData: getjsData(_Code),
		ES6Methods: getES6Methods(_Code),
		jsMethods: getjsMethods(_Code),
		nativeJs: getNativeJs(_Code),
		angularJs: getAngularJs(_Code),
	}
}


exports = module.exports = getScript;

