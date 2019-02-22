var babel = require("babel-core");

function getES6Data (_Code) {
	var _rs = ''
	// 匹配脚本中的djsData字符串
	var reg_script = /data[\s\S]*?\(\)[\s\S]*?return[\s\S]*?{([\s\S]*?)};/
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


function getAngularES6Data (_Code) {
	var _jsData = JSON.parse("{"+getjsData(_Code)+"}");
	var _arr = [];
	for (var key in _jsData) {
		_arr.push(key+' = '+JSON.stringify(_jsData[key])+';');
	}
	return _arr.join('\n')
}


function getAngularJsData (_Code) {
	return getAngularES6Data(_Code);
}


function getReactES6Data (_Code) {
	var _jsData = JSON.parse("{"+getjsData(_Code)+"}");
	var _arr = [];
	for (var key in _jsData) {
		_arr.push('const '+key+' = '+JSON.stringify(_jsData[key])+';');
	}
	return _arr.join('\n')
}


function getReactJsData (_Code) {
	var _jsData = JSON.parse("{"+getjsData(_Code)+"}");
	var _arr = [];
	for (var key in _jsData) {
		_arr.push('var '+key+' = '+JSON.stringify(_jsData[key])+';');
	}
	return _arr.join('\n')
}

/*-------------------------------------------------------------*/

// 转成带双引号的对象字符串
function strToObj (_str) {
	var _reg = /(\w+?):\s/g;
	_str.replace(_reg,function () {
		var _arg = arguments;
		_str = _str.replace(eval("/(?<![\"])"+_arg[1]+"(?=:)/"),'"'+_arg[1]+'"');
	})
	return _str;
}

/*-------------------------------------------------------------*/

function getData (_Code) {
	return {
		ES6Data: getES6Data(_Code),
		jsData: getjsData(_Code),
		angularES6Data: getAngularES6Data(_Code),
		angularJsData: getAngularJsData(_Code),
		reactES6Data: getReactES6Data(_Code),
		reactJsData: getReactJsData(_Code)
	}
}


exports = module.exports = getData;

