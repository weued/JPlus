





imports("Controls.Display.ProcessBar");
using("Controls");


var ProcessBar = Control.extend({
	tpl: '<div class="x-processbar">\
		<div class="x-processbar-fore"> \
			<div class="x-processbar-label">&nbsp;</div>\
		</div>\
		<div class="x-processbar-back">&nbsp;</div>\
	</div>',
	
	options: {
		width: 400,
		value: 0
	} ,
	
	init: function(){
		this.content = this.find('.x-processbar-fore');
	},
	
	getText: function () {
		return this.find('.x-processbar-label').getText();
	},
	
	setText: function(text){
		this.find('.x-processbar-label').setText(text);
		this.find('.x-processbar-back').setText(text);
		return this;
	},
	
	getHtml: function () {
		return this.find('.x-processbar-label').getHtml();
	},
	
	setHtml: function(text){
		this.find('.x-processbar-label').setHtml(text);
		this.find('.x-processbar-back').setHtml(text);
		return this;
	},
	
	setWidth: function(value){
		this.base('setWidth');
		this.find('.x-processbar-label').setWidth(value);
		this.find('.x-processbar-back').setWidth(value);
	},
	
	setValue: function(value){
		this.content.dom.style.width = value + '%';
	},
	
	getValue: function(){
		return parseInt(this.content.dom.style.width);
	}
	
});