//===========================================
//  拖放         A
//===========================================





using("System.Dom.Drag");



(function(p){
	
	/**
	 * 全部的区。
	 */
	var droppables = [],
		
		dp = Draggable.prototype,
		
		Droppable = namespace(".Droppable", Class({
			
			/**
			 * 触发 dragenter 执行。
			 * @param {Draggable} droppable 拖放物件。
			 * @param {Event} e 事件参数。
			 */
			onDragEnter: function(draggable, e){
				e.dragTarget = draggable;
				return this.dom.trigger('dragenter', e);
			},
			
			/**
			 * 触发 dragover 执行。
			 * @param {Draggable} droppable 拖放物件。
			 * @param {Event} e 事件参数。
			 */
			onDragOver: function(draggable, e){
				e.dragTarget = draggable;
				return this.dom.trigger('dragover', e);
			},

			/**
			 * 触发 drop 执行。
			 * @param {Draggable} draggable 拖放物件。
			 * @param {Event} e 事件参数。
			 */
			onDrop: function(draggable, e){
				e.dragTarget = draggable;
				return this.dom.trigger('drop', e);
			},
			
			/**
			 * 触发 dragleave 执行。
			 * @param {Draggable} droppable 拖放物件。
			 * @param {Event} e 事件参数。
			 */
			onDragLeave: function(draggable, e){
				e.dragTarget = draggable;
				return this.dom.trigger('dragleave', e);
			},
			
			/**
			 * 初始化。
			 * @constructor Droppable
			 */
			constructor: function(dom){
				this.dom = dom;
				this.setDisabled(false);
			},
			
			/**
			 * 判断参数的 bound 是否在指定点和大小表示的矩形是否在本区范围内。
			 * @param {Rectange} bound 。
			 * @param {Rectange} box 范围。
			 * @return {Boolean} 在上面返回 true
			 * @private
			 */
			isOver: function(position1, size1, position2, size2){
				return ((position1.right < box.right && bound.right > box.left) || (bound.left < box.right && bound.left > box.left)) &&
				  ((bound.bottom < box.bottom && bound.bottom > box.top) || (bound.top < box.bottom && bound.top > box.top)) ;
			},
			
			/**
			 * 判断当前的 bound 是否在指定点和大小表示的矩形是否在本区范围内。
			 * @param {Rectange} box 范围。
			 * @return {Boolean} 在上面返回 true
			 */
			check: function(draggable, position, size){
				var myLeft = position.x,
					myRight = myLeft + size.x,
					targetLeft = this.position.x,
					targetRight = targetLeft + this.size.x,
					myTop,
					myBottom,
					targetTop,
					targetBottom;
				
				if((myRight >= targetRight || myRight <= targetLeft) && 
						(myLeft >= targetRight || myLeft <= targetLeft) && 
						(myLeft >= targetLeft || myRight <= targetRight))
					return false;
				
				
				myTop = position.y;
				myBottom = myTop + size.y;
				targetTop = this.position.y;
				targetBottom = targetTop + this.size.y;

				if((myBottom >= targetBottom || myBottom <= targetTop) && 
						(myTop >= targetBottom || myTop <= targetTop) && 
						(myTop >= targetTop || myBottom <= targetBottom))
					return false;
				
				return true;
			},
			
			/**
			 * 使当前域处理当前的 drop 。
			 */
			setDisabled: function(value){
				droppables[value ? 'remove' : 'include'](this);
			},
			
			accept: function(elem){
				this.position = this.dom.getPosition();
				this.size = this.dom.getSize();
				return true;
			}
			
		})),
		
		beforeDrag = dp.beforeDrag,
		
		doDrag = dp.doDrag,
		
		afterDrag = dp.afterDrag,
		
		mouseEvent = p.Events.element.mousemove;
	
	Draggable.implement({
		
		beforeDrag: function(e){
			var me = this;
			beforeDrag.call(me, e);
			me.position = me.dom.getPosition();
			me.size = me.dom.getSize();
			me.droppables = droppables.filter(function(droppable){
				return droppable.accept(me);
			});
			me.activeDroppables = new Array(me.droppables.length);
		},
		
		doDrag: function(e){
			doDrag.call(this, e);
			var me = this,
				i = 0,
				droppables = me.droppables,
				position = me.proxy.getPosition(),
				size = me.proxy.getSize(),
				activeDroppables = me.activeDroppables,
				droppable;
			while(i < droppables.length) {
				droppable = droppables[i];
				if(droppable.check(me, position, size)) {
					if(activeDroppables[i])
						droppable.onDragOver(me, e);
					else {
						activeDroppables[i] = true;
						droppable.onDragEnter(me, e);
					}
					
					
				} else if(activeDroppables[i]){
					activeDroppables[i] = false;
					droppable.onDragLeave(me, e);
				}
				i++;
			}
		},
		
		afterDrag: function(e){
			var me = this;
			afterDrag.call(me, e);
			me.droppables.forEach(function(droppable, i){
				if(me.activeDroppables[i])
					droppable.onDrop(me, e);
			});
			me.activeDroppables = me.droppables = null;
		}
	});
	
	Element.addEvents(String.map('dragenter dragleave dragover drop', Object.extendIf(Function.from({
		add:  function(elem, type, fn){
			elem.addEventListener(type, fn, false);
			(p.getData(elem, 'droppable') || p.setData(elem, 'droppable', new Droppable(elem))).setDisabled(false);
		},
		remove: function(elem, type, fn){
			elem.removeListener(type, fn, false);
			p.getData(elem, 'droppable').setDisabled();
		}
	}, mouseEvent)), {}));

})(JPlus);

