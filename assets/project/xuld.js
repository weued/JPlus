

var todo = {
	'Select 处理': ''
};


var done = {
	'核心部分 - System': '',
	'定义项目结构、文件夹的结构': '',
	'制作测试页，包括单元测试、速度测试。': ''
};




initUserMenu(todo, done);



/*
 * 
 * 

		// /**
		 // * 变化到某值。
		 // * @param {String} value 变化的值。可以为 height opacity width all size position left top
		 // * right bottom。
		 // * @param {Function} [callBack] 回调。
		 // * @param {Number} duration=500 时间。
		 // * @param {String} [type] 类型。
		 // * @return this
		 // */
		// animate: function () {
			// var args = arguments, value = args[1];
			// if(typeof args[0] === 'string') {
				// (args[1] = {})[args[0]] = value;
				// args[0] = null;
			// } else if(typeof value !== 'object') {
				// ap.unshift.call(args, null);
			// }
// 
			// this.set(args[1]);
// 			
			// if(args[4])
				// args[4].call(this);
// 				
			// if(args[3])
				// setTimeout(args[3], 0);
// 
			// return  this;
		// },
		
		
		/*
		
			var r = [],
				args = arguments,
				fn = args[0];
				
			assert.isString(fn, "Array.prototype.invoke(fn, args): 参数 {fn} ~。");
			
			// 如果函数，则调用。 否则对 属性调用函数。
			ap.forEach.call(this, function(value) { 
				assert(value && Function.isFunction(value[fn]), "Array.prototype.invoke(fn, ...): {value} 不包含可执行的函数 {fn}。", value, fn);
				// value[fn](args[1], args[2], ...);
				// value[fn].call(value, args[1], args[2], ...);
				// value[fn].call(args[0], args[1], args[2], ...);
				// value[fn].call.apply(value[fn], args);
				args[0] = value;
				r.push(value[fn].call.apply(value[fn], args));
			});
			
			return r;
			
		
		
		
		
		/**
		 * 对数组每个元素筛选出一个函数返回true或属性符合的项。 
		 * @param {Function/String} name 函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Number} index 当前变量的索引} {@param {Array} array 数组本身} /数组成员的字段。
		 * @param {Object} value 值。
		 * @return this
		 * @seeAlso Array.prototype.filter
		 * @example
		 * <code>
		 * ["", "aaa", "zzz", "qqq"].select("length", 0); //  [""];
		 * [{q: "1"}, {q: "3"}].select("q", "3");	//  返回   [{q: "3"}];
		 * [{q: "1"}, {q: "3"}].select(function(v) {
		 * 	  return v.["q"] == "3";
		 * });	//  返回   [{q: "3"}];
		 * </code>
		 */
	
	
	/*
	
		select: function(name, value) {
			var me = this, index = -1, i = -1 , l = me.length, t,
				fn = Function.isFunction(name) ? name : function(t) {
					return t[name] === value;
				};
			while (++i < l) {
				t = me[i];
				
				// 调用。
				if (fn.call(t, t, i, me)) {
					me[++index] = t;
				}
			}
			ap.splice.call(me, ++index, l - index);
			
			return me;
		},
			
		
		* */








