var Linter = require("eslint").Linter;
var linter = new Linter();


function jsFormat (_code) {
	return linter.verifyAndFix(_code, {
	    rules: {
	        semi: 2
	    }
	});
}

exports = module.exports = jsFormat;