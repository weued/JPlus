


using("System.Dom.Element");

Dom.resize = (function(){
	
	var resize = JPlus.Events.control.resize,
		add = resize.add,
		remove = resize.remove,
		timer,
		win = new Dom(window);
		
	Object.extend(resize, {
		
		add: function(ctrl, type, fn){
			add(ctrl, type, resizeProxy);
		},
		
		remove: function(ctrl, type, fn){
			remove(ctrl, type, resizeProxy);
		}
		
	});
		
	function resizeProxy(e){
		if(timer)
			clearTimeout(timer);
		
		timer = setTimeout(function (){
			timer = 0;
			win.trigger('resize', e);
		}, 100);
	}
	
	
	
	return function(fn){
		win[Function.isFunction(fn) ? 'on' : 'trigger']('resize', fn);
	}

	
})();