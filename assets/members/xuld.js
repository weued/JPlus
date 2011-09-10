

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
			
			
			
			
			

//		/**
//		 * 深拷贝一个对象本身, 不深复制函数。
//		 * @static
//		 * @param {Object} obj 要拷贝的对象。
//		 * @return {Object} 返回复制后的对象。
//		 * @example
//		 * <code>
//		 * var obj1 = {a: 0, b: 1};
//		 * var obj2 = Object.clone(obj1);
//		 *  
//		 * obj1.a = 3;
//		 * trace(obj1.a);  // trace 3
//		 * trace(obj2.a);  // trace 0
//		 *
//		 * </code>
//		 */
//		clone: function (obj) {
//			
//			// 内部支持深度。
//			// 用法:  Object.clone.call(1, val);
//			var deep = this - 1;
//			
//			// 如果是对象，则复制。
//			if (o.isObject(obj) && !(deep < 0)) {
//				
//				// 如果对象支持复制，自己复制。
//				if(obj.clone)
//					return obj.clone();
//				
//				// #1    
//				// if(obj.cloneNode)
//				//	return obj.cloneNode(true);
//				
//				//仅当对象才需深拷贝，null除外。
//				obj = o.update(obj, o.clone, Array.isArray(obj) ? [] : {}, deep);
//			}
//			
//			return obj;
//		},


//,
//
///**
// * 添加一个对象的成员函数调用结束后的回调函数。
// * @static
// * @param {Object} obj 对象。
// * @param {String} propertyName 成员函数名。
// * @param {Function} fn 对象。
// * @return {Object} obj。
// * @example
// * 
// * 下面的代码方便地添加 onload 事件。 
// * <code>
// * Object.addCallback(window, "onload",trace.empty);
// * </code>
// */
//addCallback: function (obj, propertyName, fn) {
//	
//	assert.notNull(obj, 'Object.addCallback(obj, propertyName, fn): 参数 obj ~。');
//	
//	assert.isFunction(fn, 'Object.addCallback(obj, propertyName, fn): 参数 {fn} ~。');
//	
//	// 获取已有的句柄。
//	var f = obj[propertyName];
//	
//	// 如果不存在则直接拷贝，否则重新拷贝。新函数对原函数调用。
//	obj[propertyName] = typeof f === 'function' ? function () {
//		
//		// 获取上次的函数。
//		var v = f.apply(this, arguments);
//		
//		// 调用回调函数。
//		fn.apply(this, arguments);
//		
//		// 返回原值。
//		return v;
//		
//	} : fn;
//	return obj;
//}



		
		
		/**
	     * 转为骆驼格式的正则表达式。
	     * @type RegExp
	     */
		//   rToCamelCase = /-(\w)/g,
		
		
		
		
		// /**
	     // * 转为骆驼格式。
	     // * @param {String} value 内容。
	     // * @return {String} 返回的内容。
	     // * @example
		 // * <code>
		 // * "font-size".toCamelCase(); //     "fontSize"
		 // * </code>
	     // */
		// toCamelCase: function () {
	        // return this.replace(rToCamelCase, toCamelCase);
	    // },
// 		
		// * */








