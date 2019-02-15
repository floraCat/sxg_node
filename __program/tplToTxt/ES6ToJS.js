var babel = require("babel-core");


// var _code = "export default {test(){var a=111;},test2(){}}"
function ES6ToJS(_code) {
	console.log(_code);return
	if (_code.length > 0) {
		_code = 'export default {'+_code+'}';
		var result = babel.transform(_code, {"presets":["es2015"]});
		var reg_1 = /[\s\S]*?exports.default = {([\s\S]*?)}\n/
		var _rs = result.code.replace(reg_1,"$1");
		return _rs.substr(0,_rs.length-1);
	}
}

exports = module.exports = ES6ToJS;