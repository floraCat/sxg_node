
function toReact (_Vue,_jsData) {

	var _React = [];

	var _vals = [];
	for (var key in _jsData) {
		_vals.push('const '+key+' = '+JSON.stringify(_jsData[key])+';');
	}
	_React.push(_vals.join('\n'));


		// 匹配v-text处理
		var reg_vTxt = /(\s+v-text.+?\"(.+?)\")([\s\S]*?>)(<\/)/g;
		_Vue = function() {
			return _Vue.replace(reg_vTxt,function () {
				let _arg = arguments
				return _arg[3] + "{" + _arg[2] + "}" + _arg[4]
			});
		}();

		// 匹配{{ }}
		var reg_vTxt2 = /{{([\s\S]*?)}}/g;
		_Vue.replace(reg_vTxt2,function () {
			let _arg = arguments
			return _Vue.replace(_arg[0],'{'+_arg[1]+'}')
		});
		
			
		// 匹配冒号处理
		var reg_colon = /\s:([\s\S]*?\"[\s\S]*?\")/g;
		var colon = _Vue.match(reg_colon);
		if (colon) {
			for (let x = 0; x < colon.length; x ++) {
				if (colon[x].indexOf('{')<0) {
					var _temp = colon[x].split('"');
					_temp[0] = _temp[0].replace(' :',' ');
					_temp[1] = '{' + _temp[1] + '}'
				_Vue = _Vue.replace(reg_colon,_temp.join('"'))
				}
			}
		}

		// class换成className
		var reg_class = /\sclass/g;
		_Vue = _Vue.replace(reg_class,' className');

		// 匹配v-for整个标签(此处为整个li元素)
		var reg_vFor = /<(\w+)?\s+v-for[\s\S]*?<\/(\1)>/g;
		var v_for = _Vue.match(reg_vFor);
		if (v_for.length > 0) {
			for (var x = 0; x < v_for.length; x ++) {
				var reg_data = /\"(.+)\s+in\s+(\w+)/;
				var for_item = v_for[x].match(reg_data)[1];
				if (for_item.indexOf(',')>=0) {
					for_item = for_item.trim().substr(1,for_item.length-2).split(',')[0]
				}
				var for_items = v_for[x].match(reg_data)[2];

				// 先v-for整标签替换成字符'_变量名'
				_Vue = function() {
					return _Vue.replace(v_for[x],'{_'+for_items+'}');
				}();


				var _list = JSON.parse(JSON.stringify(v_for[x]));
				var reg_vFor2 = /\sv-for[\s\S]*?\"[\s\S]*?\"/;
				var match_vFor2 = _list.match(reg_vFor2)[0];
				_list = _list.replace(match_vFor2,"");
				var _item2 = match_vFor2.split('"')[2].split(' in ')[0];
				var _rs = 'const '+ for_items+'.map(('+_item2+' =>\n'+_list;
				_React.push(_rs);
			}

		}
// _React.push('return '+ _Vue);
// console.log(_React.join('\n'));
return '__toReact__'


		var itemsVal = _jsData[for_items];
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
		_Vue = function() {
			return _Vue.replace('__vFor', newItems);
		}();



	// 替换变量(对象和字符串)
	var _vals = [];
	for (let _key in _jsData) {
		if (typeof _key !== for_items) {
			// 识别 逗号前 | }右大括号前 | "右双引号前 | 空格前 的变量
			var reg_val = eval("/"+_key+"\.*?\\w*?(?=,)|"+_key+"\.*?\\w*?(?=})|"+_key+"\.*?\\w*?(?=\")|"+_key+"\.*?\\w*?(?=\\s)/g");
			var _match = _Vue.match(reg_val);
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
			_Vue = function() {
				return _Vue.replace(eval("/"+_vals[x]+"/"), __jsData)
			}();
		}
	}

	// 匹配v-text
	var reg_vTxt = /(\s+v-text.+?\"(.+?)\")([\s\S]*?>)(<\/)/g;
	_Vue = function() {
		return _Vue.replace(reg_vTxt,function () {
			let _arg = arguments
			return _arg[3] + _arg[2] + _arg[4]
		});
	}();

	// 匹配{{ }}
	var reg_vTxt2 = /([\s\S]*?){{([\s\S]*?)}}/;
	_Vue = function() {
		return _Vue.replace(reg_vTxt2,function () {
			let _arg = arguments
			return _arg[1] + _arg[2]
		});
	}();


	// 处理大括号，如:class={on:col.on,on2:col.on2}
	var reg_obj = /(:class=[\s\S]*?){([\s\S]*?)}/;
	var match_obj = _Vue.match(reg_obj);
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
			_Vue = _Vue.replace(reg_obj, function () {  // -> [col.name,on]
				var _arr = arguments
				return _arr[1] + replace_obj
			});
		}
	}


	// 处理中括号，如:class=[col.name,on]
	var reg_arr = /(:class=[\s\S]*?)\[([\s\S]*?)]/;
	var match_arr = _Vue.match(reg_arr);
	if (match_arr) {
		var replace_arr = match_arr[2].split(',')
		for (var i = 0; i < replace_arr.length; i ++) {
			if (replace_arr[i].indexOf('.') >= 0) {
				replace_arr[i] = eval(replace_arr[i])
			}
		}
		replace_arr = replace_arr.join(' ').trim();
		_Vue = _Vue.replace(reg_arr,function () {
			var _arr = arguments
			return _arr[1] + replace_arr
		});
	}


	// 处理v-if
	var reg_vIf = /\sv-if=\"([\s\S]*?)\"/g;
	var match_vIf = _Vue.match(reg_vIf);
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
					_Vue = _Vue.replace(match_vIf[y],"");
				} else {
					var reg_vIf2 = /<(\w+)?\s+v-if[\s\S]*?<\/(\1)>/;
					var match_vIf2 = _Vue.match(reg_vIf2);
					if (match_vIf2) {
						_Vue = _Vue.replace(match_vIf2[0],'');
					}
				}
			}
		}
	}


	// 匹配事件监听
	var reg_event = /\s@(.+?=\"\w+\()([\s\S]*?)(\)\")/;
	_Vue = function() {
		return _Vue.replace(reg_event,function () {
			var _arg = arguments
			if (typeof eval(_arg[2]) === 'string') {
				_arg[2] = "'" + eval(_arg[2]) + "'";
			}
			return ' on'+_arg[1]+_arg[2]+_arg[3]
		});
	}();


	// 去掉冒号
	var reg_vBind = /\s+:(.+?\")(.+?)(\")/g;
	_Vue = function() {
		return _Vue.replace(reg_vBind,function () {
			let _arg = arguments
			var _rs = ''
			_rs = ' ' + _arg[1] + _arg[2] + _arg[3]
			return _rs;
		});
	}();



	if (v_for) {
		var _Html = _Vue.replace(v_for[0],newItems);
	} else {
		var _Html = _Vue;
	}

	return _Html

}

exports = module.exports = toReact;