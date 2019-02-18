var fs = require("fs");
var $tpl = require('./programs/tpl_tool.js');


function copy(req,res) {
	var _modeArr = req.query.mode.split('|');
	var _tplArr = req.query.tpl.split('|');
	var _html = fs.readFileSync('./txts/'+_tplArr.join('/')+'.txt','utf8');
	var _rs = $tpl.getCopyCode(_modeArr,_html);
	res.send(_rs);
}

module.exports = copy;