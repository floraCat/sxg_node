function strToObj (_str) {
	var _reg = /(\w+?):\s/g;
	_str.replace(_reg,function () {
		var _arg = arguments;
		_str = _str.replace(eval("/(?<![\"])"+_arg[1]+"(?=:)/"),'"'+_arg[1]+'"');
	})
	return _str;
}

// 对象字符串去掉双引号
function objToStr (_obj) {
	var _reg = /(\"\w+?\"):\s/g;
	_obj.replace(_reg,function () {
		var _arg = arguments;
		_obj = _obj.replace(_arg[1],_arg[1].substr(1,_arg[1].length-2));
	})
	return _obj;
}


// 值中的单引号转多引号
function sTd (_str) {
	return _str.replace(/\'/g,'"');
}

// 值中的多引号转单引号
function dTs (_str) {
	return _str.replace(/"/g,"'");
}

var _x = "{t2: {t3: 1111},t4: 'abc'}";
var _x2 = '{"t2": {"t3": 1111},t4: "abc"}';

// objToStr();
var _y = strToObj(_x);
// console.log(_y);

var _y2 = objToStr(_x2);
// console.log(_y2);

// console.log(sTd(strToObj(_x)));
console.log(dTs(objToStr(_x2)));