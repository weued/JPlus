//===========================================
//  jQuery plugin - J+  System Adapter
//===========================================

(function ($) {
	
	/**
	 * Object  简写。
	 * @type Function
	 */
	var o = window.Object,
		
		/**
		 * Object.prototype.hasOwnProperty 简写。
		 * @type Function
		 */
		hasOwnProperty = o.prototype.hasOwnProperty,
		
		apply = $.extend,
		
		emptyFn = $.noop,
		
		/**
		 * 格式化字符串用的正则表达式。
		 * @type RegExp
		 */
		rFormat = /\{+?(\S*?)\}+/g,
		
		/**
		 * 匹配第一个字符。
		 * @type RegExp
		 */
		rFirstChar = /(\b[a-z])/g,
		
		/**
		 * 表示空白字符。
		 * @type RegExp
		 */
		rWhite = /%20/g,
		
		/**
	     * 转为骆驼格式的正则表达式。
	     * @type RegExp
	     */
		rToCamelCase = /-(\w)/g,
		
		/**
		 * 管理所有事件类型的工具。
		 * @type Object
		 */
		eventMgr = {
			
			/**
			 * 管理默认的类事件。
			 * @type Object
			 */
			$default: {
				add: emptyFn,
				initEvent: emptyFn,
				remove: emptyFn
			}
			
		},

		/**
		 * Py静态对象。
		 * @namespace JPlus
		 */
		p = namespace('JPlus.', {
			
			/**
			 * 获取属于一个元素的数据。
			 * @param {Object} obj 元素。
			 * @param {String} dataType 类型。
			 * @return {Object} 值。
			 * 这个函数会在对象内生成一个 data 字段， 并生成一个 data.dataType 对象返回。
			 * 如果原先存在 data.dataType, 则直接返回。
			 * @example
			 * <code>
			 * var obj = {};
			 * JPlus.data(obj, 'a').c = 2;
			 * trace(  JPlus.data(obj, 'a').c  ) // 2
			 * </code>
			 */
			data: function (obj, dataType) {
				
				
				// 创建或获取 '$data'。
				var d = obj.$data || (obj.$data = {}) ;
				
				// 创建或获取 dataType。
				return d[dataType] || (d[dataType] = {});
			},
		
			/**
			 * 如果存在，获取属于一个元素的数据。
			 * @param {Object} obj 元素。
			 * @param {String} dataType 类型。
			 * @return {Object} 值。
			 * 这个函数会在对象内生成一个 data 字段， 并生成一个 data.dataType 对象返回。
			 * 如果原先存在 data.dataType, 则直接返回。
			 * @example
			 * <code>
			 * var obj = {};
			 * if(JPlus.getData(obj, 'a')) // 如果存在 a 属性。 
			 *     trace(  JPlus.data(obj, 'a')  )
			 * </code>
			 */
			getData:function (obj, dataType) {
				
				
				// 获取属性'$data'。
				var d = obj.$data;
				return d && d[dataType];
			},
			
			/**
			 * 设置属于一个元素的数据。
			 * @param {Object} obj 元素。
			 * @param {String} dataType 类型。
			 * @param {Object} data 内容。
			 * @return data
			 * @example
			 * <code>
			 * var obj = {};
			 * JPlus.setData(obj, 'a', 5);    //     5
			 * </code>
			 */
			setData: function (obj, dataType, data) {
				
				
				// 简单设置变量。
				return (obj.$data || (obj.$data = {}))[dataType] = data;
			},
			
			/**
			 * 创建一个类。
			 * @param {Object/Function} [methods] 成员或构造函数。
			 * @return {Class} 生成的类。
			 * 创建一个类，相当于继承于 JPlus.Object创建。
			 * @see JPlus.Object.extend
			 * @example
			 * <code>
			 * var MyCls = Class({
			 * 
			 *    constructor: function (g, h) {
			 * 	      alert('构造函数' + g + h)
			 *    }	
			 * 
			 * });
			 * 
			 * 
			 * var c = new MyCls(4, ' g');
			 * </code>
			 */
			Class: function (members) {
					
				// 创建类，其实就是 继承 Object ，创建一个类。
				return Object.extend(members);
			},
			
			/**
			 * 所有类的基类。
			 * @class JPlus.Object
			 */
			Object: Object,
			
			/**
			 * 由存在的类修改创建类。
			 * @param {Function/Class} constructor 将创建的类。
			 * @return {Class} 生成的类。
			 */
			Native: function (constructor) {
				
				// 简单拷贝  Object 的成员，即拥有类的特性。
				// 在 JavaScript， 一切函数都可作为类，故此函数存在。
				// Object 的成员一般对当前类构造函数原型辅助。
				return applyIf(constructor, Object);
			},
			
			using: emptyFn,
			
			/// #endif
	
			/**
			 * 定义名字空间。
			 * @param {String} name 名字空间。
			 * @param {Object} [obj] 值。
			 * <p>
			 * 名字空间是项目中表示资源的符合。
			 * </p>
			 * 
			 * <p>
			 * 比如  system/dom/keys.js 文件， 名字空间是 System.Dom.Keys
			 * 名字空间用来快速表示资源。 {@link using} 和  {@link imports} 可以根据制定的名字空间载入相应的内容。
			 * </p>
			 * 
			 * <p>
			 * namespace 函数有多个重载， 如果只有1个参数:
			 * <code>
			 * namespace("System.Dom.Keys"); 
			 * </code>
			 * 表示系统已经载入了这个名字空间的资源， using 和 imports 将忽视这个资源的载入。
			 * </p>
			 * 
			 * <p>
			 * namespace 如果有2个参数， 表示在指定的位置创建对象。
			 * <code>
			 * namespace("A.B.C", 5); // 最后 A = {B: {C: 5}}  
			 * </code>
			 * 这个写法最后覆盖了 C 的值，但不影响 A 和 B。 
			 * 
			 * <p>
			 * 如果这个名字空间的首字符是 . 则系统会补上 'JPlus'
			 * </p> 
			 * 
			 * <p>
			 * 如果这个名字空间的最后的字符是 . 则系统不会覆盖已有对象，而是复制成员到存在的成员。
			 * </p> 
			 * 
			 * </p>
			 * 
			 * @example
			 * <code>
			 * namespace("System.Dom.Keys");  // 避免 重新去引入   System.Dom.Keys
			 * 
			 * var A = {   B:  {b: 5},  C: {b: 5}    };
			 * namespace("A.B", {a: 6})  // A = { B: {a: 6}, C: {b: 5}  }
			 * 
			 * var A = {   B:  {b: 5},  C: {b: 5}    };
			 * namespace("A.C.", {a: 6})  // A = { B: {b: 5},  C: {a: 6, b: 5} }
			 * 
			 * namespace(".G", 4);    // JPlus.G = G  = 4
			 * </code>
			 */
			namespace: namespace,
	
			/**
			 * 默认的全局名字空间。
			 * @config {Object}
			 * @value window
			 */
			defaultNamespace: 'JPlus',
			
			/**
			 * 管理所有事件类型的工具。
			 * @property
			 * @type Object
			 * @private
			 * 所有类的事件信息存储在这个变量。使用 xType -> name的结构。
			 */
			Events: eventMgr, 
			
			/**
			 * 表示一个事件接口。
			 * @interface
			 * @singleton
			 * JPlus.IEvent 提供了事件机制的基本接口，凡实现这个接口的类店都有事件的处理能力。
			 * 在调用  {@link JPlus.Object.addEvents} 的时候，将自动实现这个接口。
			 */
			IEvent: {
			
				/**
				 * 增加一个监听者。
				 * @param {String} type 监听名字。
				 * @param {Function} listener 调用函数。
				 * @param {Object} bind=this listener 执行时的作用域。
				 * @return Object this
				 * @example
				 * <code>
				 * elem.on('click', function (e) {
				 * 		return true;
				 * });
				 * </code>
				 */
				on: function (type, listener, bind) {
					
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, d = p.data(me, 'event'), evt = d[type];
					
					// 如果未绑定过这个事件。
					if (!evt) {
						
						// 支持自定义安装。
						d[type] = evt = function (e) {
							var listener = arguments.callee,
								handlers = listener.handlers.slice(0), 
								i = -1,
								len = handlers.length;
							
							// 循环直到 return false。 
							while (++i < len) 
								if (handlers[i][0].call(handlers[i][1], e) === false) 										
									return false;
							
							return true;
						};
						
						// 获取事件管理对象。 
						d = getMgr(me, type);
						
						// 当前事件的全部函数。
						evt.handlers = [[d.initEvent, me]];
						
						// 添加事件。
						d.add(me, type, evt);
						
					}
					
					// 添加到 handlers 。
					evt.handlers.push([listener, bind || me]);
						
					return me;
				},
				
				/**
				 * 删除一个监听器。
				 * @param {String} [type] 监听名字。
				 * @param {Function} [listener] 回调器。
				 * @return Object this
				 * 注意: function () {} !== function () {}, 这意味着这个代码有问题:
				 * <code>
				 * elem.on('click', function () {});
				 * elem.un('click', function () {});
				 * </code>
				 * 你应该把函数保存起来。
				 * <code>
				 * var c =  function () {};
				 * elem.on('click', c);
				 * elem.un('click', c);
				 * </code>
				 * @example
				 * <code>
				 * elem.un('click', function (e) {
				 * 		return true;
				 * });
				 * </code>
				 */
				un: function (type, listener) {
					
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, d = p.getData(me, 'event'), evt, handlers, i;
					if (d) {
						 if (evt = d[type]) {
						 	
						 	handlers = evt.handlers;
						 	
							if (listener) {
								
								// 搜索符合的句柄。
								for(i = handlers.length - 1; i; i--) {
									if(handlers[i][0] === listener)	{
										handlers.splice(i, 1);
										break;
									}
								} 
								
							}
								
							// 检查是否存在其它函数或没设置删除的函数。
							if (!listener || handlers.length < 2) {
								
								// 删除对事件处理句柄的全部引用，以允许内容回收。
								delete d[type];
								
								// 内部事件管理的删除。
								getMgr(me, type).remove(me, type, evt);
							}
						}else if (!type) {
							for (evt in d) 
								me.un(evt);
						}
					}
					return me;
				},
				
				/**
				 * 触发一个监听器。
				 * @param {String} type 监听名字。
				 * @param {Object} [e] 事件参数。
				 * @return Object this
				 * trigger 只是手动触发绑定的事件。
				 * @example
				 * <code>
				 * elem.trigger('click');
				 * </code>
				 */
				trigger: function (type, e) {
					
					// 获取本对象     本对象的数据内容   本事件值 。
					var me = this, evt = p.getData(me, 'event'), eMgr;
					
					// 执行事件。
					return !evt || !(evt = evt[type]) || ((eMgr = getMgr(me, type)).trigger ? eMgr.trigger(me, type, evt, e) : evt(e) );
					
				},
				
				/**
				 * 增加一个只执行一次的监听者。
				 * @param {String} type 监听名字。
				 * @param {Function} listener 调用函数。
				 * @param {Object} bind=this listener 执行时的作用域。
				 * @return Object this
				 * @example
				 * <code>
				 * elem.one('click', function (e) {
				 * 		trace('a');  
				 * });
				 * 
				 * elem.trigger('click');   //  输出  a
				 * elem.trigger('click');   //  没有输出 
				 * </code>
				 */
				one: function (type, listener, bind) {
					
					
					// one 本质上是 on ,  只是自动为 listener 执行 un 。
					return this.on(type, function () {
						
						// 删除，避免闭包。
						this.un( type, arguments.callee);
						
						// 然后调用。
						return listener.apply(this, arguments);
					}, bind);
				}
				
				
			}
			
		});
	
	/// #endregion
		
	/// #region 全局函数
	
	/**
	 * @namespace JPlus.Object
	 */
	apply(Object, {
	
		/**
		 * 扩展当前类的动态方法。
		 * @param {Object} members 成员。
		 * @return this
		 * @seeAlso JPlus.Object.implementIf
		 * @example
		 * <code>
		 * Number.implement({
		 *   sin: function () {
		 * 	    return Math.sin(this);
		 *  }
		 * });
		 * 
		 * (1).sin();  //  Math.sin(1);
		 * </code>
		 */
		implement: function (members) {

			// 复制到原型 。
			o.extend(this.prototype, members);
	        
			return this;
		},
		
		/**
		 * 如果不存在成员, 扩展当前类的动态方法。
		 * @param {Object} members 成员。
		 * @return this
		 * @seeAlso JPlus.Object.implement
		 */
		implementIf: function (members) {
		
	
			applyIf(this.prototype, members);
			
			return this;
		},
		
		/**
		 * 为当前类添加事件。
		 * @param {Object} [evens] 所有事件。 具体见下。
		 * @return this
		 * <p>
		 * 由于一个类的事件是按照 xType 属性存放的，拥有相同  xType 的类将有相同的事件，为了避免没有 xType 属性的类出现事件冲突， 这个方法会自动补全  xType 属性。
		 * </p>
		 * 
		 * <p>
		 * 这个函数是实现自定义事件的关键。
		 * </p>
		 * 
		 * <p>
		 * addEvents 函数的参数是一个事件信息，格式如:  {click: { add: ..., remove: ..., initEvent: ..., trigger: ...} 。
		 * 其中 click 表示事件名。一般建议事件名是小写的。
		 * </p>
		 * 
		 * <p>
		 * 一个事件有多个相应，分别是: 绑定(add), 删除(remove), 触发(trigger), 初始化事件参数(initEvent)
		 * </p>
		 * 
		 * </p>
		 * 当用户使用   o.on('事件名', 函数)  时， 系统会判断这个事件是否已经绑定过，
		 * 如果之前未绑定事件，则会创建新的函数 evtTrigger，
		 * evtTrigger 函数将遍历并执行 evtTrigger.handlers 里的成员, 如果其中一个函数执行后返回 false， 则中止执行，并返回 false， 否则返回 true。
		 * evtTrigger.handlers 表示 当前这个事件的所有实际调用的函数的数组。 evtTrigger.handlers[0] 是事件的 initEvent 函数。
		 * 然后系统会调用 add(o, '事件名', evtTrigger)
		 * 然后把 evtTrigger 保存在 o.data.event['事件名'] 中。
		 * 如果 之前已经绑定了这个事件，则 evtTrigger 已存在，无需创建。
		 * 这时系统只需把 函数 放到 evtTrigger.handlers 即可。
		 * </p>
		 * 
		 * <p>
		 * 也就是说，真正的事件触发函数是 evtTrigger， evtTrigger去执行用户定义的一个事件全部函数。
		 * </p>
		 * 
		 * <p>
		 * 当用户使用  o.un('事件名', 函数)  时， 系统会找到相应 evtTrigger， 并从
		 * evtTrigger.handlers 删除 函数。
		 * 如果  evtTrigger.handlers 是空数组， 则使用
		 * remove(o, '事件名', evtTrigger)  移除事件。
		 * </p>
		 * 
		 * <p>
		 * 当用户使用  o.trigger(参数)  时， 系统会找到相应 evtTrigger， 
		 * 如果事件有trigger， 则使用 trigger(对象, '事件名', evtTrigger, 参数) 触发事件。
		 * 如果没有， 则直接调用 evtTrigger(参数)。
		 * </p>
		 * 
		 * <p>
		 * 下面分别介绍各函数的具体内容。
		 * </p>
		 * 
		 * <p>
		 * add 表示 事件被绑定时的操作。  原型为: 
		 * </p>
		 * 
		 * <code>
		 * function add(elem, type, fn) {
		 * 	   // 对于标准的 DOM 事件， 它会调用 elem.addEventListener(type, fn, false);
		 * }
		 * </code>
		 * 
		 * <p>
		 *  elem表示绑定事件的对象，即类实例。 type 是事件类型， 它就是事件名，因为多个事件的 add 函数肯能一样的， 因此 type 是区分事件类型的关键。fn 则是绑定事件的函数。
		 * </p>
		 * 
		 * <p>
		 * remove 同理。
		 * </p>
		 * 
		 * <p>
		 * initEvent 的参数是一个事件参数，它只能有1个参数。
		 * </p>
		 * 
		 * <p>
		 * trigger 是高级的事件。参考上面的说明。 
		 * </p>
		 * 
		 * <p>
		 * 如果你不知道其中的几个参数功能，特别是  trigger ，请不要自定义。
		 * </p>
		 * 
		 * @example
		 * 下面代码演示了如何给一个类自定义事件，并创建类的实例，然后绑定触发这个事件。

		 * <code>
		 * 
		 * // 创建一个新的类。
		 * var MyCls = new Class();
		 * 
		 * MyCls.addEvents({
		 * 
		 *     click: {
		 * 			
		 * 			add:  function (elem, type, fn) {
		 * 	   			alert("为  elem 绑定 事件 " + type );
		 * 			},
		 * 
		 * 			initEvent: function (e) {
		 * 	   			alert("初始化 事件参数  " + e );
		 * 			}
		 * 
		 * 		}
		 * 
		 * });
		 * 
		 * var m = new MyCls;
		 * m.on('click', function () {
		 * 	  alert(' 事件 触发 ');
		 * });
		 * 
		 * m.trigger('click', 2);
		 * 
		 * </code>
		 */
		addEvents: function (events) {
			
			var ep = this.prototype;
			
			
			// 实现 事件 接口。
			applyIf(ep, p.IEvent);
			
			// 如果有自定义事件，则添加。
			if (events) {
				
				var xType = hasOwnProperty.call(ep, 'xType') ? ep.xType : ( ep.xType = (p.id++).toString() );
				
				// 更新事件对象。
				o.update(events, function (e) {
					return applyIf(e, eventMgr.$default);
					
					// 添加 JPlus.Events 中事件。
				}, eventMgr[xType] || (eventMgr[xType] = {}));
			
			}
			
			
			return this;	
		},
	
		/**
		 * 继承当前类并返回子类。
		 * @param {Object/Function} [methods] 成员或构造函数。
		 * @return {Class} 继承的子类。
		 * <p>
		 * 这个函数是实现继承的核心。
		 * </p>
		 * 
		 * <p>
		 * 在 Javascript 中，继承是依靠原型链实现的， 这个函数仅仅是对它的包装，而没有做额外的动作。
		 * </p>
		 * 
		 * <p>
		 * 成员中的  constructor 成员 被认为是构造函数。
		 * </p>
		 * 
		 * <p>
		 * 这个函数实现的是 单继承。如果子类有定义构造函数，则仅调用子类的构造函数，否则调用父类的构造函数。
		 * </p>
		 * 
		 * <p>
		 * 要想在子类的构造函数调用父类的构造函数，可以使用  {@link JPlus.Object.prototype.base} 。
		 * </p>
		 * 
		 * <p>
		 * 这个函数返回的类实际是一个函数，但它被使用 JPlus.Object 修饰过。
		 * </p>
		 * 
		 * <p>
		 * 由于原型链的关系， 肯能存在共享的引用。
		 * 
		 * 如: 类 A ，  A.prototype.c = [];
		 * 
		 * 那么，A的实例 b , d 都有 c 成员， 但它们共享一个   A.prototype.c 成员。
		 * 
		 * 这显然是不正确的。所以你应该把 参数 quick 置为 false ， 这样， A创建实例的时候，会自动解除共享的引用成员。
		 * 
		 * 当然，这是一个比较费时的操作，因此，默认  quick 是 true 。
		 * </p>
		 * 
		 * <p>
		 * 你也可以把动态成员的定义放到 构造函数， 如: this.c = [];
		 * 
		 * 这是最好的解决方案。
		 * </p>
		 */
	 	extend: function (members) {
	
			// 未指定函数   使用默认构造函数(Object.prototype.constructor);
			
			// 生成子类 。
			var subClass = hasOwnProperty.call(members =  members instanceof Function ? {
					constructor: members
				} : (members || {}), "constructor") ? members.constructor : function () {
					
					// 调用父类构造函数 。
					arguments.callee.base.apply(this, arguments);
					
				};
				
			// 代理类 。
			emptyFn.prototype = (subClass.base = this).prototype;
			
			// 指定成员 。
			subClass.prototype = o.extend(new emptyFn, members);
			
			// 覆盖构造函数。
			subClass.prototype.constructor = subClass;

			// 指定Class内容 。
			return p.Native(subClass);

		}

	});
	
	/**
	 * Object  简写。
	 * @namespace Object
	 */
	apply(o, {

		/**
		 * 复制对象的所有属性到其它对象。 
		 * @param {Object} dest 复制目标。
		 * @param {Object} obj 要复制的内容。
		 * @return {Object} 复制后的对象 (dest)。
		 * @seeAlso Object.extendIf
		 * @example
		 * <code>
		 * var a = {v: 3}, b = {g: 2};
		 * Object.extend(a, b);
		 * trace(a); // {v: 3, g: 2}
		 * </code>
		 */
		extend: $.extend,

		/**
		 * 如果目标成员不存在就复制对象的所有属性到其它对象。 
		 * @param {Object} dest 复制目标。
		 * @param {Object} obj 要复制的内容。
		 * @return {Object} 复制后的对象 (dest)。
		 * @seeAlso Object.extend
		 * <code>
		 * var a = {v: 3, g: 5}, b = {g: 2};
		 * Object.extendIf(a, b);
		 * trace(a); // {v: 3, g: 5}  b 未覆盖 a 任何成员。
		 * </code>
		 */
		extendIf: applyIf,
		
		/**
		 * 在一个可迭代对象上遍历。
		 * @param {Array/Object} iterable 对象，不支持函数。
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Number} index 当前变量的索引} {@param {Array} array 数组本身} {@return {Boolean} 如果中止循环， 返回 false。}
	 	 * @param {Object} bind 函数执行时的作用域。
		 * @return {Boolean} 如果已经遍历完所传的所有值， 返回 true， 如果遍历被中断过，返回 false。
		 * @example
		 * <code> 
		 * Object.each({a: '1', c: '3'}, function (value, key) {
		 * 		trace(key + ' : ' + value);
		 * });
		 * // 输出 'a : 1' 'c : 3'
		 * </code>
		 */
		each: function (iterable, fn, bind) {

			
			// 如果 iterable 是 null， 无需遍历 。
			if (iterable != null) {
				
				//普通对象使用 for( in ) , 数组用 0 -> length  。
				if (iterable.length === undefined) {
					
					// Object 遍历。
					for (var t in iterable) 
						if (fn.call(bind, iterable[t], t, iterable) === false) 
							return false;
				} else {
					return each.call(iterable, fn, bind);
				}
				
			}
			
			// 正常结束。
			return true;
		},

		/**
		 * 更新一个可迭代对象。
		 * @param {Array/Object} iterable 对象，不支持函数。
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Array} array 数组本身} {@return {Boolean} 如果中止循环， 返回 false。}
	 	 * @param {Object} bind=iterable 函数执行时的作用域。
		 * @param {Object/Boolean} [args] 参数/是否间接传递。
		 * @return {Object}  返回的对象。
		 * @example 
		 * 该函数支持多个功能。主要功能是将一个对象根据一个关系变成新的对象。
		 * <code>
		 * Object.update(["aa","aa23"], "length", []); // => [2, 4];
		 * Object.update([{a: 1},{a: 4}], "a", [{},{}], true); // => [{a: 1},{a: 4}];
		 * </code>
		 * */
		update: function (iterable, fn, dest, args) {
			
			// 如果没有目标，源和目标一致。
			dest = dest || iterable;
			
			// 遍历源。
			o.each(iterable, Function.isFunction(fn) ? function (value, key) {
                
				// 执行函数获得返回。
				value = fn.call(args, value, key);
				
				// 只有不是 undefined 更新。
                if(value !== undefined)
				    dest[key] = value;
			} : function (value, key) {
				
				// 如果存在这个值。即源有 fn 内容。
				if(value != undefined) {
					
					value = value[fn];
					
					
					// 如果属性是非函数，则说明更新。 a.value -> b.value
					if(args)
						dest[key][fn] = value;
						
					// 类似函数的更新。 a.value -> value
					else
						dest[key] = value;
				}
                    
			});
			
			// 返回目标。
			return dest;
		},

		/**
		 * 判断一个变量是否是引用变量。
		 * @param {Object} object 变量。
		 * @return {Boolean} 所有对象变量返回 true, null 返回 false 。
		 * @example
		 * <code>
		 * Object.isObject({}); // true
		 * Object.isObject(null); // false
		 * </code>
		 */
		isObject: function (obj) {
			
			// 只检查 null 。
			return obj !== null && typeof obj == "object";
		},
		
		/**
		 * 将一个对象解析成一个类的属性。
		 * @param {Object} obj 类实例。
		 * @param {Object} options 参数。
		 * 这个函数会分析对象，并试图找到一个 属性设置函数。
		 * 当设置对象 obj 的 属性 key 为 value:
		 * 发生了这些事:
		 *      检查，如果存在就调用: obj.setKey(value)
		 * 否则， 检查，如果存在就调用: obj.key(value)
		 * 否则， 检查，如果存在就调用: obj.key.set(value)
		 * 否则，检查，如果存在就调用: obj.set(value)
		 * 否则，执行 obj.key = value;
		 * 
		 * @example
		 * <code>
		 * document.setA = function (value) {
		 * 	  this._a = value;
		 * };
		 * 
		 * Object.set(document, 'a', 3); 
		 * 
		 * // 这样会调用     document.setA(3);
		 * 
		 * </code>
		 */
		set: function (obj, options) {
			
			for(var key in options) {
				
				// 检查 setValue 。
				var setter = 'set' + key.capitalize(),
					val = options[key];
		
		
				if (Function.isFunction(obj[setter]))
					obj[setter](val);
				
				// 是否存在函数。
				else if(Function.isFunction(obj[key]))
					obj[key](val);
				
				// 检查 value.set 。
				else if (obj[key] && obj[key].set)
					obj[key].set(val);
				
				// 检查 set 。
				else if(obj.set)
					obj.set(key, val);
				
				// 最后，就直接赋予。
				else
					obj[key] = val;
		
			}
			
		},
		
		/**
		 * 返回一个变量的类型的字符串形式。
		 * @param {Object} obj 变量。
		 * @return {String} 所有可以返回的字符串：  string  number   boolean   undefined	null	array	function   element  class   date   regexp object。
		 * @example
		 * <code> 
		 * Object.type(null); // "null"
		 * Object.type(); // "undefined"
		 * Object.type(new Function); // "function"
		 * Object.type(+'a'); // "number"
		 * Object.type(/a/); // "regexp"
		 * Object.type([]); // "array"
		 * </code>
		 * */
		type: function (obj) {
			
			//获得类型  。
			var typeName = typeof obj;
			
			// 对象， 直接获取 xType 。
			return obj ? obj.xType || typeName : obj === null ? "null" : typeName;
			
		}

	});

	/**
	 * 数组。
	 * @namespace Array
	 */
	applyIf(Array, {
		
		/**
		 * 判断一个变量是否是数组。
		 * @param {Object} object 变量。
		 * @return {Boolean} 如果是数组，返回 true， 否则返回 false。
		 * @example
		 * <code> 
		 * Array.isArray([]); // true
		 * Array.isArray(document.getElementsByTagName("div")); // false
		 * Array.isArray(new Array); // true
		 * </code>
		 */
		isArray: $.isArray,

		/**
		 * 在原有可迭代对象生成一个数组。
		 * @param {Object} iterable 可迭代的实例。
		 * @param {Number} startIndex=0 开始的位置。
		 * @return {Array} 复制得到的数组。
		 * @example
		 * <code>
		 * Array.create([4,6], 1); // [6]
		 * </code>
		 */
		create: $.makeArray

	});

	/**
	 * 函数。
	 * @namespace Function
	 */
	apply(Function, {
		
		/**
		 * 绑定函数作用域。
		 * @param {Function} fn 函数。
		 * @param {Object} bind 位置。
		 * 注意，未来 Function.prototype.bind 是系统函数， 因此这个函数将在那个时候被 替换掉。
		 * @example
		 * <code>
		 * Function.bind(function () {return this}, 0)()    ; // 0
		 * </code>
		 */
		bind: function (fn, bind) {
			
			// 返回对 bind 绑定。
			return function () {
				return fn.apply(bind, arguments);
			}
		},
		
		/**
		 * 空函数。
		 * @property
		 * @type Function
		 * Function.empty返回空函数的引用。
		 */
		empty: emptyFn,

		/**
		 * 一个返回 true 的函数。
		 * @property
		 * @type Function
		 */
		returnTrue: from(true),

		/**
		 * 一个返回 false 的函数。
		 * @property
		 * @type Function
		 */
		returnFalse: from(false),

		/**
		 * 判断一个变量是否是函数。
		 * @param {Object} object 变量。
		 * @return {Boolean} 如果是函数，返回 true， 否则返回 false。
		 * @example
		 * <code>
		 * Function.isFunction(function () {}); // true
		 * Function.isFunction(null); // false
		 * Function.isFunction(new Function); // true
		 * </code>
		 */
		isFunction: $.isFunction,
		
		/**
		 * 返回自身的函数。
		 * @param {Object} v 需要返回的参数。
		 * @return {Function} 执行得到参数的一个函数。
		 * @hide
		 * @example
		 * <code>
		 * Function.from(0)()    ; // 0
		 * </code>
		 */
		from: from
		
	});

	/**
	 * 字符串。
	 * @namespace String
	 */
	apply(String, {

		/**
		 * 格式化字符串。
		 * @param {String} format 字符。
		 * @param {Object} ... 参数。
		 * @return {String} 格式化后的字符串。
		 * @example
		 * <code>
		 *  String.format("{0}转换", 1); //  "1转换"
		 *  String.format("{1}翻译",0,1); // "1翻译"
		 *  String.format("{a}翻译",{a:"也可以"}); // 也可以翻译
		 *  String.format("{{0}}不转换, {0}转换", 1); //  "{0}不转换1转换"
		 *  格式化的字符串{}不允许包含空格。
		 *  不要出现{{{ 和  }}} 这样将获得不可预知的结果。
		 * </code>
		 */
		format: function (format, args) {
					

			//支持参数2为数组或对象的直接格式化。
			var toString = this;
			
			args = arguments.length === 2 && o.isObject(args) ? args: [].slice.call(arguments, 1);

			//通过格式化返回
			return (format || "").replace(rFormat, function (match, name) {
				var start = match.charAt(1) == '{',
					end = match.charAt(match.length - 2) == '}';
				if (start || end) return match.slice(start, match.length - end);
				//LOG : {0, 2;yyyy} 为了支持这个格式, 必须在这里处理 match , 同时为了代码简短, 故去该功能。
				return name in args ? toString(args[name]) : "";
			});
		},
		
		/**
		 * 将一个数组源形式的字符串内容拷贝。
		 * @param {Object} str 字符串。用空格隔开。
		 * @param {Object/Function} source 更新的函数或源。
		 * @param {Object} [dest] 如果指明了， 则拷贝结果到这个目标。
		 * @param {Boolean} copyIf=false 是否跳过本来存在的数据。
		 * @example
		 * <code>
		 * String.map("aaa bbb ccc", trace); //  aaa bbb ccc
		 * String.map("aaa bbb ccc", function (v) { return v; }, {});    //    {aaa:aaa, bbb:bbb, ccc:ccc};
		 * </code>
		 */
		map: function (str, src, dest, copyIf) {
					
			
			var isFn = Function.isFunction(src);
			// 使用 ' '、分隔, 这是约定的。
			str.split(' ').forEach(function (value, index, array) {
				
				// 如果是函数，调用函数， 否则是属性。
				var val = isFn ? src(value, index, array) : src[value];
				
				// 如果有 dest ，则复制。
				if(dest && !(copyIf && (value in dest)))
					dest[value] = val;
			});
			return dest;
		},
		
		/**
		 * 返回变量的地址形式。
		 * @param {Object} obj 变量。
		 * @return {String} 字符串。
		 * @example
		 * <code>
		 * String.param({a: 4, g: 7}); //  a=4&g=7
		 * </code>
		 */
		param: $.param,
	
		/**
		 * 把字符串转为指定长度。
		 * @param {String} value   字符串。
		 * @param {Number} len 需要的最大长度。
		 * @example
		 * <code>
		 * String.ellipsis("123", 2); //   '1...'
		 * </code>
		 */
		ellipsis: function (value, len) {
			return value.length > len ?  value.substr(0, len - 3) + "..." : value;
		}
		
	});
	
	Date.now =  $.now;

	/**
	 * 浏览器。
	 * @namespace navigator
	 */
	applyIf(navigator, (function (ua, isNonStandard) {

		//检查信息
		var match = ua.match(/(IE|Firefox|Chrome|Safari|Opera|Navigator).((\d+)\.?[\d.]*)/i) || ["", "Other", 0, 0],
			
			// 版本信息。
			version = ua.match(/(Version).((\d+)\.?[\d.]*)/i) || match,
			
			// 浏览器名字。
			browser = match[1];
		
		
		navigator["is" + browser] = navigator["is" + browser + version[3]] = true;
		
		/**
		 * 获取一个值，该值指示是否为 IE 浏览器。
		 * @getter isIE
		 * @type Boolean
		 */
		
		
		/**
		 * 获取一个值，该值指示是否为 Firefox 浏览器。
		 * @getter isFirefox
		 * @type Boolean
		 */
		
		/**
		 * 获取一个值，该值指示是否为 Chrome 浏览器。
		 * @getter isChrome
		 * @type Boolean
		 */
		
		/**
		 * 获取一个值，该值指示是否为 Opera 浏览器。
		 * @getter isOpera
		 * @type Boolean
		 */
		
		/**
		 * 获取一个值，该值指示是否为 Safari 浏览器。
		 * @getter isSafari
		 * @type Boolean
		 */
		
		//结果
		return {
			
			/// #ifdef SupportIE6
			
			/**
			 * 获取一个值，该值指示当前浏览器是否支持标准事件。就目前浏览器状况， IE6，7 中 isQuirks = true  其它皆 false 。
			 * @type Boolean
			 * 此处认为 IE6,7 是怪癖的。
			 */
			isQuirks: isNonStandard && !o.isObject(document.constructor),
			
			/// #endif
			
			/// #ifdef SupportIE8
			
			/**
			 * 获取一个值，该值指示当前浏览器是否为标准浏览器。
			 * @type Boolean
			 * 此处认为 IE6, 7, 8 不是标准的浏览器。
			 */
			isStandard: !isNonStandard,
			
			/// #endif
			
			/**
			 * 获取当前浏览器的简写。
			 * @type String
			 */
			name: browser,
			
			/**
			 * 获取当前浏览器版本。
			 * @type String
			 * 输出的格式比如 6.0.0 。
			 * 这是一个字符串，如果需要比较版本，应该使用 parseFloat(navigator.version) < 4 。
			 */
			version: version[2]
			
		};
	
	})(navigator.userAgent, !-[1,]));

	/**
	 * xType。
	 */
	Date.prototype.xType = "date";
	
	/**
	 * xType。
	 */
	RegExp.prototype.xType = "regexp";
	
	
	// 把所有内建对象本地化 。
	each.call([String, Array, Function, Date, Number], p.Native);
	
	/**
	 * @class JPlus.Object
	 */
	Object.implement({
		
		/**
		 * 调用父类的成员变量。
		 * @param {String} methodName 属性名。
		 * @param {Object} ... 调用的参数数组。
		 * @return {Object} 父类返回。
		 * 注意只能从子类中调用父类的同名成员。
		 * @protected
		 * @example
		 * <code>
		 * 
		 * var MyBa = new Class({
		 *    a: function (g, b) {
		 * 	    alert(g + b);
		 *    }
		 * });
		 * 
		 * var MyCls = MyBa.extend({
		 * 	  a: function (g, b) {
		 * 	    this.base('a', g, b);   // 或   this.base('a', arguments);
		 *    }
		 * });
		 * 
		 * new MyCls().a();   
		 * </code>
		 */
		base: function (methodName, args) {
			
			var me = this.constructor,
			
				fn = this[methodName];
				
			
			// 标记当前类的 fn 已执行。
			fn.$bubble = true;
				
			
			// 保证得到的是父类的成员。
			
			do {
				me = me.base;
			} while('$bubble' in (fn = me.prototype[methodName]));
			
			
			fn.$bubble = true;
			
			// 确保 bubble 记号被移除。
			try {
				if(args === arguments.callee.caller.arguments)
					return fn.apply(this, args);
				arguments[0] = this;
				return fn.call.apply(fn, arguments);
			} finally {
				delete fn.$bubble;
			}
		}
	
	});
	
	/**
	 * @class String 
	 */
	String.implementIf({

		/// #ifdef SupportIE8

		/**
		 * 去除首尾空格。
		 * @return {String}    处理后的字符串。
	     * @example
		 * <code>
		 * "   g h   ".trim(); //     "g h"
		 * </code>
		 */
		trim: function () {
			
			// 使用正则实现。
			return $.trim(this);
		},
		
		/// #endif
		
		/**
	     * 转为骆驼格式。
	     * @param {String} value 内容。
	     * @return {String} 返回的内容。
	     * @example
		 * <code>
		 * "font-size".toCamelCase(); //     "fontSize"
		 * </code>
	     */
		toCamelCase: function () {
	        return this.replace(rToCamelCase, toUpperCase);
	    },
		
		/**
		 * 将字符首字母大写。
		 * @return {String} 大写的字符串。
	     * @example
		 * <code>
		 * "bb".capitalize(); //     "Bb"
		 * </code>
		 */
		capitalize: function () {
			
			// 使用正则实现。
			return this.replace(rFirstChar, toUpperCase);
		}

	});
	
	/**
	 * @class Array
	 */
	Array.implementIf({

		/**
		 * 对数组运行一个函数。
		 * @param {Function} fn 函数.参数 value, index
		 * @param {Object} bind 对象。
		 * @return {Boolean} 有无执行完。
		 * @method
		 * @seeAlso Array.prototype.forEach
		 * @example
		 * <code> 
		 * [2, 5].each(function (value, key) {
		 * 		trace(value);
		 * 		return false
		 * });
		 * // 输出 '2'
		 * </code>
		 */
		each: each,

		/// #ifdef SupportIE8

		/**
		 * 返回数组某个值的第一个位置。值没有,则为-1 。
		 * @param {Object} item 成员。
		 * @param {Number} start=0 开始查找的位置。
		 * @return Number 位置，找不到返回 -1 。 
		 * 现在大多数浏览器已含此函数.除了 IE8-  。
		 */
		indexOf: function (item, startIndex) {
			startIndex = startIndex || 0;
			for (var len = this.length; startIndex < len; startIndex++)
				if (this[startIndex] === item)
					return startIndex;
			return -1;
		},
		
		/**
		 * 对数组每个元素通过一个函数过滤。返回所有符合要求的元素的数组。
		 * @param {Function} fn 函数。参数 value, index, this。
		 * @param {Object} bind 绑定的对象。
		 * @return {Array} 新的数组。
		 * @seeAlso Array.prototype.select
		 * @example
		 * <code> 
		 * [1, 7, 2].filter(function (key) {return key &lt; 5 })   [1, 2]
		 * </code>
		 */
		filter: function (fn, bind) {
			var r = [];
			[].forEach.call(this, function (value, i, array) {
				
				// 过滤布存在的成员。
				if(fn.call(this, value, i, array))
					r.push(value);
			}, bind);
			
			return r;

		},

		/**
		 * 对数组内的所有变量执行函数，并可选设置作用域。
		 * @method
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Number} index 当前变量的索引} {@param {Array} array 数组本身}
		 * @param {Object} bind 函数执行时的作用域。
		 * @seeAlso Array.prototype.each
		 * @example
		 * <code> 
		 * [2, 5].forEach(function (value, key) {
		 * 		trace(value);
		 * });
		 * // 输出 '2' '5'
		 * </code>
		 * */
		forEach: each,
		
		/// #endif

		/**
		 * 包含一个元素。元素存在直接返回。
		 * @param {Object} value 值。
		 * @return {Boolean} 是否包含元素。
		 * @example
		 * <code>
		 * ["", "aaa", "zzz", "qqq"].include(""); //   true
		 * [false].include(0);	//   false
		 * </code>
		 */
		include: function (value) {
			
			//未包含，则加入。
			var b = this.indexOf(value) !== -1;
			if(!b)
				this.push(value);
			return b;
		},
		
		/**
		 * 在指定位置插入项。
		 * @param {Number} index 插入的位置。
		 * @param {Object} value 插入的内容。
		 * @example
		 * <code>
		 * ["", "aaa", "zzz", "qqq"].insert(3, 4); //   ["", "aaa", "zzz", 4, "qqq"]
		 * </code>
		 */
		insert: function (index, value) {
			var me = this,
				tmp = [].slice.call(me, index);
			me.length = index + 1;
			this[index] = value;
			[].push.apply(me, tmp);
			return me;
			
		},
		
		/**
		 * 对数组成员调用指定的成员，返回结果数组。
		 * @param {String} func 调用的成员名。
		 * @param {Array} args 调用的参数数组。
		 * @return {Array} 结果。
		 * @example
		 * <code>
		 * ["vhd"].invoke('charAt', [0]); //    ['v']
		 * </code>
		 */
		invoke: function (func, args) {
			var r = [];
			[].forEach.call(this, function (value) { 
				r.push(value[func].apply(value, args));
			});
			
			return r;
		},
		
		/**
		 * 删除数组中重复元素。
		 * @return {Array} 结果。
		 * @example
		 * <code>
		 * [1,7,8,8].unique(); //    [1, 7, 8]
		 * </code>
		 */
		unique: function () {
			
			return $.unique(this);
		},
		
		/**
		 * 删除元素, 参数为元素的内容。
		 * @param {Object} value 值。
		 * @return {Number} 删除的值的位置。
		 * @example
		 * <code>
		 * [1,7,8,8].remove(7); //   1
		 * </code>
		 */
		remove: function (value, startIndex) {
			
			// 找到位置， 然后删。
			var i = [].indexOf.call(this, value, startIndex);
			if(i !== -1) [].splice.call(this, i, 1);
			return i;
		},
			
		/**
		 * 获取指定索引的元素。如果 index < 0， 则获取倒数 index 元素。
		 * @param {Number} index 元素。
		 * @return {Object} 指定位置所在的元素。
		 * @example
		 * <code>
		 * [1,7,8,8].item(0); //   1
		 * [1,7,8,8].item(-1); //   8
		 * [1,7,8,8].item(5); //   undefined
		 * </code>
		 */
		item: function (index) {
			return this[index < 0 ? this.length + index : index];
		},
		
		/**
		 * xType。
		 */
		xType: "array"

	});
	
	/**
	 * @class
	 */
	
	/// #endregion

	/// #region 页面
	
		
	if(!window.execScript)
	
		/**
		 * 全局运行一个函数。
		 * @param {String} statement 语句。
		 * @return {Object} 执行返回值。
		 * @example
		 * <code>
		 * execScript('alert("hello")');
		 * </code>
		 */
		window.execScript = function(statements) {
			
			// 如果正常浏览器，使用 window.eval  。
			window.eval(statements);

		};
		
	// 将以下成员赋予 window ，这些成员是全局成员。
	String.map('undefined Class IEvent using namespace', p, window);
	
	IEvent.bind = IEvent.on;
	IEvent.unbind = IEvent.un;
	
	/**
	 * id种子 。
	 * @type Number
	 */
	p.id = Date.now() % 100;

	/// #endregion
	
	/// #region 函数
	
	/**
	 * 如果不存在就复制所有属性到任何对象。 
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function applyIf(dest, src) {
		
		
		// 和 apply 类似，只是判断目标的值是否为 undefiend 。
		for (var b in src)
			if (dest[b] === undefined)
				dest[b] = src[b];
		return dest;
	}

	/**
	 * 对数组运行一个函数。
	 * @param {Function} fn 遍历的函数。参数依次 value, index, array 。
	 * @param {Object} bind 对象。
	 * @return {Boolean} 返回一个布尔值，该值指示本次循环时，有无出现一个函数返回 false 而中止循环。
	 */
	function each(fn, bind) {
		
		
		var i = -1,
			me = this;
			
		while (++i < me.length)
			if(fn.call(bind, me[i], i, me) === false)
				return false;
		return true;
	}
	
	/**
	 * 所有自定义类的基类。
	 */
	function Object() {
	
	}
	
	/**
	 * 返回返回指定结果的函数。
	 * @param {Object} ret 结果。
	 * @return {Function} 函数。
	 */
	function from(ret) {
		
		// 返回一个值，这个值是当前的参数。
		return function () {
			return ret;
		}
	}
	
	/**
	 * 将一个字符转为大写。
	 * @param {String} match 字符。
	 */
	function toUpperCase(ch, match) {
		return match.toUpperCase();
	}
	
	/**
	 * 获取指定的对象所有的事件管理器。
	 * @param {Object} obj 要使用的对象。
	 * @param {String} type 事件名。
	 * @return {Object} 符合要求的事件管理器，如果找不到合适的，返回默认的事件管理器。
	 */
	function getMgr(eMgr, type) {
		var evt = eMgr.constructor;
		
		// 遍历父类， 找到适合的 eMgr 。
		while(!(eMgr = eventMgr[eMgr.xType]) || !(eMgr = eMgr[type])) {
			
			if(evt && (evt = evt.base)) {
				eMgr = evt.prototype;
			} else {
				return eventMgr.$default;
			}
		
		}
		
		return eMgr;
	}

	/**
	 * 定义名字空间。
	 * @param {String} ns 名字空间。
	 * @param {Object} obj 值。
	 */
	function namespace(ns, obj) {
		
		
		
		// 简单声明。
		if (arguments.length == 1) {
			
			return;
		}
		
		// 取值，创建。
		ns = ns.split('.');
		
		// 如果第1个字符是 ., 则表示内置使用的名字空间。
		var current = window, i = -1, len = ns.length - 1, dft = !ns[0];
		
		// 如果第一个字符是 . 则补上默认的名字空间。
		ns[0] = ns[0] || p.defaultNamespace;
		
		// 依次创建对象。
		while(++i < len)
			current = current[ns[i]] || (current[ns[i]] = {});

  		// 如果最后一个对象是 . 则覆盖到最后一个对象， 否则更新到末尾。
		if(i = ns[len])
			current[i] = applyIf(obj, current[i] || {});
		else {
			obj = applyIf(current, obj);
			i = ns[len - 1];
		}
		
		// 如果是内置使用的名字空间，将最后一个成员更新为全局对象。
		if(dft)
			window[i] = obj;
		
		return obj;
		
		
		
	}

	/// #endregion

})(jQuery);




function assert(bValue, msg){
	if (!bValue){
		var val = arguments;

		// 如果启用 [参数] 功能
		if (val.length > 2) {
			var i = 2;
			msg = msg.replace(/\{([\w\.\(\)]*?)\}/g, function (s, x) {
				return val.length <= i ? s : x + " = " + String.ellipsis(trace.inspect(val[i++]), 200);
			});
		}else {
			msg = msg || "断言失败";
		}
		
		throw new Error(msg);
	}
}




//===========================================
//  jQuery plugin - J+ Element Adapter
//===========================================

(function ($) {
	
	/**
	 * Object  简写。
	 * @type Object
	 */
	var o = Object,
		
		/**
		 * Object.extend
		 * @type Function
		 */
		apply = o.extend,
	
		/**
		 * 数组原型。
		 * @type Object
		 */
		ap = Array.prototype,
		
		/**
		 * String.map 缩写。
		 * @type Object
		 */
		map = String.map,
		
		/**
		 * JPlus 简写。
		 * @namespace JPlus
		 */
		p = JPlus,
		
		/// #ifdef SupportIE6
		
		/**
		 * 元素。
		 * @type Function
		 * 如果页面已经存在 Element， 不管是不是用户自定义的，都直接使用。只需保证 Element 是一个函数即可。
		 */
		e = window.Element || function() {},
		
		/// #else
		
		/// e = window.Element,
		
		/// #endif
		
		/**
		 * 元素原型。
		 * @type Object
		 */
		ep = e.prototype,
	
		/**
		 * 用于测试的元素。
		 * @type Element
		 */
		div = document.createElement('DIV'),
		
		/**
		 * 根据一个 id 获取元素。如果传入的id不是字符串，则直接返回参数。
		 * @param {String/Element/Control} id 要获取元素的 id 或元素。
		 */
		$$ = getElementById,
	
		/// #endif

		/// #ifdef ElementAttribute
	
		/**
		 * 表示事件的表达式。
		 * @type RegExp
		 */
		rEventName = /^on(\w+)/,
	
		/// #endif
	
		/// #ifdef SupportIE8
	
		/**
		 * 获取元素的实际的样式属性。
		 * @param {Element} elem 需要获取属性的节点。
		 * @param {String} name 需要获取的CSS属性名字。
		 * @return {String} 返回样式字符串，肯能是 undefined、 auto 或空字符串。
		 */
		getStyle = $.css,

		/// #if defined(ElementAttribute) || defined(ElementStyle)
	
		/**
		 * 是否属性的正则表达式。
		 * @type RegExp
		 */
		rStyle = /-(\w)|float/,
	
		/// #endif
		
		/// #ifdef ElementEvent
		
		/**
		 * @class Event
		 * 用来支持自定义事件的事件对象。
		 */
		pep = {
	
			/**
			 * 构造函数。
			 * @param {Object} target 事件对象的目标。
			 * @param {String} type 事件对象的类型。
			 * @param {Object} [e] 事件对象的属性。
			 * @constructor
			 */
			constructor: function (target, type, e) {
				
				var me = this;
				me.target = target;
				me.srcElement = $$(target.dom || target);
				me.type = type;
				apply(me, e);
			},

			/**
			 * 阻止事件的冒泡。
			 * @remark
			 * 默认情况下，事件会向父元素冒泡。使用此函数阻止事件冒泡。
			 */
			stopPropagation : function () {
				this.cancelBubble = true;
			},
					
			/**
			 * 取消默认事件发生。
			 * @remark
			 * 有些事件会有默认行为，如点击链接之后执行跳转，使用此函数阻止这些默认行为。
			 */
			preventDefault : function () {
				this.returnValue = false;
			},
			
			/**
			 * 停止默认事件和冒泡。
			 * @remark
			 * 此函数可以完全撤销事件。
			 * 事件处理函数中 return false 和调用 stop() 是不同的， return false 只会阻止当前事件其它函数执行，
			 * 而 stop() 只阻止事件冒泡和默认事件，不阻止当前事件其它函数。
			 */
			stop: function () {
				this.stopPropagation();
				this.preventDefault();
			}
			
		},
	
		/**
		 * @type Function
		 */
		initUIEvent,
	
		/**
		 * @type Function
		 */
		initMouseEvent,
	
		/**
		 * @type Function
		 */
		initKeyboardEvent,
		
		/// #endif
		
		/// #if !defind(SupportIE8) && (ElementEvent || ElementDomReady)
		
		/**
		 * 扩展的事件对象。
		 */
		eventObj = {
			
			/**
			 * 绑定一个监听器。
			 * @method
			 * @param {String} type 类型。
			 * @param {Function} listener 函数。
			 * @seeAlso removeEventListener
			 * @example
			 * <code>
			 * document.addEventListener('click', function () {
			 * 	
			 * });
			 * </code>
			 */
			addEventListener: document.addEventListener ? function (type, listener) {
				
				//  因为 IE 不支持，所以忽略 第三个参数。
				this.addEventListener(type, listener, false);
				
			} : function (type, listener) {
			
				// IE8- 使用 attachEvent 。
				this.attachEvent('on' + type, listener);
				
			},
	
			/**
			 * 移除一个监听器。
			 * @method
			 * @param {String} type 类型。
			 * @param {Function} listener 函数。
			 *  @param {Boolean} state 类型。
			 * @seeAlso addEventListener
			 * @example
			 * <code>
			 * document.removeEventListener('click', function () {
			 * 
			 * });
			 * </code>
			 */
			removeEventListener: document.removeEventListener ? function (type, listener) {
			
				//  因为 IE 不支持，所以忽略 第三个参数。
				this.removeEventListener(type, listener, false);
				
			}:function (type, listener) {
			
				// IE8- 使用 detachEvent 。
				this.detachEvent('on' + type, listener);
				
			}
		
		},
		
		/// #endif
		
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 判断 body 节点的正则表达式。
		 * @type RegExp
		 */
		rBody = /^(?:BODY|HTML|#document)$/i,
		
		/**
		 * 测试是否是绝对位置的正则表达式。
		 * @type RegExp
		 */
		rMovable = /^(?:abs|fix)/,
		
		/**
		 * 获取窗口滚动大小的方法。
		 * @type Function
		 */
		getWindowScroll,
		
		/// #endif
	
		/**
		 * 一个点。
		 * @class Point
		 */
		Point = namespace(".Point", Class({
	
			/**
			 * 初始化 Point 的实例。
			 * @param {Number} x X 坐标。
			 * @param {Number} y Y 坐标。
			 * @constructor Point
			 */
			constructor: function (x, y) {
				this.x = x;
				this.y = y;
			},
	
			/**
			 * 将 (x, y) 增值。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			add: function (p) {
				return new Point(this.x + p.x, this.y + p.y);
			},
	
			/**
			 * 将一个点坐标减到当前值。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			sub: function (p) {
				return new Point(this.x - p.x, this.y - p.y);
			}
			
		})),
		
		/**
		 * 文档对象。
		 * @class Document
		 * 文档对象是对原生 HTMLDocument 对象的补充， 因为 IE6/7 不存在这些对象。
		 * 扩展 Document 也会扩展 HTMLDocument。
		 */
		Document = p.Native(document.constructor || {prototype: document}),
		
		/**
		 * 所有控件基类。
		 * @class Control
		 * @abstract
		 * @extends Element
		 * 控件的周期：
		 * constructor  -  创建控件对于的 Javascript 类。 不建议重写，除非你知道你在做什么。
		 * create - 创建本身的 dom 节点。 可重写 - 默认使用  this.tpl 创建。
		 * init - 初始化控件本身。 可重写 - 默认为无操作。
		 * render - 渲染控件到文档。 不建议重写，如果你希望额外操作渲染事件，则重写。
		 * detach - 删除控件。不建议重写，如果一个控件用到多个 dom 内容需重写。
		 */
		Control = namespace(".Control", Class({
			
			/**
			 * 封装的节点。
			 * @type Element
			 */
			dom: null,
			
			/**
			 * xType 。
			 */
			xType: "control",
		
			/**
			 * 根据一个节点返回。
			 * @param {String/Element/Object} [options] 对象的 id 或对象或各个配置。
			 */
			constructor: function (options) {
				
				// 这是所有控件共用的构造函数。
				
				var me = this,
				
					// 临时的配置对象。
					opt = apply({}, me.options),
					
					// 当前实际的节点。
					dom;
					
				
				// 如果存在配置。
				if (options) {
					
					// 如果参数是一个 DOM 节点或 ID 。
					if (typeof options == 'string' || options.nodeType) {
						
						// 直接赋值， 在下面用 $ 获取节点 。
						dom = options;
					} else {
						
						// 否则 options 是一个对象。
						
						// 复制成员到临时配置。
						apply(opt, options);
						
						// 保存 dom 。
						dom = opt.dom;
						delete opt.dom;
					}
				}
				
				// 如果 dom 的确存在，使用已存在的， 否则使用 create(opt)生成节点。
				me.dom = dom ? $$(dom) : me.create(opt);
				
				
				// 调用 init 初始化控件。
				me.init(opt);
				
				// 处理样式。
				if('style' in opt) {
					me.dom.style.cssText += ';' + opt.style;
					delete opt.style;
				}
				
				// 复制各个选项。
				Object.set(me, opt);
			},
			
			/**
			 * 当被子类重写时，生成当前控件。
			 * @param {Object} options 选项。
			 * @protected
			 */
			create: function() {
				
				
				// 转为对 tpl解析。
				return Element.parse(this.tpl);
			},
			
			/**
			 * 当被子类重写时，渲染控件。
			 * @method
			 * @param {Object} options 配置。
			 * @protected
			 */
			init: Function.empty,
			
			/**
			 * 创建当前节点的副本，并返回节点的包装。
			 * @param {cloneContent} 是否复制内容 。
		     * @return {Control} 新的控件。
			 */
			cloneNode: function (cloneContent) {
				return new this.constructor(this.dom.cloneNode(cloneContent));
			},
			
			/**
		     * 创建并返回控件的副本。
		     * @param {Boolean} keepId=fasle 是否复制 id 。
		     * @return {Control} 新的控件。
		     */
			clone: function(keepId) {
				
				// 创建一个控件。
				return  new this.constructor(this.dom.nodeType === 1 ? this.dom.clone(false, true, keepId) : this.dom.cloneNode(!keepId));
				
			}
			
		})),
		
		/**
		 * 节点集合。
		 * @class ElementList
		 * @extends Array
		 * ElementList 是对元素数组的只读包装。
		 * ElementList 允许快速操作多个节点。
		 * ElementList 的实例一旦创建，则不允许修改其成员。
		 */
		ElementList = namespace(".ElementList", 
		
		/// #ifdef SupportIE6
		
		(navigator.isQuirks ? p.Object : Array)
		
		/// #else
		
		/// Array
		
		/// #endif
		
		.extend({
			
			/**
			 * 获取当前集合的元素个数。
			 * @type {Number}
			 * @property
			 */
			length: 0,
	
			/**
			 * 初始化   ElementList  实例。
			 * @param {Array/ElementList} doms 节点集合。
			 * @constructor
			 */
			constructor: function (doms) {
				
				if(doms) {
		
					
					var len = this.length = doms.length;
					while(len--)
						this[len] = doms[len];
		
					/// #ifdef SupportIE8
					
					// 检查是否需要为每个成员调用  $ 函数。
					if(!navigator.isStandard)
						o.update(this, $$);
						
					/// #endif
				
				}
				
			},
			
			/**
			 * 将参数数组添加到当前集合。
			 * @param {Element/ElementList} value 元素。
			 * @return this
			 */
			concat: function (value) {
				if(value) {
					value = value.length !== undefined ? value : [value];
					for(var i = 0, len = value.length; i < len; i++)
						this.include(value[i]);
				}
				
				return this;
			},
			
			/**
			 * 对每个元素执行 cloneNode, 并返回新的元素的集合。
			 * @param {Boolean} cloneContent 是否复制子元素。
			 * @return {ElementList} 复制后的新元素组成的新集合。
			 */
			cloneNode: function (cloneContent) {
				var i = this.length,
					r = new ElementList();
				while(i--)
					r[i] = this[i].cloneNode(cloneContent);
				return r;
			},
	
			/**
			 * xType
			 */
			xType: "elementlist"
	
		}));
	
	/// #ifdef SupportIE6
	
	if(navigator.isQuirks) {
		map("pop shift", ap, apply(apply(ElementList.prototype, ap), {
			
			push: function() {
				return ap.push.apply(this, o.update(arguments, $));
			},
			
			unshift: function() {
				return ap.unshift.apply(this, o.update(arguments, $));
			}
			
		}));
	}
	
	/// #endif

	map("filter slice splice reverse", function(func) {
		return function() {
			return new ElementList(ap[func].apply(this, arguments));
		};
	}, ElementList.prototype);
	
	/**
	 * 根据 x, y 获取 {x: x y: y} 对象
	 * @param {Number/Point} x
	 * @param {Number} y
	 * @static
	 * @private
	 */
	Point.format = formatPoint;
		
	/**
	 * @class Element
	 */
	apply(e, {
		
		/// #ifdef ElementCore
		
		/**
		 * 转换一个HTML字符串到节点。
		 * @param {String/Element} html 字符。
		 * @param {Element} context 生成节点使用的文档中的任何节点。
		 * @param {Boolean} cachable=true 是否缓存。
		 * @return {Element/TextNode/DocumentFragment} 元素。
		 * @static
		 */
		parse: function (html, context, cachable) {

			
			// 已经是 Element 或  ElementList。
			if(html.xType)
				return html;
			
			if(html.nodeType)
				return new Control(html);
				
			
			context = context && context.ownerDocument || document;
			
			if(/<\w+/.test(html) ) {

				var div =  $(html, context);
				
				return div.length === 1 ? $$(div[0]) : new ElementList(div);
			
			}
			
			return new Control( context.createTextNode(html));

		},
		
		/// #endif
		
		/// #ifdef ElementManipulation
			
		/**
		 * 判断指定节点之后有无存在子节点。
		 * @param {Element} elem 节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
		 */
		hasChild: div.compareDocumentPosition ? function (elem, child) {
			return !!(elem.compareDocumentPosition(child) & 16);
		} : function (elem, child) {
			while(child = child.parentNode)
				if(elem === child)
					return true;
					
			return false;
		},
		
		/// #endif
		
		/// #ifdef ElementTraversing
		
		/**
		 * 用于 get 的名词对象。
		 * @type String
		 */
		treeWalkers: {
	
			// 全部子节点。
			all: 'all' in div ? function (elem, fn) { // 返回数组
				var r = new ElementList;
				ap.forEach.call(elem.all, function(elem) {
					if(fn(elem))
						r.push(elem);
				});
				return  r;
			} : function (elem, fn) {
				var r = new ElementList, doms = [elem];
				while (elem = doms.pop()) {
					for(elem = elem.firstChild; elem; elem = elem.nextSibling)
						if (elem.nodeType === 1) {
							if (fn(elem))
								r.push(elem);
							doms.push(elem);
						}
				}
				
				return r;
			},
	
			// 上级节点。
			parent: createTreeWalker(true, 'parentNode'),
	
			// 第一个节点。
			first: createTreeWalker(true, 'nextSibling', 'firstChild'),
	
			// 后面的节点。
			next: createTreeWalker(true, 'nextSibling'),
	
			// 前面的节点。
			previous: createTreeWalker(true, 'previousSibling'),
	
			// 最后的节点。
			last: createTreeWalker(true, 'previousSibling', 'lastChild'),
			
			// 全部子节点。
			children: createTreeWalker(false, 'nextSibling', 'firstChild'),
			
			// 最相邻的节点。
			closest: function(elem, args) {
				return args(elem) ? elem : this.parent(elem, args);
			},
	
			// 全部上级节点。
			parents: createTreeWalker(false, 'parentNode'),
	
			// 后面的节点。
			nexts: createTreeWalker(false, 'nextSibling'),
	
			// 前面的节点。
			previouses: createTreeWalker(false, 'previousSibling'),
	
			// 奇数个。
			odd: function(elem, args) {
				return this.even(elem, !args);
			},
			
			// 偶数个。
			even: function (elem, args) {
				return this.children(elem, function (elem) {
					return args = !args;
				});
			},
	
			// 兄弟节点。
			siblings: function(elem, args) {
				return this.previouses(elem, args).concat(this.nexts(elem, args));
			},
			
			// 号次。
			index: function (elem) {
				var i = 0;
				while(elem = elem.previousSibling)
					if(elem.nodeType === 1)
						i++;
				return i;
			},
			
			// 偏移父位置。
			offsetParent: function (elem) {
				var me = elem;
				while ( (me = me.offsetParent) && !rBody.test(me.nodeName) && getStyle(me, "position") === "static" );
				return $(me || getDocument(elem).body);
			}
	
		},

		/**
		 * 获取一个节点属性。
		 * @static
		 * @param {Element} elem 元素。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: $.attr,

		/**
		 * 检查是否含指定类名。
		 * @param {Element} elem 元素。
		 * @param {String} className 类名。
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function (elem, className) {
			return $(elem).hasClass(className);
		},
		
		/**
		 * 获取元素的计算样式。
		 * @param {Element} dom 节点。
		 * @param {String} name 名字。
		 * @return {String} 样式。
		 */
		getStyle: getStyle,

		/**
		 * 读取样式字符串。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 */
		styleString:  getStyle,

		/**
		 * 读取样式数字。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 * @static
		 */
		styleNumber: styleNumber,

		/**
		 * 样式表。
		 * @static
		 * @type Object
		 */
		sizeMap: {},
		
		/**
		 * 显示元素的样式。
		 * @static
		 * @type Object
		 */
		display: { position: "absolute", visibility: "visible", display: "block" },

		/**
		 * 不需要单位的 css 属性。
		 * @static
		 * @type Object
		 */
		styleNumbers: map('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', {}, {}),
	
		/**
		 * 默认最大的 z-index 。
		 * @property
		 * @type Number
		 * @private
		 * @static
		 */
		zIndex: 10000,
		
		/**
		 * 清空元素的 display 属性。
		 * @param {Element} elem 元素。
		 */
		show: function (elem) {
			$(elem).show();
		},
		
		/**
		 * 赋予元素的 display 属性 none。
		 * @param {Element} elem 元素。
		 */
		hide: function (elem) {
			$(elem).hide();
		},
		
		/**
		 * 获取指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 * @return {Object} 收集的属性。
		 */
		getStyles: function (elem, styles) {

			var r = {};
			for(var style in styles) {
				r[style] = elem.style[style];
			}
			return r;
		},
		
		/**
		 * 设置指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 */
		setStyles: function (elem, styles) {

			apply(elem.style, styles);
		},
	
		/// #endif
		
		/// #if defined(ElementDimension) ||  defined(ElementStyle)

		/**
		 * 根据不同的内容进行计算。
		 * @param {Element} elem 元素。
		 * @param {String} type 输入。 一个 type 由多个句子用,连接，一个句子由多个词语用+连接，一个词语由两个字组成， 第一个字可以是下列字符之一: m b p t l r b h w  第二个字可以是下列字符之一: x y l t r b。词语也可以是: outer inner  。 
		 * @return {Number} 计算值。
		 * mx+sx ->  外大小。
		 * mx-sx ->  内大小。
		 */
		getSize: (function() {
			
			var borders = {
					m: 'margin#',
					b: 'border#Width',
					p: 'padding#'
				},
				map = {
					t: 'Top',
					r: 'Right',
					b: 'Bottom',
					l: 'Left'
				},
				init,
				tpl,
				rWord = /\w+/g;
				
			if(window.getComputedStyle) {
				init = 'var c=e.ownerDocument.defaultView.getComputedStyle(e,null);return ';
				tpl	= '(parseFloat(c["#"]) || 0)';
			} else {
				init = 'return ';
				tpl	= '(parseFloat(Element.getStyle(e, "#")) || 0)';
			}
			
			/**
			 * 翻译 type。
			 * @param {String} type 输入字符串。
			 * @return {String} 处理后的字符串。
			 */
			function format(type) {
				var t, f = type.charAt(0);
				switch(type.length) {
					
					// borders + map
					// borders + x|y
					// s + x|y
					case 2:
						t = type.charAt(1);
						if(t in map) {
							t = borders[f].replace('#', map[t]);
						} else {
							return f === 's' ? 'e.offset' + (t === 'x' ? 'Width' : 'Height')  :
									'(' + format(f + (t !== 'y' ? 'l' : 't')) + '+' + 
									format(f + (t === 'x' ? 'r' : 'b')) + ')';
						}
							
						break;
					
					// map
					// w|h
					case 1:
						if(f in map) {
							t = map[f].toLowerCase();
						} else if(f !== 'x' && f !== 'y') {
							return 'Element.styleNumber(e,"' + (f === 'h' ? 'height' : 'width') + '")';
						} else {
							return f;	
						}
						
						break;
						
					default:
						t = type;
				}
				
				return tpl.replace('#', t);
			}
			
			return function (elem, type) {
				return (e.sizeMap[type] || (e.sizeMap[type] = new Function("e", init + type.replace(rWord, format))))(elem);
			}
		
		})(),
		
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 设置一个元素可拖动。
		 * @param {Element} elem 要设置的节点。
		 * @static
		 */
		setMovable: function (elem) {
			if(!rMovable.test(getStyle(elem, "position")))
				elem.style.position = "relative";
		},
		
		/// #endif
		
		/**
		 * 将一个成员附加到 Element 对象和相关类。
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 ElementList 实例。
		 * @return {Element} this
		 * @static
		 * 对 Element 扩展，内部对 Element ElementList document 皆扩展。
		 * 这是由于不同的函数需用不同的方法扩展，必须指明扩展类型。
		 * 所谓的扩展，即一个类所需要的函数。
		 *
		 *
		 * DOM 方法 有 以下种
		 *
		 *  1,   其它    setText - 执行结果返回 this， 返回 this 。(默认)
		 *  2  getText - 执行结果是数据，返回结果数组。 
		 *  3  getElementById - 执行结果是DOM 或 ElementList，返回  ElementList 包装。
		 *  4   hasClass - 只要有一个返回等于 true 的值， 就返回这个值。
		 * 
		 *
		 *  参数 copyIf 仅内部使用。
		 */
		implement: function (members, listType, copyIf) {

			
			Object.each(members, function (value, func) {
				
				var i = this.length;
				while(i--) {
					var cls = this[i].prototype;
					if(!copyIf || !cls[func]) {
						
						if(!i) {
							switch (listType) {
								case 2:  //   return array
									value = function () {
										return this.invoke(func, arguments);
									};
									break;
									
								case 3:  //  return ElementList
									value = function () {
										var args = arguments, r = new ElementList;
										this.forEach(function (node) {
											r.concat(node[func].apply(node, args));
										});
										return r;
			
									};
									break;
								case 4: // return if true
									value = function () {
										var me = this, i = -1, item = null;
										while (++i < me.length && !item)
											item = me[i][func].apply(me[i], arguments);
										return item;
									};
									break;
								default:  // return  this
									value = function () {
										var me = this, len = me.length, i = -1;
										while (++i < len)
											me[i][func].apply(me[i], arguments);
										return this;
									};
									
							}
						}
						
						cls[func] = value;
					}
				}
				
				
				
				
			}, [ElementList, Document, e, Control]);
			
			/// #ifdef SupportIE8

			if(ep.$version) {
				ep.$version++;
			}

			/// #endif

			return this;
		},

		/**
		 * 若不存在，则将一个对象附加到 Element 对象。
		 * @static
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 ElementList 实例。
		 * @param {Number} docType 说明如何复制到 Document 实例。
		 * @return {Element} this
		 */
		implementIf: function (obj, listType) {
			return this.implement(obj, listType, true);
		},
		
		/**
		 * 定义事件。
		 * @param {String} 事件名。
		 * @param {Function} trigger 触发器。
		 * @return {Function} 函数本身
		 * @static
		 * @memberOf Element
		 * 原则 Element.addEvents 可以解决问题。 但由于 DOM 的特殊性，额外提供 defineEvents 方便定义适合 DOM 的事件。
		 * defineEvents 主要解决 3 个问题:
		 * <ol>
		 * <li> 多个事件使用一个事件信息。
		 *      <p>
		 * 	 	 	所有的 DOM 事件的  add 等 是一样的，因此这个函数提供一键定义: JPlus.defineEvents('e1 e2 e3')
		 * 		</p>
		 * </li>
		 *
		 * <li> 事件别名。
		 *      <p>
		 * 	 	 	一个自定义 DOM 事件是另外一个事件的别名。
		 * 			这个函数提供一键定义依赖: JPlus.defineEvents('mousewheel', 'DOMMouseScroll')
		 * 		</p>
		 * </li>
		 *
		 * <li> 事件委托。
		 *      <p>
		 * 	 	 	一个自定义 DOM 事件经常依赖已有的事件。一个事件由另外一个事件触发， 比如 ctrlenter 是在 keyup 基础上加工的。
		 * 			这个函数提供一键定义依赖: JPlus.defineEvents('ctrlenter', 'keyup', function (e) { (判断事件) })
		 * 		</p>
		 * </li>
		 *
		 * @example
		 * <code>
		 *
		 * Element.defineEvents('mousewheel', 'DOMMouseScroll')  //  在 FF 下用   mousewheel
		 * 替换   DOMMouseScroll 。
		 *
		 * Element.defineEvents('mouseenter', 'mouseover', function (e) {
		 * 	  if( !isMouseEnter(e) )   // mouseenter  是基于 mouseover 实现的事件，  因此在 不是
		 * mouseenter 时候 取消事件。
		 *        e.returnValue = false;
		 * });
		 *
		 * </code>
		 */
		addEvents: function (events, baseEvent, initEvent) {
			
			var ee = p.Events.element;
			
			if(Object.isObject(events)) {
				p.Object.addEvents.call(this, events);
				return this;
			}
			
			
			// 删除已经创建的事件。
			delete ee[events];
			
	
			// 对每个事件执行定义。
			map(events, Function.from(o.extendIf(Function.isFunction(baseEvent) ? {
	
				initEvent: baseEvent
	
			} : {
	
				initEvent: initEvent ? function (e) {
					return ee[baseEvent].initEvent.call(this, e) !== false && initEvent.call(this, e);
				} : ee[baseEvent].initEvent,
	
				//  如果存在 baseEvent，定义别名， 否则使用默认函数。
				add: function (elem, type, fn) {
					elem.addEventListener(baseEvent, fn, false);
				},
	
				remove: function (elem, type, fn) {
					elem.removeEventListener(baseEvent, fn, false);
				}
	
			}, ee.$default)), ee);
	
			return e.addEvents;
		},
		
		/**
		 * 获取元素的文档。
		 * @param {Element} elem 元素。
		 * @return {Document} 文档。
		 */
		getDocument: getDocument
		
	})
		
	/// #if !defind(SupportIE8) && (ElementEvent || ElementDomReady)
	
	/**
	 * xType
	 * @type String
	 */
	.implementIf(apply({xType: "element"}, eventObj))
	
	/// #else
	
	/// .implementIf({xType: "element"})
		
	/// #endif
	
	.implement({
	
		/// #ifdef ElementManipulation

		/**
		 * 将当前节点添加到其它节点。
		 * @param {Element/String} elem=document.body 节点、控件或节点的 id 字符串。
		 * @return {Element} this
		 * this.appendTo(parent)  相当于 elem.appendChild(this) 。
		 * appendTo 同时执行  render(parent, null) 通知当前控件正在执行渲染。
		 */
		appendTo: function (parent) {
			
			// 切换到节点。
			parent = parent && parent !== true ? $(parent) : document.body;

			// 插入节点
			return this.render(parent, null);

		},
		
		/**
		 * 将当前列表添加到指定父节点。
		 * @param {Element/Control} parent 渲染的目标。
		 * @param {Element/Control} refNode 渲染的位置。
		 * @protected
		 */
		render: function (parent, refNode) {
			return parent.insertBefore(this.dom || this, refNode);
		},

		/**
		 * 删除元素子节点或本身。
		 * @param {Object/Undefined} child 子节点。
		 * @return {Element} this
		 */
		remove: function (child) {
			
			// 没有参数， 删除本身。
			if(!arguments.length)
				return this.detach();
				
			child.detach ? child.detach() : this.removeChild(child);
			return this;
		},
		
		/**
		 * 移除节点本身。
		 */
		detach: function() {
			var elem = this.dom || this;
			elem.parentNode && elem.parentNode.removeChild(elem);
			return this;
		},

		/**
		 * 释放节点所有资源。
		 */
		dispose: function () {
			this.detach();
		},
		
		/// #endif
		
		/// #ifdef ElementStyle

		/**
		 * 设置连接的透明度。
		 * @param {Number} value 透明度， 0 - 1 。
		 * @return {Element} this
		 */
		setOpacity: function (value) {
			$(this.dom || this).css('opacity', value);
			return this;

		},

		/**
		 * 设置元素不可选。
		 * @param {Boolean} value 是否可选。
		 * @return this
		 */
		setUnselectable: 'unselectable' in div ? function (value) {

			(this.dom || this).unselectable = value !== false ? 'on' : '';
			return this;
		} : 'onselectstart' in div ? function (value) {

			(this.dom || this).onselectstart = value !== false ? Function.returnFalse : null;
			return this;
		} : function (value) {

			(this.dom || this).style.MozUserSelect = value !== false ? 'none' : '';
			return this;
		},

		/**
		 * 将元素引到最前。
		 * @param {Element} [elem] 参考元素。
		 * @return this
		 */
		bringToFront: function (elem) {
			
			
			var thisElem = this.dom || this,
				targetZIndex = elem && (parseInt(getStyle(elem.dom || elem, 'zIndex')) + 1) || e.zIndex++;
			
			// 如果当前元素的 z-index 未超过目标值，则设置
			if(!(getStyle(thisElem, 'zIndex') > targetZIndex))
				thisElem.style.zIndex = targetZIndex;
			
			return this;
		},
		
		/// #endif
		
		/// #ifdef ElementAttribute

		/**
		 * 快速设置节点全部属性和样式。
		 * @param {String/Object} name 名字。
		 * @param {Object} [value] 值。
		 * @return {Element} this
		 */
		set: function (name, value) {

			var me = this;

			if (typeof name === "string") {
				
				var elem = me.dom || me;

				// event 。
				if(name.match(rEventName))
					me.on(RegExp.$1, value);

				// css 。
				else if(elem.style && (name in elem.style || rStyle.test(name)))
					me.setStyle(name, value);

				// attr 。
				else
					me.setAttr(name, value);

			} else if(o.isObject(name)) {

				for(value in name)
					me.set(value, name[value]);

			}

			return me;


		},
		
		/**
		 * 设置值。
		 * @param {String/Boolean} 值。
		 * @return {Element} this
		 */
		setText: function (value) {
			var elem = this.dom || this;

			switch(elem.tagName) {
				case "SELECT":
				case "INPUT":
				case "TEXTAREA":
					$(elem).val(value);
					break;
				default:
					$(elem).text(value);
			}
			return  this;
		},
	
		/// #endif
	
		/// #ifdef ElementDimension

		/**
		 * 改变大小。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setSize: function (x, y) {
			var me = this,
				p = formatPoint(x,y);

			if(p.x != null)
				me.setWidth(p.x - e.getSize(me.dom || me, 'bx+px'));
	
			if (p.y != null)
				me.setHeight(p.y - e.getSize(me.dom || me, 'by+py'));
	
			return me;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
		setWidth: function (value) {

			$(this.dom || this).width(value <= 0 ? 0 : value);
			return this;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
		setHeight: function (value) {

			$(this.dom || this).height(value <= 0 ? 0 : value);
			return this;
		},
		
		/// #endif
	
		/// #ifdef ElementOffset

		/**
		 * 设置元素的相对位置。
		 * @param {Point} p
		 * @return {Element} this
		 */
		setOffset: function (p) {

			var s = (this.dom || this).style;
			s.top = p.y + 'px';
			s.left = p.x + 'px';
			return this;
		},

		/**
		 * 设置元素的固定位置。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setPosition: function (x, y) {
			x = formatPoint(x, y);
			$(this.dom || this).offset({left: x.x, top: x.y});
			return this;
		},

		/**
		 * 滚到。
		 * @param {Element} dom
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setScroll: function (x, y) {
			var elem = this.dom || this, p = formatPoint(x, y);

			if(p.x != null)
				elem.scrollLeft = p.x;
			if(p.y != null)
				elem.scrollTop = p.y;
			return this;

		}
	
		/// #endif
		
	})
	
	/// #ifdef ElementEvent
	
	.implement(p.IEvent)
	
	/// #endif
	
	.implement({

		/**
		 * 获取透明度。
		 * @method
		 * @return {Number} 透明度。 0 - 1 范围。
		 */
		getOpacity: function () {
			return $.css(this.dom || this, 'opacity');
		},

		/**
		 * 获取值。
		 * @return {Object/String} 值。对普通节点返回 text 属性。
		 */
		getText: function () {
			var elem = this.dom || this;

			switch(elem.tagName) {
				case "SELECT":
				case "INPUT":
				case "TEXTAREA":
					return $(elem).val();
				default:
					return $(elem).text();
			}
		},
	
		/// #ifdef ElementDimension

		/**
		 * 获取元素可视区域大小。包括 border 大小。
		 * @return {Point} 位置。
		 */
		getSize: function () {
			var elem = this.dom || this;

			return new Point(elem.offsetWidth, elem.offsetHeight);
		},

		/**
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
		getScrollSize: function () {
			var elem = this.dom || this;

			return new Point(elem.scrollWidth, elem.scrollHeight);
		},
	
		/// #endif
	
		/// #ifdef ElementOffset

		/**
		 * 获取元素的相对位置。
		 * @return {Point} 位置。
		 */
		getOffset: function () {

			// 如果设置过 left top ，这是非常轻松的事。
			var elem = $(this.dom || this),
				offset = elem.position();
				
			// 碰到 auto ， 空 变为 0 。
			return new Point(
				offset.left,
				offset.top
			);
		},

		/**
		 * 获取距父元素的偏差。
		 * @return {Point} 位置。
		 */
		getPosition: function () {

			var elem = $(this.dom || this),
				offset = elem.offset();

			return new Point(
				offset.left,
				offset.top
			    );
		},

		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getScroll:  function () {
			var elem = this.dom || this;
			return new Point(elem.scrollLeft, elem.scrollTop);
		}

		/// #endif
		
	}, 2)
	
	.implement({
		
		/// #ifdef ElementTraversing
		
		/**
		 * 执行一个简单的选择器。
		 * @method
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		findAll: function(selecter){
			return new ElementList($(this.dom || this).find(selecter));
		},

		/**
		 * 获得相匹配的节点。
		 * @param {String/Function/Number} treeWalker 遍历函数，该函数在 {#link Element.treeWalkers} 指定。
		 * @param {Object} [args] 传递给遍历函数的参数。
		 * @return {Element} 元素。
		 */
		get: function (treeWalker, args) {

			switch (typeof treeWalker) {
				case 'string':
					break;
				case 'function':
					args = treeWalker;
					treeWalker = 'all';
					break;
				case 'number':
					if(treeWalker < 0) {
						args = -treeWalker;
						treeWalker = 'last';
					} else {
						args = treeWalker;
						treeWalker = 'first';
					}
					
			}
			
			return e.treeWalkers[treeWalker](this.dom || this, args);
		},
	
		/// #endif
		
		/// #ifdef ElementManipulation

		/**
		 * 在某个位置插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @param {String} [where] 插入地点。 beforeBegin   节点外    beforeEnd   节点里
		 * afterBegin    节点外  afterEnd     节点里
		 * @return {Element} 插入的节点。
		 */
		insert: function (html, where) {

			var elem = this.dom || this, p, refNode = elem;

			html = e.parse(html, elem);

			switch (where) {
				case "afterBegin":
					p = this;
					refNode = elem.firstChild;
					break;
				case "afterEnd":
					refNode = elem.nextSibling;
				case "beforeBegin":
					p = elem.parentNode;
					break;
				default:
					p = this;
					refNode = null;
			}
			
			// 调用 HTML 的渲染。
			return html.render(p, refNode);
		},

		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function (html) {
			
			
			// 如果新元素有适合自己的渲染函数。
			return e.parse(html, this.dom || this).render(this, null);
		},

		/**
		 * 将一个节点用另一个节点替换。
		 * @param {Element/String} html 内容。
		 * @return {Element} 替换之后的新元素。
		 */
		replaceWith: function (html) {
			var elem = this.dom || this;
			
			html = e.parse(html, elem);
			$(elem).replaceWith(html);
			return html;
		},
		
		/**
		 * 复制节点。
		 * @param {Boolean} cloneEvent=false 是否复制事件。
		 * @param {Boolean} contents=true 是否复制子元素。
		 * @param {Boolean} keepId=false 是否复制 id 。
		 * @return {Element} 元素。
		 */
		clone: function (cloneEvent, contents, keepId) {

			return $(this).clone(cloneEvent)[0];
		}
		
		/// #endif

	}, 3)
	
	.implement({
		
		/// #ifdef ElementTraversing
		
		/**
		 * 执行一个简单的选择器。
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		find: function (selector) {
			return $$($(this.dom || this).find(selector)[0]);
		},
		
		/// #endif
		
		/// #ifdef ElementManipulation

		/**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: function (child) {
			var elem = this.dom || this;
			child = child.dom || child;
			return child == elem || e.hasChild(elem, child);
		},

		/**
		 * 判断一个节点是否有子节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		hasChild: function (child) {
			var elem = this.dom || this;
			return child ? e.hasChild(elem, child.dom || child) : elem.firstChild !== null;
		},
		
		/// #endif
		
		/// #ifdef ElementStyle

		/**
		 * 判断一个节点是否隐藏。
		 * @param {Element} elem 元素。
		 * @return {Boolean} 隐藏返回 true 。
		 */
		isHidden: function () {
			var elem = this.dom || this;

			return (elem.style.display || getStyle(elem, 'display')) === 'none';
		}
		
		/// #endif
		
	}, 4);
	
	getWindowScroll = 'pageXOffset' in window ? function () {
		var win = this.defaultView;
		return new Point(win.pageXOffset, win.pageYOffset);
	} : ep.getScroll;
		
	/**
	 * @class Document
	 */
	Document.implement({
		
		/// #ifdef ElementManipulation

		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function (html) {
			return $$(this.body).append(html);
		},
	
		/// #endif
		
		/// #ifdef ElementCore

		/**
		 * 创建一个节点。
		 * @param {Object} tagName
		 * @param {Object} className
		 */
		create: function (tagName, className) {
			

			/// #ifdef SupportIE6

			var div = $$(this.createElement(tagName));

			/// #else

			/// var div = this.createElement(tagName);

			/// #endif

			div.className = className;

			return div;
		},
	
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 获取元素可视区域大小。包括 margin 和 border 大小。
		 * @method getSize
		 * @return {Point} 位置。
		 */
		getSize: function () {
			var doc = this.dom;

			return new Point(doc.clientWidth, doc.clientHeight);
		},

		/**
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
		getScrollSize: function () {
			var html = this.dom,
				min = this.getSize(),
				body = this.body;
				
				
			return new Point(Math.max(html.scrollWidth, body.scrollWidth, min.x), Math.max(html.scrollHeight, body.scrollHeight, min.y));
		},
		
		/// #ifdef ElementOffset
		
		/// #endif

		/**
		 * 获取距父元素的偏差。
		 * @return {Point} 位置。
		 */
		getPosition: getWindowScroll,
		
		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getScroll: getWindowScroll,

		/**
		 * 滚到。
		 * @method setScroll
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Document} this 。
		 */
		setScroll: function (x, y) {
			var doc = this, p = formatPoint(x, y);
			if(p.x == null)
				p.x = doc.getScroll().x;
			if(p.y == null)
				p.y = doc.getScroll().y;
			doc.defaultView.scrollTo(p.x, p.y);

			return doc;
		},
		
		/// #endif
		
		/**
		 * 根据元素返回节点。
		 * @param {String} ... 对象的 id 或对象。
		 * @return {ElementList} 如果只有1个参数，返回元素，否则返回元素集合。
		 */
		getDom: function () {
			return arguments.length === 1 ? $$(this.getElementById(arguments[0])) :  new ElementList(o.update(arguments, this.getElementById, null, this));
		}
		
	});
	
	/**
	 * @namespace Control
	 */
	apply(Control, {
		
		/**
		 * 基类。
		 */
		base: e,
		
		/**
		 * 将指定名字的方法委托到当前对象指定的成员。
		 * @param {Object} control 类。
		 * @param {String} delegate 委托变量。
		 * @param {String} methods 所有成员名。
		 * @param {Number} type 类型。 1 - 返回本身 2 - 返回委托返回 3 - 返回自己，参数作为控件。 
		 * @param {String} [methods2] 成员。
		 * @param {String} [type2] 类型。
		 * 由于一个控件本质上是对 DOM 的封装， 因此经常需要将一个函数转换为对节点的调用。
		 */
		delegate: function(control, target, methods, type, methods2, type2) {
			
			if (methods2) 
				Control.delegate(control, target, methods2, type2);
			
			
			map(methods, function(func) {
				switch (type) {
					case 2:
						return function(args1, args2, args3) {
							return this[target][func](args1, args2, args3);
						};
					case 3:
						return function(args1, args2) {
							return this[target][func](args1 && args1.dom || args1, args2 ? args2.dom || args2 : null);
						};
					default:
						return function(args1, args2, args3) {
							this[target][func](args1, args2, args3);
							return this;
						};
				}
			}, control.prototype);
			
			return Control.delegate;
		}
		
	});
	
	Control.delegate(Control, 'dom', 'addEventListener removeEventListener scrollIntoView focus blur', 2, 'appendChild removeChild insertBefore replaceChild', 3);
	
	/**
	 * 将当前列表添加到指定父节点。
	 * @param {Element/Control} parent 渲染的目标。
	 * @param {Element/Control} refNode 渲染的位置。
	 * @protected
	 */
	ElementList.prototype.render = function (parent, refNode) {
			parent = parent.dom || parent;
			for(var i = 0, len = this.length; i < len; i++)
				parent.insertBefore(this[i], refNode);
	};

	/// #ifdef ElementCore
	
	/// #endif
		
	/// #ifdef ElementNode
	
	map('checked disabled selected', function (treeWalker) {
		return function(elem, args) {
			args = args !== false;
			return this.children(elem, function (elem) {
				return elem[treeWalker] !== args;
			});
		};
	}, e.treeWalkers);
	
	var setter = {};
	
	o.each({
		setStyle: 'css',
		empty: 'empty',
		setAttr: 'attr',
		addClass: 'addClass',
		removeClass: 'removeClass',
		toggleClass: 'toggleClass',
		setHtml: 'html',
		animate: 'animate',
		show: 'show',
		hide: 'hide',
		toggle: 'toggle'
	}, function (func, name){
		this[name] = function () {
			var me = $(this.dom || this);
			me[func].apply(me, arguments);
			return this;
		}
	}, setter);
	
	e.implement(setter);
	
	o.each({
		getStyle: 'css',
		getAttr: 'attr',
		getHtml: 'html',
		getWidth: 'width',
		getHeight: 'height',
		hasClass: 'hasClass'
	},   function (func, name){
		this[name] = function () {
			var me = $(this.dom || this);
			return me[func].apply(me, arguments);
		}
	}, setter = {});
	
	e.implement(setter, 2);
	
	
	
	/// #endif
	
	/**
	 * 获取节点本身。
	 */
	document.dom = document.documentElement;
	
	/// #ifdef SupportIE8

	if (navigator.isStandard) {

	/// #endif
		
		/// #ifdef ElementEvent
		
		window.Event.prototype.stop = pep.stop;

		initMouseEvent = initKeyboardEvent = initUIEvent = function (e) {

			if(!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

		};
		
		/// #endif

	/// #ifdef SupportIE8
		
	} else {
		
		ep.$version = 1;
		
		$$ = function (id) {
			
			// 获取节点本身。
			var dom = getElementById(id);
	
			// 把 Element 成员复制到节点。
			// 根据 $version 决定是否需要拷贝，这样保证每个节点只拷贝一次。
			if(dom && dom.nodeType === 1 && dom.$version !== ep.$version)
				o.extendIf(dom, ep);
	
			return dom;
			
		};
		
		/**
		 * 返回当前文档默认的视图。
		 * @type {Window}
		 */
		document.defaultView = document.parentWindow;
		
		/// #ifdef ElementEvent
		
		initUIEvent = function (e) {
			if(!e.stop) {
				e.target = $$(e.srcElement);
				e.stopPropagation = pep.stopPropagation;
				e.preventDefault = pep.preventDefault;
				e.stop = pep.stop;
			}
		};

		// mouseEvent
		initMouseEvent = function (e) {
			if(!e.stop) {
				initUIEvent(e);
				e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
				var dom = getDocument(e.target).dom;
				e.pageX = e.clientX + dom.scrollLeft;
				e.pageY = e.clientY + dom.scrollTop;
				e.layerX = e.x;
				e.layerY = e.y;
				//  1 ： 单击  2 ：  中键点击 3 ： 右击
				e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
			
			}
		};

		// keyEvents
		initKeyboardEvent = function (e) {
			if(!e.stop) {
				initUIEvent(e);
				e.which = e.keyCode;
			}
		};
	
		try {
	
			//  修复IE6 因 css 改变背景图出现的闪烁。
			document.execCommand("BackgroundImageCache", false, true);
		} catch(e) {
	
		}
	
		/// #endif
		
	}
	
	/// #endif
	
	apply(p, {
	
		$: $$,
		
		/**
		 * 元素。
		 */	
		Element: e,
		
		/// #ifdef ElementEvent
		
		/**
		 * 表示事件的参数。
		 * @class JPlus.Event
		 */
		Event: Class(pep),
		
		/// #endif
		
		/**
		 * 文档。
		 */
		Document: Document
			
	});
	
	map("$ Element Event Document", p, window, true);
	
	window.$$ = $$;
		
	/// #ifdef ElementEvent
	
	/**
	 * 默认事件。
	 * @type Object
	 * @hide
	 */
	namespace("JPlus.Events.element.$default", {

		/**
		 * 创建当前事件可用的参数。
		 * @param {Object} elem 对象。
		 * @param {Event} e 事件参数。
		 * @param {Object} target 事件目标。
		 * @return {Event} e 事件参数。
		 */
		trigger: function (elem, type, fn, e) {
			return fn(e = new p.Event(elem, type, e)) && (!elem[type = 'on' + type] || elem[type](e) !== false);
		},

		/**
		 * 事件触发后对参数进行处理。
		 * @param {Event} e 事件参数。
		 */
		initEvent: Function.empty,

		/**
		 * 添加绑定事件。
		 * @param {Object} elem 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		add: function (elem, type, fn) {
			elem.addEventListener(type, fn, false);
		},

		/**
		 * 删除事件。
		 * @param {Object} elem 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		remove: function (elem, type, fn) {
			elem.removeEventListener(type, fn, false);
		}

	});

	e.addEvents
		("mousewheel blur focus focusin focusout scroll change select submit error load unload", initUIEvent)
		("click dblclick DOMMouseScroll mousedown mouseup mouseover mouseenter mousemove mouseleave mouseout contextmenu selectstart selectend", initMouseEvent)
		("keydown keypress keyup", initKeyboardEvent);

	if (navigator.isFirefox)
		e.addEvents('mousewheel', 'DOMMouseScroll');

	if (!navigator.isIE)
		e.addEvents
			('mouseenter', 'mouseover', checkMouseEnter)
			('mouseleave', 'mouseout', checkMouseEnter);
	
	/**
	 * 判断发生事件的元素是否在当前鼠标所在的节点内。
	 * @param {Event} e 事件对象。
	 * @return {Boolean} 返回是否应该触发  mouseenter。
	 */
	function checkMouseEnter(event) {
		
		return this !== event.relatedTarget && !e.hasChild(this, event.relatedTarget);

	}
	
	o.extendIf(window, eventObj);
	
	document.onReady = function(fn){
		$(fn);
	};
	
	document.onLoad = function(fn){
		$(document).load(fn);
	};
	
	/**
	 * @class
	 */

	/**
	 * 根据一个 id 或 对象获取节点。
	 * @param {String/Element} id 对象的 id 或对象。
	 * @return {Element} 元素。
	 */
	function getElementById(id) {
		return typeof id == "string" ? document.getElementById(id) : id;
	}
	
	/**
	 * 获取元素的文档。
	 * @param {Element} elem 元素。
	 * @return {Document} 文档。
	 */
	function getDocument(elem) {
		return elem.ownerDocument || elem.document || elem;
	}
	
	/// #ifdef ElementTraversing
	
	/**
	 * 返回简单的遍历函数。
	 * @param {Boolean} getFirst 返回第一个还是返回所有元素。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
	function createTreeWalker(getFirst, next, first) {
		first = first || next;
		return getFirst ? function(elem, args) {
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first];
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					return $(node);
				node = node[next];
			}
			return node;
		} : function (elem, args) {
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first],
				r = new ElementList;
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					r.push(node);
				node = node[next];
			}
			return r;
		};
	}

	/**
	 * 获取一个选择器。
	 * @param {Number/Function/String} args 参数。
	 * @return {Funtion} 函数。
	 */
	function getFilter(args) {
		switch(typeof args) {
			case 'number':
				return function (elem) {
					return --args < 0;
				};
			case 'string':
				args = args.toUpperCase();
				return function (elem) {
					return elem.tagName === args;
				};
		}
		
		return args;
	}
	
	/// #endif

	/**
	 * 读取样式数字。
	 * @param {Object} elem 元素。
	 * @param {Object} name 属性名。
	 * @return {Number} 数字。
	 */
	function styleNumber(elem, name) {
		return parseFloat($(elem).css(name));
	}
	
	/**
	 * 转换参数为标准点。
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	function formatPoint(x, y) {
		return x && typeof x === 'object' ? x : {
			x:x,
			y:y
		};
	}
	
	var get = $.fn.get;
	
	$.fn.get = function(){
		return $$(get.apply(this, arguments));
	};

})(jQuery);


