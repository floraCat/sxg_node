
function toAngular (_Vue,_jsData) {

	// 匹配v-for换成*ngFor
	var reg_vFor = /v-for([\s\S]*?\"[\s\S]*?\")/g;
	var v_for = _Vue.match(reg_vFor);
	var _NG = _Vue.replace(reg_vFor,function () {
		var _arg = arguments;
		var _temp1 = _arg[1].split('"');
		_temp1[1] = 'let ' + _temp1[1].split('in').join('of');
		return ' *ngFor' + _temp1.join('"')
	});

	// 匹配v-text处理
	var reg_vTxt = /(\s+v-text.+?\"(.+?)\")([\s\S]*?>)(<\/)/g;
	_NG = function() {
		return _NG.replace(reg_vTxt,function () {
			let _arg = arguments
			return _arg[3] + "{{" + _arg[2] + "}}" + _arg[4]
		});
	}();

	// 匹配 v-if
	var reg_vIf = /v-if(?=[=])/g;
	_NG = _NG.replace(reg_vIf, "*ngIf");

	// 匹配 事件监听
	var reg_event = /(?<=\s)@(\w+?)(?=[=]\"\w+\([\s\S]*?\)\")/g;
	_NG = _NG.replace(reg_event, "($1)");

	// 匹配冒号处理
	var reg_colon = /\s:([\s\S]*?\"[\s\S]*?\")/g;
	var colon = _NG.match(reg_colon);
	if (colon) {
		for (let x = 0; x < colon.length; x ++) {
			if (colon[x].indexOf('{')<0) {
				var _temp = colon[x].split('"');
				_temp[0] = _temp[0].replace(' :',' ');
				_temp[1] = '{{' + _temp[1] + '}}'
			_NG = _NG.replace(reg_colon,_temp.join('"'))
			}
		}
	}

	return _NG
}

exports = module.exports = toAngular;