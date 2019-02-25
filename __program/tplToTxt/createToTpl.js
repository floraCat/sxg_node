
var fs = require("fs");

var _url = '../../tpls/angular/';
var _tpl_ts = fs.readFileSync(_url+'tpl.ts','utf8');
var _tpl_html = fs.readFileSync(_url+'tpl.html','utf8');
var _tpl_css = fs.readFileSync(_url+'tpl.css','utf8');

var _url_2 = '../../tpls/react/';
var _tpl_js_2 = fs.readFileSync(_url_2+'tpl.js','utf8');
var _tpl_css_2 = fs.readFileSync(_url_2+'tpl.css','utf8');

function replace (_code, _reObj, _name) {
	var _reg = /(?<=\${{)(.+)(?=}})/g;
	var _match = _code.match(_reg);
	_reObj.name = _name;
	_reObj.name2 = _name.substring(0,1).toUpperCase()+_name.substring(1);
	_match.forEach(function (_item) {
		_code = _code.replace('${{'+_item+'}}', _reObj[_item]);
	});
	return _code;
}


function createToAngular (_reObj, _name) {
	var _code_ts = replace(_tpl_ts, _reObj, _name);
	var _code_html = replace(_tpl_html, _reObj, _name);
	var _code_css = replace(_tpl_css, _reObj, _name);
	var _url_to = '../../../_angular/'+_name;
	if (!fs.existsSync(_url_to)) {
		fs.mkdir(_url_to,function () {});
	}
	fs.writeFile(_url_to+'/'+_name+'.ts',_code_ts,function(err){
		if (err) {
		    console.log(err)
		    return
		}
	});
	fs.writeFile(_url_to+'/'+_name+'.html',_code_html,function(err){
		if (err) {
		    console.log(err)
		    return
		}
	});
	fs.writeFile(_url_to+'/'+_name+'.css',_code_css,function(err){
		if (err) {
		    console.log(err)
		    return
		}
	});
}


function createToReact (_reObj, _name) {
	var _code_js = replace(_tpl_js_2, _reObj, _name);
	var _code_css = replace(_tpl_css_2, _reObj, _name);
	var _url_to = '../../../_react/'+_name;
	if (!fs.existsSync(_url_to)) {
		fs.mkdir(_url_to,function () {});
	}
	fs.writeFile(_url_to+'/'+_name+'.js',_code_js,function(err){
		if (err) {
		    console.log(err)
		    return
		}
	});
	fs.writeFile(_url_to+'/'+_name+'.css',_code_css,function(err){
		if (err) {
		    console.log(err)
		    return
		}
	});
}


function createToTpl (_reObj, _name) {
	createToAngular(_reObj, _name);
	createToReact(_reObj, _name);
}

exports = module.exports = createToTpl;