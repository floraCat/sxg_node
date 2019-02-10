
function cssFormat (_style) {
	var reg_1 = /\n\s{2}/g;
	_style = _style.replace(reg_1,"\n    ");

	var reg_2 = /\n\s{6}/g;
	_style = _style.replace(reg_2,"\n    ");

	var reg_3 = /\n\s{4}\./g;
	_style = _style.replace(reg_3,"\n.");

	var reg_4 = /}/g;
	_style = _style.replace(reg_4,"\n}");

	return _style
}

exports = module.exports = cssFormat;