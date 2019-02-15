
function toAngular (_Vue,_jsData) {

	// 匹配v-for换成*ngFor
	var reg_vFor = /v-for([\s\S]*?\"[\s\S]*?\")/g;
	var v_for = _Vue.match(reg_vFor);
	var _Vue = _Vue.replace(reg_vFor,function () {
		var _arg = arguments;
		var _temp1 = _arg[1].split('"');
		_temp1[1] = 'let ' + _temp1[1].split('in').join('of');
		return ' *ngFor' + _temp1.join('"')
	});

	// 匹配v-text处理
	var reg_vTxt = /(\s+v-text.+?\"(.+?)\")([\s\S]*?>)(<\/)/g;
	_Vue = function() {
		return _Vue.replace(reg_vTxt,function () {
			let _arg = arguments
			return _arg[3] + "{{" + _arg[2] + "}}" + _arg[4]
		});
	}();

	// 匹配冒号处理
	var reg_colon = /\s:([\s\S]*?\"[\s\S]*?\")/g;
	var colon = _Vue.match(reg_colon);
	if (colon) {
		for (let x = 0; x < colon.length; x ++) {
			if (colon[x].indexOf('{')<0) {
				var _temp = colon[x].split('"');
				_temp[0] = _temp[0].replace(' :',' ');
				_temp[1] = '{{' + _temp[1] + '}}'
			_Vue = _Vue.replace(reg_colon,_temp.join('"'))
			}
		}
	}

return '__toAngular__'

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


	return _Vue

}

exports = module.exports = toAngular;