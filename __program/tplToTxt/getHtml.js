/*
** vue模板转静态html
注意：
	- index未考虑
	- 模板尽量不用v-show
	- 多个v-for的情况
	- jsData 对象多层嵌套的情况
	- jsData匹配有问题
	- jsMouted的情况没考虑
	- jsMethods还有问题
	- ...
*/

var toHtml  = require("./toHtml.js");
var toAngular  = require("./toAngular.js");
var toReact  = require("./toReact.js");

function getHtml (_Code,_jsData) {

	// 获取vue代码
	var reg_code = /<template>([\s\S]*?)<\/template>/;
	var _vue = _Code.match(reg_code)[1].trim();

	// vue转html
	var _Html = toHtml(_vue, _jsData);
	// vue转angular
	var _Angular = toAngular(_vue, _jsData);
	// vue转react
	var _React = toReact(_vue, _jsData);

	return {
		vue: _vue,
		html:_Html,
		angular:_Angular,
		react:_React
	}

}

exports = module.exports = getHtml;