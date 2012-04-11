/**
 * J+ Library, 3.0
 * @projectDescription J+：面向对象的组件实现
 * @copyright 2011-2012 J+ Team
 * @fileOverview 定义必须的系统函数。
 */

// 可用的宏
// 	CompactMode - 兼容模式 - 支持 IE6+ FF2.5+ Chrome1+ Opera9+ Safari4+ , 若无此宏，将只支持 HTML5。
// 	Release - 启用发布操作 - 删除 assert 和 trace 和 using 支持。


(function(window) {

    /// #if Release
    /// 	#trim assert
    /// 	#trim trace
    /// 	#trim using
    /// 	#trim imports
    /// #endif

	/// #region Core

	/**
	 * document 简写。
	 * @type Document
	 */
	var document = window.document,
	
		/**
		 * navigator 简写。
		 * @type Navigator
		 */
		navigator = window.navigator,

        /**
         * Object 简写。
         * @type Function
         */
        Object = window.Object,
	
		/**
		 * Array.prototype 简写。
		 * @type  Object
		 */
		ap = Array.prototype,
	
		/**
		 * Object.prototype.toString 简写。
		 * @type Function
		 */
		toString = Object.prototype.toString,
	
		/**
		 * Object.prototype.hasOwnProperty 简写。
		 * @type Function
		 */
		hasOwnProperty = Object.prototype.hasOwnProperty,
	
		/**
		 * 存储所有类的事件信息。
		 * @type  Object
		 */
		eventMgr = {
	
			/**
			 * 默认的事件信息。
			 * @type  Object
			 */
			$default: {}

		},
	
		/**
		 * JPlus 全局静态对象。包含系统有关的函数。
		 * @namespace JPlus
		 */
		p = namespace("JPlus", {
	
		    /**
			 * 获取用于在一个对象读写数据的对象。
			 * @param {Object} obj 任何对象。
			 * @param {String} dataType 数据类型名。
			 * @return {Object} 用于读写数据的对象。
			 * @remark {JPlus.data} 总是返回一个对象，该对象和指定的 obj 关联。对于同一个 obj，如果 dataType 相同，则返回相同的数据对象。
			 * @see JPlus.getData
			 * @see JPlus.setData
			 * @example <code>
		     * var obj = {};
			 * var data =  JPlus.data(obj, 'a'); // 创建并返回数据对象 'a'
             * data.c = 2; // 读写数据对象的值。
             * </code>
			 */
		    data: function(obj, dataType) {
	
			    assert.isObject(obj, "JPlus.data(obj, dataType): {obj} ~");

                // 内部支持 dom 属性。
                if(obj.dom)
                    obj = obj.dom;

                // 这里忽略 IE6/7 的内存泄露问题。

                obj = obj.$data || (obj.$data = {});
	
			    // 创建或获取 dataType。
			    return obj[dataType] || (obj[dataType] = {});
		    },
	
		    /**
			 * 获取一个对象指定字段的数据，如果数据不存在，则返回 undefined。
			 * @param {Object} obj 任何对象。
			 * @param {String} dataType 数据类型名。
			 * @return {Object} 返回对应的值。如果数据不存在，则返回 undefined。
			 * @see JPlus.data
			 * @see JPlus.setData
			 * @example <code>
		     * var obj = {};
			 * var a = JPlus.getData(obj, 'a'); // 获取 a 字段的数据。 
		     * trace( a )
		     * </code>
			 */
		    getData: function(obj, dataType) {
	
			    assert.isObject(obj, "JPlus.getData(obj, dataType): {obj} ~");

                // 内部支持 dom 属性。
                if(obj.dom)
                    obj = obj.dom;
	
			    // 获取属性'$data'。
			    var d = obj.$data;
			    return d && d[dataType];
		    },
	
		    /**
			 * 设置属于一个对象指定字段的数据。
			 * @param {Object} obj 任何对象。
			 * @param {String} dataType 数据类型名。
			 * @param {Object} data 要设置的数据内容。
			 * @return {Object} data 返回 data 本身。
			 * @see JPlus.data
			 * @see JPlus.getData
			 * @example <code>
		     * var obj = {};
		     * JPlus.setData(obj, 'a', 5);    // 设置 a 字段的数据值为 5。 
			 * var val = JPlus.getData(obj, 'a'); // 获取值， 返回 5
		     * </code>
			 */
		    setData: function(obj, dataType, data) {
	
			    assert.isObject(obj, "JPlus.setData(obj, dataType): {obj} ~");

                // 内部支持 dom 属性。
                if(obj.dom)
                    obj = obj.dom;
	
			    // 简单设置变量。
			    return (obj.$data || (obj.$data = {}))[dataType] = data;
		    },
			
			/**
			 * 删除属于一个对象指定字段的全部数据。
			 * @param {Object} obj 任何对象。
			 * @example <code>
		     * var obj = {};
		     * JPlus.removeData(obj);
		     * </code>
			 */
			removeData: function(obj){
				if(obj.dom)
                    obj = obj.dom;
				obj.$data = null;
			},
	
		    /**
			 * 创建一个类。
			 * @param {Object/Function} [methods] 类成员列表对象或类构造函数。
			 * @return {Class} 返回创建的类。
			 * @see JPlus.Object.extend
			 * @example 以下代码演示了如何创建一个类:
			 * <code>
		     * var MyCls = Class({
		     * 
		     *    constructor: function (g, h) {
		     * 	      alert('构造函数' + g + h)
		     *    },
		     *
			 *    say: function(){
			 *    	alert('say');
			 *    } 
		     * 
		     * });
		     * 
		     * 
		     * var c = new MyCls(4, ' g');  // 创建类。
			 * c.say();  //  调用 say 方法。
		     * </code>
			 */
		    Class: function(members) {
	
			    // 创建类，其实就是 继承 Object ，创建一个类。
			    return  Base.extend(members);
		    },
	
		    /**
			 * 所有类的基类。
			 * @class JPlus.Object
			 */
		    Object:  Base,
	
		    /**
			 * 将一个原生的 Javascript 函数对象转换为一个类。
			 * @param {Function/Class} constructor 用于转换的对象，将修改此对象，让它看上去和普通的类一样。
			 * @return {Class} 返回生成的类。
			 */
		    Native: function(constructor) {
	
			    // 简单拷贝 Object 的成员，即拥有类的特性。
			    // 在 JavaScript， 一切函数都可作为类，故此函数存在。
			    // Object 的成员一般对当前类构造函数原型辅助。
			    return applyIf(constructor,  Base);
		    },

            /**
             * 判断一个 HTTP 状态码是否表示正常响应。
             * @param {Number} statusCode 要判断的状态码。
             * @return {Boolean} 如果正常则返回true, 否则返回 false 。
			 * 一般地， 200、304、1223 被认为是正常的状态吗。
             */
            checkStatusCode: function(statusCode) {

                // 获取状态。
                if (!statusCode) {

                    // 获取协议。
                    var protocol = window.location.protocol;

                    // 对谷歌浏览器, 在有些协议， statusCode 不存在。
                    return (protocol == "file: " || protocol == "chrome: " || protocol == "app: ");
                }

                // 检查， 各浏览器支持不同。
                return (statusCode >= 200 && statusCode < 300) || statusCode == 304 || statusCode == 1223;
            },
	
		    /**
			 * 创建一个名字空间。
			 * @param {String} namespace 要创建的名字空间，格式如 "System.Dom" 。
			 * @param {Object} [obj] 声明的名字空间对应的初始值。
			 * @remark 	 <p>
			 *            使用名字空间有助于帮助不同组件之间的对象命名冲突。
			 *            </p>
			 *			  <p>
			 * 如果使用 JPlus.namespace(namespace) 重载，则函数会创建对应的对象，但如果要创建的对象已存在，则函数不进行任何操作。
			 *            </p>
			 *            <p>
			 * 如果使用 JPlus.namespace(namespace, obj) 重载，则函数将对应的对象值更改为 obj，如果要创建的对象已存在，则拷贝已有对象的属性到新对象。 如<code>
		     * JPlus.namespace("A.B.C", 5); // 最后 A = {B: {C: 5}}  
		     * </code>
			 * @example <code>
		     * JPlus.namespace("A.B");  // 创建 A 和 A.B 对象，避免修改已存在的对象。
		     * 
		     * var A = {   B:  {b: 5},  C: {b: 5}    };
		     * JPlus.namespace("A.B", {a: 6})  // A = { B: {a: 6}, C: {b: 5}  }
		     * </code>
			 */
		    namespace: namespace,

            /**
             * id种子 。
             * @type Number
			 * @example 下例演示了 JPlus.id 的用处。<code>
			 *		var uid = JPlus.id++;  // 每次使用之后执行 ++， 保证页面内的 id 是唯一的。
			 * </code>
             */
            id: 1,
	
		    /**
			 * 管理所有事件类型的工具。
			 * @property
			 * @type  Object
			 * @internal
			 * 所有类的事件信息都存储在这个对象。
			 */
		    Events: eventMgr
	
		});

	/// #endregion

	/// #region Functions

	/**
	 * @namespace JPlus.Object
	 */
	apply(Base, {

	    /**
		 * 扩展当前类的动态方法。
		 * @param {Object} members 用于扩展的成员列表。
		 * @return this
		 * @see #implementIf
		 * @example 以下示例演示了如何扩展 Number 类的成员。<code>
	     * Number.implement({
	     *   sin: function () {
	     * 	    return Math.sin(this);
	     *  }
	     * });
	     * 
	     * (1).sin();  //  Math.sin(1);
	     * </code>
		 */
	    implement: function(members) {

		    assert(members && this.prototype, "Class.implement(members): 无法扩展类，因为 {members} 或 this.prototype 为空。", members);
		    // 复制到原型 。
		    Object.extend(this.prototype, members);

		    return this;
	    },

	    /**
		 * 扩展当前类的动态方法，但不覆盖已存在的成员。
		 * @param {Object} members 成员。
		 * @return this
		 * @see #implement
		 */
	    implementIf: function(members) {

		    assert(members && this.prototype, "Class.implementIf(members): 无法扩展类，因为 {members} 或 this.prototype 为空。", members);

		    applyIf(this.prototype, members);

		    return this;
	    },

	    /**
		 * 为当前类添加事件。
		 * @param {Object} [evens] 所有事件。 具体见下。
		 * @return this
		 * @remark
		 *         <p>
		 *         由于一个类的事件是按照 xType 属性存放的，拥有相同 xType 的类将有相同的事件，为了避免没有 xType
		 *         属性的类出现事件冲突， 这个方法会自动补全 xType 属性。
		 *         </p>
		 *         <p>
		 *         这个函数是实现自定义事件的关键。
		 *         </p>
		 *         <p>
		 *         addEvents 函数的参数是一个事件信息，格式如: {click: { add: ..., remove: ...,
		 *         initEvent: ..., trigger: ...} 。 其中 click 表示事件名。一般建议事件名是小写的。
		 *         </p>
		 *         <p>
		 *         一个事件有多个相应，分别是: 绑定(add), 删除(remove), 触发(trigger),
		 *         初始化事件参数(initEvent)
		 *         </p>
		 *         </p>
		 *         当用户使用 o.on('事件名', 函数) 时， 系统会判断这个事件是否已经绑定过， 如果之前未绑定事件，则会创建新的函数
		 *         evtTrigger， evtTrigger 函数将遍历并执行 evtTrigger.handlers 里的成员,
		 *         如果其中一个函数执行后返回 false， 则中止执行，并返回 false， 否则返回 true。
		 *         evtTrigger.handlers 表示 当前这个事件的所有实际调用的函数的数组。
		 *         evtTrigger.handlers[0] 是事件的 initEvent 函数。 然后系统会调用 add(o,
		 *         '事件名', evtTrigger) 然后把 evtTrigger 保存在 o.data.event['事件名'] 中。
		 *         如果 之前已经绑定了这个事件，则 evtTrigger 已存在，无需创建。 这时系统只需把 函数 放到
		 *         evtTrigger.handlers 即可。
		 *         </p>
		 *         <p>
		 *         也就是说，真正的事件触发函数是 evtTrigger， evtTrigger去执行用户定义的一个事件全部函数。
		 *         </p>
		 *         <p>
		 *         当用户使用 o.un('事件名', 函数) 时， 系统会找到相应 evtTrigger， 并从
		 *         evtTrigger.handlers 删除 函数。 如果 evtTrigger.handlers 是空数组， 则使用
		 *         remove(o, '事件名', evtTrigger) 移除事件。
		 *         </p>
		 *         <p>
		 *         当用户使用 o.trigger(参数) 时， 系统会找到相应 evtTrigger， 如果事件有trigger， 则使用
		 *         trigger(对象, '事件名', evtTrigger, 参数) 触发事件。 如果没有， 则直接调用
		 *         evtTrigger(参数)。
		 *         </p>
		 *         <p>
		 *         下面分别介绍各函数的具体内容。
		 *         </p>
		 *         <p>
		 *         add 表示 事件被绑定时的操作。 原型为:
		 *         </p>
		 *         <code>
	     * function add(elem, type, fn) {
	     * 	   // 对于标准的 DOM 事件， 它会调用 elem.addEventListener(type, fn, false);
	     * }
	     * </code>
		 *         <p>
		 *         elem表示绑定事件的对象，即类实例。 type 是事件类型， 它就是事件名，因为多个事件的 add 函数肯能一样的，
		 *         因此 type 是区分事件类型的关键。fn 则是绑定事件的函数。
		 *         </p>
		 *         <p>
		 *         remove 同理。
		 *         </p>
		 *         <p>
		 *         initEvent 的参数是一个事件参数，它只能有1个参数。
		 *         </p>
		 *         <p>
		 *         trigger 是高级的事件。参考上面的说明。
		 *         </p>
		 *         <p>
		 *         如果你不知道其中的几个参数功能，特别是 trigger ，请不要自定义。
		 *         </p>
		 * @example 下面代码演示了如何给一个类自定义事件，并创建类的实例，然后绑定触发这个事件。 <code>
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
	    addEvents: function(events) {

		    assert(!events || Object.isObject(events),
		            "Class.addEvents(events): {event} 必须是一个包含事件的对象。 如 {click: { add: ..., remove: ..., initEvent: ..., trigger: ... } ", events);

			var ep = this.prototype, xType = hasOwnProperty.call(ep, 'xType') ? ep.xType : (ep.xType = (p.id++).toString());

			// 更新事件对象。
			apply(eventMgr[xType] || (eventMgr[xType] = {}), events);

		    return this;
	    },

	    /**
		 * 继承当前类创建并返回子类。
		 * @param {Object/Function} [methods] 子类的员或构造函数。
		 * @return {Class} 继承的子类。
		 *         <p>
		 *         这个函数是实现继承的核心。
		 *         </p>
		 *         <p>
		 *         在 Javascript 中，继承是依靠原型链实现的， 这个函数仅仅是对它的包装，而没有做额外的动作。
		 *         </p>
		 *         <p>
		 *         成员中的 constructor 成员 被认为是构造函数。
		 *         </p>
		 *         <p>
		 *         这个函数实现的是 单继承。如果子类有定义构造函数，则仅调用子类的构造函数，否则调用父类的构造函数。
		 *         </p>
		 *         <p>
		 *         要想在子类的构造函数调用父类的构造函数，可以使用 {@link JPlus.Object.prototype.base} 。
		 *         </p>
		 *         <p>
		 *         这个函数返回的类实际是一个函数，但它被使用 JPlus.Object 修饰过。
		 *         </p>
		 *         <p>
		 *         由于原型链的关系， 肯能存在共享的引用。 如: 类 A ， A.prototype.c = []; 那么，A的实例 b ,
		 *         d 都有 c 成员， 但它们共享一个 A.prototype.c 成员。 这显然是不正确的。所以你应该把 参数 quick
		 *         置为 false ， 这样， A创建实例的时候，会自动解除共享的引用成员。 当然，这是一个比较费时的操作，因此，默认
		 *         quick 是 true 。
		 *         </p>
		 *         <p>
		 *         你也可以把动态成员的定义放到 构造函数， 如: this.c = []; 这是最好的解决方案。
		 *         </p>
		 * @example 下面示例演示了如何创建一个子类。<code>
		 * var MyClass = new Class(); //创建一个类。
		 * 
		 * var Child = MyClass.extend({  // 创建一个子类。
		 * 	  type: 'a'
		 * });
		 * 
		 * var obj = new Child(); // 创建子类的实例。
		 * </code>
		 */
	    extend: function(members) {

		    // 未指定函数 使用默认构造函数(Object.prototype.constructor);

		    // 生成子类 。
		    var subClass = hasOwnProperty.call(members = members instanceof Function ? {
			    constructor: members
		    } : (members || {}), "constructor") ? members.constructor : function() {

			    // 调用父类构造函数 。
			    arguments.callee.base.apply(this, arguments);

		    };

		    // 代理类 。
		     emptyFn.prototype = (subClass.base = this).prototype;

		    // 指定成员 。
		    subClass.prototype = Object.extend(new  emptyFn, members);
		    
		    // 清空临时对象。
		    emptyFn.prototype = null;

		    // 覆盖构造函数。
		    subClass.prototype.constructor = subClass;

		    // 指定Class内容 。
		    return p.Native(subClass);

	    }

	});

	/**
	 * Object 简写。
	 * @namespace Object
	 */
	apply(Object, {

	    /**
		 * 复制对象的所有属性到其它对象。
		 * @param {Object} dest 复制目标。
		 * @param {Object} obj 要复制的内容。
		 * @return {Object} 复制后的对象 (dest)。
		 * @see Object.extendIf
		 * @example <code>
	     * var a = {v: 3}, b = {g: 2};
	     * Object.extend(a, b);
	     * trace(a); // {v: 3, g: 2}
	     * </code>
		 */
	    extend: (function() {
		    for ( var item in {
			    toString: true
		    })
			    return apply;

		    p.enumerables = "toString hasOwnProperty valueOf constructor isPrototypeOf".split(' ');
		    // IE6 不会遍历系统对象需要复制，所以强制去测试，如果改写就复制 。
		    return function(dest, src) {
			    if (src) {
				    assert(dest != null, "Object.extend(dest, src): {dest} 不可为空。", dest);

				    for ( var i = p.enumerables.length, value; i--;)
					    if (hasOwnProperty.call(src, value = p.enumerables[i]))
						    dest[value] = src[value];
				    apply(dest, src);
			    }

			    return dest;
		    }
	    })(),

	    /**
		 * 如果目标成员不存在就复制对象的所有属性到其它对象。
		 * @param {Object} dest 复制目标。
		 * @param {Object} obj 要复制的内容。
		 * @return {Object} 复制后的对象 (dest)。
		 * @see Object.extend <code>
	     * var a = {v: 3, g: 5}, b = {g: 2};
	     * Object.extendIf(a, b);
	     * trace(a); // {v: 3, g: 5}  b 未覆盖 a 任何成员。
	     * </code>
		 */
	    extendIf: applyIf,

	    /**
		 * 在一个可迭代对象上遍历。
		 * @param {Array/ Base} iterable 对象，不支持函数。
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值}
		 *            {@param {Number} key 当前变量的索引} {@param {Number} index
		 *            当前变量的索引} {@param {Array} array 数组本身} {@return {Boolean}
		 *            如果中止循环， 返回 false。}
		 * @param {Object} bind 函数执行时的作用域。
		 * @return {Boolean} 如果已经遍历完所传的所有值， 返回 true， 如果遍历被中断过，返回 false。
		 * @example <code> 
	     * Object.each({a: '1', c: '3'}, function (value, key) {
	     * 		trace(key + ' : ' + value);
	     * });
	     * // 输出 'a : 1' 'c : 3'
	     * </code>
		 */
	    each: function(iterable, fn, bind) {

		    assert(!Function.isFunction(iterable), "Object.each(iterable, fn, bind): {iterable} 不能是函数。 ", iterable);
		    assert(Function.isFunction(fn), "Object.each(iterable, fn, bind): {fn} 必须是函数。 ", fn);

		    // 如果 iterable 是 null， 无需遍历 。
		    if (iterable != null) {

			    // 普通对象使用 for( in ) , 数组用 0 -> length 。
			    if (iterable.length === undefined) {

				    // Object 遍历。
				    for ( var t in iterable)
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
		 * @param {Array/ Base} iterable 对象，不支持函数。
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值}
		 *            {@param {Number} key 当前变量的索引} {@param {Array} array 数组本身}
		 *            {@return {Boolean} 如果中止循环， 返回 false。}
		 * @param {Object} bind=iterable 函数执行时的作用域。
		 * @param { Base/Boolean} [args] 参数/是否间接传递。
		 * @return {Object} 返回的对象。
		 * @example 该函数支持多个功能。主要功能是将一个对象根据一个关系变成新的对象。 <code>
	     * Object.update(["aa","aa23"], "length", []); // => [2, 4];
	     * Object.update([{a: 1},{a: 4}], "a", [{},{}], true); // => [{a: 1},{a: 4}];
	     * </code>
		 */
	    update: function(iterable, fn, dest, args) {

		    // 如果没有目标，源和目标一致。
		    dest = dest || iterable;

		    // 遍历源。
		    Object.each(iterable, Function.isFunction(fn) ? function(value, key) {

			    // 执行函数获得返回。
			    value = fn.call(args, value, key);

			    // 只有不是 undefined 更新。
			    if (value !== undefined)
				    dest[key] = value;
		    } : function(value, key) {

			    // 如果存在这个值。即源有 fn 内容。
			    if (value != undefined) {

				    value = value[fn];

				    assert(!args || dest[key], "Object.update(iterable, fn, dest, args): 试图把iterable[{key}][{fn}] 放到 dest[key][fn], 但  dest[key] 是一个空的成员。",
				            key, fn);

				    // 如果属性是非函数，则说明更新。 a.value
				    // -> b.value
				    if (args)
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
		 * @example <code>
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
		 * @param {Object} obj 类实例。
		 * @param {Object} options 参数。 这个函数会分析对象，并试图找到一个 属性设置函数。 当设置对象 obj 的 属性
		 *            key 为 value: 发生了这些事: 检查，如果存在就调用: obj.setKey(value) 否则，
		 *            检查，如果存在就调用: obj.key(value) 否则， 检查，如果存在就调用:
		 *            obj.key.set(value) 否则，检查，如果存在就调用: obj.set(value) 否则，执行
		 *            obj.key = value;
		 * @example <code>
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
	    set: function(obj, options) {
		
			assert.notNull(obj, "Object.set(obj, options): {obj}~");

		    for ( var key in options) {

			    // 检查 setValue 。
			    var setter = 'set' + key.capitalize(), val = options[key];

			    if (Function.isFunction(obj[setter])) {
				    obj[setter](val);
					
				} else if(key in obj) {
				
					setter = obj[key];
					
					// 是否存在函数。
					if (Function.isFunction(setter))
						obj[key](val);

					// 检查 value.set 。
					else if (setter && setter.set)
						setter.set(val);
					
					// 最后，就直接赋予。
					else
						obj[key] = val;
				}

			    // 检查 set 。
			    else if (obj.set)
				    obj.set(key, val);

			    // 最后，就直接赋予。
			    else
				    obj[key] = val;

		    }

	    },

	    /**
		 * 返回一个变量的类型的字符串形式。
		 * @param {Object} obj 变量。
		 * @return {String} 所有可以返回的字符串： string number boolean undefined null
		 *         array function element class date regexp object。
		 * @example <code> 
	     * Object.type(null); // "null"
	     * Object.type(); // "undefined"
	     * Object.type(new Function); // "function"
	     * Object.type(+'a'); // "number"
	     * Object.type(/a/); // "regexp"
	     * Object.type([]); // "array"
	     * </code>
		 */
	    type: function(obj) {

		    // 获得类型 。
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
		 * @param {Object} obj 要判断的变量。
		 * @return {Boolean} 如果是数组，返回 true， 否则返回 false。
		 * @example <code> 
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
		 * @param {Object} iterable 可迭代的实例。
		 * @param {Number} startIndex=0 开始的位置。
		 * @return {Array} 复制得到的数组。
		 * @example <code>
	     * Array.create([4,6], 1); // [6]
	     * </code>
		 */
	    create: function(iterable, startIndex) {
		    // if(!iterable)
		    // return [];

		    // [DOM Object] 。
		    // if(iterable.item) {
		    // var r = [], len = iterable.length;
		    // for(startIndex = startIndex || 0; startIndex < len;
		    // startIndex++)
		    // r[startIndex] = iterable[startIndex];
		    // return r;
		    // }

		    assert(!iterable || toString.call(iterable) !== '[object HTMLCollection]' || typeof iterable.length !== 'number',
		            'Array.create(iterable, startIndex): {iterable} 不支持 DomCollection 。', iterable);

		    // 调用 slice 实现。
		    return iterable ? ap.slice.call(iterable, startIndex) : [];
	    }

	});

	/**
	 * 函数。
	 * @namespace Function
	 */
	apply(Function, {

	    /**
		 * 绑定函数作用域。返回一个函数，这个函数内的 this 为指定的 bind 。
		 * @param {Function} fn 函数。
		 * @param {Object} bind 位置。 注意，未来 Function.prototype.bind 是系统函数，
		 *            因此这个函数将在那个时候被 替换掉。
		 * @example <code>
	     * Function.bind(function () {trace( this );}, 0)()    ; // 0
	     * </code>
		 */
	    bind: function(fn, bind) {

		    assert.isFunction(fn, 'Function.bind(fn): {fn} ~');

		    // 返回对 bind 绑定。
		    return function() {
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
		 * @param {Object} obj 要判断的变量。
		 * @return {Boolean} 如果是函数，返回 true， 否则返回 false。
		 * @example <code>
	     * Function.isFunction(function () {}); // true
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
		 * @param {Object} v 需要返回的参数。
		 * @return {Function} 执行得到参数的一个函数。
		 * @hide
		 * @example <code>
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
		 * @example <code>
	     *  String.format("{0}转换", 1); //  "1转换"
	     *  String.format("{1}翻译",0,1); // "1翻译"
	     *  String.format("{a}翻译",{a:"也可以"}); // 也可以翻译
	     *  String.format("{{0}}不转换, {0}转换", 1); //  "{0}不转换1转换"
	     *  格式化的字符串{}不允许包含空格。
	     *  不要出现{{{ 和  }}} 这样将获得不可预知的结果。
	     * </code>
		 */
	    format: function(format, args) {

		    assert(!format || format.replace, 'String.format(format, args): {format} 必须是字符串。', format);

		    // 支持参数2为数组或对象的直接格式化。
		    var toString = this;

		    args = arguments.length === 2 && Object.isObject(args) ? args : ap.slice.call(arguments, 1);

		    // 通过格式化返回
		    return (format || "").replace(/\{+?(\S*?)\}+/g, function(match, name) {
			    var start = match.charAt(1) == '{', end = match.charAt(match.length - 2) == '}';
			    if (start || end)
				    return match.slice(start, match.length - end);
			    // LOG : {0, 2;yyyy} 为了支持这个格式, 必须在这里处理
			    // match , 同时为了代码简短, 故去该功能。
			    return name in args ? toString(args[name]) : "";
		    });
	    },

	    /**
		 * 将一个数组源形式的字符串内容拷贝。
		 * @param {Object} str 字符串。用空格隔开。
		 * @param { Base/Function} source 更新的函数或源。
		 * @param {Object} [dest] 如果指明了， 则拷贝结果到这个目标。
		 * @example <code>
	     * String.map("aaa bbb ccc", trace); //  aaa bbb ccc
	     * String.map("aaa bbb ccc", function (v) { return v; }, {});    //    {aaa:aaa, bbb:bbb, ccc:ccc};
	     * </code>
		 */
	    map: function(str, src, dest) {

		    assert(typeof str == 'string', 'String.map(str, src, dest, copyIf): {str} 必须是字符串。', str);

		    var isFn = Function.isFunction(src);
		    // 使用 ' '、分隔, 这是约定的。
		    str.split(' ').forEach(function(value, index, array) {

			    // 如果是函数，调用函数， 否则是属性。
			    var val = isFn ? src(value, index, array) : src[value];

			    // 如果有 dest ，则复制。
			    if (dest)
				    dest[value] = val;
		    });
		    return dest;
	    },

	    /**
		 * 把字符串转为指定长度。
		 * @param {String} value 字符串。
		 * @param {Number} len 需要的最大长度。
		 * @example <code>
	     * String.ellipsis("123", 2); //   '1...'
	     * </code>
		 */
	    ellipsis: function(value, len) {
		    assert.isString(value, "String.ellipsis(value, len): 参数  {value} ~");
		    assert.isNumber(len, "String.ellipsis(value, len): 参数  {len} ~");
		    return value.length > len ? value.substr(0, len - 3) + "..." : value;
	    }

	});

	/// #if CompactMode

	/**
	 * 日期。
	 * @namespace Date
	 */
	applyIf(Date, {

		/**
		 * 获取当前时间。
		 * @return {Number} 当前的时间点。
		 * @example <code>
		 * Date.now(); //   相当于 new Date().getTime()
		 * </code>
		 */
		now: function() {
			return +new Date;
		}

	});

	/// #endif

	/// #endregion

	/// #region Navigator

	/**
	 * 浏览器。
	 * @namespace navigator
	 */
	apply(navigator, (function(ua) {

		// 检查信息
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

		// 结果
		return {

		    /// #if CompactMode

		    /**
			 * 获取一个值，该值指示当前浏览器是否支持标准事件。就目前浏览器状况， IE6，7 中 isQuirks = true 其它浏览器都为 false 。
			 * @type Boolean 此处认为 IE6,7 是怪癖的。
			 */
		    isQuirks: eval("!-[1,]") && !Object.isObject(document.constructor),

		    /// #endif

		    /**
			 * 获取当前浏览器的简写。
			 * @type String
			 */
		    name: browser,

		    /**
			 * 获取当前浏览器版本。
			 * @type String 输出的格式比如 6.0.0 。 这是一个字符串，如果需要比较版本，应该使用
			 *       parseFloat(navigator.version) < 4 。
			 */
		    version: version[2]

		};

	})(navigator.userAgent));

	applyIf(window, {

		/// #if CompactMode
		
		/**
		 * 初始化一个 XMLHttpRequest 对象。
		 * @constructor
		 * @class XMLHttpRequest
		 * @return {XMLHttpRequest} 请求的对象。
		 */
		XMLHttpRequest: function() {
			return new ActiveXObject("Microsoft.XMLHTTP");
		},

		/// #endif
		
		/**
		 * 在全局作用域运行一个字符串内的代码。
		 * @param {String} statement Javascript 语句。
		 * @example <code>
		 * execScript('alert("hello")');
		 * </code>
		 */
		execScript: function(statements) {

			// 如果正常浏览器，使用 window.eval 。
			window["eval"].call( window, statements );

        }
		
	});
	
	/// #endregion

	/// #region Methods
	
	// 把所有内建对象本地化 。
	each.call([String, Array, Function, Date], p.Native);

	/**
	 * xType。
	 */
	Date.prototype.xType = "date";

	/**
	 * xType。
	 */
	RegExp.prototype.xType = "regexp";
	
	/**
	 * @class JPlus.Object
	 */
    Base.implement({
    	
	    /**
	     * 调用父类的成员变量。
	     * @param {String} methodName 属性名。
	     * @param {Object} [...] 调用的参数数组。
	     * @return {Object} 父类返回。 注意只能从子类中调用父类的同名成员。
	     * @protected
	     * @example <code>
	     *
	     * var MyBa = new Class({
	     *    a: function (g, b) {
	     * 	    alert(g + b);
	     *    }
	     * });
	     *
	     * var MyCls = MyBa.extend({
	     * 	  a: function (g, b) {
	     * 	    this.base('a'); // 调用 MyBa#a 成员。
	     *    }
	     * });
	     *
	     * new MyCls().a();
	     * </code>
	     */
    	base: function(methodName) {
	
	        var me = this.constructor,
	
	            fn = this[methodName],
	            
	            oldFn = fn,
	            
	            args = arguments;
	
	        assert(fn, "Base.prototype.base(methodName, args): 子类不存在 {methodName} 的属性或方法。", name);
	
	        // 标记当前类的 fn 已执行。
	        fn.$bubble = true;
	
	        assert(!me || me.prototype[methodName], "Base.prototype.base(methodName, args): 父类不存在 {methodName} 的属性或方法。", name);
	
	        // 保证得到的是父类的成员。
	
	        do {
	            me = me.base;
	            assert(me && me.prototype[methodName], "Base.prototype.base(methodName, args): 父类不存在 {methodName} 的属性或方法。", name);
	        } while ('$bubble' in (fn = me.prototype[methodName]));
	
	        assert.isFunction(fn, "Base.prototype.base(methodName, args): 父类的成员 {fn}不是一个函数。  ");
	
	        fn.$bubble = true;
	
	        // 确保 bubble 记号被移除。
	        try {
	            if (args.length <= 1)
	                return fn.apply(this, args.callee.caller.arguments);
	            args[0] = this;
	            return fn.call.apply(fn, args);
	        } finally {
	            delete fn.$bubble;
	            delete oldFn.$bubble;
	        }
	    },
	
        /**
		 * 增加一个监听者。
		 * @param {String} type 监听名字。
		 * @param {Function} listener 调用函数。
		 * @param {Object} bind=this listener 执行时的作用域。
		 * @return  Base this
		 * @example <code>
         * elem.on('click', function (e) {
         * 		return true;
         * });
         * </code>
		 */
        on: function(type, listener, bind) {

	        assert.isFunction(listener, 'JPlus.Object.prototype.on(type, listener, bind): {listener} ~');

	        // 获取本对象 本对象的数据内容 本事件值
	        var me = this, d = p.data(me, 'event'), evt = d[type];

	        // 如果未绑定过这个事件。
	        if (!evt) {

		        // 支持自定义安装。
		        d[type] = evt = function(e) {
			        var listener = arguments.callee, handlers = listener.handlers.slice(0), i = -1, len = handlers.length;

			        // 循环直到 return false。
			        while (++i < len)
				        if (handlers[i][0].call(handlers[i][1], e) === false)
					        return false;

			        return true;
		        };

		        // 获取事件管理对象。
		        d = getMgr(me, type);

		        // 当前事件的全部函数。
		        evt.handlers =d.initEvent ? [[d.initEvent, me]] : [];

                // 添加事件。
                if(d.add)
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
		 * @return  Base this 注意: function () {} !== function () {},
		 *         这意味着这个代码有问题: <code>
         * elem.on('click', function () {});
         * elem.un('click', function () {});
         * </code>
		 *         你应该把函数保存起来。 <code>
         * var c =  function () {};
         * elem.on('click', c);
         * elem.un('click', c);
         * </code>
		 * @example <code>
         * elem.un('click', function (e) {
         * 		return true;
         * });
         * </code>
		 */
        un: function(type, listener) {

	        assert(!listener || Function.isFunction(listener), 'JPlus.Object.prototype.un(type, listener): {listener} 必须是函数或空参数。', listener);

	        // 获取本对象 本对象的数据内容 本事件值
	        var me = this, d = p.getData(me, 'event'), evt, handlers, i;
	        if (d) {
		        if (evt = d[type]) {

			        handlers = evt.handlers;

			        if (listener) {

				        // 搜索符合的句柄。
				        for (i = handlers.length - 1; i; i--) {
					        if (handlers[i][0] === listener) {
						        handlers.splice(i, 1);
						        break;
					        }
				        }

			        }

			        // 检查是否存在其它函数或没设置删除的函数。
			        if (!listener || handlers.length < 2) {

				        // 删除对事件处理句柄的全部引用，以允许内容回收。
				        delete d[type];

                        d = getMgr(me, type);

				        // 内部事件管理的删除。
                        if(d.remove)
				            d.remove(me, type, evt);
			        }
		        } else if (!type) {
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
		 * @return  Base this trigger 只是手动触发绑定的事件。
		 * @example <code>
         * elem.trigger('click');
         * </code>
		 */
        trigger: function(type, e) {

	        // 获取本对象 本对象的数据内容 本事件值 。
	        var me = this, evt = p.getData(me, 'event'), eMgr;

	        // 执行事件。
	        return !evt || !(evt = evt[type]) || ((eMgr = getMgr(me, type)).trigger ? eMgr.trigger(me, type, evt, e) : evt(e));

        },

        /**
		 * 增加一个只执行一次的监听者。
		 * @param {String} type 监听名字。
		 * @param {Function} listener 调用函数。
		 * @param {Object} bind=this listener 执行时的作用域。
		 * @return  Base this
		 * @example <code>
         * elem.one('click', function (e) {
         * 		trace('a');  
         * });
         * 
         * elem.trigger('click');   //  输出  a
         * elem.trigger('click');   //  没有输出 
         * </code>
		 */
        one: function(type, listener, bind) {

	        assert.isFunction(listener, 'JPlus.Object.prototype.one(type, listener): {listener} ~');
			
			var me = this;

	        // one 本质上是 on , 只是自动为 listener 执行 un 。
	        return this.on(type, function() {

		        // 删除，避免闭包。
		        me.un(type, arguments.callee);

		        // 然后调用。
		        return listener.apply(this, arguments);
	        }, bind);
        },
		        
		/**
		 * 将制定对象转换为字符串。
		 * @return {String} 对应的字符串。
		 */
		toString: function(){
			return this.xType || toString.call(this);
		}
		
	});

	/**
	 * @class String
	 */
	String.implementIf({

	    /// #if CompactMode

	    /**
		 * 去除字符串的首尾空格。
		 * @return {String} 处理后的字符串。
		 * @example <code>
	     * "   g h   ".trim(); //  返回     "g h"
	     * </code>
		 */
	    trim: function() {

		    // 使用正则实现。
		    return this.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "");
	    },

	    /// #endif

	    /**
		 * 转为骆驼格式。
		 * @param {String} value 内容。
		 * @return {String} 返回的内容。
		 * @example <code>
	     * "font-size".toCamelCase(); //     "fontSize"
	     * </code>
		 */
	    toCamelCase: function() {
		    return this.replace(/-(\w)/g, toUpperCase);
	    },

	    /**
		 * 将字符首字母大写。
		 * @return {String} 大写的字符串。
		 * @example <code>
	     * "bb".capitalize(); //     "Bb"
	     * </code>
		 */
	    capitalize: function() {

		    // 使用正则实现。
		    return this.replace(/(\b[a-z])/g, toUpperCase);
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
		 * @see #forEach
		 * @example <code> 
	     * [2, 5].each(function (value, key) {
	     * 		trace(value);
	     * 		return false
	     * });
	     * // 输出 '2'
	     * </code>
		 */
	    each: each,

	    /**
		 * 包含一个元素。元素存在直接返回。
		 * @param {Object} value 值。
		 * @return {Boolean} 是否包含元素。
		 * @example <code>
	     * ["", "aaa", "zzz", "qqq"].include(""); //   true
	     * [false].include(0);	//   false
	     * </code>
		 */
	    include: function(value) {

		    // 未包含，则加入。
		    var b = this.indexOf(value) !== -1;
		    if (!b)
			    this.push(value);
		    return b;
	    },

	    /**
		 * 在指定位置插入项。
		 * @param {Number} index 插入的位置。
		 * @param {Object} value 插入的内容。
		 * @example <code>
	     * ["", "aaa", "zzz", "qqq"].insert(3, 4); //   ["", "aaa", "zzz", 4, "qqq"]
	     * </code>
		 */
	    insert: function(index, value) {
		    assert.isNumber(index, "Array.prototype.insert(index, value): 参数 index ~");
		    var me = this, tmp;
		    if(index < 0 || index >= me.length){
		    	me[index = me.length++] = value;
		    } else {
			    tmp = ap.slice.call(me, index);
			    me.length = index + 1;
			    this[index] = value;
			    ap.push.apply(me, tmp);
			}
		    return index;

	    },

	    /**
		 * 对数组成员调用指定的成员，返回结果数组。
		 * @param {String} func 调用的成员名。
		 * @param {Array} args 调用的参数数组。
		 * @return {Array} 结果。
		 * @example <code>
	     * ["vhd"].invoke('charAt', [0]); //    ['v']
	     * </code>
		 */
	    invoke: function(func, args) {
		    assert(args && typeof args.length === 'number', "Array.prototype.invoke(func, args): {args} 必须是数组, 无法省略。", args);
		    var r = [];
		    ap.forEach.call(this, function(value) {
			    assert(value != null && value[func] && value[func].apply, "Array.prototype.invoke(func, args): {value} 不包含函数 {func}。", value, func);
			    r.push(value[func].apply(value, args));
		    });

		    return r;
	    },

	    /**
		 * 删除数组中重复元素。
		 * @return {Array} 结果。
		 * @example <code>
	     * [1,7,8,8].unique(); //    [1, 7, 8]
	     * </code>
		 */
	    unique: function() {

		    // 删除从 i + 1 之后的当前元素。
		    for ( var i = 0, t, v; i < this.length;) {
			    v = this[i];
			    t = ++i;
			    do {
				    t = ap.remove.call(this, v, t);
			    } while (t >= 0);
		    }

		    return this;
	    },

	    /**
		 * 删除元素, 参数为元素的内容。
		 * @param {Object} value 值。
		 * @return {Number} 删除的值的位置。
		 * @example <code>
	     * [1,7,8,8].remove(7); //   1
	     * </code>
		 */
	    remove: function(value, startIndex) {

		    // 找到位置， 然后删。
		    var i = ap.indexOf.call(this, value, startIndex);
		    if (i !== -1)
			    ap.splice.call(this, i, 1);
		    return i;
	    },

	    /**
		 * 获取指定索引的元素。如果 index < 0， 则获取倒数 index 元素。
		 * @param {Number} index 元素。
		 * @return {Object} 指定位置所在的元素。
		 * @example <code>
	     * [1,7,8,8].item(0); //   1
	     * [1,7,8,8].item(-1); //   8
	     * [1,7,8,8].item(5); //   undefined
	     * </code>
		 */
	    item: function(index) {
		    return this[index < 0 ? this.length + index : index];
	    },

	    /// #if CompactMode

	    /**
		 * 返回数组某个值的第一个位置。值没有,则为-1 。
		 * @param {Object} item 成员。
		 * @param {Number} start=0 开始查找的位置。
		 * @return Number 位置，找不到返回 -1 。 现在大多数浏览器已含此函数.除了 IE8- 。
		 */
	    indexOf: function(item, startIndex) {
		    startIndex = startIndex || 0;
		    for ( var len = this.length; startIndex < len; startIndex++)
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
		 * @example <code> 
	     * [1, 7, 2].filter(function (key) {return key &lt; 5 })   [1, 2]
	     * </code>
		 */
	    filter: function(fn, bind) {
		    var r = [];
		    ap.forEach.call(this, function(value, i, array) {

			    // 过滤布存在的成员。
			    if (fn.call(this, value, i, array))
				    r.push(value);
		    }, bind);

		    return r;

	    },

	    /**
		 * 对数组内的所有变量执行函数，并可选设置作用域。
		 * @method
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值}
		 *            {@param {Number} key 当前变量的索引} {@param {Number} index
		 *            当前变量的索引} {@param {Array} array 数组本身}
		 * @param {Object} bind 函数执行时的作用域。
		 * @seeAlso Array.prototype.each
		 * @example <code> 
	     * [2, 5].forEach(function (value, key) {
	     * 		trace(value);
	     * });
	     * // 输出 '2' '5'
	     * </code>
		 */
	    forEach: each,

	    /// #endif

	    /**
		 * xType。
		 */
	    xType: "array"

	});

	/// #endregion
	
    // 将以下成员赋予 window ，这些成员是全局成员。
    String.map('undefined Class', p, window);

	/// #region Private Functions

	/**
	 * 复制所有属性到任何对象。
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function apply(dest, src) {

		assert(dest != null, "Object.extend(dest, src): {dest} 不可为空。", dest);

		// 直接遍历，不判断是否为真实成员还是原型的成员。
		for ( var b in src)
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

		assert(dest != null, "Object.extendIf(dest, src): {dest} 不可为空。", dest);

		// 和 apply 类似，只是判断目标的值是否为 undefiend 。
		for ( var b in src)
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

		assert(Function.isFunction(fn), "Array.prototype.each(fn, bind): {fn} 必须是一个函数。", fn);

		var i = -1, me = this;

		while (++i < me.length)
			if (fn.call(bind, me[i], i, me) === false)
				return false;
		return true;
	}

	/**
	 * 所有自定义类的基类。
	 */
	function Base() {

	}
	
	/**
	 * 空函数。
	 */
	function emptyFn(){
		
	}

	/**
	 * 返回返回指定结果的函数。
	 * @param {Object} ret 结果。
	 * @return {Function} 函数。
	 */
	function from(ret) {

		// 返回一个值，这个值是当前的参数。
		return function() {
			return ret;
		}
	}

	/**
	 * 将一个字符转为大写。
	 * @param {String} ch 参数。
	 * @param {String} match 字符。
	 * @return {String} 转为大写之后的字符串。
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
		while (!(eMgr = eventMgr[eMgr.xType]) || !(eMgr = eMgr[type])) {

			if (evt && (evt = evt.base)) {
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

		assert(ns && ns.split, "JPlus.namespace(namespace, obj, value): {namespace} 不是合法的名字空间。", ns);

		// 取值，创建。
		ns = ns.split('.');

		// 如果第1个字符是 ., 则表示内置使用的名字空间。
		var current = window, i = -1;

		// 依次创建对象。
		while (++i < ns.length)
			current = current[ns[i]] || (current[ns[i]] = {});

		// 如果对象已存在，则拷贝成员到最后一个对象。
        return apply(current, obj);

	}

	/// #endregion

})(this);

/// #if !Release

/// #region Using

/**
 * 使用一个名空间。
 * @param {String} ns 名字空间。
 * @example <code>
 * using("System.Dom.Keys");
 * </code>
 */
function using(ns, isStyle) {

    assert.isString(ns, "using(ns): {ns} 不是合法的名字空间。");
    
    var p = JPlus;

    // 已经载入。
    if (p[isStyle ? 'styles' : 'scripts'].include(ns))
        return;

    if (ns.indexOf('/') === -1)
        ns = p.resolveNamespace(ns.toLowerCase(), isStyle);

    var doms, callback, path = ns.replace(/^[\.\/\\]+/, "");
    if (isStyle) {
        callback = p.loadStyle;
        doms = document.styleSheets;
        src = 'href';
    } else {
        callback = p.loadScript;
        doms = document.getElementsByTagName("SCRIPT");
        src = 'src';
    }

    // 如果在节点找到符合的就返回，找不到，调用 callback 进行真正的 加载处理。
    Object.each(doms, function(dom) {
    	var url = navigator.isQuirks ? (
    		isStyle ? 
    			dom.owningElement ? dom.owningElement.getAttribute(src, 4) : dom.href :
    			dom.getAttribute(src, 4)
    	) :  dom[src];
        return !url || url.toLowerCase().indexOf(path) === -1;
    }) && callback(p.rootPath + ns);
};

/**
 * 导入指定名字空间表示的样式文件。
 * @param {String} ns 名字空间。
 */
function imports(ns){
    return using(ns, true);
};

/// #endregion

/// #region Trace

/**
 * 调试输出指定的信息。
 * @param {Object} ... 要输出的变量。
 */
function trace() {
    if (JPlus.debug) {
    	
    	var hasLog = window.console && console.log;

        // 如果存在控制台，则优先使用控制台。
        if(hasLog && console.log.apply){
            console.log.apply(console, arguments);
        } else if(hasLog && arguments.length === 1){
        	console.log(arguments[0]);
        } else {
			(hasLog ? console : trace).log(Object.update(arguments, trace.inspect, []).join(" "));
        }
    }
}

/// #region Assert

/**
 * 确认一个值正确。
 * @param {Object} bValue 值。
 * @param {String} msg="断言失败" 错误后的提示。
 * @return {Boolean} 返回 bValue 。
 * @example <code>
 * assert(true, "{value} 错误。", value);
 * </code>
 */
function assert(bValue, msg) {
    if (!bValue) {

        var val = arguments;

        // 如果启用 [参数] 功能
        if (val.length > 2) {
            var i = 2;
            msg = msg.replace(/\{([\w\.\(\)]*?)\}/g, function(s, x) {
                return "参数 " + (val.length <= i ? s :  x + " = " + String.ellipsis(trace.inspect(val[i++]), 200));
            });
        } else {
            msg = msg || "断言失败";
        }

        // 错误源
        val = arguments.callee.caller;

        if (JPlus.stackTrace) {

            while (val.debugStepThrough)
                val = val.caller;

            if(val && val.caller){
                val = val.caller;
            }

            if (val)
                msg += "\r\n--------------------------------------------------------------------\r\n" + String.ellipsis(String.decodeUTF8(val.toString()), 600);

        }

        trace.error(msg);

    }

    return !!bValue;
}

/// #endregion

/// #endregion

(function(p, apply){

    /// #region Using

    apply(p, {

        /**
         * 同步载入代码。
         * @param {String} uri 地址。
         * @example <code>
         * JPlus.loadScript('./v.js');
         * </code>
         */
        loadScript: function(url) {
            return p.loadText(url, execScript);
        },

        /**
         * 异步载入样式。
         * @param {String} uri 地址。
         * @example <code>
         * JPlus.loadStyle('./v.css');
         * </code>
         */
        loadStyle: function(url) {

            // 在顶部插入一个css，但这样肯能导致css没加载就执行 js 。所以，要保证样式加载后才能继续执行计算。
            return document.getElementsByTagName("HEAD")[0].appendChild(apply(document.createElement('link'), {
                href: url,
                rel: 'stylesheet',
                type: 'text/css'
            }));
        },

        /**
         * 同步载入文本。
         * @param {String} uri 地址。
         * @param {Function} [callback] 对返回值的处理函数。
         * @return {String} 载入的值。 因为同步，所以无法跨站。
         * @example <code>
         * trace(  JPlus.loadText('./v.html')  );
         * </code>
         */
        loadText: function(url, callback) {

            assert.notNull(url, "JPlus.loadText(url, callback): {url} ~");

            // assert(window.location.protocol != "file:",
            // "JPlus.loadText(uri, callback): 当前正使用 file 协议，请使用 http
            // 协议。 \r\n请求地址: {0}", uri);

            // 新建请求。
            // 下文对 XMLHttpRequest 对象进行兼容处理。
            var xmlHttp = new XMLHttpRequest();

            try {

                // 打开请求。
                xmlHttp.open("GET", url, false);

                // 发送请求。
                xmlHttp.send(null);

                // 检查当前的 XMLHttp 是否正常回复。
                if (!p.checkStatusCode(xmlHttp.status)) {
                    // 载入失败的处理。
                    throw String.format("请求失败:  \r\n   地址: {0} \r\n   状态: {1}   {2}  {3}", url, xmlHttp.status, xmlHttp.statusText,
                        window.location.protocol == "file:" ? '\r\n原因: 当前正使用 file 协议打开文件，请使用 http 协议。' : '');
                }

                url = xmlHttp.responseText;

                // 运行处理函数。
                return callback ? callback(url) : url;

            } catch (e) {

                // 调试输出。
                trace.error(e);
            } finally {

                // 释放资源。
                xmlHttp = null;
            }

        },

        /**
         * JPlus 安装的根目录, 可以为相对目录。
         * @config {String}
         */
        rootPath: (function(){
            try {
                var scripts = document.getElementsByTagName("script");

                // 当前脚本在 <script> 引用。最后一个脚本即当前执行的文件。
                scripts = scripts[scripts.length - 1];

                // IE6/7 使用 getAttribute
                scripts = navigator.isQuirks ? scripts.getAttribute('src', 5) : scripts.src;

                // 设置路径。
                return (scripts.match(/[\S\s]*\//) || [""])[0];

            } catch (e) {

                // 出错后，设置当前位置.
                return "";
            }

        })(),

        /**
         * 全部已载入的样式。
         * @type Array
         * @private
         */
        styles: [],

        /**
         * 全部已载入的名字空间。
         * @type Array
         * @private
         */
        scripts: [],

        /**
         * 将指定的名字空间转为路径。
         * @param {String} ns 名字空间。
         * @param {Boolean} isStyle=false 是否为样式表。
         */
        resolveNamespace: function(ns, isStyle) {
            // 如果名字空间本来就是一个地址，则不需要转换，否则，将 . 替换为 / ,并在末尾加上 文件后缀。
            return ns.replace(/\./g, '/') + (isStyle ? '.css' : '.js');
        }

    });

    /// #endregion

    /// #region Trace

    /**
     * @namespace String
     */
    apply(String, {

        /**
         * 将字符串转为 utf-8 字符串。
         * @param {String} s 字符串。
         * @return {String} 返回的字符串。
         */
        encodeUTF8: function(s) {
            return s.replace(/[^\x00-\xff]/g, function(a, b) {
                return '\\u' + ((b = a.charCodeAt()) < 16 ? '000' : b < 256 ? '00' : b < 4096 ? '0' : '') + b.toString(16);
            });
        },

        /**
         * 将字符串从 utf-8 字符串转义。
         * @param {String} s 字符串。
         * @return {String} 返回的字符串。
         */
        decodeUTF8: function(s) {
            return s.replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function(a, b, c) {
                return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
            })
        }

    });

    /**
     * @namespace trace
     */
    apply(trace, {

        /**
         * 输出方式。 {@param {String} message 信息。}
         * @type Function
         */
        log: function(message) {
            alert(message);
        },

        /**
         * 输出类的信息。
         * @param {Object} [obj] 要查看成员的对象。如果未提供这个对象，则显示全局的成员。
         * @param {Boolean} showPredefinedMembers=true 是否显示内置的成员。
         */
        api: (function() {

            var nodeTypes = 'Window Element Attr Text CDATASection Entity EntityReference ProcessingInstruction Comment HTMLDocument DocumentType DocumentFragment Document Node'.split(' '),

                definedClazz = 'String Date Array Number RegExp Function XMLHttpRequest Object'.split(' ').concat(nodeTypes),

                predefinedNonStatic = {
                    'Object': 'valueOf hasOwnProperty toString',
                    'String': 'length charAt charCodeAt concat indexOf lastIndexOf match quote slice split substr substring toLowerCase toUpperCase trim sub sup anchor big blink bold small fixed fontcolor italics link',
                    'Array': 'length pop push reverse shift sort splice unshift concat join slice indexOf lastIndexOf filter forEach',
                    /*
                     * every
                     * map
                     * some
                     * reduce
                     * reduceRight'
                     */
                    'Number': 'toExponential toFixed toLocaleString toPrecision',
                    'Function': 'length apply call',
                    'Date': 'getDate getDay getFullYear getHours getMilliseconds getMinutes getMonth getSeconds getTime getTimezoneOffset getUTCDate getUTCDay getUTCFullYear getUTCHours getUTCMinutes getUTCMonth getUTCSeconds getYear setDate setFullYear setHours setMinutes setMonth setSeconds setTime setUTCDate setUTCFullYear setUTCHours setUTCMilliseconds setUTCMinutes setUTCMonth setUTCSeconds setYear toGMTString toLocaleString toUTCString',
                    'RegExp': 'exec test'
                },

                predefinedStatic = {
                    'Array': 'isArray',
                    'Number': 'MAX_VALUE MIN_VALUE NaN NEGATIVE_INFINITY POSITIVE_INFINITY',
                    'Date': 'now parse UTC'
                },

                APIInfo = Class({

                    memberName: '',

                    title: 'API 信息:',

                    prefix: '',

                    getPrefix: function(obj) {
                        if (!obj)
                            return "";
                        for ( var i = 0; i < definedClazz.length; i++) {
                            if (window[definedClazz[i]] === obj) {
                                return this.memberName = definedClazz[i];
                            }
                        }

                        return this.getTypeName(obj, window, "", 3);
                    },

                    getTypeName: function(obj, base, baseName, deep) {

                        for ( var memberName in base) {
                            if (base[memberName] === obj) {
                                this.memberName = memberName;
                                return baseName + memberName;
                            }
                        }

                        if (deep-- > 0) {
                            for ( var memberName in base) {
                                try {
                                    if (base[memberName] && isUpper(memberName, 0)) {
                                        memberName = this.getTypeName(obj, base[memberName], baseName + memberName + ".", deep);
                                        if (memberName)
                                            return memberName;
                                    }
                                } catch (e) {
                                }
                            }
                        }

                        return '';
                    },

                    getBaseClassDescription: function(obj) {
                        if (obj && obj.base && obj.base !== p.Object) {
                            var extObj = this.getTypeName(obj.base, window, "", 3);
                            return " 类" + (extObj && extObj != "JPlus.Object" ? "(继承于 " + extObj + " 类)" : "");
                        }

                        return " 类";
                    },

                    /**
                     * 获取类的继承关系。
                     */
                    getExtInfo: function(clazz) {
                        if (!this.baseClasses) {
                            this.baseClassNames = [];
                            this.baseClasses = [];
                            while (clazz && clazz.prototype) {
                                var name = this.getPrefix(clazz);
                                if (name) {
                                    this.baseClasses.push(clazz);
                                    this.baseClassNames.push(name);
                                }

                                clazz = clazz.base;
                            }
                        }

                    },

                    constructor: function(obj, showPredefinedMembers) {
                        this.members = {};
                        this.sortInfo = {};

                        this.showPredefinedMembers = showPredefinedMembers !== false;
                        this.isClass = obj === Function || (obj.prototype && obj.prototype.constructor !== Function);

                        // 如果是普通的变量。获取其所在的原型的成员。
                        if (!this.isClass && obj.constructor !==  Object) {
                            this.prefix = this.getPrefix(obj.constructor);

                            if (!this.prefix) {
                                var nodeType = obj.replaceChild ? obj.nodeType : obj.setInterval && obj.clearTimeout ? 0 : null;
                                if (nodeType) {
                                    this.prefix = this.memberName = nodeTypes[nodeType];
                                    if (this.prefix) {
                                        this.baseClassNames = ['Node', 'Element', 'HTMLElement', 'Document'];
                                        this.baseClasses = [window.Node, window.Element, window.HTMLElement, window.HTMLDocument];
                                    }
                                }
                            }

                            if (this.prefix) {
                                this.title = this.prefix + this.getBaseClassDescription(obj.constructor) + "的实例成员: ";
                                this.prefix += '.prototype.';
                            }

                            if ([Number, String, Boolean].indexOf(obj.constructor) === -1) {
                                var betterPrefix = this.getPrefix(obj);
                                if (betterPrefix) {
                                    this.orignalPrefix = betterPrefix + ".";
                                }
                            }

                        }

                        if (!this.prefix) {

                            this.prefix = this.getPrefix(obj);

                            // 如果是类或对象， 在这里遍历。
                            if (this.prefix) {
                                this.title = this.prefix
                                    + (this.isClass ? this.getBaseClassDescription(obj) : ' ' + getMemberType(obj, this.memberName)) + "的成员: ";
                                this.prefix += '.';
                            }

                        }

                        // 如果是类，获取全部成员。
                        if (this.isClass) {
                            this.getExtInfo(obj);
                            this.addStaticMembers(obj);
                            this.addStaticMembers(obj.prototype, 1, true);
							this.addEvents(obj, '');
                            delete this.members.prototype;
                            if (this.showPredefinedMembers) {
                                this.addPredefinedNonStaticMembers(obj, obj.prototype, true);
                                this.addPredefinedMembers(obj, obj, predefinedStatic);
                            }

                        } else {
                            this.getExtInfo(obj.constructor);
                            // 否则，获取当前实例下的成员。
                            this.addStaticMembers(obj);

                            if (this.showPredefinedMembers && obj.constructor) {
                                this.addPredefinedNonStaticMembers(obj.constructor, obj);
                            }

                        }
                    },

                    addStaticMembers: function(obj, nonStatic) {
                        for ( var memberName in obj) {
							this.addMember(obj, memberName, 1, nonStatic);
                        }

                    },

                    addPredefinedMembers: function(clazz, obj, staticOrNonStatic, nonStatic) {
                        for ( var type in staticOrNonStatic) {
                            if (clazz === window[type]) {
                                staticOrNonStatic[type].forEach(function(memberName) {
                                    this.addMember(obj, memberName, 5, nonStatic);
                                }, this);
                            }
                        }
                    },

                    addPredefinedNonStaticMembers: function(clazz, obj, nonStatic) {

                        if (clazz !==  Object) {

                            predefinedNonStatic.Object.forEach(function(memberName) {
                                if (clazz.prototype[memberName] !==  Object.prototype[memberName]) {
                                    this.addMember(obj, memberName, 5, nonStatic);
                                }
                            }, this);

                        }

                        if (clazz ===  Object && !this.isClass) {
                            return;
                        }

                        this.addPredefinedMembers(clazz, obj, predefinedNonStatic, nonStatic);

                    },

					addEvents: function(obj, extInfo){
						var evtInfo = obj.prototype && p.Events[obj.prototype.xType];
						
						if(evtInfo){
						
							for(var evt in evtInfo){
								this.sortInfo[this.members[evt] = obj.prototype.xType + '.' + evt + ' 事件' + extInfo] = 4 + evt;
							}
							
							if(obj.base){
								this.addEvents(obj.base, '(继承的)');
							}
						}
					},
					
                    addMember: function(base, memberName, type, nonStatic) {
						try {

							var hasOwnProperty =  Object.prototype.hasOwnProperty, owner = hasOwnProperty.call(base, memberName), prefix, extInfo = '';

							nonStatic = nonStatic ? 'prototype.' : '';

							// 如果 base 不存在 memberName 的成员，则尝试在父类查找。
							if (owner) {
								prefix = this.orignalPrefix || (this.prefix + nonStatic);
								type--; // 自己的成员置顶。
							} else {

								// 搜索包含当前成员的父类。
								this.baseClasses.each(function(baseClass, i) {
									if (baseClass.prototype[memberName] === base[memberName] && hasOwnProperty.call(baseClass.prototype, memberName)) {
										prefix = this.baseClassNames[i] + ".prototype.";

										if (nonStatic)
											extInfo = '(继承的)';

										return false;
									}
								}, this);

								// 如果没找到正确的父类，使用当前类替代，并指明它是继承的成员。
								if (!prefix) {
									prefix = this.prefix + nonStatic;
									extInfo = '(继承的)';
								}

							}

							this.sortInfo[this.members[memberName] = (type >= 4 ? '[内置]' : '') + prefix + getDescription(base, memberName) + extInfo] = type
								+ memberName;

						} catch (e) {
						}
                    },

                    copyTo: function(value) {
                        for ( var member in this.members) {
                            value.push(this.members[member]);
                        }

                        if (value.length) {
                            var sortInfo = this.sortInfo;
                            value.sort(function(a, b) {
                                return sortInfo[a] < sortInfo[b] ? -1 : 1;
                            });
                            value.unshift(this.title);
                        } else {
                            value.push(this.title + '没有可用的子成员信息。');
                        }

                    }

                });

            initPredefined(predefinedNonStatic);
            initPredefined(predefinedStatic);

            function initPredefined(predefined) {
                for ( var obj in predefined)
                    predefined[obj] = predefined[obj].split(' ');
            }

            function isEmptyObject(obj) {

                // null 被认为是空对象。
                // 有成员的对象将进入 for(in) 并返回 false 。
                for (obj in (obj || {}))
                    return false;
                return true;
            }

            // 90 是 'Z' 65 是 'A'
            function isUpper(str, index) {
                str = str.charCodeAt(index);
                return str <= 90 && str >= 65;
            }

            function getMemberType(obj, name) {

                // 构造函数最好识别。
                if (typeof obj === 'function' && name === 'constructor')
                    return '构造函数';

                // IE6 的 DOM 成员不被认为是函数，这里忽略这个错误。
                // 有 prototype 的函数一定是类。
                // 没有 prototype 的函数肯能是类。
                // 这里根据命名如果名字首字母大写，则作为空类理解。
                // 这不是一个完全正确的判断方式，但它大部分时候正确。
                // 这个世界不要求很完美，能解决实际问题的就是好方法。
                if (obj.prototype && obj.prototype.constructor)
                    return !isEmptyObject(obj.prototype) || isUpper(name, 0) ? '类' : '函数';

                // 最后判断对象。
                if ( Object.isObject(obj))
                    return name.charAt(0) === 'I' && isUpper(name, 1) ? '接口' : '对象';

                // 空成员、值类型都作为属性。
                return '属性';
            }

            function getDescription(base, name) {
                return name + ' ' + getMemberType(base[name], name);
            }

            return function(obj, showPredefinedMembers) {
                var r = [];

                // 如果没有参数，显示全局对象。
                if (arguments.length === 0) {
                    for ( var i = 0; i < 7; i++) {
                        r.push(getDescription(window, definedClazz[i]));
                    }
					
					if(window.using){
						r.push("using 函数");
					}
					
					if(window.imports){
						r.push("imports 函数");
					}
					
					if(window.trace){
						r.push("trace 函数");
					}
					
					if(window.assert){
						r.push("assert 函数");
					}

                    for ( var name in window) {
					
						try{
							if (isUpper(name, 0) || p[name] === window[name])
								r.push(getDescription(window, name));
						} catch(e){
						
						}
					}

                    r.sort();
                    r.unshift('全局对象: ');

                } else if (obj != null) {
                    new APIInfo(obj, showPredefinedMembers).copyTo(r);
                } else {
                    r.push('无法对 ' + (obj === null ? "null" : "undefined") + ' 分析');
                }

                trace(r.join('\r\n'));

            };

        })(),

        /**
         * 获取对象的字符串形式。
         * @param {Object} obj 要输出的内容。
         * @param {Number/undefined} deep=0 递归的层数。
         * @return String 成员。
         */
        inspect: function(obj, deep) {

            if (deep == null)
                deep = 0;
            switch (typeof obj) {
                case "function":
                    if (deep == 0 && obj.prototype && obj.prototype.xType) {
                        // 类
                        return String.format("class {0} : {1} {2}", obj.prototype.xType,
                            (obj.prototype.base && obj.prototype.base.xType || "Basee"), trace.inspect(obj.prototype, deep + 1));
                    }

                    // 函数
                    return deep == 0 ? String.decodeUTF8(obj.toString()) : "function ()";

                case "object":
                    if (obj == null)
                        return "null";
                    if (deep >= 3)
                        return obj.toString();

                    if (Array.isArray(obj)) {
                        return "[" +  Object.update(obj, trace.inspect, []).join(", ") + "]";

                    } else {
                        if (obj.setInterval && obj.resizeTo)
                            return "window" + obj.document.URL;
                        if (obj.nodeType) {
                            if (obj.nodeType == 9)
                                return 'document ' + obj.URL;
                            if (obj.tagName) {
                                var tagName = obj.tagName.toLowerCase(), r = tagName;
                                if (obj.id) {
                                    r += "#" + obj.id;
                                    if (obj.className)
                                        r += "." + obj.className;
                                } else if (obj.outerHTML)
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
                        for (i in obj)
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
         * 输出一个错误信息。
         * @param {Object} msg 内容。
         */
        error: function(msg) {
            if (p.debug) {
                if (window.console && console.error)
                    console.error(msg); // 如果错误在此行产生，说明这是预知错误。
                else
                    throw msg;
            }
        },

        /**
         * 输出一个警告信息。
         * @param {Object} msg 内容。
         */
        warn: function(msg) {
            if (p.debug) {
                if (window.console && console.warn)
                    console.warn(msg);
                else
                    trace.write("[警告]" + msg);
            }
        },

        /**
         * 输出一个信息。
         * @param {Object} msg 内容。
         */
        info: function(msg) {
            if (p.debug) {
                if (window.console && console.info)
                    console.info(msg);
                else
                    trace.write("[信息]" + msg);
            }
        },

        /**
         * 遍历对象每个元素。
         * @param {Object} obj 对象。
         */
        dir: function(obj) {
            if (p.debug) {
                if (window.console && console.dir)
                    console.dir(obj);
                else if (obj) {
                    var r = "", i;
                    for (i in obj)
                        r += i + " = " + trace.inspect(obj[i], 1) + "\r\n";
                    trace(r);
                }
            }
        },

        /**
         * 清除调试信息。 (没有控制台时，不起任何作用)
         */
        clear: function() {
            if (window.console && console.clear)
                console.clear();
        },

        /**
         * 如果是调试模式就运行。
         * @param {Function} func 函数。
         * @return String 返回运行的错误。如无错, 返回空字符。
         */
        execute: function(func) {
            if (p.debug) {
                try {
                    func();
                } catch (e) {
                    return e;
                }
            }
            return "";
        },

        /**
         * 空函数，用于证明函数已经执行过。
         */
        count: function() {
            trace('[调试]' + p.id++);
        },

        /**
         * 输出一个函数执行指定次使用的时间。
         * @param {Function} fn 函数。
         * @param {Number} times=1000 运行次数。
         */
        time: function(fn, times) {
            times = times || 1000;
            var d = Date.now();
            while (times-- > 0)
                fn();
            times = Date.now() - d;
            trace("[时间] " + times);
        }

    });

    /// #region Assert

    /**
     * @namespace assert
     */
    apply(assert, {

        /**
         * 确认一个值为函数变量。
         * @param {Object} bValue 值。
         * @param {String} msg="断言失败" 错误后的提示。
         * @return {Boolean} 返回 bValue 。
         * @example <code>
         * assert.isFunction(a, "a ~");
         * </code>
         */
        isFunction: function() {
            return assertInternal2(Function.isFunction, "必须是函数。", arguments);
        },

        /**
         * 确认一个值为数组。
         * @param {Object} bValue 值。
         * @param {String} msg="断言失败" 错误后的提示。
         * @return {Boolean} 返回 bValue 。
         */
        isArray: function() {
            return assertInternal2(Array.isArray, "必须是数组。", arguments);
        },

        /**
         * 确认一个值为函数变量。
         * @param {Object} bValue 值。
         * @param {String} msg="断言失败" 错误后的提示。
         * @return {Boolean} 返回 bValue 。
         */
        isObject: function(value, msg) {
            return assertInternal( Object.isObject(value) || Function.isFunction(value) || value.nodeType, msg, value, "必须是引用的对象。", arguments);
        },

        /**
         * 确认一个值为数字。
         * @param {Object} bValue 值。
         * @param {String} msg="断言失败" 错误后的提示。
         * @return {Boolean} 返回 bValue 。
         */
        isNumber: function(value, msg) {
            return assertInternal(typeof value == 'number' || value instanceof Number, msg, value, "必须是数字。");
        },

        /**
         * 确认一个值为节点。
         * @param {Object} bValue 值。
         * @param {String} msg="断言失败" 错误后的提示。
         * @return {Boolean} 返回 bValue 。
         */
        isNode: function(value, msg) {
            return assertInternal(value && value.nodeType, msg, value, "必须是 DOM 节点。");
        },

        /**
         * 确认一个值为节点。
         * @param {Object} bValue 值。
         * @param {String} msg="断言失败" 错误后的提示。
         * @return {Boolean} 返回 bValue 。
         */
        isElement: function(value, msg) {
            return assertInternal(value && value.style, msg, value, "必须是 Element 对象。");
        },

        /**
         * 确认一个值是字符串。
         * @param {Object} bValue 值。
         * @param {String} msg="断言失败" 错误后的提示。
         * @return {Boolean} 返回 bValue 。
         */
        isString: function(value, msg) {
            return assertInternal(typeof value == 'string' || value instanceof String, msg, value, "必须是字符串。");
        },

        /**
         * 确认一个值是日期。
         * @param {Object} bValue 值。
         * @param {String} msg="断言失败" 错误后的提示。
         * @return {Boolean} 返回 bValue 。
         */
        isDate: function(value, msg) {
            return assertInternal( Object.type(value) == 'date' || value instanceof Date, msg, value, "必须是日期。");
        },

        /**
         * 确认一个值是正则表达式。
         * @param {Object} bValue 值。
         * @param {String} msg="断言失败" 错误后的提示。
         * @return {Boolean} 返回 bValue 。
         */
        isRegExp: function(value, msg) {
            return assertInternal( Object.type(value) == 'regexp' || value instanceof RegExp, msg, value, "必须是正则表达式。");
        },

        /**
         * 确认一个值非空。
         * @param {Object} value 值。
         * @param {String} argsName 变量的名字字符串。
         * @return {Boolean} 返回 assert 是否成功 。
         */
        notNull: function(value, msg) {
            return assertInternal(value != null, msg, value, "不可为空。");
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
            return assertInternal(value >= min && !(value >= max), msg, value, "超出索引, 它必须在 [" + min + ", " + (max === undefined ? "+∞" : max) + ") 间。");
        },

        /**
         * 确认一个值非空。
         * @param {Object} value 值。
         * @param {String} argsName 变量的参数名。
         * @return {Boolean} 返回 assert 是否成功 。
         */
        notEmpty: function(value, msg) {
            return assertInternal(value && value.length, msg, value, "不能为空。");
        }

    });
	
    function assertInternal(asserts, msg, value, dftMsg) {
        return assert(asserts, msg ? msg.replace('~', dftMsg) : dftMsg, value);
    }

    function assertInternal2(fn, dftMsg, args) {
        return assertInternal(fn(args[0]), args[1], args[0], dftMsg);
    }

	// 追加 debugStepThrough 防止被认为是 assert 错误源堆栈。

    assertInternal.debugStepThrough = assertInternal2.debugStepThrough = assert.debugStepThrough = true;

    for ( var fn in assert) {
        assert[fn].debugStepThrough = true;
    }

    /// #endregion

    /// #endregion


})(JPlus, Object.extend);


/// #if !Publish

/**
 * 是否打开调试。启用调试后，将支持assert检查。
 * @config {Boolean}
 */
JPlus.debug = true;

/**
 * 是否在 assert 失败时显示函数调用堆栈。
 * @config {Boolean} stackTrace
 */
JPlus.stackTrace = true;

JPlus.rootPath = JPlus.rootPath.substr(0, JPlus.rootPath.length - "system/core/assets/scripts/".length);

JPlus.resolveNamespace = function(ns, isStyle){
	return ns.replace(/^([^.]+\.[^.]+)\./, isStyle ? '$1.assets.styles.' : '$1.assets.scripts.').replace(/\./g, '/') + (isStyle ? '.css' : '.js');
};


/// #endif


/// #endif
