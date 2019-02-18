/*
** 提供前端编辑页的模板html和工具html
*/
var fs = require("fs");

// 返回展示模板+编辑工具html
function init (_modeArr,_txt,_el,_oldFile) {
	return {
		tpl: getTpl(_modeArr,_txt,_el,_oldFile),
		tool: getTool(_txt)
	};
}


// 返回修改后的展示模板+编辑工具html
function mod (_modeArr,_txt,_el,_oldFile,_data) {
	for (var i=0; i<_data.length; i++) {
		if (_data[i]) {
			let _clsArr = _data[i].cls;
			for (var j = 0; j < _clsArr.length; j ++) {
				if (_clsArr[j].indexOf('.') >= 0) { _clsArr[j] = _clsArr[j].split('.').join('\\.')};
				var _reg = new RegExp("("+_clsArr[j]+"[\\s\\S]*?"+_data[i].prop+":)[\\s\\S]*?(;)","g");
				var _txt = _txt.replace(_reg,"$1"+_data[i].val+"$2");
			}
		}
	}
	return {
		tpl: getTpl(_modeArr,_txt,_el,_oldFile),
		tool: getTool(_txt)
	};
}


// 获取模板分片代码用于前端复制
function getCopyCode (_modeArr,_txt) {
	let _rs = {};
	for (var i = 0; i < _modeArr.length; i ++) {
		_rs[_modeArr[i]] = _txt.match(eval("/<"+_modeArr[i]+">([\\s\\S]*?)<\\/"+_modeArr[i]+">/"))[1].trim() || '';
	}
	return _rs;
}


// 获取整个模板代码
function getTpl (_modeArr,_txt,_el,_oldFile) {
	let _data = {};
	for (var i = 0; i < _modeArr.length; i ++) {
		_data[_modeArr[i]] = _txt.match(eval("/<"+_modeArr[i]+">([\\s\\S]*?)<\\/"+_modeArr[i]+">/"))[1].trim() || '';
	}
	var _code = {}
	// 把上面匹配的代码放到view里的模板内
	var _view = fs.readFileSync('./tpls/'+_modeArr.join('_')+'.html','utf8');
	for (var j = 0; j < _modeArr.length; j ++) {
		_view = _view.replace(eval("/{{"+_modeArr[j]+"}}/"),_data[_modeArr[j]]);
		_code[_modeArr[j]] = _data[_modeArr[j]]
	}
	if (_modeArr.indexOf('jsData') >= 0) {
		var temp = _el.split('/');
		if (temp[temp.length-1].indexOf('-')>=0) {
		    var _el2 = temp[temp.length-1].split('-')[0];
		} else {
		    var _el2 = temp[temp.length-1].split('.')[0];
		}
		_view = _view.replace(/{{el}}/,_el2);
	}
	var _file = Date.parse(new Date());
	fs.writeFile('./public/html/'+_file+'.html',_view,function(err){
        if (err) {
            console.log(err)
        }
        delFile(_oldFile)
    });
	var $mod = _txt.match(/<dataMod.*>([\s\S]*?)<\/dataMod>/)[1];
	return {
		view: _file,
		code: _code,
		mod: $mod
	};
}


// 获取编辑工具html
function getTool (_txt) {
	var _data = _txt.match(/<dataTool.*>([\s\S]*?)<\/dataTool>/)[1];
	if (_data === '\n\n') {
		console.log('<dataTool>为空');
		return '';
	} else {
		_data = JSON.parse(_data);
		var _tpl = `<div class="myTool" id="myTool">
						<div id="drag"></div>
			            <div id="imgDef">
			                <img src="static/imgs/p-search-010.png" />
			            </div>
			            <ol id="toolOl">
			        	${_data.map( (item,index) => `
							<dl class="${item.tpl}" id="mod0${index+1}">
			                    <dt>
			                        <label>${item.label}：</label>
			                        <div class="ctrl">
			                            <input type="text" v-model="mod[${index}].val" @blur="modHandle(${index})" />
			                        </div>
			                    </dt>
			                    <dd class="line"></dd>
			                </dl>
			        	`)}
			            </ol>
	        		</div>`;
	    return _tpl;
	}
}

// 删除临时文件
function delFile (_file) {
	let $file = './public/html/'+_file+'.html'
	if (fs.existsSync($file)) {
		fs.unlink($file, function(err){
		     if(err){
		          throw err;
		     }
		     console.log('文件:'+_file+'删除成功！');
		})
	}
}


module.exports = {
	getCopyCode: getCopyCode,
	init: init,
	mod : mod,
	delFile: delFile
};