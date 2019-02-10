var $dbHandle = require('../DBmodel/index.js');
var objectId = require('mongodb').ObjectId;

function list(act,req,res) {
	var _query = req.query;
	var _db = _query.db;
	var _where = {};
	if (_db === 'cats1') {
		$dbHandle(_db,'list',_where).then( (_rs) => {
			res.send(_rs);
		});
	}
	if (_db === 'cats2') {
		_where['cat1'] = objectId(_query['cat1']);
		$dbHandle(_db,'list',_where)
		.then( (_rs) => {
			res.send(_rs);
		});
	}
	if (_db === 'templates') {
		_where['cat2'] = objectId(_query['cat2']);
		var _where2 = {};
		_where2['_id'] = objectId(_query['cat2']); 
		Promise.all([$dbHandle(_db,'list',_where), $dbHandle('cats2','list',_where2)])
		.then( (_rs) => {
			var _rs2 = {
				cat2: _rs[1][0],
				templates: _rs[0]
			}
			res.send(_rs2);
		});
	}
}

module.exports = list;