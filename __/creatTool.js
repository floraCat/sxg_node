/*
** 创建编辑工具（用于前端编辑页）
*/

var fs = require("fs");

function getData () {
	var _html = fs.readFileSync('../templates/test.html','utf8');
	var _data = _html.match(/<data.*>([\s\S]*?)<\/data>/)[1];
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
                        <input type="text" v-model="mod[${index}] && mod[${index}].val" @blur="modHandle(${index})" />
                    </div>
                </dt>
                <dd class="line"></dd>
            </dl>
    	`).join('')}
        </ol>
	</div>`;

    var _style = '';
    _data.map((item,index) => {
    	var _temp = '';
    	if (item.tpl === 'toolTop') {
    		_temp = `#mod0${index+1} { top: ${item.TorB}; left: ${item.left};}`;
    		_temp += ` #mod0${index+1} dd { height: ${item.lineHeight};}`
    	}
    	if (item.tpl === 'toolBtm') {
    		_temp = `#mod0${index+1} { bottom: ${item.TorB}; left: ${item.left};}`;
    		_temp += ` #mod0${index+1} dd { height: ${item.lineHeight};}`
    	}
    	if (item.tpl === 'toolRt') {
    		_temp = `#mod0${index+1} { left: ${item.left};}`;
    		_temp += ` #mod0${index+1} dd { width: ${item.lineHeight};}`
    	}
    	_style += _temp+' '
    })

    var _template = `<template>
    ${_tpl}
</template>

<script>
import $axios from 'axios';

export default {
    data () {
        return {}
    },
    props: ['mod','modCur'],
    methods: {
        modHandle (index) {
            let self = this;
            if (this.mod[index].val != this.modCur[index].val) {
                $axios({
                    url: 'http://localhost:8000/apiGet2?mod='+JSON.stringify(self.mod),
                    method: 'GET'
                }).then((res) => {
                    console.log('修改');
                    self.$emit('reprint',res.data.html);
                });
            }
        },
    }
}
</script>

<style>
${_style}
</style>
    `;

    fs.writeFile("../templates/test_comp.html",_template,function(err){
        if (err) {
            console.log(err)
        }
        console.log('生成文件 ok')
    });
}

getData();
