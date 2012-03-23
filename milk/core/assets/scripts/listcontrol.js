/**
 * @author  xuld
 */


imports("Controls.Core.ListControl");
using("Controls.Core.ScrollableControl");



/**
 * 表示所有管理多个有序列的子控件的控件基类。
 * @class ListControl
 * @extends ScrollableControl
 * ListControl 封装了使用  &lt;ul&gt; 创建列表控件一系列方法。
 */
var ListControl = ScrollableControl.extend({
	
	xType: 'listcontrol',
	
	tpl: '<div></div>',
	
	onControlAdded: function(childControl, index){
		var t = childControl;
		if(childControl.dom.tagName !== 'LI') {
			childControl = Dom.create('li', 'x-' + this.xType + '-content');
			childControl.append(t);
		}
		
		index = this.controls[index];
		this.container.insertBefore(childControl, index && index.getParent());
		
		// 更新选中项。
		if(this.baseGetSelected(childControl)){
			this.setSelectedItem(t);
		}
		
	},
	
	onControlRemoved: function(childControl, index){
		var t = childControl;
		if(childControl.dom.tagName !== 'LI'){
			childControl = childControl.getParent();
			childControl.removeChild(t);
		}
		
		this.container.removeChild(childControl);
		
		// 更新选中项。
		if(this.getSelectedItem() == t){
			this.selectedItem = null;
			this.setSelectedIndex(index);
		}
	},
	
	/**
	 * 获取指定子控件的最外层 <li>元素。
	 */
	getContainerOf: function(childControl){
		return childControl.dom.tagName === 'LI' ? childControl : childControl.getParent('li');
	},
	
	/**
	 * 获取包含指定节点的子控件。
	 */
	getItemOf: function(node){
		var me = this.controls, ul = this.container.dom;
		while(node){
			if(node.parentNode === ul){
				for(var i = me.length; i--;){
					if((ul = me[i].dom) && (ul === node || ul.parentNode === node)){
						return me[i];
					}
				}
				break;
			}
			node = node.parentNode;
		}
		
		return null;
	},
	
	init: function(options){
		this.items = this.controls;
		var classNamePreFix = 'x-' + this.xType;
		this.addClass(classNamePreFix);
		
		// 获取容器。
		var container = this.container = this.getFirst('ul');
		if(container) {
			// 已经存在了一个 UL 标签，转换为 items 属性。
			this.controls.addRange(container.query('>li').addClass(classNamePreFix + '-content'));
		} else {
			container = this.container = Dom.create('ul', '');
			this.dom.appendChild(container.dom);
		}
		container.addClass(classNamePreFix + '-container');
	},
	
	// 选择功能
	
	/**
	 * 当前的选中项。
	 */
	selectedItem: null,
	
	/**
	 * 底层获取某项的选中状态。该函数仅仅检查元素的 class。
	 */
	baseGetSelected: function (itemContainerLi) {
		return itemContainerLi.hasClass('x-' + this.xType + '-selected');
	},
	
	/**
	 * 底层设置某项的选中状态。该函数仅仅设置元素的 class。
	 */
	baseSetSelected: function (itemContainerLi, value) {
		itemContainerLi.toggleClass('x-' + this.xType + '-selected', value);
	},
	
	onOverFlowY: function(max){
		this.setHeight(max);
	},
	
	/**
	 * 当选中的项被更新后触发。
	 */
	onChange: function (old, item){
		return this.trigger('change', old);
	},
	
	/**
	 * 当某项被选择时触发。如果返回 false， 则事件会被阻止。
	 */
	onSelect: function (item){
		return this.trigger('select', item);
	},
	
	/**
	 * 获取当前选中项的索引。如果没有向被选中，则返回 -1 。
	 */
	getSelectedIndex: function () {
		return this.controls.indexOf(this.getSelectedItem());
	},
	
	/**
	 * 设置当前选中项的索引。
	 */
	setSelectedIndex: function (value) {
		return this.setSelectedItem(this.controls[value]);
	},
	
	/**
	 * 获取当前选中的项。如果不存在选中的项，则返回 null 。
	 */
	getSelectedItem: function () {
		return this.selectedItem;
	},
	
	/**
	 * 设置某一项为选中状态。对于单选框，该函数会同时清除已有的选择项。
	 */
	setSelectedItem: function(item){
		
		// 先反选当前选择项。
		var old = this.getSelectedItem();
		if(old && (old = this.getContainerOf(old)))
			this.baseSetSelected(old, false);
	
		if(this.onSelect(item)){
		
			// 更新选择项。
			this.selectedItem = item;
			
			if(item != null){
				item = this.getContainerOf(item);
			//	if(!navigator.isQuirks)
			//		item.scrollIntoView();
				this.baseSetSelected(item, true);
				
			}
			
		}
			
		if(old !== item)
			this.onChange(old, item);
			
		return this;
	},
	
	/**
	 * 获取选中项的文本内容。
	 */
	getText: function () {
		var selectedItem = this.getSelectedItem();
		return selectedItem ? selectedItem.getText() : '';
	},
	
	/**
	 * 查找并选中指定文本内容的项。如果没有项的文本和当前项相同，则清空选择状态。
	 */
	setText: function (value) {
		var t = null;
		this.controls.each(function(item){
			if(item.getText() === value){
				t = item;
				return false;
			}
		}, this);
		
		return this.setSelectedItem(t);
	},
	
	/**
	 * 切换某一项的选择状态。
	 */
	toggleItem: function(item){
		
		// 如果当前项已选中，则表示反选当前的项。
		return  this.setSelectedItem(item === this.getSelectedItem() ? null : item);
	},
	
	/**
	 * 确保当前有至少一项被选择。
	 */
	select: function () {
		if(!this.selectedItem) {
			this.setSelectedIndex(0);
		}
		
		return this;
	},
	
	/**
	 * 选择当前选择项的下一项。
	 */
	selectNext: function(up){
		var oldIndex = this.getSelectedIndex(), newIndex, maxIndex = this.controls.length - 1;
		if(oldIndex != -1) {
			newIndex = oldIndex + ( up !== false ? 1 : -1);
			if(newIndex < 0) newIndex = maxIndex;
			else if(newIndex > maxIndex) newIndex = 0;
		} else {
			newIndex = up !== false ? 0 : maxIndex;
		}
		return this.setSelectedIndex(newIndex);
	},
	
	/**
	 * 选择当前选择项的上一项。
	 */
	selectPrevious: function(){
		return this.selectNext(false);
	},
	
	/**
	 * 设置某个事件发生之后，自动选择元素。
	 */
	bindSelector: function(eventName){
		this.on(eventName, function(e){
			var item = this.getItemOf(e.target);
			if(item){
				this.setSelectedItem(item);
			}
		}, this);
		return this;
	}
	
}).addEvents({select:{}, change:{}});


