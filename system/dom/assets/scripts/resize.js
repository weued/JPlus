


using("System.Dom.Element");

Dom.resize = (function(){
	
	var controlEvent = JPlus.Events.control,
		oldResize = controlEvent.resize,
		timer,
		win = new Dom(window);
		
	controlEvent.resize = {
		
		add: function(ctrl, type, fn){
			oldResize.add(ctrl, type, resizeProxy);
		},
		
		remove: function(ctrl, type, fn){
			oldResize.remove(ctrl, type, resizeProxy);
		},
		
		trigger: oldResize.trigger,
		
		initEvent: oldResize.initEvent
		
	};
		
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