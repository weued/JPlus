//===========================================
//  拖放         A
//===========================================





using("System.Dom.Drag");


(function(p){
	
	/**
	 * 全部的区。
	 */
	var zones = [],
	
		/**
		 * Py.DragDrop 简写。
		 */
		dd = Py.DragDrop,
		
		/**
		 * Manager 简写。
		 * @type Py.DragDrop.Manager
		 */
		dm = dd.Manager,
		
		/**
		 * @type Object
		 */
		options = {
			
			/**
			 * 触发拖动事件。
			 * @param {Element} tg 目标。
			 * @param {String} type 类型。
			 * @param {Event} e 事件。
			 */
			_event: function(tg, type, e){
				e.data = dm.current;
				return tg.target.trigger(type, e);
			},
			
		//	/**
		//	 * 初始化事件。
		//	 * @param {Object} e
		//	 */
		//	_init: function(e){
		///		e.returnValue = true;
		//		e.cancelBubble = false;
		//	},
		
			/**
			 * 触发 drop 执行。
			 * @param {Zone} zone 区。
			 * @param {Event} e 事件参数。
			 */
			drop: function(zone, e){
				return this._event(zone, 'drop', e);
			},
			
			/**
			 * 触发 dragenter 执行。
			 * @param {Zone} zone 区。
			 * @param {Event} e 事件参数。
			 */
			dragEnter: function(zone, e){
				this._event(zone, 'dragenter', e);
			},
			
			/**
			 * 触发 dragover 执行。
			 * @param {Zone} zone 区。
			 * @param {Event} e 事件参数。
			 */
			dragOver: function(zone, e){
				this._event(zone, 'dragover', e);
			},
			
			/**
			 * 触发 dragleave 执行。
			 * @param {Zone} zone 区。
			 * @param {Event} e 事件参数。
			 */
			dragLeave: function(zone, e){
				//this._init(e);
				this._event(zone, 'dragleave', e);
				//this._init(e);
			}
		};
	
	// 拷贝对象。
	Object.extend(dd.options, options);
		
	/**
	 * 表示可拖动的区域。
	 * @class Zone
	 */
	dd.Zone = Array.extend({
				
		/**
		 * 初始化。
		 * @constructor Zone
		 */
		constructor: function(){
			
			// 每个元素复制到本区。
			Object.each(arguments, function(elem, i){
				
				// 如果元素为 true ， 表示本组支持全部元素。
				if(elem === true){
					elem = Function.returnTrue;
				}
				
				// 如果未函数，表示自定义函数。
				if(Function.isFunction(elem)){
					this.contains = elem;
					return false;
				}
				
				// 获取元素。
				elem = p.$(elem);
				
				// 第一个为目标。
				if(i == 0)
					this.change(elem);
				else
					this.push(elem);
			}, this);
			this.enable();
		},
		
		/**
		 * 使当前域处理当前的 drop 。
		 */
		enable: function(){
			zones.include(this);
		},
		
		/**
		 * 使当前域不处理任何 drop 。
		 */
		disable: function(){
			zones.remove(this);
		},
		
		/**
		 * 改变当前区的目标元素。
		 * @param {Element} tg 元素。
		 */
		change: function(tg){
			
			// 初始化。
			this.target = tg;

			// 初始化区域。
			// 如果只需简单拖动，此步可省。
			this.bound = tg.getBound();
			
			// 绑定当前元素区域。
			p.setData(tg, 'zone', this);
		}
		
	}) ;

	/**
	 * @class Py.DragDrop.Target
	 */
	dd.Target.implement({
		
		/**
		 * 当前所在区。
		 * @type Zone
		 */
		activeZone: null,
				
		/**
		 * @private
		 * @param {Element} elem 元素。
		 */
		_change: dd.Target.prototype.change,
		
		/**
		 * 改变当前对象的目标。
		 * @param {Element} elem 元素。
		 */
		change: function(elem){
			this._change(elem);
			this.bound = elem.getBound();
			return this;
		},
		
		/**
		 * 判断参数的 bound 是否在指定点和大小表示的矩形是否在本区范围内。
		 * @param {Rectange} bound 。
		 * @param {Rectange} box 范围。
		 * @return {Boolean} 在上面返回 true
		 * @private
		 */
		_isOver: function(bound, box){
			return ((bound.right < box.right && bound.right > box.left) || (bound.left < box.right && bound.left > box.left)) &&
			  ((bound.bottom < box.bottom && bound.bottom > box.top) || (bound.top < box.bottom && bound.top > box.top)) ;
		},
		
		/**
		 * 获取当前目标区。
		 * @return {Py.DragDrop.Zone} 获得区。
		 */
		getActiveZone: function(){
			var me = this, bound = me.getBound(), r;

			dm.current.zones.each(function(zone){
				if (me._isOver(bound, zone.bound)) {
					r = zone;
					return false;
				}
			});
				
			return r;
		},
		
		/**
		 * 更新当前块情况。
		 * @param {Event} e 事件。
		 * @param {Document} doc 发生事件的文档。
		 */
		update: function(e, doc){
			
			// 获取当前激活的区。
			var me = this, activeZone = me.getActiveZone();
			if(activeZone){
				// 原先就激活的
				if (activeZone == me.activeZone) {
					dm.options.dragOver(activeZone, e);
				} else {
				
					// 本来有激活的
					if (me.activeZone) dm.options.dragLeave(me.activeZone, e);
					
					// 现在刚激活的
					dm.options.dragEnter(activeZone, e);
					me.activeZone = activeZone;
					
				}
			} else if(me.activeZone){
				
				// 本来有激活的
				dm.options.dragLeave(me.activeZone, e);
				me.activeZone = undefined;
			}
			
		},
		
		/**
		 * 计算返回当前的 bound 。
		 * @return {Rectange} 位置。
		 */
		getBound: function(){
			var bound = this.bound,
				dx = this.to.x - this.from.x,
				dy = this.to.y - this.from.y;
			
			return {
				left: bound.left + dx,
				top: bound.top + dy,
				right: bound.right + dx,
				bottom: bound.bottom + dy
			};
			
		},
		
		/**
		 * 将当前值改在指定范围内。
		 * @param {Rectangle} box 限制的范围。
		 */
		limit: function(box){

			var me = this,
				bound = me.getBound(),
				left = box.left - bound.left,
				top = box.top - bound.top;
				
				
			if(left > 0){
				me.to.x += left;
			} else{
				left =  box.right - bound.right;
				if(left < 0){
					me.to.x += left;
				}
			}
			
			if(top > 0){
				me.to.y += top;
			} else{
				top =  box.bottom - bound.bottom;
				if(top < 0){
					me.to.y += top;
				}
			}
			
			
			dm.delta.set(me.to.x - me.from.x, me.to.y - me.from.y);
		},

		/**
		 * 判断当前的 bound 是否在指定点和大小表示的矩形是否在本区范围内。
		 * @param {Rectange} box 范围。
		 * @return {Boolean} 在上面返回 true
		 */
		isOver: function(box){
			return this._isOver(this.getBound(), box);
		}

	});
	
	/**
	 * @namespace Py.DragDrop.Manager
	 */
	Object.extend(dm, {
		
		/**
		 * 在开始拖动前初始化拖动变量。
		 * @param {Event} e 事件参数。
		 */
		onBeforeDrag: function(e){
			var c = dm.current;
			if((c.zones = zones.filter(function(zone){
					return zone.indexOf(dm.current.target) !== -1;
				})).length){
				// 初始位置。
				c.activeZone = c.getActiveZone();
				
				// 初始化方法。
				if(!'drop' in dm.options)
					Object.extendIf(dm.options, options);
			}
			
			
		},
		
		/**
		 * 在拖动之后的默认处理函数。
		 * @param {Event} e 事件参数。
		 */
		onAfterDrag: function(e){
			
			return !dm.current.activeZone || dm.options.drop(dm.current.activeZone, e);
		}
		
		/**
		 * 在鼠标改变位置时，移动被拖动对象的位置。
		 * @param {Event} e 事件参数。
		 */
		
		/**
		 * 当 drop 事件 return false 执行。
		 * @param {Event} e 事件参数。
		 */
				
	});
	
	dm.onDrag = dm.onInvalidDrop = function  (e, doc){
		dm.current.update(e, doc);
	};
	
	Object.update(p.IEvent, function (value, key) {
		return function(type, fn){
			this.target[key](type, fn);
			return this;
		}
	}, dd.Zone.prototype);
	
	Element.defineEvents ('dragenter dragleave dragover drop', !navigator.isStd ? function(e){
		
		// IE8- 需要检查   e.stopPropagation
		if(!e.stopPropagation)
			p.Events.element.focus.initEvent(e);
	} : Function.empty, function(elem, type, fn){
		elem.addEventListener(type, fn, false);
		(p.getData(elem, 'zone') || p.setData(elem, 'zone', new dd.Zone(elem, true))).enable();
	}, function(elem, type, fn){
		elem.removeListener(type, fn, false);
		p.data(elem, 'zone').disable();
	});

})(Py);

