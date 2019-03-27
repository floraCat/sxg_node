var $dbHandle = require('../DBmodel/index.js');


function admin (act,req,res) {
	let _db = req.query.db;
	if (act === 'add') {
		if (_db === 'cats1') {
			let _obj = {
				ttl: req.query.ttl,
				type: req.query.type,
				attr: req.query.attr,
				en: req.query.ttl,
				sort: parseInt(req.query["sort"]),
				summary: ''
			};
			$dbHandle(_db,'add',_obj).then( (_rs) => {
				res.send(_rs);
			});
		}
		if (_db === 'cats2') {
			let _cat1 = req.query.cat1;
			$dbHandle('cats1','list',{en:_cat1}).then( (_rs) => {
				let _obj = {
					cat1: _rs[0]._id,
					ttl: req.query.ttl,
					en: req.query.ttl,
					sort: parseInt(req.query["sort"])
				}
				$dbHandle(_db,'add',_obj).then( (_rs) => {
					res.send(_rs);
				});
			});
		}
		if (_db === 'templates') {
			let _cat2 = req.query.cat2;
			$dbHandle('cats2','list',{en:_cat2}).then( (_rs) => {
				let _obj = {
					ttl: req.query.ttl,
					cat2: _rs[0]._id,
					en: req.query.ttl,
					sort: parseInt(req.query["sort"]),
					keyword: ''
				}
				$dbHandle(_db,'add',_obj).then( (_rs) => {
					res.send(_rs);
				});
			});
		}
	}
}


module.exports = admin