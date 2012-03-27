



using("System.Fx.Animate");
using("System.Dom.Element");

var Marquee = Control.extend({
	
	direction: 'left',
	
	duration:-1,
	
	delay: 3000,
	
	_currentIndex: 0,
	
	getCurrentIndex: function(){
		return this._currentIndex;
	},
	
	/**
	 * 是否循环。
	 * @property {Boolean} loop
	 */
	
	_getWidthBefore: function(ctrl, xy){
		
		ctrl = ctrl.getPrevious();
		
		if(ctrl) {
			return Dom.calc(ctrl.dom, xy) + this._getWidthBefore(ctrl, xy);
		}
		
		return 0;
	},
	
	_getScrollByIndex: function(value){
		return this._getWidthBefore(this.container.getChild(value), /^[lr]/.test(this.direction) ? 'mx+sx' : 'my+sy')   ;
	},
	
	_getTotalSize: function(){
		var size = 0;
		
		var xy = /^[lr]/.test(this.direction) ? "mx+sx" : "my+sy";
		
		this.container.getChildren().each(function(child){
			size += Dom.calc(child, xy);
		});
		
		return size;
	},
	
	onChanging: function(newIndex){
		return !this.disabled && this.trigger('changing', newIndex);
	},
	
	onChange: function(oldIndex, newIndex){
		this.trigger('change', oldIndex);
	},
	
	/**
	 * 更新节点状态。
	 */
	update: function(){
		var children = this.container.getChildren();
		this.childCount = children.length;
		var size = this._getTotalSize();
		var xy = /^[lr]/.test(this.direction) ? 'Width' : 'Height';
		
		this.disabled = this['get' + xy]() >= size;
		
		if(!this.disabled && this.loop && !this.cloned){
			children.clone().appendTo(this.container);
			children.clone().appendTo(this.container);
			size = this._getTotalSize();
			this.cloned = true;
		}
		
		this.container['set' + xy](size);
		this._currentIndex = 0;
	},
	
	init: function(options){
		this.container = this.find('ul');
		this.setStyle('overflow', 'hidden');
		
		
		if(options.loop !== false && this.loop !== false){
			this.loop = true;
			delete options.loop;
		}
		
		this.update();
	},
	
	restart: function(){
		if(!this.timer && this.step)
			this.timer = setInterval(this.step, this.delay);
	},
	
	moveTo: function(index){
		clearInterval(this.timer);
		this.timer = 0;
		this.one('change', this.restart);
		this.moveToInternal(index % (this.loop ? this.childCount * 3 : this.childCount));
		return this;
	},
	
	setCurrentIndex: function(index){
		this.container.setStyle(/^[lr]/.test(this.direction) ? 'marginLeft' : 'marginTop', -this._getScrollByIndex(index));
	},
	
	/**
	 * 内部实现移动到指定位置的效果。
	 */
	moveToInternal: function(index){
		
		var actualNewIndex, resetIndex, newIndex = index % this.childCount;
		
		if(newIndex < 0)
			newIndex += this.childCount;
		
		if(this.onChanging(actualNewIndex = newIndex)) {
			
			// 如果是循环的，则需要保证变化是平滑的。	
			if(this.loop){
				
				// 循环表示，有三层，中间这层的索引是显示值。
				actualNewIndex = index + this.childCount;
				
				// 当前位置。
				//index = this._currentIndex;
				
				// 如果是正向变化。则应该保证 newIndex > index。
				// 否则，应该保证 newIndex < index 。
				// if(/^[lt]/.test(this.direction)){
// 					
					// if(newIndex <= index) {
						// resetIndex = newIndex;
					// }
// 					
				// } else if(newIndex >= index) {
					// resetIndex = newIndex;
				//}
				if(actualNewIndex <= this.childCount || actualNewIndex >= (this.childCount + this.childCount))
					resetIndex = newIndex;
				
			}
			
			var me = this;
			var oldIndex = me._currentIndex;
			me.container.animate(/^[lr]/.test(this.direction) ? 'marginLeft' : 'marginTop', -me._getScrollByIndex(actualNewIndex), me.duration, function(){
				if(resetIndex != null){
					me.setCurrentIndex(resetIndex + me.childCount);
				}
				me.onChange(oldIndex, newIndex);
			}, function(){
				me._currentIndex = newIndex;
			}, 'reset');
		}
		return this;
		
	},
	
	moveBy: function(index){
		return this.moveTo(this._currentIndex + index);
	},
	
	prev: function(){
		return this.moveBy(-1);
	},
	
	next: function(){
		return this.moveBy(1);
	},
	
	/**
	 * 暂停滚动
	 * @method pause
	 */
	stop: function() {
		clearInterval(this.timer);
		this.timer = 0;
		this.step = null;
		return this;
	},
	
	/**
	 * (重新)开始滚动
	 * @method start
	 */
	start: function(delta, direction) {
		delta = delta || 1;
		var me = this.stop();
		if(direction)
			this.direction = direction;
		if(/^[rb]/.test(this.direction))
			delta *= -1;
		me.set(me._currentIndex + (this.loop ? this.childCount : 0));
		me.timer = setInterval(me.step = function(){
			me.moveToInternal(me._currentIndex + delta);
		}, me.delay);
		
		return me;
	}
	
});