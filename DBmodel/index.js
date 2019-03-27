var MongoClient = require('mongodb').MongoClient;

var $url = 'mongodb://localhost:27017/';
var $db = 'sxg';


function queryHandle ($collection,act,where) {
	if (act === 'list') { return list($collection,where);}
	if (act === 'add') { return add($collection,where);}
	if (act === 'mod') { return mod($collection,where);}
	if (act === 'del') { return del($collection,where);}
}

// 查询
function list($collection,where) {
	return new Promise(resolve => {
		MongoClient.connect($url,{useNewUrlParser:true},function (err,db) {
			if (err) throw err;
			var dbo = db.db($db);
			dbo.collection($collection).find(where).sort({"sort":1}).toArray(function (err,result) {
				if (err) throw err;
				resolve(result);
				db.close();
			});
		});
	});
}

// 添加
function add($collection,obj) {
	return new Promise(resolve => {
		MongoClient.connect($url,{useNewUrlParser:true},function (err,db) {
			if (err) throw err;
			var dbo = db.db($db);
			dbo.collection($collection).insertOne(obj,function (err,result) {
				if (err) throw err;
				resolve(result);
				db.close();
			});
		});
	});
}

// 修改
function mod(req,res) {
	MongoClient.connect($url,{useNewUrlParser:true},function (err,db) {
		if (err) throw err;
		var dbo = db.db($db);
		var whereObj = {name: req.query.name};
		var updateObj = {
			$set: {
				ttl: req.query.ttl
			}
		}
		dbo.collection($collection).updateOne(whereObj,updateObj,function (err,result) {
			if (err) throw err;
			console.log('mod seccess');
			res.send(result);
			db.close();
		});
	});
}

// 删除
function del(req,res) {
	MongoClient.connect($url,{useNewUrlParser:true},function (err,db) {
		if (err) throw err;
		var dbo = db.db($db);
		var whereObj = {name: req.query.name};
		dbo.collection($collection).deleteOne(whereObj,function (err,result) {
			if (err) throw err;
			console.log('del seccess');
			res.send(result);
			db.close();
		});
	});
}

module.exports = queryHandle;