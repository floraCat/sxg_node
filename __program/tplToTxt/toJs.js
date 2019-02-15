var babel = require("babel-core");


// var _code = "export default {test(){var a=111;},test2(){}}"
function getNativeJs(_jsData,_jsMethods) {
	// console.log(_code);return
	if (_jsMethods.length > 0) {
		_jsMethods = 'export default {'+_jsMethods+'}';
		var result = babel.transform(_jsMethods, {"presets":["es2015"]});
		var reg_1 = /[\s\S]*?exports.default = {([\s\S]*?)}\n/
		var _rs = result.code.replace(reg_1,"$1");
		return _rs.substr(0,_rs.length-1);
	}
}

function getAngularJs (_jsData,_jsMethods) {
	var _arr = [];
	for (var key in _jsData) {
		_arr.push('const '+key+' = '+JSON.stringify(_jsData[key])+';');
	}
	return _arr.join('\n')
}

// function getReactJs (_jsData,_jsMethods) {
// 	return '__getReactJs__'
// }

function toJs (_jsData,_jsMethods) {
	return {
		nativeJs:getNativeJs(_jsData,_jsMethods),
		angularJs: getAngularJs(_jsData,_jsMethods),
		// reactJs: getReactJs(_jsData,_jsMethods)
	}
}

exports = module.exports = toJs;