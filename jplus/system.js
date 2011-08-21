//===========================================
//  J+ Library   0.1
//===========================================


//
// HtmlFive - 支持 IE10+ FF5+ Chrome12+ Opera12+ Safari6+ 。
// SupportIE9 - 支持 IE9+ FF4+ Chrome10+ Opera10+ Safari4+ 。
// SupportIE8  -   支持 IE8+ FF3+ Chrome10+ Opera10+ Safari4+ 。
// SupportIE6   -  支持 IE6+ FF2.5+ Chrome1+ Opera9+ Safari4+ 。
// SupportUsing - 支持 namespace 等。
// Compact - 当前执行了打包操作。
// Zip - 当前执行了压缩操作。
// Format - 当前在格式化代码。
// SupportGlobalObject  - 允许扩展全局对象。
// Debug - 启用调试， 启用调试将执行 assert 函数。



/// #ifndef Compact

 
// 配置。编译后会删除以下代码。

/**
 * @type Object
 */
var JPlus = {
	
	/**
	 * 是否打开调试。
	 * @config {Boolean}
	 */
	debug: true,
	
	/**
	 * 启用控制台调试。
	 * @config {Boolean} 
	 * 如果不存在控制台，将自动调整为 false 。
	 */
	trace: true,

	/**
	 * 根目录。(需要末尾追加 /)
	 * @config {String}
	 * 程序会自动搜索当前脚本的位置为跟目录。
	 */
	rootPath: undefined,
	
	/**
	 * 是否输出 assert 来源。
	 * @config {Boolean}
	 * @value false
	 * 如果此项是 true， 将会输出 assert 失败时的来源函数。
	 */
	stackTrace: false,
	
	/**
	 * 默认的全局名字空间。
	 * @config {Object}
	 * @value window
	 */
	defaultNamespace: this,
	
	/**
	 * 如果使用了 UI 库，则 theme 表示默认主题。
	 * @config {String}
	 * @value 'default'
	 */
	theme: 'default',
	
	/**
	 * 如果使用了 UI 库，则  resource 表示公共的主题资源。
	 * @config {String}
	 * @value 'share'
	 */
	resource: 'share'

};




/// #endif

//===========================================
//  核心: 定义必须的系统函数。      G
//===========================================

/**
 * @projectDescription JPlus
 * @copyright n2011 JPlus Team
 * @fileOverview 系统核心的核心部分。
 */

(function (w) {
	
	/// #define JPlus
	
	/// #ifndef Debug
	/// #define assert
	/// #define trace
	/// #endif
	
	/// #if defined(SupportIE7) && !defined(SupportIE6)
	/// #define SupportIE6
	/// #endif
	
	/// #if !defined(SupportIE9) && !defined(SupportIE8) && !defined(SupportIE6)
	/// #define SupportIE6
	/// #endif
	
	/// #ifdef SupportIE6
	/// #define SupportIE8
	/// #endif
	
	/// #ifdef SupportIE8
	/// #define SupportIE9
	/// #endif
	
	/// #ifndef Compact
	/// #define SupportUsing
	/// #endif
	
	/// #ifndef SupportUsing
	/// #define using
	/// #endif

	/// #region 全局变量
	
	
		/**
		 * document 简写。
		 * @type Document
		 */
	var document = w.document,
		
		/**
		 * navigator 简写。
		 * @type Navigator
		 */
		navigator = w.navigator,
		
		/**
		 * Array.prototype  简写。
		 * @type Object
		 */
		ap = Array.prototype,
		
		/**
		 * Object  简写。
		 * @type Function
		 */
		o = w.Object,
	
		/**
		 * Object.prototype.toString 简写。
		 * @type Function
		 */
		toString = o.prototype.toString,
		
		/**
		 * Object.prototype.hasOwnProperty 简写。
		 * @type Function
		 */
		hasOwnProperty = o.prototype.hasOwnProperty,
		
		/**
		 * 检查空白的正则表达式。
		 * @type RegExp
		 */
		rSpace = /^[\s\u00A0]+|[\s\u00A0]+$/g,
		
		/**
		 * 格式化字符串用的正则表达式。
		 * @type RegExp
		 */
		rFormat = /\{+?(\S*?)\}+/g,
		
		/**
		 * 查找字符点的正则表达式。
		 * @type RegExp
		 */
		rPoint = /\./g,
		
		/**
		 * 匹配第一个字符。
		 * @type RegExp
		 */
		rFirstChar = /\b[a-z]/g,
		
		/**
		 * 表示空白字符。
		 * @type RegExp
		 */
		rWhite = /%20/g,
		
		/**
	     * 转为骆驼格式的正则表达式。
	     * @type RegExp
	     */
		rToCamelCase = /[\-_]\D/g,
		
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
			 * @static
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
				
				assert.isObject(obj, "JPlus.data(obj, dataType): 参数 {obj} ~。");
				
				// 创建或测试 '$data'。
				var d = obj.$data || (obj.$data = {}) ;
				
				// 创建或测试   dataType。
				return d[dataType] || (d[dataType] = {});
			},
		
			/**
			 * 如果存在，获取属于一个元素的数据。
			 * @static
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
				
				assert.isObject(obj, "JPlus.getData(obj, dataType): 参数 {obj} ~。");
				
				// 获取属性'$data'。
				var d = obj.$data;
				return d && d[dataType];
			},
			
			/**
			 * 设置属于一个元素的数据。
			 * @static
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
			setData: function(obj, dataType, data) {
				
				assert.isObject(obj, "JPlus.setData(obj, dataType): 参数 {obj} ~。");
				
				// 简单设置变量。
				return (obj.$data || (obj.$data = {}))[dataType] = data;
			},
			
			/**
			 * 复制一个对象的数据到另一个对象。
			 * @static
			 * @param {Object} src 来源的对象。
			 * @param {Object} dest 目标的对象。
			 * @return this
			 * @example
			 * <code>
			 * var obj = {}, obj2 = {};
			 * JPlus.cloneData(obj2, obj);
			 * </code>
			 */
			cloneData: function(dest, src) {
				
				assert.isObject(src, "JPlus.cloneData(dest, src): 参数 {src} ~。");
				assert.isObject(dest, "JPlus.cloneData(dest, src): 参数 {dest} ~。");
				
				var data = src.$data;
				
				if(data) {
					dest.$data = o.clone.call(1, data);
					
					// event 作为系统内部对象。事件的拷贝必须重新进行 on 绑定。
					var evt = src.$data.event, i  ;
					if(evt) {
						delete dest.data.event;
						for (i in evt) {
							evt[i].handlers.forEach( function(fn) {
								p.IEvent.on.call(dest, i, fn);
							});
						}
					}
				}
				
				return dest;
			}, 
			
			/**
			 * 全局运行一个函数。
			 * @method
			 * @static
			 * @param {String} statement 语句。
			 * @return {Object} 执行返回值。
			 * @example
			 * <code>
			 * JPlus.eval('alert("hello")');
			 * </code>
			 */
			eval: w.execScript || function(statement) {
				
				// 如果正常浏览器，使用 window.eval  。
				return w.eval(statement);
			},
			
			/**
			 * 创建一个类。
			 * @method
			 * @static
			 * @param {Object/Function} [methods] 成员或构造函数。
			 * @return {Class} 生成的类。
			 * 创建一个类，相当于继承于 JPlus.Object创建。
			 * @see JPlus.Object.extend
			 * @example
			 * <code>
			 * var MyCls = Class({
			 * 
			 *    constructor: function(g, h) {
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
			
			/// #ifdef SupportUsing
		
			/**
			 * 全部已载入的名字空间。
			 * @static
			 * @type Array
			 * @private
			 */
			namespaces: [],
			
			/**
			 * 同步载入代码。
			 * @static
			 * @param {String} uri 地址。
			 * @example
			 * <code>
			 * JPlus.loadScript('./v.js');
			 * </code>
			 */
			loadScript: function(url) {
				return p.loadText(url, p.eval);
			},
			
			/**
			 * 异步载入样式。
			 * @static
			 * @param {String} uri 地址。
			 * @example
			 * <code>
			 * JPlus.loadStyle('./v.css');
			 * </code>
			 */
			loadStyle: function(url) {
				document.getElementsByTagName("HEAD")[0].appendChild(apply(document.createElement('link'), {
					href: url,
					rel: 'stylesheet',
					type: 'text/css'
				}));
			},
			
			/**
			 * 同步载入文本。
			 * @param {String} uri 地址。
			 * @param {Function} [callback] 对返回值的处理函数。
			 * @return {String} 载入的值。
			 * 因为同步，所以无法跨站。
			 * @example
			 * <code>
			 * trace(  JPlus.loadText('./v.html')  );
			 * </code>
			 */
			loadText: function(url, callback) {
				
				assert.notNull(url, "JPlus.loadText(url, callback): 参数 {url} ~。");
	
				//     assert(w.location.protocol != "file:", "JPlus.loadText(uri, callback):  当前正使用 file 协议，请使用 http 协议。 \r\n请求地址: {0}",  uri);
				
				// 新建请求。
				var xmlHttp = new XMLHttpRequest();
	
				try {
					
					// 打开请求。
					xmlHttp.open("GET", url, false);
	
					// 发送请求。
					xmlHttp.send(null);
	
					// 检查当前的 XMLHttp 是否正常回复。
					if (!XMLHttpRequest.isOk(xmlHttp)) {
						//载入失败的处理。
						throw String.format("请求失败:  \r\n   地址: {0} \r\n   状态: {1}   {2}  {3}", url, xmlHttp.status, xmlHttp.statusText, w.location.protocol == "file:" ? '\r\n原因: 当前正使用 file 协议打开文件，请使用 http 协议。' : '');
					}
					
					url = xmlHttp.responseText;
					
					// 运行处理函数。
					return callback ? callback(url) : url;
	
				} catch(e) {
					
					// 调试输出。
					trace.error(e);
				} finally{
					
					// 释放资源。
					xmlHttp = null;
				}
				
				return null;
	
			},
	
			/**
			 * 使用一个名空间。
			 * @method
			 * @static
			 * @param {String} ns 名字空间。
			 * @param {Boolean} isStyle=false 是否为样式表。
			 * 有关名字空间的说明， 见 {@link namespace} 。
			 * @example
			 * <code>
			 * using("System.Dom.Keys");
			 * </code>
			 */
			using: function(ns, isStyle) {
				
				assert.isString(ns, "using(ns): 参数 {ns} 不是合法的名字空间。");
				
				// 已经载入。
				if(p.namespaces.include(ns))
					return;
				
				if(ns.indexOf('/') === -1) {
					ns = ns.toLowerCase().replace(rPoint, '/') + (isStyle ? '.css' : '.js');
				}
				 
				 var doms, check, callback;
				 
				 if(isStyle) {
				 	callback = p.loadStyle;
				 	doms = document.styleSheets;
					src = 'href';
				 } else {
				 	callback = p.loadScript;
				 	doms = document.getElementsByTagName("SCRIPT");
					src = 'src';
				 }
				 
				 // 如果在节点找到符合的就返回，找不到，调用 callback
				 each.call(doms, function(dom) {
				 	return !dom[src] || dom[src].toLowerCase().indexOf(ns) === -1;
				 }) && callback(p.rootPath + ns);
			},
			
			/// #endif
	
			/**
			 * 定义名字空间。
			 * @method
			 * @static
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
			defaultNamespace: w,
			
			/// #ifdef SupportIE8
								
			/**
			 * 绑定一个监听器。
			 * @method
			 * @static
			 * @param {Element} elem 元素。
			 * @param {String} type 类型。
			 * @param {Function} listener 函数。
			 * @seeAlso JPlus.removeListener
			 * @example
			 * <code>
			 * JPlus.addEventListener.call(document, 'click', function() {
			 * 	
			 * });
			 * </code>
			 */
			addEventListener: document.addEventListener ? function(type, listener) {
				this.addEventListener(type, listener, false);
			} : function(type, listener) {
				
				// IE8- 使用 attachEvent 。
				this.attachEvent('on' + type, listener);
			},
			
			/**
			 * 移除一个监听器。
			 * @method
			 * @static
			 * @param {Element} elem 元素。
			 * @param {String} type 类型。
			 * @param {Function} listener 函数。
			 * @seeAlso JPlus.addListener
			 * @example
			 * <code>
			 * JPlus.removeEventListener.call(document, 'click', function() {
			 * 	
			 * });
			 * </code>
			 */
			removeEventListener: document.removeEventListener ? function(type, listener) {
				this.removeEventListener(type, listener, false);
			} : function(type, listener) {
				
				// IE8- 使用 detachEvent 。
				this.detachEvent('on' + type, listener);
			},
			
			/// #endif
			
			/**
			 * 管理所有事件类型的工具。
			 * @property
			 * @static
			 * @type Object
			 * @private
			 * 所有类的事件信息存储在这个变量。使用 xType -> name的结构。
			 */
			Events: eventMgr, 
			
			/**
			 * 表示一个事件接口。
			 * @interface JPlus.IEvent
			 * @singleton
			 * JPlus.IEvent 提供了事件机制的基本接口，凡实现这个接口的类店都有事件的处理能力。
			 * 在调用  {@link JPlus.Object.addEvents} 的时候，将自动实现这个接口。
			 */
			IEvent: {
			
				/**
				 * 增加一个监听者。
				 * @param {String} type 监听名字。
				 * @param {Function} listener 调用函数。
				 * @return Object this
				 * @example
				 * <code>
				 * elem.on('click', function(e) {
				 * 		return true;
				 * });
				 * </code>
				 */
				on: function(type, listener) {
					
					assert.isFunction(listener, 'IEvent.on(type, listener): 参数 {listener} ~。');
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, d = p.data(me, 'event'), evt = d[type], eMgr;
					
					// 如果未绑定
					if (!evt) {
						
						evt = (eMgr = me).constructor;
						
						// 遍历父类， 找到适合的 eMgr	
						while(!(eMgr = eventMgr[eMgr.xType]) || !(eMgr = eMgr[type])) {
							
							if(evt && (evt = evt.base)) {
								eMgr = evt.prototype;
							} else {
								eMgr = eventMgr.$default;
								break;
							}
						
						}
						
						// 支持自定义安装。
						evt = function(e) {
							var listener = arguments.callee,
								target = listener.target,
								handlers = fn.handlers.slice(0), 
								i = -1,
								len = handlers.length;
							
							// 循环直到 return false。 
							while (++i < len) 
								if (handlers[i].call(target, e) === false) 										
									return false;
							
							return true;
						};
						
						// 绑定事件对象，用来删除和触发。
						evt.event = eMgr;
						
						//指定当然事件的全部函数。
						evt.handlers = [eMgr.initEvent, listener];
						
						// 保存全部内容。
						d[type] = evt;
						
						// 添加事件。
						eMgr.add(evt.target = me, type, evt);
						
					} else {
						evt.handlers.push(listener);
					}
						
					return me;
				},
				
				/**
				 * 删除一个监听器。
				 * @param {String} [type] 监听名字。
				 * @param {Function/undefined} listener 回调器。
				 * @return Object this
				 * 注意: function() {} !== function() {}, 这意味着这个代码有问题:
				 * <code>
				 * elem.on('click', function() {});
				 * elem.un('click', function() {});
				 * </code>
				 * 你应该把函数保存起来。
				 * <code>
				 * var c =  function() {};
				 * elem.on('click', c);
				 * elem.un('click', c);
				 * </code>
				 * @example
				 * <code>
				 * elem.un('click', function(e) {
				 * 		return true;
				 * });
				 * </code>
				 */
				un: function (type, listener) {
					
					assert(!listener || Function.isFunction(listener), 'IEvent.un(type, listener): 参数 {listener} 必须是可执行的函数或空参数。', listener);
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, d = p.getData(me, 'event'), evt;
					if (d) {
						 if (evt = d[type]) {
							if (listener) 
								evt.handlers.remove(listener);
								
							// 检查是否存在其它函数或没设置删除的函数。
							if (!listener || evt.handlers.length < 2) {
								
								evt.handlers = null;
								delete d[type];
								
								// 内部事件管理的删除。
								evt.event.remove(me, type, evt);
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
				 * @param {Object/undefined} e 事件参数。
				 * @return Object this
				 * trigger 只是手动触发绑定的事件。
				 * @example
				 * <code>
				 * elem.trigger('click');
				 * </code>
				 */
				trigger: function (type, e) {
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, evt = p.getData(me, 'event');
					   
					return !evt || !(evt = evt[type]) || ( evt.event.trigger ? evt.event.trigger(me, type, evt, e) : evt(e) );
					
				},
				
				/**
				 * 增加一个只执行一次的监听者。
				 * @param {String} type 监听名字。
				 * @param {Function} listener 调用函数。
				 * @return Object this
				 * @example
				 * <code>
				 * elem.one('click', function(e) {
				 * 		trace('a');  
				 * });
				 * 
				 * elem.trigger('click');   //  输出  a
				 * elem.trigger('click');   //  没有输出 
				 * </code>
				 */
				one: function(type, listener) {
					
					assert.isFunction(listener, 'IEvent.one(type, listener): 参数 {listener} ~。');
					
					
					return this.on(type, function() {
						
						// 删除。
						this.un( type, arguments.callee);
						
						// 然后调用。
						return listener.apply(this, arguments);
					});
				}
				
				
			}
			
		});
	
	/// #endregion
		
	/// #region 全局函数
	
	/**
	 * @class JPlus.Object
	 */
	apply(Object, {
	
		/**
		 * 扩展当前类的动态方法。
		 * @static
		 * @param {Object} members 成员。
		 * @return this
		 * @seeAlso JPlus.Object.implementIf
		 * @example
		 * <code>
		 * Number.implement({
		 *   sin: function() {
		 * 	    return Math.sin(this);
		 *  }
		 * });
		 * 
		 * (1).sin();  //  Math.sin(1);
		 * </code>
		 */
		implement: function (members) {

			assert(members && this.prototype, "Class.implement(members): 无法扩展类，因为 {members} 或 this.prototype 为空。", members);
			// 复制到原型
			o.extend(this.prototype, members);
	        
			return this;
		},
		
		/**
		 * 如果不存在成员, 扩展当前类的动态方法。
		 * @static
		 * @param {Object} members 成员。
		 * @return this
		 * @seeAlso JPlus.Object.implement
		 */
		implementIf: function(members) {
		
			assert(members && this.prototype, "Class.implementIf(members): 无法扩展类，因为 {members} 或 this.prototype 为空。", members);
	
			applyIf(this.prototype, members);
			
			return this;
		},
		
		/**
		 * 为当前类添加事件。
		 * @static
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
		 * 			add:  function(elem, type, fn) {
		 * 	   			alert("为  elem 绑定 事件 " + type );
		 * 			},
		 * 
		 * 			initEvent: function(e) {
		 * 	   			alert("初始化 事件参数  " + e );
		 * 			}
		 * 
		 * 		}
		 * 
		 * });
		 * 
		 * var m = new MyCls;
		 * m.on('click', function() {
		 * 	  alert(' 事件 触发 ');
		 * });
		 * 
		 * m.trigger('click', 2);
		 * 
		 * </code>
		 */
		addEvents: function (events) {
			
			var ep = this.prototype;
			
			assert(!events || o.isObject(events), "Class.addEvents(events): 参数 {event} 必须是一个包含事件的对象。 如 {click: { add: ..., remove: ..., initEvent: ..., trigger: ... } ", events);
			
			// 实现 事件 接口。
			applyIf(ep, p.IEvent);
			
			// 如果有自定义事件，则添加。
			if (events) {
				
				var xType = hasOwnProperty.call(ep, 'xType') ? ep.xType : ( ep.xType = (p.id++).toString() );
				
				// 更新事件对象。
				o.update(events, function(e) {
					return applyIf(e, eventMgr.$default);
					
					// 添加 JPlus.Events 中事件。
				}, eventMgr[xType] || (eventMgr[xType] = {}));
			
			}
			
			
			return this;	
		},
	
		/**
		 * 继承当前类并返回子类。
		 * @static
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
	 	extend: function(members) {
	
			// 未指定函数   使用默认构造函数(Object.prototype.constructor);
			
			// 生成子类 。
			var subClass = hasOwnProperty.call(members =  members instanceof Function ? {
					constructor: members
				} : (members || {}), "constructor") ? members.constructor : function() {
					
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
			return Class(subClass);

		}

	});
	
	/**
	 * Object  简写。
	 * @class Object
	 */
	apply(o, {

		/**
		 * 复制对象的所有属性到其它对象。 
		 * @static
		 * @method
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
		extend: (function () {
			for (var item in {toString: true})
				return apply;
			
			p.enumerables = "toString hasOwnProperty valueOf constructor isPrototypeOf".split(' ');
			// IE6  不会遍历系统对象需要复制，所以强制去测试，如果改写就复制 。
			return function(dest, src) {
				for (var i = p.enumerables.length, value; i--;)
					if(hasOwnProperty.call(src, value = p.enumerables[i]))
						dest[value] = src[value];
				return apply(dest, src);
			}
		})(),

		/**
		 * 如果目标成员不存在就复制对象的所有属性到其它对象。 
		 * @static
		 * @method
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
		 * @static
		 * @param {Array/Object} iterable 对象，不支持函数。
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Number} index 当前变量的索引} {@param {Array} array 数组本身} {@return {Boolean} 如果中止循环， 返回 false。}
	 	 * @param {Object} bind 函数执行时的作用域。
		 * @return {Boolean} 如果已经遍历完所传的所有值， 返回 true， 如果遍历被中断过，返回 false。
		 * @example
		 * <code> 
		 * Object.each({a: '1', c: '3'}, function(value, key) {
		 * 		trace(key + ' : ' + value);
		 * });
		 * // 输出 'a : 1' 'c : 3'
		 * </code>
		 */
		each: function(iterable, fn, bind) {

			assert(!Function.isFunction(iterable), "Object.each(iterable, fn, bind): 参数 {iterable} 不能是可执行的函数。 ", iterable);
			assert(Function.isFunction(fn), "Object.each(iterable, fn, bind): 参数 {fn} 必须是可执行的函数。 ", fn);
			
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
		 * @static
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
		update: function(iterable, fn, dest, args) {
			
			// 如果没有目标，源和目标一致。
			dest = dest || iterable;
			
			// 遍历源。
			o.each(iterable, Function.isFunction(fn) ? function(value, key) {
                
				// 执行函数获得返回。
				value = fn.call(args, value, key);
				
				// 只有不是 undefined 更新。
                if(value !== undefined)
				    dest[key] = value;
			} : function(value, key) {
				
				// 如果存在这个值。即源有 fn 内容。
				if(value != undefined) {
					
					value = value[fn];
					
					assert(!args || dest[key], "Object.update(iterable, fn, dest, args): 试图把iterable[{key}][{fn}] 放到 dest[key][fn], 但  dest[key] 是一个空的成员。", key, fn);
					
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
		 * @static
		 * @param {Object} object 变量。
		 * @return {Boolean} 所有对象变量返回 true, null 返回 false 。
		 * @example
		 * <code>
		 * Object.isObject({}); // true
		 * Object.isObject(null); // false
		 * </code>
		 */
		isObject: function(obj) {
			
			// 只检查 null 。
			return obj !== null && typeof obj == "object";
		},
		
		/**
		 * 将一个对象解析成一个类的属性。
		 * @static
		 * @param {Object} obj 类实例。
		 * @param {Object} configs 参数。
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
		 * document.setA = function(value) {
		 * 	  this._a = value;
		 * };
		 * 
		 * Object.set(document, 'a', 3); 
		 * 
		 * // 这样会调用     document.setA(3);
		 * 
		 * </code>
		 */
		set: function(obj, configs) {
			
			if(configs) 
				for(var key in configs) {
					
					// 检查 setValue 。
					var setter = 'set' + key.capitalize(),
						val = configs[key];
			
			
					if (Function.isFunction(obj[setter])) {
						obj[setter](val);
					} 
					
					// 是否存在函数。
					else if(Function.isFunction(obj[key])) {
						obj[key](val);
					}
					
					// 检查 value.set 。
					else if (obj[key] && obj[key].set) {
						obj[key].set(val);
					} 
					
					// 检查 set 。
					else if(obj.set)
						obj.set(key, val);
					else
					
						// 最后，就直接赋予。
						obj[key] = val;
			
				}
			
		},

		/**
		 * 深拷贝一个对象本身, 不深复制函数。
		 * @static
		 * @param {Object} obj 要拷贝的对象。
		 * @return {Object} 返回复制后的对象。
		 * @example
		 * <code>
		 * var obj1 = {a: 0, b: 1};
		 * var obj2 = Object.clone(obj1);
		 *  
		 * obj1.a = 3;
		 * trace(obj1.a);  // trace 3
		 * trace(obj2.a);  // trace 0
		 *
		 * </code>
		 */
		clone: function(obj) {
			
			// 内部支持深度。
			// 用法:  Object.clone.call(1, val);
			var deep = this - 1;
			
			// 如果是对象，则复制。
			if (o.isObject(obj) && !(deep < 0)) {
				
				// 如果对象支持复制，自己复制。
				if(obj.clone)
					return obj.clone();
				
				// #1    
				// if(obj.cloneNode)
				//	return obj.cloneNode(true);
					
				//仅当对象才需深拷贝，null除外。
				obj = o.update(obj, o.clone, Array.isArray(obj) ? [] : {}, deep);
			}
			
			return obj;
		},
		
		/**
		 * 返回一个变量的类型的字符串形式。
		 * @static
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
		type: function(obj) {
			
			//获得类型  。
			var b = typeof obj;
			
			switch (b) {
				case "object":  // 对象， 直接获取 xType 。
					return obj == null ? "null" : (obj.xType || b);

				case "function":  // 如果有原型， 则为类 。
					for(obj in obj.prototype) { return "class";}
					
				default:  // 和 typeof 一样 。
					return b;
					
			}
		},
		
		/**
		 * 添加一个对象的成员函数调用结束后的回调函数。
		 * @static
		 * @param {Object} obj 对象。
		 * @param {String} propertyName 成员函数名。
		 * @param {Function} fn 对象。
		 * @return {Object} obj。
		 * @example
		 * 
		 * 下面的代码方便地添加 onload 事件。 
		 * <code>
		 * Object.addCallback(window, "onload",trace.empty);
		 * </code>
		 */
		addCallback: function(obj, propertyName, fn) {
			
			assert.notNull(obj, 'Object.addCallback(obj, propertyName, fn): 参数 obj ~。');
			
			assert.isFunction(fn, 'Object.addCallback(obj, propertyName, fn): 参数 {fn} ~。');
			
			// 获取已有的句柄。
			var f = obj[propertyName];
			
			// 如果不存在则直接拷贝，否则重新拷贝。新函数对原函数调用。
			obj[propertyName] = typeof f === 'function' ? function() {
				
				// 获取上次的函数。
				var v = f.apply(this, arguments);
				
				// 调用回调函数。
				fn.apply(this, arguments);
				
				// 返回原值。
				return v;
				
			} : fn;
			return obj;
		}

	});

	/**
	 * 数组。
	 * @class Array
	 */
	applyIf(Array, {
		
		/**
		 * 判断一个变量是否是数组。
		 * @static
		 * @param {Object} object 变量。
		 * @return {Boolean} 如果是数组，返回 true， 否则返回 false。
		 * @example
		 * <code> 
		 * Array.isArray([]); // true
		 * Array.isArray(document.getElementsByTagName("div")); // false
		 * Array.isArray(new Array); // true
		 * </code>
		 */
		isArray: function(obj) {
			
			// 检查原型。
			return toString.call(obj) === "[object Array]";
		},

		/**
		 * 在原有可迭代对象生成一个数组。
		 * @static
		 * @param {Object} iterable 可迭代的实例。
		 * @param {Number} startIndex=0 开始的位置。
		 * @return {Array} 复制得到的数组。
		 * @example
		 * <code>
		 * Array.create([4,6], 1); // [6]
		 * </code>
		 */
		create: function(iterable, startIndex) {
			if(!iterable)
				return [];
				
			//  [DOM Object] 。
			if(iterable.item || iterable.count) {   
				var l = iterable.length || iterable.count;
				startIndex = startIndex || 0;
				
				// 复制。
				var r = new Array(l);
				while (l--) r[l] = iterable[startIndex++];
				return r;
			}
			
			// 调用 slice 实现。
			return ap.slice.call(iterable, startIndex);
		}

	});

	/**
	 * 函数。
	 * @class Function
	 */
	apply(Function, {
		
		/**
		 * 绑定函数作用域。
		 * @static
		 * @param {Function} fn 函数。
		 * @param {Object} bind 位置。
		 * 注意，未来 Function.prototype.bind 是系统函数， 因此这个函数将在那个时候被 替换掉。
		 * @example
		 * <code>
		 * Function.bind(function() {return this}, 0)()    ; // 0
		 * </code>
		 */
		bind: function(fn, bind) {
					
			assert.isFunction(fn, 'Function.bind(fn): 参数 {fn} ~。');
			
			// 返回对 bind 绑定。
			return function() {
				return fn.apply(bind, arguments);
			}
		},
		
		/**
		 * 空函数。
		 * @static
		 * @property
		 * @type Function
		 * Function.empty返回空函数的引用。
		 */
		empty: emptyFn,

		/**
		 * 一个返回 true 的函数。
		 * @static
		 * @property
		 * @type Function
		 */
		returnTrue: from(true),

		/**
		 * 一个返回 false 的函数。
		 * @static
		 * @property
		 * @type Function
		 */
		returnFalse: from(false),

		/**
		 * 判断一个变量是否是函数。
		 * @static
		 * @param {Object} object 变量。
		 * @return {Boolean} 如果是函数，返回 true， 否则返回 false。
		 * @example
		 * <code>
		 * Function.isFunction(function() {}); // true
		 * Function.isFunction(null); // false
		 * Function.isFunction(new Function); // true
		 * </code>
		 */
		isFunction: function(obj) {
			
			// 检查原型。
			return toString.call(obj) === "[object Function]";
		},
		
		/**
		 * 返回自身的函数。
		 * @static
		 * @method
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
	 * @class String
	 */
	apply(String, {

		/**
		 * 格式化字符串。
		 * @static
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
		format: function(format, args) {

			if (!format) return "";
					
			assert(format.replace, 'String.format(format, args): 参数 {format} 必须是字符串。', format);

			//支持参数2为数组或对象的直接格式化。
			var toString = this,
				arr = o.isObject(args) && arguments.length === 2 ? args: ap.slice.call(arguments, 1);

			//通过格式化返回
			return format.replace(rFormat, function(match, name) {
				var start = match.charAt(1) == '{',
					end = match.charAt(match.length - 2) == '}';
				if (start || end) return match.slice(start, match.length - end);
				//LOG : {0, 2;yyyy} 为了支持这个格式, 必须在这里处理 match , 同时为了代码简短, 故去该功能。
				return name in arr ? toString(arr[name]) : "";
			});
		},
		
		/**
		 * 将一个数组源形式的字符串内容拷贝。
		 * @static
		 * @param {Object} str 字符串。用空格隔开。
		 * @param {Object/Function} source 更新的函数或源。
		 * @param {Object} [dest] 如果指明了， 则拷贝结果到这个目标。
		 * @param {Boolean} copyIf=false 是否跳过本来存在的数据。
		 * @example
		 * <code>
		 * String.map("aaa bbb ccc", trace); //  aaa bbb ccc
		 * String.map("aaa bbb ccc", function(v) { return v; }, {});    //    {aaa:aaa, bbb:bbb, ccc:ccc};
		 * </code>
		 */
		map: function(str, src, dest, copyIf) {
					
			assert(typeof str == 'string', 'String.map(str, src, dest, copyIf): 参数 {str} 必须是字符串。', str);
			
			var isFn = Function.isFunction(src);
			// 使用 ' '、分隔, 这是约定的。
			str.split(' ').forEach(function(value, index, array) {
				
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
		 * @static
		 * @param {Object} obj 变量。
		 * @return {String} 字符串。
		 * @example
		 * <code>
		 * String.param({a: 4, g: 7}); //  a=4&g=7
		 * </code>
		 */
		param: function(obj) {
			if(!obj) return "";
			var s = [], e = encodeURIComponent;
			o.each(obj, function( value, key ) {
				s.push(e(key) + '=' + e(value));
			});
			
			//  %20 -> +  。
			return s.join('&').replace(rWhite, '+');
		},
	
		/**
		 * 把字符串转为指定长度。
		 * @param {String} value   字符串。
		 * @param {Number} len 需要的最大长度。
		 * @example
		 * <code>
		 * String.ellipsis("123", 2); //   '1...'
		 * </code>
		 */
		ellipsis: function(value, len) {
			assert.isString(value, "String.ellipsis(value, len): 参数  {value} ~。");
			assert.isNumber(len, "String.ellipsis(value, len): 参数  {len} ~。");
			return value.length > len ?  value.substr(0, len - 3) + "..." : value;
		}
		
	});
	
	/// #ifdef SupportIE8
	
	/**
	 * 日期。
	 * @class Date
	 */
	applyIf(Date, {
		
		/**
		 * 获取当前时间。
		 * @static
		 * @return {Number} 当前的时间点。
		 * @example
		 * <code>
		 * Date.now(); //   相当于 new Date().getTime()
		 * </code>
		 */
		now: function() {
			return +new Date();
		}
		
	});
	
	/// #endif
	
	
	/// #endregion
	
	/// #region 浏览器

	/**
	 * 浏览器。
	 * @namespace navigator
	 */
	applyIf(navigator, (function(ua) {

		//检查信息
		var match = ua.match(/(IE|Firefox|Chrome|Safari|Opera|Navigator).((\d+)\.?[\d.]*)/i) || ["", "Other", 0, 0],
			
			// 版本信息。
			version = ua.match(/(Version).((\d+)\.?[\d.]*)/i) || match,
			
			//浏览器名字
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
			 * 浏览器是否为标准事件。就目前浏览器状况， IE6，7 中 isQuirks = true  其它皆 false 。
			 * @type Boolean
			 * 此处认为 IE6,7 是怪癖的。
			 */
			isQuirks: typeof Element !== 'function' && String(w.Element).indexOf("object Element") === -1,
			
			/// #endif
			
			/// #ifdef SupportIE8
			
			/**
			 * 是否为标准浏览器事件。
			 * @type Boolean
			 */
			isStd: !!-[1,],
			
			/// #endif
			
			/**
			 * 浏览器名字。
			 * @type String
			 */
			name: browser,
			
			/**
			 * 浏览器版本。
			 * @type String
			 * 输出的格式比如 6.0.0 。
			 * 这是一个字符串，如果需要比较版本，应该使用 parseFloat(navigator.version) < 4 。
			 */
			version: version[2]
			
		};
	
	})(navigator.userAgent));

	/// #endregion
	
	/// #region 内部函数

	/**
	 * xType。
	 */
	Date.prototype.xType = "date";
	
	/**
	 * xType。
	 */
	RegExp.prototype.xType = "regexp";
	
	
	// 把所有内建对象本地化
	each.call([String, Array, Function, Date, Number], Class);
	
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
		 *    a: function(g, b) {
		 * 	    alert(g + b);
		 *    }
		 * });
		 * 
		 * var MyCls = MyBa.extend({
		 * 	  a: function(g, b) {
		 * 	    this.base('a', g, b);   // 或   this.base('a', arguments);
		 *    }
		 * });
		 * 
		 * new MyCls().a();   
		 * </code>
		 */
		base: function(methodName, args) {
			
			var me = this.constructor,
			
				fn = this[methodName];
				
			assert(fn, "Object.prototype.base(methodName, args): 子类不存在 {methodName} 的属性或方法。", name);
			
			// 标记当前类的 fn 已执行。
			fn.$bubble = true;
				
			assert(!me || me.prototype[methodName], "Object.prototype.base(methodName, args): 父类不存在 {methodName} 的属性或方法。", name);
			
			// 保证得到的是父类的成员。
			
			do {
				me = me.base;
				assert(me && me.prototype[methodName], "Object.prototype.base(methodName, args): 父类不存在 {methodName} 的属性或方法。", name);
			} while('$bubble' in (fn = me.prototype[methodName]));
			
			assert.isFunction(fn, "Object.prototype.base(methodName, args): 父类的成员 {fn}不是一个函数。  ");
			
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
		
		/**
	     * 转为骆驼格式。
	     * @param {String} value 内容。
	     * @return {String} 返回的内容。
	     * @example
		 * <code>
		 * "font-size".toCamelCase(); //     "fontSize"
		 * </code>
	     */
		toCamelCase: function() {
	        return this.replace(rToCamelCase, toCamelCase);
	    },

		/// #ifdef SupportIE8

		/**
		 * 去除首尾空格。
		 * @return {String}    处理后的字符串。
	     * @example
		 * <code>
		 * "   g h   ".trim(); //     "g h"
		 * </code>
		 */
		trim: function() {
			
			// 使用正则实现。
			return this.replace(rSpace, "");
		},
		
		/// #endif
		
		/**
		 * 将字符首字母大写。
		 * @return {String} 大写的字符串。
	     * @example
		 * <code>
		 * "bb".capitalize(); //     "Bb"
		 * </code>
		 */
		capitalize: function() {
			
			// 使用正则实现。
			return this.replace(rFirstChar, toUpperCase);
		}

	});
	
	/**
	 * @class Array
	 */
	Array.implementIf({

		/// #ifdef SupportIE8

		/**
		 * 返回数组某个值的第一个位置。值没有,则为-1 。
		 * @param {Object} item 成员。
		 * @param {Number} start=0 开始查找的位置。
		 * @return Number 位置，找不到返回 -1 。 
		 * 现在大多数浏览器已含此函数.除了 IE8-  。
		 * @method
		 */
		indexOf: function   (item, startIndex) {
			startIndex = startIndex || 0;
			for (var l = this.length; startIndex < l; startIndex++)
				if (this[startIndex] === item)
					return startIndex;
			return -1;
		},
		
		/// #endif

		/**
		 * 对数组运行一个函数。
		 * @param {Function} fn 函数.参数 value, index
		 * @param {Object} bind 对象。
		 * @return {Boolean} 有无执行完。
		 * @method
		 * @seeAlso Array.prototype.forEach
		 * @example
		 * <code> 
		 * [2, 5].each(function(value, key) {
		 * 		trace(value);
		 * 		return false
		 * });
		 * // 输出 '2'
		 * </code>
		 */
		each: each,

		/// #ifdef SupportIE8

		/**
		 * 对数组每个元素通过一个函数过滤。返回所有符合要求的元素的数组。
		 * @param {Function} fn 函数。参数 value, index, this。
		 * @param {Object} bind 绑定的对象。
		 * @return {Array} 新的数组。
		 * @seeAlso Array.prototype.select
		 * @example
		 * <code> 
		 * [1, 7, 2].filter(function(key) {return key &lt; 5 })   [1, 2]
		 * </code>
		 */
		filter: function(fn, bind) {
			var r = [];
			ap.forEach.call(this, function(value, i, array) {
				
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
		 * [2, 5].forEach(function(value, key) {
		 * 		trace(value);
		 * });
		 * // 输出 '2' '5'
		 * </code>
		 * */
		forEach: each,
		
		/// #endif
		
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
			me.splice(++index, l - index);
			
			return me;
		},

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
		include: function(value) {
			
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
		insert: function(index, value) {
			
			assert.isNumber(index, "Array.prototype.insert(index, value): 参数 index ~。");
			var me = this,
				tmp = ap.slice.call(this, index);
			me.length = index;
			this[index] = value;
			ap.push.apply(me, tmp);
			return me;
			
		},
		
		/**
		 * 对数组成员遍历执行。
		 * @param {String/Function} fn
		 * @param {Array} args
		 * @return {Array} 结果。
		 * @example
		 * <code>
		 * ["vhd"].invoke('charAt', [0]); //    ['v']
		 * ["vhd"].invoke(function(v){ return v.charAt(0)} ); //    ['v']
		 * </code>
		 */
		invoke: function(fn, args) {
			assert(Function.isFunction(fn) || (args && typeof args.length === 'number'), "Array.prototype.invoke(fn, args): 参数 {args} 必须是数组, 无法省略。", args)
			var r = [];
			
			// 如果函数，则调用。 否则对 属性调用函数。
			ap.forEach.call(this, Function.isFunction(fn) ? function(value, index) {
				r.push(fn.call(args, value, index));
			} : function(value) { 
				assert(value && Function.isFunction(value[fn]), "Array.prototype.invoke(fn, args): {args} 内的 {value} 不包含可执行的函数 {fn}。", args, value, fn);
				r.push(value[fn].apply(value, args));
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
		unique: function() {
			
			// 删除从 i + 1 之后的当前元素。
			for(var i = 0; i < this.length; ap.remove.call(this, this[i], ++i)) ;
			
			return this;
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
		remove: function(value, startIndex) {
			
			// 找到位置， 然后删。
			var i = ap.indexOf.call(this, value, startIndex);
			if(i !== -1) ap.splice.call(this, i, 1);
			return i;
		},
		
		/**
		 * xType。
		 */
		xType: "array"

	});
	
	/// #endregion
	
	/// #region 远程请求
	
	
	/// #ifdef SupportIE6
	
	/**
	 * 生成一个请求。
	 * @class window.XMLHttpRequest
	 * @return {XMLHttpRequest} 请求的对象。
	 */
	
	if(!w.XMLHttpRequest || navigator.isQuirks) {
		
		try{
			(w.XMLHttpRequest = function() {
				return new ActiveXObject("MSXML2.XMLHTTP");
			})();
		} catch(e) {
			try {
				(w.XMLHttpRequest = function() {
					return new ActiveXObject("Microsoft.XMLHTTP");
				})();
			} catch (e) {
				
			}
		}
	}
	
	
	/// #endif
	
	/**
	 * 判断当前请求是否有正常的返回。
	 * @param {XMLHttpRequest} xmlHttpRequest 请求。
	 * @return {Boolean} 正常返回true 。
	 * @static
	 */
	w.XMLHttpRequest.isOk = function(xmlHttpRequest) {
		
		assert.isObject(xmlHttpRequest, 'XMLHttpRequest.isOk(xmlHttpRequest): 参数 {xmlHttpRequest} 不是合法的 XMLHttpRequest 对象');
		
		// 获取状态。
		var status = xmlHttpRequest.status;
		if (!status) {
			
			// 获取协议。
			var protocol = w.location.protocol;
			
			// 对谷歌浏览器，  status 不存在。
			return (protocol == "file: " || protocol == "chrome: " || protocol == "app: ");
		}
		
		// 检查， 各浏览器支持不同。
		return (status >= 200 && status < 300) || status == 304 || status == 1223;
	};
	
	/**
	 * @class
	 */
	
	/// #endregion

	/// #region 页面
	
	/**
	 * @namespace JPlus
	 */
	apply(p, {
		
		/**
		 * id种子 。
		 * @type Number
		 */
		id: Date.now() % 100,
			
		/**
		 * JPlus 安装的根目录, 可以为相对目录。
		 * @config {String}
		 */
		rootPath: p.rootPath || (function() {
				
				
				/// HACK: this function fails in special environment
				
				var scripts = document.getElementsByTagName("script");
				
				// 当前脚本在 <script> 引用。最后一个脚本即当前执行的文件。
				scripts = scripts[scripts.length - 1];
						
				// IE6/7 使用  getAttribute
				scripts = navigator.isQuirks ? scripts.getAttribute('src', 5) : scripts.src;
				return (scripts.match(/[\S\s]*\//) || [""])[0];
				
		}) (),
		
		/**
		 * 初始化 window 对象。
		 * @param {Document} doc
		 * @private
		 */
		setupWindow: function(w) {
			
			/// #region 变量
			
			/// #ifdef SupportGlobalObject
		
			// 将以下成员赋予 window ，这些成员是全局成员。
			String.map('Class using namespace undefined IEvent', p, w, true);
			
			/// #endif
		
			
			/// #endregion
			
			/// #region bindReady
			
			var document = w.document,
			
				list = [],
				
				/// #ifdef SupportIE8
			
				eventName = navigator.isStd ? 'DOMContentLoaded' : 'readystatechange';
			
				/// #else
				
				/// eventName = 'DOMContentLoaded';  
				
				/// #endif
				
			[['onReady', 'isReady', document, eventName], ['onLoad', 'isLoaded', w, 'load']].forEach(function(value, i){
				var onReadyLoad = value[0],
					owner = value[2]; 
					
				//  设置 onReady  Load
				document[onReadyLoad] = function(fn) {
	
					assert.isFunction(fn, "document." +  onReadyLoad + "(fn): 参数 {fn} ~。");
					
					if(document[value[1]])
						fn.call(owner);
					else
						// 已经完成则执行函数，否则 on 。
						doReadyLoad.list.push(fn);
					
					return this;
				};
				
				// 真正执行的函数。
				function doReadyLoad(){
					document[value[1]] = true;
					
					// 使用 document 删除事件。
					p.removeEventListener.call(owner, eventName, doReadyLoad, false);
					
					// 调用所有函数。
					doReadyLoad.list.invoke('call', [owner, p]);
					
					
					doReadyLoad = null;
					
				}
				
				list[i] = doReadyLoad;
				
			});
		
			/**
			 * 页面加载时执行。
			 * @param {Functon} fn 执行的函数。
			 * @memberOf document
			 */
			
			/**
			 * 在文档载入的时候执行函数。
			 * @param {Functon} fn 执行的函数。
			 * @memberOf document
			 */
				
			list[0].list = [];
			
			list[1].list = [function(){
				if(!document.isReady)
					list[0]();
				list = null;
			}];
				
			// 如果readyState 不是  complete, 说明文档正在加载。
			if (document.readyState !== "complete") { 
	
				// 使用系统文档完成事件。
				p.addEventListener.call(document, eventName, list[0], false);
				
				p.addEventListener.call(w, 'load', list[1], false);
				
				/// #ifdef SupportIE8
				
				// 只对 IE 检查。
				if (!navigator.isStd) {
				
					// 来自 jQuery
		
					//   如果是 IE 且不是框架
					var toplevel = false;
		
					try {
						toplevel = w.frameElement == null;
					} catch(e) {}
		
					if ( toplevel && document.documentElement.doScroll) {
						
						/**
						 * 为 IE 检查状态。
						 * @private
						 */
						(function () {
							if (document.isReady) {
								return;
							}
						
							try {
								//  http:// javascript.nwbox.com/IEContentLoaded/
								document.documentElement.doScroll("left");
							} catch(e) {
								setTimeout( arguments.callee, 1 );
								return;
							}
						
							list[0]();
						})();
					}
				}
				
				/// #endif
				
			} else {
				setTimeout(list[1], 1);
			}
			
			/// #endregion
		}
		
	});
	
	p.setupWindow(w);

	/// #endregion
	
	/// #region 函数
	
	/**
	 * 复制所有属性到任何对象。 
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function apply(dest, src) {
		
		assert(dest != null, "Object.extend(dest, src): 参数 {dest} 不可为空。", dest);
		assert(src != null, "Object.extend(dest, src): 参数 {src} 不可为空。", src);
		
		
		for (var b in src)
			dest[b] = src[b];
		return dest;
	}
	
	/**
	 * 如果不存在就复制所有属性到任何对象。 
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function applyIf(dest, src) {
		
		assert(dest != null, "Object.extendIf(dest, src): 参数 {dest} 不可为空。", dest);
		assert(src != null, "Object.extendIf(dest, src): 参数 {src} 不可为空。", src);

		for (var b in src)
			if (dest[b] === undefined)
				dest[b] = src[b];
		return dest;
	}

	/**
	 * 对数组运行一个函数。
	 * @param {Function} fn 函数.参数 value, index, array
	 * @param {Object} bind 对象。
	 * @return {Boolean} 有无执行完。
	 * 现在大多数浏览器已含此函数.除了 IE8-  。
	 */
	function each(fn, bind) {
		
		assert(Function.isFunction(fn), "Array.prototype.each(fn, bind): 参数 {fn} 必须是一个可执行的函数。", fn);
		
		var i = -1,
			me = this;
		while (++i < me.length)
			if(fn.call(bind, me[i], i, me) === false)
				return false;
		return true;
	}
	
	/**
	 * 由存在的类修改创建类。
	 * @param {Function/Class} constructor 将创建的类。
	 * @return {Class} 生成的类。
	 */
	function Class(constructor) {
		
		// 简单拷贝  Object 的成员，即拥有类的特性。
		// 在 JavaScript， 一切函数都可作为类，故此函数存在。
		// Object 的成员一般对当前类构造函数原型辅助。
		return applyIf(constructor, Object);
	}
	
	/**
	 * 所有自定义类的基类。
	 */
	function Object() {
	
	}
		
	/**
	 * 返回返回指定结果的函数。
	 * @param {mixed} v 结果。
	 * @return {Function} 函数。
	 */
	function from(obj) {
		
		return function() {
			return obj;
		}
	}
	
    /**
     * 到骆驼模式。
     * @param {Match} match 匹配的内容。
     * @return {String} 返回的内容。
     */
    function toCamelCase(match) {
        return match.charAt(1).toUpperCase();
    }
	
	/**
	 * 将一个字符转为大写。
	 * @param {String} match 字符。
	 */
	function toUpperCase(match) {
		return match.toUpperCase();
	}
	
	/**
	 * 空函数。
	 */
	function emptyFn() {
		
	}

	/**
	 * 定义名字空间。
	 * @param {String} ns 名字空间。
	 * @param {Object/Boolean} obj 值。
	 */
	function namespace(ns, obj) {
		
		assert(ns && ns.split, "namespace(namespace, obj, value): 参数 {namespace} 不是合法的名字空间。", ns);
		
		
		// 简单声明。
		if (arguments.length == 1) {
			
			/// #ifdef SupportUsing
			
			// 加入已使用的名字空间。
			return   p.namespaces.include(ns);
			
			/// #else
			
			/// return ;
			
			/// #endif
		}
		
		// 取值，创建。
		ns = ns.split('.');
		
		var current = w, i = -1, len = ns.length - 1;
		
		ns[0] = ns[0] || 'JPlus';
		
		while(++i < len)
			current = current[ns[i]] || (current[ns[i]] = {});

		if(i = ns[len])
			current[i] = obj;
		else {
			obj = applyIf(current, obj);
			i = ns[--len];
		}
			
		
		/// #ifdef SupportGlobalObject
		
		// 指明的是对象。
		if (!(i in JPlus.defaultNamespace)) {
			
			// 复制到全局对象和名字空间。
			JPlus.defaultNamespace[i] = obj;
			
		}
		
		/// #endif
		
		return obj;
		
		
		
	}

	/// #endregion

})(this);



// ===========================================
//   调试        C
// ===========================================

///  #ifdef Debug
///  #region 调试


/**
 * @namespace String
 */
Object.extend(String, {
	
	/**
	 * 将字符串转为 utf-8 字符串。
	 * @param {String} s 字符串。
	 * @return {String} 返回的字符串。
	 */
	toUTF8:function(s) {
		return s.replace(/[^\x00-\xff]/g, function(a,b) {
			return '\\u' + ((b=a.charCodeAt()) < 16 ? '000' : b<256 ? '00' : b<4096 ? '0' : '') + b.toString(16);
		});
	},
    
	/**
	 * 将字符串从 utf-8 字符串转义。
	 * @param {String} s   字符串。
	 * @return {String} 返回的字符串。
	 */
	fromUTF8:function(s) {
		return s.replace(/\\u([0-9a-f]{3})([0-9a-f])/gi,function(a,b,c) {return String.fromCharCode((parseInt(b,16)*16+parseInt(c,16)))})
	}
		
});
 


/**
 * 调试输出。
 * @param {Object} obj 值。
 * @param {String} args 格式化的字符串。
 */
function trace(obj, args) {

	if (arguments.length == 0 || !JPlus.trace) return; // 关闭调试
	
	var useConsole = window.console && console.log;

	if (typeof obj == "string") {
		if(arguments.length > 1)
			obj = String.format.apply(trace.inspect, arguments);
		// 存在       console
		//   IE8  存在控制台，这是好事，但问题是IE8的控制台对对象输出全为 [object] 为了更好的调试，我们期待自定义的调试信息。
		//    为了支持类的输出，也不使用默认的函数输出
	} else if (!useConsole || navigator.isIE8) {
		obj = trace.inspect(obj, args);
	}


	if (useConsole) console.log(obj);
	else trace.write(obj);
}

/**
 * @namespace trace
 */
Object.extendIf(trace, {
	
	/**
	 * 输出方式。
	 * @param {String} message 信息。
	 */
	write: function(message) {
		alert(message);
	},
	
	/**
	 * 输出类的信息。
	 * @param {Object} 成员。
	 */
	api: function(obj, prefix) {
		var title = 'API信息: ', msg = [];
		
		var definedObj = 'Object String Date Array RegExp document JPlus navigator XMLHttpRequest trace assert Function';

		if(arguments.length === 0) {
			title = '全局对象: ';
			prefix = '';
			String.map(definedObj, function(propertyName) {
				addValue(window, propertyName);
			});

			for(var propertyName in JPlus) {
				if(JPlus.defaultNamespace[propertyName] === JPlus[propertyName]) {
					addValue(JPlus, propertyName);
				}
			}
		} else if(obj != null) {
			if(obj.prototype) {
				for(var propertyName in obj.prototype) {
					var extObj = obj;
					
					try {
						while(!Object.prototype.hasOwnProperty.call(extObj.prototype, propertyName) && (extObj = extObj.base) && extObj.prototype);
						extObj = extObj === obj ? '' : (extObj = getClassInfo(extObj)) ? '(继承于 ' + extObj + ' 类)' : '(继承的)';
						
						msg.push('prototype.' + propertyName + ' ' + getMember(obj.prototype[propertyName], propertyName) + extObj);
					} catch(e) {
					}
				}
			}
			for(var item in obj) {
				try {
					addValue(obj, item);
				} catch(e) {
				}
			}
		} else {
			msg = ['无法对 ' + (obj === null ? "null" : "undefined") + ' 分析'];
		}

		// 尝试获取一层的元素。
		if(prefix === undefined) {
			
			String.map(definedObj + ' window location history', function(value) {
				if(window[value] === obj) {
					title = value + ' ' + getMember(obj, value) + '的成员: ';
					prefix = value;
				}
			});
			
			var typeName ,constructor = obj != null && obj.constructor;
			
			if(!prefix) {
				
				String.map(definedObj, function(value) {
					if(constructor === window[value]) {
						prefix = value + '.prototype';
						title = value + ' 类的实例成员: ';
					}
				});
				
			}

			if(!prefix) {
				
				
				if(obj && obj.nodeType) {
					prefix = 'Element.prototype';
					title = 'Element 类的实例成员: ';
				} else {
					
					if(typeName = getClassInfo(obj)) {
						var extObj = getMember(obj, typeName) === '类' && getClassInfo(obj.base);
						title = typeName + ' ' + getMember(obj, typeName) + (extObj && extObj != "Object" ? '(继承于 ' + extObj + ' 类)' : '') + '的成员: ';
						prefix = typeName;
					} else if(typeName = getClassInfo(constructor)) {
						prefix = typeName + '.prototype';
						title = typeName + ' 类的实例成员: ';
					}
				}
			}
		}

		if(msg.length === 0)
			msg.push(title + '无');
		else {
			msg.sort();
			msg.unshift(title);
		}

		trace(msg.join( prefix ? '\r\n' + prefix + "." : '\r\n'));


		function isEmptyObject(obj) {
			for(var i in obj)
			return false;

			return true;
		}

		function getMember(val, name) {
			
			if(typeof val === 'function' && name === 'constructor')
				return '构造函数';

			if(val && val.prototype && !isEmptyObject(val.prototype))
				return '类';

			if(Object.isObject(val))
				return name.charAt(0) === 'I' && isUpper(name, 1) ? '接口' : '对象';

			if(Function.isFunction(val)) {
				return isUpper(name, 0) ? '类' : '函数';
			}

			return '属性';
		}

		function isUpper(s, i) {
			s = s.charCodeAt(i);
			return s <= 90 && s >= 65;
		}
		
		function getClassInfo(value) {
			
			if(value) {
				for(var item in JPlus) {
					if(JPlus[item] === value) {
						return item;
					}
				}
				
			}
			
			return null;
		}
		
		function addValue(base, memberName) {
			msg.push(memberName + ' ' + getMember(base[memberName], memberName));
		}

	},
	
	/**
	 * 得到输出指定内容的函数。
	 * @return {Function}
	 */
	from: function(msg) {
		return function() {
			trace(msg, arguments);
		};
	},

	/**
	 * 遍历对象每个元素。
	 * @param {Object} obj 对象。
	 */
	dir: function(obj) {
		if (JPlus.trace) {
			if (window.console && console.dir) 
				console.dir(obj);
			else 
				if (obj) {
					var r = "{\r\n", i;
					for (i in obj) 
						r += "\t" + i + " = " + trace.inspect(obj[i], 1) + "\r\n";
					r += "}";
					trace.alert(r);
				}
		}
	},
	
	/**
	 * 获取对象的字符串形式。
	 * @param {Object} obj 要输出的内容。
	 * @param {Number/undefined} deep=0 递归的层数。
	 * @return String 成员。
	 */
	inspect: function(obj, deep) {
		
		if( deep == null ) deep = 0;
		switch (typeof obj) {
			case "function":
				if(deep == 0 && obj.prototype && obj.prototype.xType) {
					// 类
					return String.format(
							"class {0} : {1} {2}",
							obj.prototype.xType,
							(obj.prototype.base && obj.prototype.base.xType || "Object"),
							trace.inspect(obj.prototype, deep + 1)
						);
				}
				
				//  函数
				return deep == 0 ? String.fromUTF8(obj.toString()) : "function()";
				
			case "object":
				if (obj == null) return "null";
				if(deep >= 3)
					return obj.toString();

				if(Array.isArray(obj)) {
					return "[" + Object.update(obj, trace.inspect, []).join(", ") + "]";
					
				}else{
					if(obj.setInterval && obj.resizeTo)
						return "window";
					if (obj.nodeType) {
						if(obj.nodeType == 9)
							return 'document';
						if (obj.tagName) {
							var tagName = obj.tagName.toLowerCase(), r = tagName;
							if (obj.id) {
								r += "#" + obj.id;
								if (obj.className) 
									r += "." + obj.className;
							}
							else 
								if (obj.outerHTML) 
									r = obj.outerHTML;
								else {
									if (obj.className) 
										r += " class=\"." + obj.className + "\"";
									r = "<" + r + ">" + obj.innerHTML + "</" + tagName + ">  ";
								}
							
							return r;
						}
						
						return '[Node name=' + obj.nodeName + 'value=' + obj.nodeValue + ']';
					}
					var r = "{\r\n", i;
					for(i in obj)
						r += "\t" + i + " = " + trace.inspect(obj[i], deep + 1) + "\r\n";
					r += "}";
					return r;
				}
			case "string":
				return deep == 0 ? obj : '"' + obj + '"';
			case "undefined":
				return "undefined";
			default:
				return obj.toString();
		}
	},
	
	/**
	 * 输出信息。
	 * @param {Object} ... 内容。
	 */
	log: function() {
		if (JPlus.trace) {
			if (window.console && console.log && console.log.apply) {
				console.log.apply(console, arguments);
			} else {
				trace(Object.update(arguments, trace.inspect, []).join(" "));
			}
		}
	},

	/**
	 * 输出一个错误信息。
	 * @param {Object} msg 内容。
	 */
	error: function(msg) {
		if (JPlus.trace) {
			if (window.console && console.error) 
				console.error(msg); //   如果错误在此行产生，说明这是预知错误。
				
			else {
				throw msg;
			}
		}
	},
	
	/**
	 * 输出一个警告信息。
	 * @param {Object} msg 内容。
	 */
	warn: function(msg) {
		if (JPlus.trace) {
			if (window.console && console.warn) 
				console.warn(msg);
			else 
				trace.alert("[警告]" + msg);
		}
	},

	/**
	 * 输出一个信息。
	 * @param {Object} msg 内容。
	 */
	info: function(msg) {
		if (JPlus.trace) {
			if (window.console && console.info) 
				console.info(msg);
			else 
				trace.alert("[信息]" + msg);
		}
	},

	/**
	 * 如果是调试模式就运行。
	 * @param {Function} f 函数。
	 * @return String 返回运行的错误。如无错, 返回空字符。
	 */
	ifDebug: function(f) {
		if (JPlus.debug === false) return;
		try {
			f();
			return "";
		} catch(e) {
			return e;
		}
	},
	
	/**
	 * 清除调试信息。  (没有控制台时，不起任何作用)
	 */
	clear: function() {
		if( window.console && console.clear)
			console.clear();
	},

	/**
	 * 空函数，用于证明函数已经执行过。
	 */
	count: function() {
		trace(JPlus.id++);
	},

	/**
	 * 如果false则输出。
	 * @param {Boolean} condition 字段。
	 * @return {String} msg  输出的内容。
	 */
	ifNot: function(condition, msg) {
		if (!condition) trace.warn(msg);
	},
	
	/**
	 * 输出一个函数执行指定次使用的时间。
	 * @param {Function} fn 函数。
	 * @param {Number} times=1000 运行次数。
	 */
	time: function(fn, times) {
		trace("[时间] " + trace.runTime(fn, times));
	},
	
	/**
	 * 测试某个函数运行一定次数的时间。
	 * @param {Function} fn 函数。
	 * @param {Number} times=1000 运行次数。
	 * @return {Number} 运行的时间 。
	 */
	runTime: function(fn, times) {
		times = times || 1000;
		var d = Date.now();
		while (times-- > 0)
			fn();
		return Date.now() - d;
	}

});

/**
 * 确认一个值正确。
 * @param {Object} bValue 值。
 * @param {String} msg="断言失败" 错误后的提示。
 * @return {Boolean} 返回 bValue 。
 * @example
 * <code>
 * assert(true, "{value} 错误。", value);
 * </code>
 */
function assert(bValue, msg) {
	if (!bValue && JPlus.debug) {
	
		 var val = arguments;

		// 如果启用 [参数] 功能
		if (val.length > 2) {
			var i = 2;
			msg = msg.replace(/\{([\w$\.\(\)]*?)\}/g, function(s, x) {
				return val.length <= i ? s : x + " = " + String.ellipsis(trace.inspect(val[i++]), 200);
			});
		}else {
			msg = msg || "断言失败";
		}

		// 错误源
		val = arguments.callee.caller;
		
		if (JPlus.stackTrace !== false) {
		
			while (val.debugStepThrough) 
				val = val.caller;
			
			if (val) msg += "\r\n--------------------------------------------------------------------\r\n" + String.ellipsis(String.fromUTF8(val.toString()), 600);
			
		}

		if(JPlus.trace)
			trace.error(msg);
		else
			throw new Error(msg);

	}

	return !!bValue;
}

(function() {
	
	function  assertInternal(asserts, msg, value, dftMsg) {
		return assert(asserts, msg ?  msg.replace('~', dftMsg) : dftMsg, value);
	}
	
	function assertInternal2(fn, dftMsg, args) {
		return assertInternal(fn(args[0]), args[1], args[0], dftMsg);
	}
	
	/**
	 * @namespace assert
	 */
	Object.extend(assert, {
		
		/**
		 * 确认一个值为函数变量。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 * @example
		 * <code>
		 * assert.isFunction(a, "a ~");
		 * </code>
		 */
		isFunction: function() {
			return assertInternal2(Function.isFunction, "必须是可执行的函数", arguments);
		},
		
		/**
		 * 确认一个值为数组。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isArray: function() {
			return assertInternal2(Array.isArray, "必须是数组", arguments);
		},
		
		/**
		 * 确认一个值为函数变量。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isObject: function(value, msg) {
			return assertInternal(Object.isObject(value) || Function.isFunction(value), msg, value,  "必须是引用的对象", arguments);
		},
		
		/**
		 * 确认一个值为数字。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isNumber: function(value, msg) {
			return assertInternal(typeof value == 'number' || value instanceof Number, msg, value, "必须是数字");
		},
		
		/**
		 * 确认一个值为节点。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isNode: function(value, msg) {
			return assertInternal(value && value.nodeType, msg, value, "必须是 DOM 节点");
		},
		
		/**
		 * 确认一个值为节点。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isElement: function(value, msg) {
			return assertInternal(value && value.style, msg, value, "必须是 Element 对象");
		},
		
		/**
		 * 确认一个值是字符串。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isString: function(value, msg) {
			return assertInternal(typeof value == 'string' || value instanceof String, msg, value, "必须是字符串");
		},
		
		/**
		 * 确认一个值是日期。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isDate: function(value, msg) {
			return assertInternal(Object.type(value) == 'date' || value instanceof Date, msg, value, "必须是日期");
		},
		
		/**
		 * 确认一个值是正则表达式。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isRegExp: function(value, msg) {
			return assertInternal(Object.type(value) == 'regexp' || value instanceof RegExp, msg, value, "必须是正则表达式");
		},
	
		/**
		 * 确认一个值非空。
		 * @param {Object} value 值。
		 * @param {String} argsName 变量的名字字符串。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		notNull: function(value, msg) {
			return assertInternal(value != null, msg, value, "不可为空");
		},
	
		/**
		 * 确认一个值在 min ， max 间。
		 * @param {Number} value 判断的值。
		 * @param {Number} min 最小值。
		 * @param {Number} max 最大值。
		 * @param {String} argsName 变量的米各庄。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		between: function(value, min, max, msg) {
			return assertInternal(value >= min && !(value >= max), msg, value, "超出索引, 它必须在 [" + min + ", " + (max === undefined ? "+∞" : max) + ") 间");
		},
	
		/**
		 * 确认一个值属于一个类型。
		 * @param {Object} v 值。
		 * @param {String/Array} types 类型/表示类型的参数数组。
		 * @param {String} message 错误的提示信息。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		instanceOf: function(v, types, msg) {
			if (!Array.isArray(types)) types = [types];
			var ty = typeof v,
				iy = Object.type(v);
			return assertInternal(types.filter(function(type) {
				return type == ty || type == iy;
			}).length, msg, v, "类型错误。");
		},
	
		/**
		 * 确认一个值非空。
		 * @param {Object} value 值。
		 * @param {String} argsName 变量的参数名。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		notEmpty: function(value, msg) {
			return assertInternal(value && value.length, msg, value, "为空");
		}

	});
	
	assertInternal.debugStepThrough = assertInternal2.debugStepThrough = true;
	
	
	for(var fn in assert) { 
		assert[fn].debugStepThrough = true;
	}

	
})();

/// #endregion
/// #endif

//===========================================================
