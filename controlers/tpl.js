var fs = require("fs");
var $tpl = require('./programs/tpl_tool.js');


function tplHandle(act,req,res) {
	var _act = req.query.act;
	var _modeArr = req.query.mode.split('|');
	var _tplArr = req.query.tpl.split('|');
	var _txt = fs.readFileSync('./templates/'+_tplArr.join('/')+'.txt','utf8');
	var _el = _tplArr[2];
	var _oldFile = req.query.file
	if (_act === 'init') {
		var _rs = $tpl.init(_modeArr,_txt,_el,_oldFile);
		res.send(_rs);
	}
	if (_act === 'mod') {
		var _data = JSON.parse(req.query.data)
		var _rs = $tpl.mod(_modeArr,_txt,_el,_oldFile,_data);
		res.send(_rs);
	}
}

function fileHandle (req,res) {
	var _file = req.query.file;
	var _rs = $tpl.delFile(_file);
	res.send(_rs);
}


module.exports = {
	tplHandle:tplHandle,
	fileHandle:fileHandle
};