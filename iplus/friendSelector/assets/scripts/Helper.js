var Helper = {};

Helper.bind = function(func, obj) {
	var slice = [].slice,
		args = slice.call(arguments, 2),
		nop = function() {},
		bound = function() {
			return func.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
		};
	nop.prototype = func.prototype;
	bound.prototype = new nop();
	return bound;
};

Helper.on = function(obj,self){
	if ($.isArray(obj)) {
		$.each(obj,function(index,item){Helper.on(item,self);});
	} else {
		var dom = self.dom,
			name = obj.classname,
			func = obj.func;
		dom.find(name).bind("click",Helper.bind(self[func],dom));
	}
};