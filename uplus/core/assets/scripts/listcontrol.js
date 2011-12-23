//===========================================
//  列表控件   listcontrol.js         A
//===========================================


imports("UPlus.Core.ListControl");
using("UPlus.Core.IContainerControl");



/**
 * 表示所有管理多个有序列的子控件的控件基类。
 * @class ListControl
 * ListControl 封装了使用  <ul> 创建列表控件一系列方法。
 * 子类可以重写 onControlAdded、onControlRemoved、initItem  3　个函数，实现对
 */
namespace(".ListControl", Control.extend(IContainerControl).implement({
	
	create: function(){
		var dom = document.create('div', 'b-' + this.xType);
		dom.appendChild(document.create('ul', 'b-list-container b-' + this.xType + '-container'));
		return dom;
	},
	
	init: function(options){
		this.initChildren('items');
		this.content = this.get('first', 'ul');
	},
	
	onControlAdded: function(childControl, index){
		var li = document.create('li', 'b-list-content b-' + this.xType + '-content');
		index = this.controls[index];
		li.appendChild(childControl.dom || childControl);
		this.content.insertBefore(li, index ? (index.dom || index).parentNode : null);
	},
	
	onControlRemoved: function(childControl, index){
		this.content.removeChild((childControl.dom || childControl).parentNode);
	}
	
}));

