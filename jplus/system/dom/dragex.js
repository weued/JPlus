//===========================================
//  拖动 
//   A: xuld
//===========================================

using("System.Dom.Drag");



Draggable.implement({
	
	/**
	 * 将当前值改在指定范围内。
	 * @param {Rectangle} box 限制的范围。
	 */
	limit: function(position, size){
		this.doDrag();
		var me = this,
			myPosition = me.proxy.getPosition(),
			mySize = me.proxy.getSize(),
			deltaX = position.x - myPosition.x,
			deltaY = position.y - myPosition.y;
			
			
		if(deltaX > 0){
			me.to.x += deltaX;
		} else {
			deltaX =  position.x + size.x - myPosition.x - mySize.x;
			if(deltaX < 0){
				me.to.x += deltaX;
			}
		}
		
		if(deltaY > 0){
			me.to.y += deltaY;
		} else {
			deltaY =  position.y + size.y - myPosition.y - mySize.y;
			if(deltaY < 0){
				me.to.y += deltaY;
			}
		}
		
		
	},
	
	setLimit: function(elem){
		this.limit(elem.getPosition(), elem.getSize());
	},
	
	revert: function(){
		var me = this.proxy;
		me.setDraggable(false);
		me.animate({
			left: this.offset.x,
			top: this.offset.y
		}, -1, function () {
			me.setDraggable();
		});
	},
	
	setStep: function(direction, value){
		var delta = parseInt( (this.to[direction] - this.from[direction]) / value);
		
		this.to[direction] = this.from[direction] + delta * value;
	},
	
	autoScroll: function(target){
		
		var scroll = target.getScroll(),
			top = this.proxy.getPosition().sub(target.getPosition()),
			size = target.getSize(),
			scollSize = target.getScrollSize().sub(size),
			delta;

		if(top.y < 0)
			scroll.y += top.y;
		
		if(top.x < 0)
			scroll.x += top.x;
		
		top = top.add(this.proxy.getSize());
		
		delta = top.y - size.y;
		
		if(delta > 0 && scroll.y + delta < scollSize.y) {
			scroll.y += delta;
		}
		
		delta = top.x - size.x;
		
		if(delta > 0 && scroll.x + delta < scollSize.x) {
			scroll.x += delta;
		}
		
		document.setScroll(scroll);
	}
	
});