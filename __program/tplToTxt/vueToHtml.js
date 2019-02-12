/*
** vue模板转静态html
注意：
	- index未考虑
	- 模板尽量不用v-show
	- 最后的html导出新html文件
	- 没有v-for的情况
	- 多个v-for的情况
	- data字符串值未考虑
	- ...
*/


function VueToHtml (code) {

	// 匹配脚本中的djsData字符串
	var reg_script = /data[\s\S]*?\(\)[\s\S]*?{[\s\S]*?return[\s\S]*?{([\s\S]*)}[\s\S]*?},[\s\S]*?methods:/;
	var match_script = code.match(reg_script)
	if (match_script) {
		match_script = match_script[1]
	}

	// jsData字符串转对象
	var getjsData = function () {

		// 替换所有数组为'$arr'方便后续判断是数组
		var $arr = '$arr'
		var _reg_arr8 = /\[([\s\S]*?)\]/
		if (match_script.match(_reg_arr8)) {
			var match$arr = match_script.match(_reg_arr8)[1]
			match_script = match_script.replace(_reg_arr8, $arr)
		}
			
		// 再替换所有对象为'$obj'方便后续判断是对象
		var $obj = '$obj'
		var _reg_obj8 = /{([\s\S]*?)}/
		if (match_script.match(_reg_obj8)) {
			var match$obj = match_script.match(_reg_obj8)[1]
			match_script = match_script.replace(_reg_obj8, $obj)
		}
			
		// 加双引号方便转json
		match_script = match_script.replace(/:/g, "\":\"");
		match_script = match_script.replace(/,/g, "\",\"");
		match_script = match_script.replace(/[\s]*/g, "");
		var $$topObj = JSON.parse('{"' + match_script.trim()+ '"}')

		$arr = match$arr && strToArr(match$arr);
		$obj = match$obj && strToObj(match$obj);

		for (var key in $$topObj) {
			if ($$topObj[key]) {
				if ($$topObj[key].trim() === '$arr') {
					$$topObj[key] = $arr;
				} else if ($$topObj[key].trim() === '$obj') {
					$$topObj[key] = $obj;
				}
			}
		}
		return $$topObj
	}
	var $$topObj = getjsData();



	// 匹配v-for整个标签(此处为整个li元素)
	var reg_vFor = /<(\w+)?\s+v-for[\s\S]*?<\/(\1)>/;
	var v_for = code.match(reg_vFor);

	if (v_for) {

		// 匹配v-for的数据名称(此处为cats)
		var reg_data = /\"(\w+)\s+in\s+(\w+)/;
		var item = v_for[0].match(reg_data)[1];
		var data = v_for[0].match(reg_data)[2];
		var dataArr = $$topObj[data];
		var len = dataArr.length;
		var newItem = JSON.parse(JSON.stringify(v_for[0]));

		// 去掉v-for
		var reg_vFor2 = eval("/\\s+v-for[\\s\\S]*?"+data+"\"/");
		var newItem = newItem.replace(reg_vFor2,"");

		// 去掉v-bind:key
		var reg_vKey = eval("/\\s+v-bind:key=\"[\\s\\S]*?\"/g");
		newItem = newItem.replace(reg_vKey,"");

			
		// var _newItem = ''
		var newItems = '';
		for (let x = 0; x < len; x ++) {

			var col = dataArr[x];
			var _newItem = JSON.parse(JSON.stringify(newItem));


			// 处理大括号，如:class={on:col.on,on2:col.on2}
			var reg_obj = /(:class=[\s\S]*?){([\s\S]*?)}/;
			var match_obj = _newItem.match(reg_obj);
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
					_newItem = _newItem.replace(reg_obj, function () {  // -> [col.name,on]
						var _arr = arguments
						return _arr[1] + replace_obj
					});
				}
			}


			// 处理中括号，如:class=[col.name,on]
			var reg_arr = /(:class=[\s\S]*?)\[([\s\S]*?)]/;
			var match_arr = _newItem.match(reg_arr);
			if (match_arr) {
				var replace_arr = match_arr[2].split(',')
				for (var i = 0; i < replace_arr.length; i ++) {
					if (replace_arr[i].indexOf('.') >= 0) {
						replace_arr[i] = eval(replace_arr[i])
					}
				}
				replace_arr = replace_arr.join(' ').trim();
				_newItem = _newItem.replace(reg_arr,function () {
					var _arr = arguments
					return _arr[1] + replace_arr
				});
			}


			// 处理v-if
			var reg_vTxt = /(<(.+?)\s)v-if=\"([\s\S]*?)\"([\s\S]*?>(?:[\s\S]*?\2>)*)/;
			_newItem = function() {
				return _newItem.replace(reg_vTxt,function () {
					var _arg = arguments
					for (var _key in $$topObj) {
						if (_arg[3].indexOf(_key) >= 0) {
							_arg[3] = _arg[3].replace(_key,$$topObj[_key])
						}
					}
					var _rs = ''
					if (eval(eval(_arg[3]))) {
						_rs = _arg[1] + _arg[4]
					}
					return _rs
				});
			}();

			// 匹配事件监听
			var reg_even = /\s@(.+?=\"\w+\()([\s\S]*?)(\)\")/;
			_newItem = function() {
				return _newItem.replace(reg_even,function () {
					var _arg = arguments
					if (typeof eval(_arg[2]) === 'string') {
						_arg[2] = "'" + eval(_arg[2]) + "'";
					}
					return ' on'+_arg[1]+_arg[2]+_arg[3]
				});
			}();

			// console.log(_newItem);return


			//替换item属性值
			var reg_item = eval("/("+item+"\\.)(\\w+[^}\\];,\\s\"])/g");
			_newItem = function() {
				return _newItem.replace(reg_item, function () {
					var _arg = arguments
					return col[_arg[2]].trim()
				})
			}();


			//替换单一变量
			for (let _key in $$topObj) {
				if (_key !== data) {
					var reg_val = eval("/([\s\S]*?)"+_key+"([\s\S]*?)/");
					_newItem = function() {
						return _newItem.replace(reg_val, function () {
							var _arg = arguments
							return _arg[1] + eval($$topObj[_key]) + _arg[2]
						})
					}();
				}
				
			}
			

			// 去掉冒号
			var reg_vBind = /\s+:(.+?\")(.+?)(\")/g;
			_newItem = function() {
				return _newItem.replace(reg_vBind,function () {
					let _arg = arguments
					var _rs = ''
					_rs = ' ' + _arg[1] + _arg[2] + _arg[3]
					return _rs;
				});
			}();


			// 匹配v-text
			var reg_vTxt = /(\s+v-text.+?\"(.+?)\")([\s\S]*?>)(<\/)/g;
			_newItem = function() {
				return _newItem.replace(reg_vTxt,function () {
					let _arg = arguments
					return _arg[3] + _arg[2] + _arg[4]
				});
			}();
			

			newItems += _newItem
		}
	}

	var reg_code = /<template>([\s\S]*?)<\/template>/;
	var vue = code.match(reg_code)[1].trim();
	if (v_for) {
		var newHtml = vue.replace(v_for[0],newItems);
	} else {
		var newHtml = vue;
	}

	return {
		html:newHtml,
		data:$$topObj
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

function strToObj (_str) {
	return _str
}


exports = module.exports = VueToHtml;