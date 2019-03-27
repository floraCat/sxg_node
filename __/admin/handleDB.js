var MongoClient = require('mongodb').MongoClient;

var $url = 'mongodb://localhost:27017/';
var $db = 'sxg';


function list(collection,where) {
	return new Promise(resolve => {
		MongoClient.connect($url,{useNewUrlParser:true},function (err,db) {
			if (err) throw err;
			var dbo = db.db($db);
			dbo.collection(collection).find(where).toArray(function (err,result) {
				if (err) throw err;
				console.log('list seccess');
				resolve(result);
				db.close();
			});
		});
	});
}

function addField(collection,en) {
	return new Promise(resolve => {
		MongoClient.connect($url,{useNewUrlParser:true},function (err,db) {
			if (err) throw err;
			var dbo = db.db($db);
			var whereObj = {en: en};
			var updateObj = {
				$set: {
					summary: ''
				}
			}
			dbo.collection(collection).updateOne(whereObj,updateObj,function (err,result) {
				if (err) throw err;
				console.log('addField seccess');
				resolve(result);
				db.close();
			});
		});
	});
}

function modField(collection,en) {
	return new Promise(resolve => {
		MongoClient.connect($url,{useNewUrlParser:true},function (err,db) {
			if (err) throw err;
			var dbo = db.db($db);
			dbo.collection(collection).updateOne({en: en},{'$rename':{"cn2":"ttl"}},function (err,result) {
				if (err) throw err;
				console.log('modField seccess');
				resolve(result);
				db.close();
			});
		});
	});
}

function delField(collection,en) {
	return new Promise(resolve => {
		MongoClient.connect($url,{useNewUrlParser:true},function (err,db) {
			if (err) throw err;
			var dbo = db.db($db);
			dbo.collection(collection).updateOne({en: en},{'$unset':{"keyword":""}},function (err,result) {
				if (err) throw err;
				console.log('delField seccess');
				resolve(result);
				db.close();
			});
		});
	});
}

/********************************************************/

list('cats1').then(function (res) {
	for (let i = 0,len=res.length; i < len; i ++) {
		addField('cats1',res[i].en);
	}
});

// list('cats1').then(function (res) {
// 	for (let i = 0,len=res.length; i < len; i ++) {
// 		modField('cats1',res[i].en);
// 	}
// });

// list('cats1').then(function (res) {
// 	for (let i = 0,len=res.length; i < len; i ++) {
// 		delField('cats1',res[i].en);
// 	}
// });