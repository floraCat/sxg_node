
function getImportJs (_Code) {
	var _rs = [];
	var _reg = /import[\s\S]*?\'([\s\S]*?)\'[\s\S]*?;/g;
	_Code.replace(_reg,function () {
		var _arg = arguments;
		var _x = _arg[1];
		if (_x.indexOf('.css')>=0) {
			_rs.push('<link rel="stylesheet" href="'+_x+'" />');
		} else {
			_rs.push('<script src="'+_x+'"></script>');
		}
	});
	return _rs.join('\n');
}

function getImportVue (_Code) {
	var _reg = /import[\s\S]*?;/g;
	var _rs = _Code.match(_reg);
	return _rs.join('\n');
}

function getImportAngular (_Code) {
	return getImportVue(_Code);
}

function getImportReact (_Code) {
	return getImportVue(_Code);
}


/*-------------------------------------------------------------*/

function getImport (_Code) {
	return {
		js: getImportJs(_Code),
		vue: getImportVue(_Code),
		angular: getImportAngular(_Code),
		react: getImportReact(_Code)
	}
}


exports = module.exports = getImport;

