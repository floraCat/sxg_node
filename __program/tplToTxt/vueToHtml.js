/*
** vue模板转静态html
注意：
	- 模板尽量不用v-show
	- ...
*/


function VueToHtml (_Code) {

	// 匹配脚本中的djsData字符串
	var reg_script = /data[\s\S]*?\(\)[\s\S]*?{[\s\S]*?return[\s\S]*?{([\s\S]*)}[\s\S]*?},[\s\S]*?methods:/;
	var match_script = _Code.match(reg_script)
	if (match_script) {
		match_script = match_script[1]
	}
	var dataObj = {};
	if (match_script) {
		dataObj = getjsData();
	}

	// jsData字符串转对象
	function getjsData () {

		// 替换所有数组为'$arr'方便后续判断是数组
		var _reg_arr8 = /\[([\s\S]*?)\]/g
		var _match_arr8 = match_script.match(_reg_arr8)
		var match$arr = []
		if (_match_arr8) {
			for (var x8 = 0; x8 < _match_arr8.length; x8 ++) {
				match$arr.push(_match_arr8[x8])
				match_script = match_script.replace(_match_arr8[x8], '$arr-'+x8)
			}
		}
		// 再替换所有对象为'$obj'方便后续判断是对象
		var _reg_obj8 = /{([\s\S]*?)}/g
		var _match_obj8 = match_script.match(_reg_obj8)
		var match$obj = []
		if (_match_obj8) {
			for (var y8 = 0; y8 < _match_obj8.length; y8 ++) {
				match$obj.push(_match_obj8[y8])
				match_script = match_script.replace(_match_obj8[y8], '$obj-'+y8)
			}
		}
		// 加双引号方便转json
		match_script = match_script.replace(/:/g, "\":\"");
		match_script = match_script.replace(/,/g, "\",\"");
		match_script = match_script.replace(/[\s]*/g, "");
		var dataObj = JSON.parse('{"' + match_script.trim()+ '"}')
		for (var key in dataObj) {
			if (dataObj[key]) { // 值为数组
				if (dataObj[key].indexOf('$arr-') >= 0) {
					var _arr = match$arr[dataObj[key].split('-')[1]].trim();
					dataObj[key] = strToArr(_arr.substr(1,_arr.length-3));
				} else if (dataObj[key].indexOf('$obj-') >= 0) { // 值为对象
					var _obj = match$obj[dataObj[key].split('-')[1]].trim();
					dataObj[key] = strToObj(_obj.substr(1,_obj.length-3));
				} else { // 值为字符串
					dataObj[key] = valAssign(dataObj[key])
				}
			}
		}
		return dataObj
	}


	var reg_code = /<template>([\s\S]*?)<\/template>/;
	_Code = _Code.match(reg_code)[1].trim();

	// 匹配v-for整个标签(此处为整个li元素)
	var reg_vFor = /<(\w+)?\s+v-for[\s\S]*?<\/(\1)>/;
	var v_for = _Code.match(reg_vFor);

	var for_items = '---';
	if (v_for) {

		// 先v-for整标签替换成字符'__vFor'，后面处理完会替换回来
		_Code = function() {
			return _Code.replace(v_for[0],'__vFor');
		}();

		// 匹配v-for的数据名称(如 items)
		var reg_data = /\"(.+)\s+in\s+(\w+)/;
		var for_item = v_for[0].match(reg_data)[1];
		if (for_item.indexOf(',')>=0) {
			for_item = for_item.trim().substr(1,for_item.length-2).split(',')[0]
		}
		for_items = v_for[0].match(reg_data)[2];
		var itemsVal = dataObj[for_items];
		var itemsLen = itemsVal.length;
		var newItem = JSON.parse(JSON.stringify(v_for[0]));

		// 去掉v-for
		var reg_vFor2 = eval("/\\s+v-for[\\s\\S]*?"+for_items+"\"/");
		var newItem = newItem.replace(reg_vFor2,"");

		// 去掉v-bind:key
		var reg_vKey = eval("/\\s+v-bind:key=\"[\\s\\S]*?\"/g");
		newItem = newItem.replace(reg_vKey,"");

		// 遍历v-for替换变量生成多个li
		var newItems = '';
		for (let x = 0; x < itemsLen; x ++) {

			var itemVal = itemsVal[x];
			var _newItem = JSON.parse(JSON.stringify(newItem));

			//替换for_item属性值
			var reg_item = eval("/("+for_item+"\\.)(\\w+[^}\\];,\\s\"])/g");
			_newItem = function() {
				return _newItem.replace(reg_item, function () {
					var _arg = arguments
					return itemVal[_arg[2]].trim()
				})
			}();	

			newItems += _newItem
		}
		_Code = function() {
			return _Code.replace('__vFor', newItems);
		}();
	}


	// 替换变量(对象和字符串)
	var _vals = [];
	for (let _key in dataObj) {
		if (typeof _key !== for_items) {
			// 识别 逗号前 | }右大括号前 | "右双引号前 | 空格前 的变量
			var reg_val = eval("/"+_key+"\.*?\\w*?(?=,)|"+_key+"\.*?\\w*?(?=})|"+_key+"\.*?\\w*?(?=\")|"+_key+"\.*?\\w*?(?=\\s)/g");
			var _match = _Code.match(reg_val);
			if (_match) {
				_match.map(function ($val) {
					var _match2 = $val.match(reg_val);
					if (_match2) {
						_match2.map(function ($val2) {
							_vals.push($val2);
						});
					} else {
						_vals.push($val);
					}
				})
			}
		}
	}
	if (_vals) {
		for (var x = 0; x < _vals.length; x ++) {
			var _dataObj = JSON.parse(JSON.stringify(dataObj));
			if (_vals[x].indexOf('.') >=0) {
				var _arr = _vals[x].split('.');
				for (var y = 0; y < _arr.length; y ++) {
					_dataObj = _dataObj[_arr[y]]
				}
			} else {
				_dataObj = _dataObj[_vals[x]];
			}
			_Code = function() {
				return _Code.replace(eval("/"+_vals[x]+"/"), _dataObj)
			}();
		}
	}

	// 匹配v-text
	var reg_vTxt = /(\s+v-text.+?\"(.+?)\")([\s\S]*?>)(<\/)/g;
	_Code = function() {
		return _Code.replace(reg_vTxt,function () {
			let _arg = arguments
			return _arg[3] + _arg[2] + _arg[4]
		});
	}();

	// 匹配{{ }}
	var reg_vTxt2 = /([\s\S]*?){{([\s\S]*?)}}/;
	_Code = function() {
		return _Code.replace(reg_vTxt2,function () {
			let _arg = arguments
			return _arg[1] + _arg[2]
		});
	}();


	// 处理大括号，如:class={on:col.on,on2:col.on2}
	var reg_obj = /(:class=[\s\S]*?){([\s\S]*?)}/;
	var match_obj = _Code.match(reg_obj);
	if (match_obj) {
		var arr_obj = match_obj[2].split(',')
		var replace_obj = ''
		for (let i = 0; i < arr_obj.length; i ++) {
			replace_obj = arr_obj[i].split(":");
			if (eval(eval(replace_obj[1].trim()))) {
				replace_obj = replace_obj[0].trim()
			} else {
				replace_obj = ''
			}
			_Code = _Code.replace(reg_obj, function () {  // -> [col.name,on]
				var _arr = arguments
				return _arr[1] + replace_obj
			});
		}
	}


	// 处理中括号，如:class=[col.name,on]
	var reg_arr = /(:class=[\s\S]*?)\[([\s\S]*?)]/;
	var match_arr = _Code.match(reg_arr);
	if (match_arr) {
		var replace_arr = match_arr[2].split(',')
		for (var i = 0; i < replace_arr.length; i ++) {
			if (replace_arr[i].indexOf('.') >= 0) {
				replace_arr[i] = eval(replace_arr[i])
			}
		}
		replace_arr = replace_arr.join(' ').trim();
		_Code = _Code.replace(reg_arr,function () {
			var _arr = arguments
			return _arr[1] + replace_arr
		});
	}


	// 处理v-if
	var reg_vIf = /\sv-if=\"([\s\S]*?)\"/g;
	var match_vIf = _Code.match(reg_vIf);
	if (match_vIf && match_vIf.length > 0) {
		var _equals = []
		for (var x = 0; x < match_vIf.length; x ++) {
			var reg_equal = /\"(.+)\s===\s(.+?)\s/;
			var match_equal = match_vIf[x].match(reg_equal);
			if (match_equal) {
				if (match_equal[1].match(/\'/)) {
					if (!match_equal[2].match(/\'/)) {
						var _temp = match_vIf[x].replace(" "+match_equal[2]," '"+match_equal[2]+"'");
						_equals.push(_temp)
					}
				}
			}
		}
	}
	if (_equals && _equals.length > 0) {
		for (var y = 0; y < _equals.length; y ++) {
			var reg_equal2 = /.+\"(.+)\"/;
			var match_equal2 = _equals[y].match(reg_equal2);
			if (match_equal2) {
				if (eval(match_equal2[1])) {
					_Code = _Code.replace(match_vIf[y],"");
				} else {
					var reg_vIf2 = /<(\w+)?\s+v-if[\s\S]*?<\/(\1)>/;
					var match_vIf2 = _Code.match(reg_vIf2);
					if (match_vIf2) {
						_Code = _Code.replace(match_vIf2[0],'');
					}
				}
			}
		}
	}


	// 匹配事件监听
	var reg_event = /\s@(.+?=\"\w+\()([\s\S]*?)(\)\")/;
	_Code = function() {
		return _Code.replace(reg_event,function () {
			var _arg = arguments
			if (typeof eval(_arg[2]) === 'string') {
				_arg[2] = "'" + eval(_arg[2]) + "'";
			}
			return ' on'+_arg[1]+_arg[2]+_arg[3]
		});
	}();


	// 去掉冒号
	var reg_vBind = /\s+:(.+?\")(.+?)(\")/g;
	_Code = function() {
		return _Code.replace(reg_vBind,function () {
			let _arg = arguments
			var _rs = ''
			_rs = ' ' + _arg[1] + _arg[2] + _arg[3]
			return _rs;
		});
	}();



	if (v_for) {
		var newHtml = _Code.replace(v_for[0],newItems);
	} else {
		var newHtml = _Code;
	}

	return {
		html:newHtml,
		data:dataObj
	}

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
	var _obj = {};
	if (_str.trim()[_str.trim().length-1] === ',') {
		_str = _str.trim().substr(-1);
	}
	var _arr = _str.trim().split(',');
	for (var j = 0; j < _arr.length; j ++) {
		var _temp = _arr[j].trim().split(': ')[1].trim();
		var _match1 = _temp.match(/\'/);
		var _match2 = _temp.match(/true/);
		var _match3 = _temp.match(/false/);
		if (_match1 && _match1[0] === '\'') {

			_temp = _temp.replace(/\'/g,"");
		} else if (_match2 && _match2[0] === 'true') {
			_temp = true;
		} else if (_match3 && _match3[0] === 'false') {
			_temp = false;
		} else {
			_temp = Number(_temp);
		}
		_obj[_arr[j].trim().split(': ')[0]] = _temp;
	}
	return _obj
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


exports = module.exports = VueToHtml;