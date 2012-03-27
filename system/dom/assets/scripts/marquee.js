



using("System.Fx.Animate");
using("System.Dom.Element");

var Marquee = Control.extend({
	
	direction: 'left',
	
	duration:-1,
	
	delay: 1000,
	
	_currentIndex: 0,
	
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
			size = this._getTotalSize();
			this.cloned = true;
		}
		
		this.container['set' + xy](size);
		this.container.setScroll(0, 0);
		this._currentIndex = 0;
	},
	
	init: function(options){
		this.container = this.find('ul');
		this.setStyle('overflow', 'hidden');
		
		
		if(options.loop !== false){
			this.loop = true;
			delete options.loop;
		}
		
		this.update();
	},
	
	moveTo: function(index){
		var xy = /^[lr]/.test(this.direction) ? 'x' : 'y';
		if( index < 0){
			this._currentIndex = index = this.childCount + index;
			this.container.setStyle(xy === 'x' ? 'marginLeft' : 'marginTop', -this._getScrollByIndex(index + 1));
			newIndex = null;
		} else {
			var newIndex = index % this.childCount;
			
			if(newIndex < index){
				if(this.loop){
						
				} else {
					index = newIndex;
					newIndex = null;
				}
			}
		}
		
		var me = this, newScroll = me._getScrollByIndex(index);
		me.container.animate(xy === 'x' ? 'marginLeft' : 'marginTop', -newScroll, me.duration, function(){
			if(newIndex !== null){
				newScroll = me._getScrollByIndex(newIndex);
				me.container.setStyle(xy === 'x' ? 'marginLeft' : 'marginTop', -newScroll);
				me._currentIndex = newIndex;
			}
		}, null, 'replace');
		return this;
		
	},
	
	moveBy: function(index){
		this.moveTo(this._currentIndex + index);
	},
	
	prev: function(){
		return this.stop().moveBy(-1).start();
	},
	
	next: function(){
		return this.stop().moveBy(1).start();;
	},
	
	/**
	 * 暂停滚动
	 * @method pause
	 */
	stop: function() {
		clearInterval(this.timer);
		this.timer = 0;
		return this;
	},
	
	/**
	 * (重新)开始滚动
	 * @method start
	 */
	start: function(delta, direction) {
		if(this.disabled)
			return;
		delta = delta || 1;
		var me = this.stop();
		if(direction)
			this.direction = direction;
		if(/^[rb]/.test(this.direction))
			delta *= -1;
		me.timer = setInterval(function(){
			me.moveBy(delta || 1);
		}, me.delay);
		
		return me;
	}
	
});