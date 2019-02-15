

function getES6Data (_Code) {
	return '__getES6Data__'
}


function getjsData (_Code) {
	var _rs = {};
	// 匹配脚本中的djsData字符串
	if (_Code.indexOf('mounted ()')>=0) {
		var reg_script = /data[\s\S]*?\(\)[\s\S]*?{[\s\S]*?return[\s\S]*?{([\s\S]*)}[\s\S]*?},[\s\S]*?mounted/;
	} else {
		var reg_script = /data[\s\S]*?\(\)[\s\S]*?{[\s\S]*?return[\s\S]*?({[\s\S]*})[\s\S]*?},[\s\S]*?methods:/;
	}
	var _str = _Code.match(reg_script)
	if (_str) {
		_str = _str[1]
		_str = _str.replace(/\'/g,'"');
		// console.log(_str); return
		return strToObj(_str);
	}

	// 	console.log(strToObj(_str)); return
	// 	// 替换所有数组为'$arr'方便后续判断是数组
	// 	var _reg_arr8 = /\[([\s\S]*?)\]/g
	// 	var _match_arr8 = _str.match(_reg_arr8)
	// 	var match$arr = []
	// 	if (_match_arr8) {
	// 		for (var x8 = 0; x8 < _match_arr8.length; x8 ++) {
	// 			match$arr.push(_match_arr8[x8])
	// 			_str = _str.replace(_match_arr8[x8], '$arr-'+x8)
	// 		}
	// 	}
	// 	// 再替换所有对象为'$obj'方便后续判断是对象
	// 	var _reg_obj8 = /{([\s\S]*?)},/g
	// 	var match$obj = _str.match(_reg_obj8)
	// 	if (match$obj) {
	// 		for (var y8 = 0; y8 < match$obj.length; y8 ++) {
	// 			_str = _str.replace(match$obj[y8], '$obj-'+y8+',')
	// 		}
	// 	}
	// 	// 加双引号方便转json
	// 	_str = _str.replace(/:/g, "\":\"");
	// 	_str = _str.replace(/,/g, "\",\"");
	// 	_str = _str.replace(/[\s]*/g, "");
	// 	_rs = JSON.parse('{"' + _str.trim()+ '"}')
	// 	for (var key in _rs) {
	// 		if (_rs[key]) { // 值为数组
	// 			if (_rs[key].indexOf('$arr-') >= 0) {
	// 				var _arr = match$arr[_rs[key].split('-')[1]].trim();
	// 				_rs[key] = strToArr(_arr.substr(1,_arr.length-3));
	// 			} else if (_rs[key].indexOf('$obj-') >= 0) { // 值为对象
	// 				var _obj = match$obj[_rs[key].split('-')[1]].trim();
	// 				_rs[key] = strToObj2(_obj.substr(1,_obj.length-3));
	// 			} else { // 值为字符串
	// 				_rs[key] = valAssign(_rs[key])
	// 			}
	// 		}
	// 	}
	// }

	// console.log(_rs);return
	// return _rs;	
}


function getES6Methods (_Code) {
	return '__getES6Methods__'
}


function getjsMethods (_Code) {
	var reg_methods = /methods:.*?({[\s\S]*?)<\/script>/;
	var _funs = _Code.match(reg_methods);
	if (_funs) {
		_funs = _funs[1].trim()
		_funs = _funs.replace(/[\r\n]*/g,'');
		_funs = _funs.replace(/\s+/g,' ');
		_funs = _funs.substr(1,_funs.length-4);
		if (_funs.trim()[_funs.trim().length-1] === ',') {
			_funs = _funs.trim().substr(0,_funs.trim().length-1)
		}
		_funs = _funs.replace(/},/,"},\n");
	} else {
		_funs = ''
	}	
	return _funs;
}


/*-------------------------------------------------------------*/	

// 类数组字符串 转 数组
function strToArr (_str) {
	if (_str.trim()[_str.trim().length-1] != ',') {
		_str = _str.trim() + ','
	}
	var _arr = _str.trim().split('},');
	var _len = _arr.length - 1;
	for (var i = 0; i < _len; i ++) {
		var _arr2 = _arr[i].trim().substr(1,_arr[i].trim().length-1).split(',');
		var _len2 = _arr2.length;
		var _obj = {};
		for (var j = 0; j < _len2; j ++) {
			// 冒号后的空格为防止识别http后的冒号
			var _str = _arr2[j].trim().split(': ')[1].trim().replace(/\'/g,"");
			_obj[_arr2[j].trim().split(': ')[0]] = _str.trim();
		}
		_arr[i] = _obj;
	}
	_arr.pop(); 
	return _arr
}

// 类对象字符串 转 对象
function strToObj (_str) {
	var _reg = /(\w+?):\s/g;
	_str.replace(_reg,function () {
		var _arg = arguments;
		_str = _str.replace(eval("/(?<![\"])"+_arg[1]+"/"),'"'+_arg[1]+'"');
	})
	return JSON.parse(_str);
}


function strToObj2 (_str) {
	// console.log(_str);
	_str = _str.replace(/:/g, "\":\"");
	_str = _str.replace(/,/g, "\",\"");
	_str = _str.replace(/[\s]*/g, "");
	_str = _str.replace(/\"{/g, "{\"");
	_str = _str.replace(/}/g, "\"}");
	_str = '{"' + _str.trim()+ '"}';
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
	// console.log(_obj);
	return _obj



	// var _obj = {};
	// if (_str.trim()[_str.trim().length-1] === ',') {
	// 	_str = _str.trim().substr(-1);
	// }
	// var _arr = _str.trim().split(',');
	// // if (_arr.length >1) {
	// 	for (var j = 0; j < _arr.length; j ++) {
	// 		// console.log(11111);
	// 		// console.log(_arr[j]);
	// 		if (_arr[j].indexOf('{')>=0) {
	// 			var _temp = _arr[j].trim().split(': {')[1].trim();
	// 		} else {
	// 			var _temp = _arr[j].trim().split(': ')[1].trim();
	// 		}
	// 		// console.log(_temp);
	// 		var _match1 = _temp.match(/\'/);
	// 		var _match2 = _temp.match(/true/);
	// 		var _match3 = _temp.match(/false/);
	// 		if (_temp.indexOf('{') >= 0) { // 对象
	// 			// console.log(888888);
	// 			// console.log(_temp);
	// 			// console.log('-------');return
	// 			_temp = strToObj2(_temp);
	// 		} else if (_match1 && _match1[0] === '\'') { // 字符串
	// 			_temp = _temp.replace(/\'/g,"");
	// 		} else if (_match2 && _match2[0] === 'true') {
	// 			_temp = true;
	// 		} else if (_match3 && _match3[0] === 'false') {
	// 			_temp = false;
	// 		} else { // 数字
	// 			_temp = Number(_temp);
	// 		}
	// 		_obj[_arr[j].trim().split(': ')[0]] = _temp;
	// 	}
	// } else {
	// 	console.log(9999999);
	// 	console.log(_str);
	// }
		
}

// 字符串值赋值处理
function valAssign (_str) {
	var _match1 = _str.match(/\'/);
	var _match2 = _str.match(/true/);
	var _match3 = _str.match(/false/);
	if (_match1 && _match1[0] === '\'') {
		_str = _str.replace(/\'/g,"");
	} else if (_match2 && _match2[0] === 'true') {
		_str = true;
	} else if (_match3 && _match3[0] === 'false') {
		_str = false;
	} else {
		_str = Number(_str);
	}
	return _str
}

/*-------------------------------------------------------------*/

function getScript (_Code) {
	return {
		ES6Data:getES6Data(_Code),
		jsData:getjsData(_Code),
		ES6Methods:getES6Methods(_Code),
		jsMethods:getjsMethods(_Code)
	}
}


exports = module.exports = getScript;

