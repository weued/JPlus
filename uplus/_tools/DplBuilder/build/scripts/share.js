/*
 * This file is created by a tool at 2012/01/12 10:23:42
 */


/************************************
 * UPlus.Form.IFormControl
 ************************************/
var IFormControl = {
		
	setState: function(state, toggle){
		this.toggleClass('b-' + this.xType + '-' + state, this.dom[state] = toggle !== false);
		return this;
	},
	
	getDisabled: function(){
		return this.dom.disabled ;
	},
	
	setDisabled: function(value){ 
		return this.setState('disabled', value);
	},
	
	getReadOnly: function(){
		return this.dom.readOnly ;
	},
	
	setReadOnly: function(value){
		return this.setState('readOnly', value);
	},
	
	setName: function(value){
		this.dom.name = value;
	},
	
	getName: function(){
		return this.dom.name;
	},
	
	getForm: function () {
		return JPlus.$(this.dom.form);
	},
	
	clear: function(){
		this.setText('');
	},
	
	select: function(){
		this.dom.select();
	}
	
};
/************************************
 * UPlus.Form.TextBox
 ************************************/
var TextBox = Control.extend({
	
	xType: 'textbox',
	
	tpl: '<input type="text" class="b-textbox">'
	
}).implement(IFormControl);
