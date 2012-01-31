/**
 * @author  xuld
 */

using("Controls");

var IInputControl = {
	
	setAttr: function (name, value) {
		if(typeof value === 'boolean'){
			this.toggleClass('x-' + this.xType + '-' + name, value);
		}
		return this.base('setAttr');
	},
	
	setDisabled: function (value) {
		return this.setAttr('disabled', value !== false);
	},
	
	getDisabled: function () {
		return this.getAttr('disabled');
	},
	
	setReadOnly: function (value) {
		return this.setAttr('readonly', value !== false);
	},
	
	getReadOnly: function () {
		return this.getAttr('readonly');
	},
	
	setName: function (value) {
		return this.setAttr('name', value);
	},
	
	getName: function () {
		return this.getAttr('name');
	},
	
	getForm: function () {
		return Dom.get(this.dom.form);
	},
	
	clear: function(){
		this.setText('');
	},
	
	select: function(){
		this.dom.select();
	}
	
};