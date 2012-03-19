//===========================================
//  拖动 
//   A: xuld
//===========================================

using("System.Dom.Element");


	
var Draggable = Class({
	
	initEvent: function (e) {
		e.draggable = this;
		e.dragTarget = this.target;
	},
	
	/**
	 * 触发 dragstart 事件。
	 * @param {Event} e 原生的 mousemove 事件。
	 */
	onDragStart: function(e){
		this.initEvent(e);
		// 如果都正常。
		return this.target.trigger('dragstart', e);
	},
	
	/**
	 * 触发 drag 事件。
	 * @param {Event} e 原生的 mousemove 事件。
	 */
	onDrag: function(e){
		this.initEvent(e);
		this.target.trigger('drag', e);
	},
	
	/**
	 * 触发 dragend 事件。
	 * @param {Event} e 原生的 mouseup 事件。
	 */
	onDragEnd: function(e){
		this.initEvent(e);
		return this.target.trigger('dragend', e);
	},
	
	/**
	 * 处理 mousedown 事件。
	 * 初始化拖动，当单击时，执行这个函数，但不执行 doDragStart。
	 * 只有鼠标移动时才会继续执行doDragStart。
	 * @param {Event} e 事件参数。
	 */
	initDrag: function(e){

		// 左键才继续
		if(e.which !== 1)
			return;
		
		if(Draggable.current) {
			Draggable.current.stopDrag(e);
		}
		
		e.preventDefault();
		
		var me = this;
		
		me.from = new Point(e.pageX, e.pageY);
		me.to = new Point(e.pageX, e.pageY);
		
		// 设置当前处理  mousemove 的方法。
		// 初始需设置 onDrag
		// 由 onDrag 设置为    onDrag
		me.handler = me.startDrag;
		
		me.timer = setTimeout(function(){
			me.startDrag(e);
		}, me.dragDelay);
		
		// 设置文档  mouseup 和   mousemove
		Dom.getDocument(me.handle.dom).on('mouseup', me.stopDrag, me).on('mousemove', me.handleDrag, me);
	
	},
	
	/**
	 * 处理 mousemove 事件。
	 * @param {Event} e 事件参数。
	 */
	handleDrag: function(e){
		
		e.preventDefault();
		
		this.to.x = e.pageX;
		this.to.y = e.pageY;
		
		// 调用函数处理。
		this.handler(e);
	},
	
	/**
	 * 处理 mousedown 或 mousemove 事件。开始准备拖动。
	 * @param {Event} e 事件。
	 * 这个函数调用 onDragStart 和 beforeDrag
	 */
	startDrag: function (e) {
		
		var me = this;
		
		//   清空计时器。
		clearTimeout(me.timer);
		
		Draggable.current = me;
		
		// 设置句柄。
		me.handler = me.drag;
		
		// 开始拖动事件，如果这个事件 return false，  就完全停止拖动。
		if (me.onDragStart(e)) {
			me.beforeDrag(e);
			me.drag(e);
		} else {
			// 停止。
			me.stopDragging();
		}
	},
	
	/**
	 * 处理 mousemove 事件。处理拖动。
	 * @param {Event} e 事件参数。
	 * 这个函数调用 onDrag 和 doDrag
	 */
	drag: function(e){
		this.onDrag(e);
		this.doDrag(e);
	},
	
	/**
	 * 处理 mouseup 事件。
	 * @param {Event} e 事件参数。
	 * 这个函数调用 onDragEnd 和 afterDrag
	 */
	stopDrag: function (e) {
		
		// 只有鼠标左键松开， 才认为是停止拖动。
		if(e.which !== 1)
			return;
		
		e.preventDefault();
		
		// 检查是否拖动。
		// 有些浏览器效率较低，肯能出现这个函数多次被调用。
		// 为了安全起见，检查 current 变量。
		if (Draggable.current === this) {
			
			this.stopDragging();
			
			this.onDragEnd(e);

			// 改变结束的鼠标类型，一般这个函数将恢复鼠标样式。
			this.afterDrag(e);
		
		} else {

			this.stopDragging();
			
		}
	},
	
	beforeDrag: function(e){
		this.offset = this.proxy.getOffset();
		this.cursor = document.getStyle('cursor');
		document.setStyle('cursor', this.target.getStyle('cursor'));
	},
	
	doDrag: function(e){
		var me = this;
		me.proxy.setOffset({
			x: me.offset.x + me.to.x - me.from.x,
			y: me.offset.y + me.to.y - me.from.y
		});
	},
	
	afterDrag: function(){
		document.setStyle('cursor', this.cursor);
		this.offset = this.cursor = null;
	},
	
	dragDelay: 500,
	
	constructor: function(dom, handle){
		this.proxy = this.target = dom;
		this.handle = handle || dom;
		this.setDraggable();
	},

	/**
	 * 停止当前对象的拖动。
	 */
	stopDragging: function(){
		Dom.getDocument(this.handle.dom).un('mousemove', this.handleDrag).un('mouseup', this.stopDrag);
		clearTimeout(this.timer);
		Draggable.current = null;
	},
	
	setDraggable: function(value){
		this.handle[value !== false ? 'on' : 'un']('mousedown', this.initDrag, this);
	}
	
});

/// #endregion

/// #region Element

/**
 * @class Element
 */
Control.implement({
	
	/**
	 * 使当前元素支持拖动。
	 * @param {Element} [handle] 拖动句柄。
	 * @return this
	 */
	setDraggable: function(handle) {
		var draggable = JPlus.getData(this, 'draggable');
		if(handle !== false) {
			if (handle === true) handle = null;
			if(draggable) {
				assert(!handle || draggable.handle.target === handle.target, "Control.prototype.setDraggable(handle): 无法重复设置 {handle}, 如果希望重新设置handle，使用以下代码：dom.setDraggable(false);JPlus.removeData(dom, 'draggable');dom.setDraggable(handle) 。", handle);
				draggable.setDraggable();
			} else  {
				Dom.movable(this.dom);
				draggable = JPlus.setData(this, 'draggable', new Draggable(this, handle));
			}
			
			
		} else if(draggable)
			draggable.setDraggable(false);
		return this;
	}
	
});

/// #endregion
	

