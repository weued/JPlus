



imports("Controls.Button.LinkButton");
using("Controls");


var LinkButton = Control.extend({
	
	tpl: '<a class="x-linkbutton" href="javascript://" target="_blank"></a>',
	
	setHref: function(value){
		return this.setAttr('href', value);
	},
	
	getHref: function(){
		return this.getAttr('href');
	}
	
});