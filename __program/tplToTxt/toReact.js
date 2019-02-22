
function toReact (_Vue,_jsData) {

	var _React = [];

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

	// // 匹配 v-if
	// var reg_vIf = /v-if(?=[=])/g;
	// _NG = _NG.replace(reg_vIf, "*ngIf");

	// // 匹配 事件监听
	// var reg_event = /(?<=\s)@(\w+?)(?=[=]\"\w+\([\s\S]*?\)\")/g;
	// _NG = _NG.replace(reg_event, "($1)");
	
		
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
	if (v_for && v_for.length > 0) {
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
	_React.push('return '+ _Vue);
	return _React.join('\n');
}

exports = module.exports = toReact;