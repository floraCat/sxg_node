var fs = require('fs');


function listImgs(path,req,res) {
	var imgs = [];
	var list = function(_path,_dir) {
		if( fs.existsSync(_path) ) {
	        var files = fs.readdirSync(_path);
	        files.forEach(function(file,index){
	        	if (file.indexOf('DS_Store')<0 && file.indexOf('node_modules')<0 && file.indexOf('8111')<0) {
	        		var curPath = _path + "/" + file;
		            if(fs.statSync(curPath).isDirectory()) {
		                list(curPath,file);
		            } else {
		                imgs.push(_dir+'/'+file)
		            }
	        	}
	        });
	    } else {
	    	alert('没有此路径');
	    }
	}
	list(path,'/');
    res.send(imgs);
}


module.exports = listImgs