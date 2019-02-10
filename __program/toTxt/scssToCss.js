var sass = require('node-sass');


// sass.render({
//   file: './nav2.scss'
// }, function(err, result) { 
// 	console.log(44444444)
// 	console.log(result.css.toString())
// });

/*----------*/

function scssToCss (_scss) {
	var result = sass.renderSync({
	  data: _scss
	})
	return result.css.toString()
}


exports = module.exports = scssToCss;