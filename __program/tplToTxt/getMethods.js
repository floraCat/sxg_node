var babel = require("babel-core");


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


function getES6(_Code) {
	return getjsMethods(_Code);
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


function getAngularES6Methods (_Code) {
	var _ES6 = getES6Methods(_Code);
	if (_ES6) {
		var _reg = /(?<=\w*?\s*?\([\s\S]*?\))\s(?={)/g;
		_ES6 = _ES6.replace(_reg, ': void ');
	}
	return _ES6;
}


function getAngularJsMethods (_Code) {
	var _js = getES6Methods(_Code);
	if (_js) {
		_js = ES6ToJs(_js);
		var _funs = []
		for (var x = 0; x < _js.length; x ++) {
			_funs.push(_js[x].split(': function')[1]);
		}
		_js = _funs.join('\n');
		var _reg = /(?<=\w*?\s*?\([\s\S]*?\))\s(?={)/g;
		_js = _js.replace(_reg, ': void ');
	}
	return _js;
}


function getReactES6Methods (_Code) {
	return getES6Methods(_Code);
}


function getReactJsMethods (_Code) {
	var _js = getES6Methods(_Code);
	if (_js) {
		_js = ES6ToJs(_js);
		var _funs = []
		for (var x = 0; x < _js.length; x ++) {
			_funs.push(_js[x].split(': function')[1]);
		}
		_js = _funs.join('\n');
	}
	return _js;
}

/*-------------------------------------------------------------*/

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

function getMethods (_Code) {
	return {
		ES6Methods: getES6Methods(_Code),
		jsMethods: getjsMethods(_Code),
		ES6: getES6(_Code),
		nativeJs: getNativeJs(_Code),
		angularJsMethods: getAngularJsMethods(_Code),
		angularES6Methods: getAngularES6Methods(_Code),
		reactJsMethods: getReactJsMethods(_Code),
		reactES6Methods: getReactES6Methods(_Code)
	}
}


exports = module.exports = getMethods;

