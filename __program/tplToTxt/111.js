function strToObj (_str) {
	_str = _str.replace(/:/g, "\":\"");
	_str = _str.replace(/,/g, "\",\"");
	_str = _str.replace(/[\s]*/g, "");
	_str = _str.replace(/\"{/g, "{\"");
	_str = _str.replace(/{(?=[^\"])/g, "{\"");
	_str = _str.replace(/}/g, "\"}");

	_str = _str.replace(/\"\[/g, "\[\"");
	_str = _str.replace(/\[(?=[^\"])/g, "\[\"");
	_str = _str.replace(/\]/g, "\"\]");

	// _str = '{"' + _str.trim()+ '"}';
	_str = _str.replace(/}\"}/g, "}}");
	_str = _str.replace(/}\"}/g, "}}");
	var _obj = JSON.parse(_str);
	var forObj = function (obj) {
		for (var key in obj) {
			if (typeof obj[key] === 'object') { // 对象
				forObj(obj[key]);
			} else {
				var _match1 = obj[key].match(/\'/);
				var _match2 = obj[key].match(/true/);
				var _match3 = obj[key].match(/false/);
				if (_match1 && _match1[0] === '\'') { // 字符串
					obj[key] = obj[key].replace(/\'/g,"");
				} else if (_match2 && _match2[0] === 'true') {
					obj[key] = true;
				} else if (_match3 && _match3[0] === 'false') {
					obj[key] = false;
				} else { // 数字
					obj[key] = Number(obj[key]);
				}
			}
		}
	}
	forObj(_obj);
	return _obj
}


function strToObj (_obj) {
	var _reg = /(\w+?):/g;
	_obj.replace(_reg,function () {
		var _arg = arguments;
		_obj = _obj.replace(_arg[1],'"'+_arg[1]+'"');
	})
	return JSON.parse(_obj);
}

var _x = '{t2:{t3:1111}}';
var _y = '[{t2:{t3:1111}},222]'
// var _z = [{t2:{t3:1111}},222];
// console.log(JSON.stringify({t2:{t3:1111}}));

console.log(strTo(_y));


