
function toHtml (_Code,_jsData) {

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
		var itemsVal = _jsData[for_items];
		var itemsLen = itemsVal.length;
		var newItem = JSON.parse(JSON.stringify(v_for[0]));

		// 去掉v-for
		var reg_vFor2 = eval("/\\s+v-for[\\s\\S]*?"+for_items+"\"/");
		newItem = newItem.replace(reg_vFor2,"");

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
	for (let _key in _jsData) {
		if (typeof _key !== for_items) {
			// 识别 逗号前 | }右大括号前 | "右双引号前 | 空格前 | @click参数右括号前 的变量
			var reg_val = eval("/"+_key+"\.*?\\w*?(?=,)|"+_key+"\.*?\\w*?(?=})|"+_key+"\.*?\\w*?(?=\")|"+_key+"\.*?\\w*?(?=\\s)|"+_key+"\.*?\\w*?(?=\\))/g");
			var _match = _Code.match(reg_val);
			// console.log(11111);
			// console.log(_match);return
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
			var __jsData = JSON.parse(JSON.stringify(_jsData));
			if (_vals[x].indexOf('.') >=0) {
				var _arr = _vals[x].split('.');
				for (var y = 0; y < _arr.length; y ++) {
					__jsData = __jsData[_arr[y]]
				}
			} else {
				__jsData = __jsData[_vals[x]];
			}
			if (typeof __jsData === 'string') {
				__jsData = "'"+__jsData+"'";
			}
			_Code = function() {
				return _Code.replace(eval("/"+_vals[x]+"/"), __jsData)
			}();
		}
	}


	// 匹配v-text
	var reg_vTxt = /(\s+v-text.+?\"(.+?)\")([\s\S]*?>)(<\/)/g;
	_Code = function() {
		return _Code.replace(reg_vTxt,function () {
			let _arg = arguments
			if (_arg[2][0] === "'") {
				_arg[2] = _arg[2].substr(1,_arg[2].length-2);
			}
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
	var _equals = [];
	_Code.replace(reg_vIf, function () {
		var _arg = arguments;
		// 让等号两边类型同步
		var reg_equal = /\"(.+)\s===\s(.+?)\s/;
		var match_equal = _arg[0].match(reg_equal);
		if (match_equal) {
			if (match_equal[1].match(/\'/)) {
				if (!match_equal[2].match(/\'/)) { // 变量值类型不同于左边，把字符串的引号去掉
					_arg[0] = _arg[0].replace(" "+match_equal[2]," '"+match_equal[2]+"'");
				}
			}
		}
		_equals.push(_arg[0]);
		return _arg[0];
	});
	if (_equals.length > 0) {
		for (var y = 0; y < _equals.length; y ++) {
			var reg_equal2 = /.+\"(.+)\"/;
			var match_equal2 = _equals[y].match(reg_equal2);
			if (match_equal2) {
				if (eval(match_equal2[1])) { // if为正
					_Code = _Code.replace(_equals[y],"");
				} else { // if为负时把整个标签删掉
					var reg_vIf2 = /<(\w+)?\s+v-if[\s\S]*?<\/(\1)>/;
					var _equals2 = _Code.match(reg_vIf2);
					if (_equals2) {
						_Code = _Code.replace(_equals2[0]+'\n','');
					}
				}
			}
		}
	}


	// 匹配事件监听
	var reg_event = /\s@(.+?=\"\w+\()([\s\S]*?)(\)\")/g;
	_Code = function() {
		return _Code.replace(reg_event,function () {
			var _arg = arguments
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
		var _Html = _Code.replace(v_for[0],newItems);
	} else {
		var _Html = _Code;
	}

	return _Html

}

exports = module.exports = toHtml;