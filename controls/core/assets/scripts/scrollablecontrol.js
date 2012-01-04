//===========================================
//   包含含有滚动区域的控件
//===========================================


using("UPlus.Core.ContentControl");

/**
 * 内容显示面板。
 * @class ScrollableControl
 * @extends ContentControl
 * @abstract
 * ScrollableControl 封装了一个 content 和 header 。
 * 
 * content 表示可滚动的一个区域。
 * 
 * <p>
 * 一般地，一个控件由一个 DIV， 封装了很多DIV组成。如:
 * </p>
 * 
 * <code type="html">
 * &lt;div&gt;
 *  &lt;div class="header"&gt;
 *  &lt;/div&gt;
 * 	&lt;div class="body"&gt;
 *  &lt;/div&gt;
 *  &lt;div class="footer"&gt;
 *  &lt;/div&gt;
 * &lt;/div&gt;
 * </code>
 * 
 * <p>
 * 其中， body 为存放子元素的地方。
 * 经常地，需要让 body 内的元素实现 width: 100%;
 * 因为，有必要再设置外容器的宽度时，同时设置 body 的宽度。
 * 但 body 的宽度不等于外容器的宽度 (如外容器有边框时)。
 * 因此这个类封装这个行为。 widthFix 表示 外容器的宽度 和 body  宽度差。
 * </p>
 */
namespace(".ScrollableControl", ContentControl.extend({
	
	/**
	 * 外容器左右边框+边距。
	 * @param {Object} value
	 */
	widthFix: 0,
	
	/**
	 * 外容器上下边框+边距。
	 * @param {Object} value
	 */
	heightFix: 0,
	
	/**
	 * 当前正文。
	 * @param {Object} value
	 */
	header: null,
	
	/**
	 * 设置容器标题。
	 * @param {String} value 值。
	 */
	setTitle: function(value){
		assert(this.header, 'ScrollableControl.prototype.setTitle(value): 目前控件不存在顶部');
		this.header.setHtml(value);
		return this;
	},
	
	/**
	 * 返回容器标题。
	 * @return {String} 值。
	 */
	getTitle: function(){
		assert(this.header, 'ScrollableControl.prototype.getTitle(): 目前控件不存在顶部');
		return this.header.getHtml();
	},
	
	/**
	 * 在 Panel 添加一个功能按钮。
	 * @param {String} name 名字[样式]。
	 * @param {Function} onclick 处理函数。
	 * @param {String} title 鼠标悬浮的标题。
	 * @return {Element} 节点。
	 * @protected
	 */
	addHeaderItem: function(name, onclick, title) {
		assert(this.header, 'ScrollableControl.prototype.addHeaderItem(name, onclick, title): 目前控件不存在顶部');
		title = title || "";
		
		var node = this.header.insert('<a class="x-icon ' + (name || '') + '" href="javascript://' + title + '" title="' + title + '">&nbsp;</a>', "beforeBegin");
		node.onclick = Function.bind(onclick, this);
		return  node;
	},
	
	/**
	 * @protected
	 * @override
	 */
	createIcon: function(){
		assert(this.header, 'ScrollableControl.prototype.createIcon(): 目前控件不存在顶部');
		return  this.header.insert(document.createElement("span"), 'beforeBegin');
	},
	
	_getBorders: function (content, xOrY) {
		return Element.getSizes(content, xOrY, 'bp');
	},
	
	/**
	 * 设置当前元素显示的内容。
	 */
	setContent: function(content){
		
		var cd = content.dom || content, cdd = this.content;
		
		if(cdd) {
				
			cdd = cdd.dom || cdd, p = cdd.parentNode;
			
			assert(cd, "ScrollableControl.prototype.setContent(content): 参数 {content} 必须是 Element。")
			
			this.widthFix -= this._getBorders(cdd, 'x');
			this.heightFix -= this._getBorders(cdd, 'y');
		
			// 删除 content
			p.replaceChild(cd, cdd);
		} else {
			
			//  this.container.appendChild(cd);
			
			
		}
		
		
		// 更新 widthFix / heightFix
		this.widthFix += this._getBorders(cd, 'x');
		this.heightFix += this._getBorders(cd, 'y');
		
		
		// 设置 content
		this.content = content;
		
		// 初始化 width 。
		this.dom.setWidth(content.getWidth() + this.widthFix);
		
				// if (this.header) {
			// var h = this.header.get('parent');
// 		
			// if ('name' in content) 
				// this.setTitle(content.name);
			// else if (!this.header.innerHTML.length) h.hide();
// 			
			// this.heightFix += h.getSize().y;
// 			
		// }
		
		return this;
	},
	
	/**
	 * 切换头部的可视。
	 */
	setHeaderVisible: function(value) {
		var header = this.header.get('parent'),
			currentState = header.isHidden();
			
		value = !!value;
		if(currentState != value){
			currentState = header.getSize().y;
			if (value) {
				header.show();
				this.heightFix += currentState;
			} else {
				this.heightFix -= currentState;
				header.hide();
			}
		}
	},
	
	///**
	// * 在滚动区域的附近增加一个存放内容的节点。
	// */
	//addContent: function (elem, position) {
	//	this.content.insert(elem.dom || elem, position || "beforeBegin");
	//	this.heightFix += elem.getSize().y;
	//},
	
	//removeContent: function (elem) {
	//	this.heightFix -=  elem.getSize().y;
	//	this.content.get('parent').remove(elem.dom || elem);
	//},
		
	setWidth: function(value){
		this.dom.setWidth(value);
		if (this.content) {
			this.content.setWidth(value - this.widthFix);
		}
		this.onResizeX(value);
		return this;
	},
	
	getWidth: function() {
		return this.dom.getWidth();
	},
	
	setHeight: function(value){
		if (this.content) {
			this.content.setHeight(value - this.heightFix);
		}
		this.onResizeY(value);
		return this;
	},
	
	getHeight: function(){
		return this.content.getHeight() + this.heightFix;
	},
	
	/**
	 * 设置 Panel 可拖动。
	 * @method setDraggable
	 * @param {Boolean} enable 如果 true 允许， false 不允许。
	 * @return {Panel} this
	 */
	setDraggable: function(enable) {
		
		if (JPlus.DragDrop) {
		
			JPlus.DragDrop.Manager.set(this, enable === true ? this.header : enable, enable && this.constructor.dragOptions);
			
			this.toggleClass('x-movable', this.draggable = !!enable);
			
		}
		
		return this;
	},
	
	onResizeX: function(value){
		this.trigger('resizex', value);
	},
	
	onResizeY: function(value){
		this.trigger('resizey', value);
	}
	

}) );


/// #if SupportIE6



if(navigator.isQuirks){
	
	ScrollableControl.implement({
		
		getWidthForResizing: function (args) {
			return Math.max(this.header.getSize().x, this.content.offsetWidth + this.widthFix);
		},
		
		setWidth: ContentControl.prototype.setWidth, 
		
		setWidthWithoutResizing: ScrollableControl.prototype.setWidth
		
	});
	
}

/// #endif
