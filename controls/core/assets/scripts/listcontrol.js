//===========================================
//  列表控件   listcontrol.js         A
//===========================================


imports("Controls.Core.ListControl");
using("Controls.Core.IContainerControl");



/**
 * 表示所有管理多个有序列的子控件的控件基类。
 * @class ListControl
 * ListControl 封装了使用  &lt;ul&gt; 创建列表控件一系列方法。
 * 子类可以重写 onControlAdded、onControlRemoved、initItem  3　个函数，实现对
 */
var ListControl = Control.extend(IContainerControl).implement({
	
	create: function(){
		var dom = Dom.create('div', 'x-' + this.xType);
		dom.append(Dom.create('ul', 'x-list-container x-' + this.xType + '-container'));
		return dom.dom;
	},
	
	init: function(options){
		this.initChildren('items');
		this.container = this.getFirst('ul');
	},
	
	onControlAdded: function(childControl, index){
		var li = Dom.create('li', 'x-list-content x-' + this.xType + '-content');
		li.append(childControl);
		index = this.controls[index];
		this.container.insertBefore(li, index ? index.getParent() : null);
	},
	
	onControlRemoved: function(childControl, index){
		this.container.removeChild(childControl.getParent());
	},
	
	setActived: function(index, value){
		this.controls[index].getParent('li').toggleClass('x-' + this.xType + '-actived', value);
	}
	
});

