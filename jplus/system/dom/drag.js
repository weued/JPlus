//===========================================
//  拖动 
//   A: xuld
//===========================================

using("System.Dom.Element");


(function() {
	
	namespace(".DragTarget", Class({
		
		initDrag: function(e){

			// 左键才继续
			if(e.which !== 1 || DragTarget.current)
				return;
			
			var elem = e.srcElement;
			
			DragTarget.current = this;
			
			this.from = new Point(e.pageX, e.pageY);
			this.to = new Point(0, 0);
			this.init(e);
			
			// 设置当前处理  mousemove 的方法。
			// 初始需设置 onDrag
			// 由 onDrag 设置为    onDrag
			DragTarget.handler = onDrag;
			
			// 设置文档  mouseup 和   mousemove
			elem.ownerDocument.on('mouseup', this.stopDrag, this).on('mousemove', this.drag, this);
		},
		
		/**
		 * 处理 mouseup 事件。
		 * @param {Event} e 事件参数。
		 */
		stopDrag: function (e) {
			
			// 左键
			if(e.which !== 1)
				return;
			
			var elem = e.srcElement;
				
			// 检查是否拖动。
			// 有些浏览器效率较低，肯能出现这个函数多次被调用。
			// 为了安全起见，检查 current 变量。
			if (DragTarget.current === this) {
				
				this.onDragEnd(e);
				
				// 改变结束的鼠标类型，一般这个函数将恢复鼠标样式。
				dm.changeType(this, '');
				
				// 删除无用的数据 。
				DragTarget.current = null;
			
			}
			
			elem.ownerDocument.un('mousemove', this.drag).un('mouseup', this.stopDrag);
		},
		
		constructor: function(dom){
			this.dom = dom;
			this.setDraggable();
		},
		
		setDraggable: function(value){
			value = value !== false;
			this.dom[value ? 'on' : 'un']('mousedown', this.initDrag, this).draggable = !value;
		},
		
		onDragStart: function(){
			
			
		},
		
		onDrag: function(){
			
			
		},
		
		onDrop: function(){
			
			
		},
		
		onInvalidDrop: function(){
			
			
		},
		
		onDragEnd: function(){
			
			
		}
		
	}));
	
	/**
	 * Function.empty。
	 * @type Function
	 */
	var empty = Function.empty,
		
		/**
		 * 表示一个拖动元素。
		 * @class Target
		 */
		Target = Class({
			
			/**
			 * 改变当前对象的目标。
			 * @param {Element} elem 元素。
			 */
			change: function(elem) {
				
				var me = this;
				
				me.dom = elem;
				me.from = elem.getOffset();
				me.to = me.from.clone();
				
			},
			
			/**
			 * 计算当前的元素新位置。
			 */
			calculate: function() {
				var me = this;
				
				//当前位置的改变量 和 鼠标的偏移量相同。
				me.to.set(me.from.x + dm.delta.x, me.from.y + dm.delta.y);
			},
			
			/**
			 * 把目标移回开始位置。
			 */
			back: function() {
				this.to = this.from;
				dm.delta.set(0, 0);
				this.move();
			},
			
			/**
			 * 移动到当前的新位置。
			 */
			move: function() {
				this.dom.setOffset(this.to);
			}
			
		}),
		
		/**
		 * @namespace JPlus.DragDrop
		 */
		DragDrop = namespace('.DragDrop', {
			
			/**
			 * 表示一个拖动元素。
			 * @class Target
			 */
			Target: Target,
			
			/**
			 * @type Object
			 */
			options: {
				
				/**
				 * 开始拖动。
				 * @param {Element} current 源。
				 * @param {Event} e 事件。
				 */
				start: function(current, e) {
					
					// 事件目标。
					var c = dm.current, tg = c.target = JPlus.getData(current, 'dragTarget') || current;
					
					e.data = c;
					
					// 如果都正常。
					if(tg.trigger('dragstart', e)) {
						
						c.change(tg.dom || tg);
						
						dm.onBeforeDrag(e);
						
						return true;
					}
					
					return false;
				},
				
				/**
				 * 放开拖动。
				 * @param {Event} e 事件。
				 */
				stop: function(e) {
					e.data = dm.current;
					var result = dm.onAfterDrag(e);
					return dm.current.target.trigger('dragend', e) && result;
				},
				
				/**
				 * 非法停止拖动。
				 * @param {Event} e 事件。
				 */
				prevent: function(e) {
					dm.current.back(); 
					dm.onInvalidDrop(e);
				},
				
				/**
				 * 拖动。
				 * @param {Event} e 事件。
				 */
				drag: function(e) {
					
					var c = e.data = dm.current;
					
					c.calculate();
					
					if(c.target.trigger('drag', e)) {
						
						c.move();
						dm.onDrag(e);
						
					}
						
				}
				
			},
			
			/**
			 * 拖动管理类。
			 * @namespace JPlus.DragDrop.Manager
			 */
			Manager: {
				
				/**
				 * 鼠标开始坐标。
				 * @type Point
				 */
				from: new Point(),
				
				/**
				 * 当前鼠标总变化量。
				 */
				delta: new Point(),
				
				/**
				 * 当前引发拖动事件的对象。
				 * @type Target
				 */
				current: null,
				
				/**
				 * 当前选项。
				 */
				options: null,
				
				/**
				 * 暂停当前正在进行的拖动。
				 * @param {Document} doc 文档。
				 */
				pause: function(doc) {
					doc.un('mousemove', drag).un('mouseup', stopDrag);
				},
				
				/**
				 * 在开始拖动前初始化拖动变量。
				 * @param {Event} e 事件参数。
				 */
				onBeforeDrag: empty,
				
				/**
				 * 在拖动之后的默认处理函数。
				 * @param {Event} e 事件参数。
				 */
				onAfterDrag: Function.returnTrue,
				
				/**
				 * 在鼠标改变位置时，移动被拖动对象的位置。
				 * @param {Event} e 事件参数。
				 */
				onDrag: empty,
				
				/**
				 * 当 drop 事件 return false 执行。
				 * @param {Event} e 事件参数。
				 */
				onInvalidDrop: empty,
				
				/**
				 * 更新当前的鼠标效果。
				 * @param {Document} doc 文档。
				 * @param {Boolean} in 如果 true， 表示设置当前的样式，否则删除当前样式。
				 */
				changeType: function(doc, type) {
					doc.setUnselectable(!!type).setStyle('curosur', type);
				},
			
				/**
				 * 设置某个元素的拖动。
				 * @param {Element} elem 元素。
				 * @param {Object} options 拖动选项。
				 * 提供最底层的拖动事件。
				 * start - 开始拖动
				 * stop - 停止拖动
				 * drag - 拖动。
				 * prevent - 阻止拖动。
				 */
				start: function(elem, options) {
					
					// 保存选项。
					p.setData(elem, 'drag', options);
					
					elem
						.on   ('mousedown', startDrag)
						.draggable = false;  // 使自带的 dragstart 失效。
				},
				
				/**
				 * 设置元素根据句柄拖动。
				 * @param {Element} elem 元素。
				 * @param {Element} handler 句柄。
				 * @param {Object} options 拖动选项。
				 */
				set: function(elem, handler, options) {
					
					if(handler !== false) {
						if (handler && handler.nodeType) {
							JPlus.setData(handler, 'dragTarget', elem);
							JPlus.setData(elem, 'dragHandler', handler);
						} else {
							handler = elem;
						}
						
						Element.setMovable(elem.dom || elem);
						
						dm.start(handler, options || DragDrop.options);
					}else
						dm.stop(elem);
				},
				
				/**
				 * 停止拖动。
				 * @param {Element} handle 拖动句柄。
				 */
				stop: function(handle) {
					(JPlus.getData(handle, 'dragHandler') || handle).un  ('mousedown', startDrag);
				}
			
			}
			
		}),
		
		/**
		 * Manager 简写。
		 * @type JPlus.DragDrop.Manager
		 */
		dm = DragDrop.Manager  ;
	
	
	/// #region 拖动
	
	/**
	 * 处理 mousedown 事件。
	 * @param {Event} e 事件参数。
	 */
	function initDrag(e) {
		
		
	}
	
	/**
	 * 开始准备拖动。
	 * @param {Event} e 事件。
	 * @param {Document} doc 发生事件的文档。
	 */
	function startDrag(e, doc) {
		
		// 载入当前的配置。
		// 刷新当前的拖动对象。 
		// 生成当前处理的数据。
		var currentTarget = DragTarget.current;
		
		// 设置句柄。
		DragTarget.handler = dat.drag;
		
		if (DragTarget.onStartDrag(e, doc) {
			
			dm.changeType(doc, current.getStyle('cursor'));
			DragTarget.handler(e, doc);
		} else {
			
			// 停止。
			DragTarget.current.stop(doc);
			
			// 删除无用的数据 。
			DragTarget.current = null;
		}
	}
	
	/**
	 * 处理 mousemove 事件。
	 * @param {Event} e 事件参数。
	 */
	function drag(e) {

		DragTarget.current.to.x = e.pageX;
		DragTarget.current.to.y = e.pageY;
		
		// 调用函数处理。
		DragTarget.handler(e, this);
	}
	
	/// #endregion
	
	/// #region Element
	
	/**
	 * @class Element
	 */
	Element.implement({
		
		/**
		 * 使当前元素支持拖动。
		 * @param {Element} [handler] 拖动句柄。
		 * @return this
		 */
		setDraggable: function(handler) {
			dm.set(this.dom || this, handler);
			return this;
		}
		
	});
	
	/// #endregion
	
})() ;



