/*
 * This file is created by a tool at 2012/04/06 20:45:30
 */


/************************************
 * System
 ************************************/
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
				    assert(dest != null, "Basee.extend(dest, src): {dest} 不可为空。", dest);

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

		    assert(!Function.isFunction(iterable), "Basee.each(iterable, fn, bind): {iterable} 不能是函数。 ", iterable);
		    assert(Function.isFunction(fn), "Basee.each(iterable, fn, bind): {fn} 必须是函数。 ", fn);

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

				    assert(!args || dest[key], "Basee.update(iterable, fn, dest, args): 试图把iterable[{key}][{fn}] 放到 dest[key][fn], 但  dest[key] 是一个空的成员。",
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

		assert(dest != null, "Basee.extend(dest, src): {dest} 不可为空。", dest);

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

		assert(dest != null, "Basee.extendIf(dest, src): {dest} 不可为空。", dest);

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
/************************************
 * System.Dom.Element
 ************************************/
(function(window) {
	
	assert(!window.Dom || window.$$ != window.Dom.get, "重复引入 Element 模块。");

	/**
	 * document 简写。
	 * @type Document
	 */
	var document = window.document,
	
		/**
		 * Object 简写。
		 * @type Object
		 */
		o = Object,
	
		/**
		 * JPlus 简写。
		 * @type Object
		 */
		p = JPlus,
	
		/**
		 * Object.extend 简写。
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
		 * 指示当前浏览器是否为标签浏览器。
		 */
		isStandard = eval("-[1,]"),
	
		/**
		 * 用于测试的元素。
		 * @type Element
		 */
		div = document.createElement('DIV'),
	
		/**
		 * 所有控件基类。
		 * @class Control
		 * @abstract
		 * 控件的周期： 
		 * constructor - 创建控件对应的 Javascript 类。不建议重写构造函数，除非你知道你在做什么。 
		 * create - 创建本身的 dom 节点。 可重写 - 默认使用 this.tpl 创建。
		 * init - 初始化控件本身。 可重写 - 默认为无操作。 
		 * attach - 渲染控件到文档。不建议重写，如果你希望额外操作渲染事件，则重写。 
		 * detach - 删除控件。不建议重写，如果一个控件用到多个 dom 内容需重写。
		 */
		Control = Class({
	
			/**
			 * 当前控件实际对应的 HTMLNode 实例。
			 * @type Node
			 * @protected
			 */
			dom: null,
	
			/**
			 * xType 。
			 * @virtual
			 */
			xType: "control",
	
			/**
			 * 存储当前控件的默认配置。
			 * @getter {Object} options
			 * @protected
			 * @virtual
			 */
	
			/**
			 * 存储当前控件的默认模板字符串。
			 * @getter {String} tpl
			 * @protected
			 * @virtual
			 */
	
			/**
			 * 当被子类重写时，生成当前控件。
			 * @param {Object} options 选项。
			 * @protected
			 * @virtual
			 */
			create: function() {
	
				assert(this.tpl, "Control.prototype.create(): 当前类不存在 tpl 属性。Control.prototype.create 会调用 tpl 属性，根据这个属性中的 HTML 代码动态地生成节点并返回。子类必须定义 tpl 属性或重写 Control.prototype.create 方法返回节点。");
	
				// 转为对 tpl解析。
				return Dom.parseNode(this.tpl);
			},
			
			/**
			 * 当被子类重写时，渲染控件。
			 * @method
			 * @param {Object} options 配置。
			 * @protected virtual
			 */
			init: Function.empty,
		
			/**
			 * 将当前控件插入到指定父节点，并显示在指定节点之前。
			 * @param {Node} parentNode 渲染的目标。
			 * @param {Node} refNode=null 渲染的位置。
			 * @protected virtual
			 */
			attach: function(parentNode, refNode) {
				assert(parentNode && parentNode.nodeType, 'Control.prototype.attach(parentNode, refNode): {parentNode} 必须是 DOM 节点。', parentNode);
				assert(refNode === null || refNode.nodeType, 'Control.prototype.attach(parentNode, refNode): {refNode} 必须是 null 或 DOM 节点 。', refNode);
				parentNode.insertBefore(this.dom, refNode);
			},
		
			/**
			 * 移除节点本身。
			 * @param {Node} parentNode 渲染的目标。
			 * @protected virtual
			 */
			detach: function(parentNode) {
				assert(parentNode && parentNode.removeChild, 'Control.prototype.detach(parentNode): {parentNode} 必须是 DOM 节点或控件。', parent);
				parentNode.removeChild(this.dom);
			},
		
			/**
			 * 在当前控件下插入一个子控件，并插入到指定位置。
			 * @param {Control} childControl 要插入的控件。
			 * @param {Control} refControl=null 渲染的位置。
			 * @protected
			 */
			insertBefore: function(childControl, refControl) {
				assert(childControl && childControl.attach, 'Control.prototype.insertBefore(childControl, refControl): {childControl} 必须是控件。', childControl);
				childControl.attach(this.dom, refControl && refControl.dom || null);
			},
		
			/**
			 * 删除当前控件的指定子控件。
			 * @param {Control} childControl 要插入的控件。
			 * @protected
			 */
			removeChild: function(childControl) {
				assert(childControl && childControl.detach, 'Control.prototype.removeChild(childControl): {childControl} 必须是控件。', childControl);
				childControl.detach(this.dom);
			},
	
			/**
			 * 初始化一个新的控件。
			 * @param {String/Element/Control/Object} [options] 对象的 id 或对象或各个配置。
			 */
			constructor: function(options) {
	
				// 这是所有控件共用的构造函数。
				var me = this,
	
					// 临时的配置对象。
					opt = apply({}, me.options),
	
					// 当前实际的节点。
					dom;
	
				// 如果存在配置。
				if(options) {
					
					// 如果 options 是纯配置。
					if(!options.nodeType && options.constructor === Object) {
						dom = options.dom || options;
						apply(opt, options);
						delete opt.dom;
					} else {
						dom = options;
					}
					
					if(typeof dom === "string") {
						dom = document.getElementById(dom);
					} else if(!dom.nodeType){
						dom = dom.dom;
					}
					
				}
	
				// 如果 dom 的确存在，使用已存在的， 否则使用 create(opt)生成节点。
				me.dom = dom || me.create(opt);
	
				assert(me.dom && me.dom.nodeType, "Control.prototype.constructor(options): 当前实例的 dom 属性为空，或此属性不是 DOM 对象。(检查 options.dom 是否是合法的节点或ID(ID不存在?) 或当前实例的 create 方法是否正确返回一个节点)\r\n当前控件: {dom} {xType}", me.dom, me.xType);
	
				// 调用 init 初始化控件。
				me.init(opt);
	
				// 处理样式。
				if('style' in opt) {
					assert.isElement(me.dom, "Control.prototype.constructor(options): 当前控件不支持样式。");
					me.dom.style.cssText += ';' + opt.style;
					delete opt.style;
				}
	
				// 如果指定的节点已经在 DOM 树上，且重写了 attach 方法，则调用之。
				if(me.dom.parentNode && this.attach !== Control.prototype.attach) {
					this.attach(me.dom.parentNode, me.dom.nextSibling);
				}
	
				// 复制各个选项。
				Object.set(me, opt);
			},
			
			equals: function(other){
				return other && other.dom === this.dom;
			}
		}),
	
		/**
		 * 表示节点的集合。用于批量操作节点。
		 * @class DomList
		 * DomList 是对元素数组的只读包装。 DomList 允许快速操作多个节点。 DomList 的实例一旦创建，则不允许修改其成员。
		 */
		DomList = Class({
	
			/**
			 * 获取当前集合的元素个数。
			 * @type {Number}
			 * @property
			 */
			length: 0,
	
			/**
			 * 获取指定索引的元素。如果 index < 0， 则获取倒数 index 元素。
			 * @param {Number} index 元素。
			 * @return { Base} 指定位置所在的元素。
			 * @example <code>
			 * [1,7,8,8].item(0); //   1
			 * [1,7,8,8].item(-1); //   8
			 * [1,7,8,8].item(5); //   undefined
			 * </code>
			 */
			item: function(index) {
				index = this[index < 0 ? this.length + index: index];
				return index ? new Dom(index) : null;
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
				assert(args && typeof args.length === 'number', "DomList.prototype.invoke(func, args): {args} 必须是数组, 无法省略。", args);
				var r = [];
				assert(Dom.prototype[func] && Dom.prototype[func].apply, "DomList.prototype.invoke(func, args): Control 不包含方法 {func}。", func);
				ap.forEach.call(this, function(value) {
					value = new Dom(value);
					r.push(value[func].apply(value, args));
				});
				return r;
			},
			
			/**
			 * 初始化 DomList 实例。
			 * @param {Array/DomList} nodes 节点集合。
			 * @constructor
			 */
			constructor: function(nodes) {
	
				if(nodes) {

					assert(nodes.length !== undefined, 'DomList.prototype.constructor(nodes): {nodes} 必须是一个 DomList 或 Array 类型的变量。', nodes);
	
					var len = this.length = nodes.length;
					while(len--)
						this[len] = nodes[len].dom || nodes[len];

				}

			},
			
			/**
			 * 将参数数组添加到当前集合。
			 * @param {Element/DomList} value 元素。
			 * @return this
			 */
			concat: function() {
				for(var args = arguments, i = 0; i < args.length; i++){
					var value = args[i], j = -1;
					if(value){
						if(typeof value.length !== 'number')
							value = [value];
							
						while(++j < value.length)
							this.include(value[j].dom || value[j]);
					}
				}
	
				return this;
			},
			
			/**
			 * xType
			 */
			xType: "nodelist"
	
		}),
	
		/**
		 * 表示一个点。包含 x 坐标和 y 坐标。
		 * @class Point
		 */
		Point = Class({
	
			/**
			 * 初始化 Point 的实例。
			 * @param {Number} x X 坐标。
			 * @param {Number} y Y 坐标。
			 * @constructor
			 */
			constructor: function(x, y) {
				this.x = x;
				this.y = y;
			},
			
			/**
			 * 将 (x, y) 增值。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			add: function(p) {
				assert(p && 'x' in p && 'y' in p, "Point.prototype.add(p): {p} 必须有 'x' 和 'y' 属性。", p);
				return new Point(this.x + p.x, this.y + p.y);
			},

			/**
			 * 将一个点坐标减到当前值。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			sub: function(p) {
				assert(p && 'x' in p && 'y' in p, "Point.prototype.sub(p): {p} 必须有 'x' 和 'y' 属性。", p);
				return new Point(this.x - p.x, this.y - p.y);
			}
		}),
	
		/**
		 * 函数 Dom.parseNode使用的新元素缓存。
		 * @type Object
		 */
		cache = {},
	
		/**
		 * 处理 <div/> 格式标签的正则表达式。
		 * @type RegExp
		 */
		rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	
		/**
		 * 在 Dom.parseNode 和 setHtml 中对 HTML 字符串进行包装用的字符串。
		 * @type Object 部分元素只能属于特定父元素， wrapMap 列出这些元素，并使它们正确地添加到父元素中。 IE678
		 *       会忽视第一个标签，所以额外添加一个 div 标签，以保证此类浏览器正常运行。
		 */
		wrapMap = {
			$default: isStandard ? [1, '', '']: [2, '$<div>', '</div>'],
			option: [2, '<select multiple="multiple">', '</select>'],
			legend: [2, '<fieldset>', '</fieldset>'],
			thead: [2, '<table>', '</table>'],
			tr: [3, '<table><tbody>', '</tbody></table>'],
			td: [4, '<table><tbody><tr>', '</tr></tbody></table>'],
			col: [3, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
			area: [2, '<map>', '</map>']
		},
		
		styles = {
			height: 'setHeight',
			width: 'setWidth'
		},
	
		/**
		 * 特殊属性的列表。
		 * @type Object
		 */
		attributes = {
			innerText: 'innerText' in div ? 'innerText': 'textContent',
			'for': 'htmlFor',
			'class': 'className'
		},
		
		/**
		 * 字符串字段。
		 * @type Object
		 */
		textField = {
			
		},
	
		/// #if CompactMode
		
		/**
		 * 透明度的正则表达式。
		 * @type RegExp IE8 使用滤镜支持透明度，这个表达式用于获取滤镜内的表示透明度部分的子字符串。
		 */
		rOpacity = /opacity=([^)]*)/,
	
		/**
		 * 获取元素的实际的样式属性。
		 * @param {Element} elem 需要获取属性的节点。
		 * @param {String} name 需要获取的CSS属性名字。
		 * @return {String} 返回样式字符串，肯能是 undefined、 auto 或空字符串。
		 */
		getStyle = window.getComputedStyle ? function(elem, name) {
	
			// getComputedStyle为标准浏览器获取样式。
			assert.isElement(elem, "Dom.getStyle(elem, name): {elem} ~");
	
			// 获取真实的样式owerDocument返回elem所属的文档对象
			// 调用getComputeStyle的方式为(elem,null)
			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
	
			// 返回 , 在 火狐如果存在 IFrame， 则 computedStyle == null
			// http://drupal.org/node/182569
			return computedStyle ? computedStyle[name]: null;
	
		}: function(elem, name) {
	
			assert.isElement(elem, "Dom.getStyle(elem, name): {elem} ~");
	
			// 特殊样式保存在 styles 。
			if( name in styles) {
				switch (name) {
					case 'height':
						return elem.offsetHeight === 0 ? 'auto': elem.offsetHeight -  Dom.calc(elem, 'by+py') + 'px';
					case 'width':
						return elem.offsetWidth === 0 ? 'auto': elem.offsetWidth -  Dom.calc(elem, 'bx+px') + 'px';
					case 'opacity':
						return new Dom(elem).getOpacity().toString();
				}
			}
			// currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
			// currentStyle是运行时期样式与style属性覆盖之后的样式
			var r = elem.currentStyle;
	
			if(!r)
				return "";
			r = r[name];
	
			// 来自 jQuery
			// 如果返回值不是一个带px的 数字。 转换为像素单位
			if(/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {
	
				// 保存初始值
				var style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;
	
				// 放入值来计算
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = name === "fontSize" ? "1em": (r || 0);
				r = style.pixelLeft + "px";
	
				// 回到初始值
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
	
			}
	
			return r;
		},
		
		/// #else
		
		/// getStyle = function (elem, name) {
		///
		/// 	// 获取样式
		/// 	var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
		///
		/// 	// 返回
		/// 	return computedStyle ? computedStyle[ name ]: null;
		///
		/// },
		/// #endif
		
		/**
		 * 是否属性的正则表达式。
		 * @type RegExp
		 */
		rStyle = /-(\w)|float/,
		
		/**
		 * float 属性的名字。
		 * @type String
		 */
		styleFloat = 'cssFloat' in div.style ? 'cssFloat': 'styleFloat',
		
		// IE：styleFloat Other：cssFloat
		
		/**
		 * 获取滚动大小的方法。
		 * @type Function
		 */
		getScroll = function() {
			var elem = this.dom;
			return new Point(elem.scrollLeft, elem.scrollTop);
		},
		
		/**
		 * 获取窗口滚动大小的方法。
		 * @type Function
		 */
		getWindowScroll = 'pageXOffset' in window ? function() {
			var win = this.defaultView;
			return new Point(win.pageXOffset, win.pageYOffset);
		}: getScroll,
	
		/**
		 * 判断 body 节点的正则表达式。
		 * @type RegExp
		 */
		rBody = /^(?:BODY|HTML|#document)$/i;

	/**
	 * @namespace Dom
	 */
	apply(Dom, {
		
		/**
		 * 根据一个 id 获取元素。如果传入的id不是字符串，则直接返回参数。
		 * @param {String/Node/Control/DomList} id 要获取元素的 id 或元素本身。
	 	 * @return {Control} 元素。
		 */
		get: function(id) {
			
			return typeof id === "string" ?
				(id = document.getElementById(id)) && new Dom(id) :
				id ? 
					id.nodeType ? 
						new Dom(id) :
						id.dom ? 
							id : 
							Dom.get(id[0]) : 
					null;
			
		},
		
		/**
		 * 执行一个选择器，返回一个新的 {DomList} 对象。
		 * @param {String} selecter 选择器。 如 "h2" ".cls" "[attr=value]" 。
		 * @return {Element/undefined} 节点。
		 */
		query: function(selector) {
			
			// 如果传入的是字符串，作为选择器处理。
			// 否则作为一个节点处理。
			return selector ? 
				typeof selector === 'string' ? 
					document.query(selector) :
					typeof selector.length === 'number' ? 
						selector instanceof DomList ?
							selector :
							new DomList(selector) :
						new DomList([Dom.get(selector)]) :
				new DomList;
			
		},
		
		/**
		 * 判断一个元素是否符合一个选择器。
		 */
		match: function (elem, selector) {
			assert.isString(selector, "Control.prototype.find(selector): selector ~。");
			
			if(!elem.parentNode){
				var div = document.createElement('div');
				div.appendChild(elem);
				try{
					return match(elem, selector);
				} finally {
					div.removeChild(elem);
				}
			}
			return match(elem, selector);
		},

		/**
		 * 解析一个 html 字符串，返回相应的控件。
		 * @param {String/Element} html 字符。
		 * @param {Element} context=document 生成节点使用的文档中的任何节点。
		 * @param {Boolean} cachable=true 指示是否缓存节点。
		 * @return {Control} 控件。
		 */
		parse: function(html, context, cachable) {

			assert.notNull(html, 'Dom.parse(html, context, cachable): {html} ~');

			return html.dom ? html: new Dom(Dom.parseNode(html, context, cachable));
		},
		
		/**
		 * 创建一个节点。
		 * @param {String} tagName 创建的节点的标签名。
		 * @param {String} className 创建的节点的类名。
		 */
		create: function(tagName, className) {
			return new Dom(Dom.createNode(tagName, className || ''));
		},
		
		/**
		 * 创建一个节点。
		 * @param {String} tagName 创建的节点的标签名。
		 * @param {String} className 创建的节点的类名。
		 */
		createNode: function(tagName, className) {
			assert.isString(tagName, 'Dom.create(tagName, className): {tagName} ~');
			var div = document.createElement(tagName);
			div.className = className;
			return div;
		},
		
		/**
		 * 根据一个 id 获取元素。如果传入的id不是字符串，则直接返回参数。
		 * @param {String/Node/Control} id 要获取元素的 id 或元素本身。
	 	 * @return {Node} 元素。
		 */
		getNode: function (id) {
			return typeof id === "string" ?
				document.getElementById(id) :
				id ? 
					id.nodeType ? 
						id :
						id.dom || Dom.getNode(id[0]) : 
					null;
			
		},

		/**
		 * 解析一个 html 字符串，返回相应的原生节点。
		 * @param {String/Element} html 字符。
		 * @param {Element} context=document 生成节点使用的文档中的任何节点。
		 * @param {Boolean} cachable=true 指示是否缓存节点。
		 * @return {Element/TextNode/DocumentFragment} 元素。
		 */
		parseNode: function(html, context, cachable) {

			// 不是 html，直接返回。
			if( typeof html === 'string') {

				var srcHTML = html;

				// 查找是否存在缓存。
				html = cache[srcHTML];
				context = context && context.ownerDocument || document;

				assert(context.createElement, 'Dom.parseNode(html, context, cachable): {context} 必须是 DOM 节点。', context);

				if(html && html.ownerDocument === context) {

					// 复制并返回节点的副本。
					html = html.cloneNode(true);

				} else {

					// 测试查找 HTML 标签。
					var tag = /<([\w:]+)/.exec(srcHTML);
					cachable = cachable !== false;

					if(tag) {

						assert.isString(srcHTML, 'Dom.parseNode(html, context, cachable): {html} ~');
						html = context.createElement("div");

						var wrap = wrapMap[tag[1].toLowerCase()] || wrapMap.$default;

						html.innerHTML = wrap[1] + srcHTML.trim().replace(rXhtmlTag, "<$1></$2>") + wrap[2];

						// 转到正确的深度。
						// IE 肯能无法正确完成位置标签的处理。
						for( tag = wrap[0]; tag--; )
						html = html.lastChild;

						// 如果解析包含了多个节点。
						if(html.previousSibling) {
							wrap = html.parentNode;

							assert(context.createDocumentFragment, 'Dom.parseNode(html, context, cachable): {context} 必须是 DOM 节点。', context);
							html = context.createDocumentFragment();
							while(wrap.firstChild) {
								html.appendChild(wrap.firstChild);
							}
						}

						assert(html, "Dom.parseNode(html, context, cachable): 无法根据 {html} 创建节点。", srcHTML);

						// 一般使用最后的节点， 如果存在最后的节点，使用父节点。
						// 如果有多节点，则复制到片段对象。
						cachable = cachable && !/<(?:script|object|embed|option|style)/i.test(srcHTML);

					} else {

						// 创建文本节点。
						html = context.createTextNode(srcHTML);
					}

					if(cachable) {
						cache[srcHTML] = html.cloneNode(true);
					}

				}

			}

			return html;

		},
		
		/**
		 * 判断指定节点之后有无存在子节点。
		 * @param {Element} elem 节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
		 */
		hasChild: div.compareDocumentPosition ? function(elem, child) {
			assert.isNode(elem, "Dom.hasChild(elem, child): {elem} ~");
			assert.isNode(child, "Dom.hasChild(elem, child): {child} ~");
			return !!(elem.compareDocumentPosition(child) & 16);
		}: function(elem, child) {
			assert.isNode(elem, "Dom.hasChild(elem, child): {elem} ~");
			assert.isNode(child, "Dom.hasChild(elem, child): {child} ~");
			while( child = child.parentNode)
				if(elem === child)
					return true;

			return false;
		},
		
		/**
		 * 特殊属性集合。
		 * @type Object 特殊的属性，在节点复制时不会被复制，因此需要额外复制这些属性内容。
		 */
		properties: {
			INPUT: 'checked',
			OPTION: 'selected',
			TEXTAREA: 'value'
		},
		
		/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		attributes: attributes,
		
		/**
		 * 选择器中关系选择符的处理函数列表。
		 * @private
		 */
		combinators: {
			' ': 'getAll',
			'>': 'getChildren',
			'+': 'getNext',
			'~': 'getAllNext',
			'<': 'getAllParent'
		},
		
		/**
		 * 获取文本时应使用的属性值。
		 * @private
		 */
		textField: textField,
	
		/**
		 * 用于查找所有支持的伪类的函数集合。
		 * @private
		 */
		pseudos: {
			
			target : function (elem) {
				var nameOrId = elem.id || elem.name;
				if(!nameOrId) return false;
				var doc = getDocument(elem).defaultView;
				return nameOrId === (doc.defaultView || doc.parentWindow).location.hash.slice(1)
			},
			
			empty: Dom.isEmpty = function(elem) {
				for( elem = elem.firstChild; elem; elem = elem.nextSibling )
					if( elem.nodeType === 1 || elem.nodeType === 3 ) 
						return false;
				return true;
			},
			
			contains: function( elem, args){ 
				return Dom.getText(elem).indexOf(args) >= 0;
			},
			
			/**
			 * 判断一个节点是否隐藏。
			 * @return {Boolean} 隐藏返回 true 。
			 */
			hidden: Dom.isHidden = function(elem) {
				return (elem.style.display || getStyle(elem, 'display')) === 'none';
			},
			visible: function( elem ){ return !Dom.isHidden(elem); },
			
			not: function(elem, args){ return !match(elem, args); },
			has: function(elem, args){ return query(args, new Dom(elem)).length > 0; },
			
			selected: function(elem){ return elem.selected; },
			checked: function(elem){ return elem.checked; },
			enabled: function(elem){ return elem.disabled === false; },
			disabled: function(elem){ return elem.disabled === true; },
			
			input: function(elem){ return /^(input|select|textarea|button)$/i.test(elem.nodeName); },
			
			"nth-child": function(args, oldResult, result){
				var p = Dom.pseudos;
				if(p[args]){
					p[args](null, oldResult, result);	
				} else if(args = oldResult[args])
					result.push(args);
			},
			"first-child": function (args, oldResult, result) {
				if(args = oldResult[0])
					result.push(args);
			},
			"last-child": function (args, oldResult, result) {
				if(args = oldResult[oldResult.length - 1])
					result.push(args);
			},
			"only-child": function(elem){ 
				var p = new Dom(elem.parentNode).getFirst(elem.nodeName);
				return p && p.getNext(); 
			},
			odd: function(args, oldResult, result){
				var index = 0, elem, t;
				while(elem = oldResult[index++]) {
					if(args){
						result.push(elem);	
					}
				}
			},
			even: function(args, oldResult, result){
				return Dom.pseudos.odd(!args, oldResult, result);
			}
			
		},
		
		/**
		 * 获取一个元素对应的文本。
		 * @param {Element} elem 元素。
		 * @return {String} 值。对普通节点返回 text 属性。
		 */
		getText: function(elem) {

			assert.isNode(elem, "Dom.getText(elem, name): {elem} ~");
			return elem[textField[elem.nodeName] || attributes.innerText] || '';
		},

		/**
		 * 获取一个节点属性。
		 * @param {Element} elem 元素。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: function(elem, name) {

			assert.isNode(elem, "Dom.getAttr(elem, name): {elem} ~");

			// if(navigator.isSafari && name === 'selected' &&
			// elem.parentNode) { elem.parentNode.selectIndex;
			// if(elem.parentNode.parentNode)
			// elem.parentNode.parentNode.selectIndex; }
			var fix = attributes[name];

			// 如果是特殊属性，直接返回Property。
			if(fix) {

				if(fix.get)
					return fix.get(elem, name);

				assert(!elem[fix] || !elem[fix].nodeType, "Dom.getAttr(elem, name): 表单内不能存在 {name} 的元素。", name);

				// 如果 这个属性是自定义属性。
				if( fix in elem)
					return elem[fix];
			}

			assert(elem.getAttributeNode, "Dom.getAttr(elem, name): {elem} 不支持 getAttribute。", elem);

			// 获取属性节点，避免 IE 返回属性。
			fix = elem.getAttributeNode(name);

			// 如果不存在节点， name 为 null ，如果不存在节点值， 返回 null。
			return fix && (fix.value || null);

		},
		
		/**
		 * 判断一个节点是否隐藏。
		 * @method isHidden
		 * @return {Boolean} 隐藏返回 true 。
		 */
		
		/**
		 * 检查是否含指定类名。
		 * @param {Element} elem 元素。
		 * @param {String} className 类名。
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function(elem, className) {
			assert.isNode(elem, "Dom.hasClass(elem, className): {elem} ~");
			assert(className && (!className.indexOf || !/[\s\r\n]/.test(className)), "Dom.hasClass(elem, className): {className} 不能空，且不允许有空格和换行。");
			return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
		},
		
		/**
		 * 特殊的样式集合。
		 * @property
		 * @type Object
		 * @private
		 */
		styles: styles,

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
		styleString: styleString,

		/**
		 * 读取样式数字。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 * @static
		 */
		styleNumber: styleNumber,

		/**
		 * 获取指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 * @return {Object} 收集的属性。
		 */
		getStyles: function(elem, styles) {
			assert.isElement(elem, "Dom.getStyles(elem, styles): {elem} ~");

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
		setStyles: function(elem, styles) {
			assert.isElement(elem, "Dom.getStyles(elem, styles): {elem} ~");

			apply(elem.style, styles);
		},
		
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
		display: {
			position: "absolute",
			visibility: "visible",
			display: "block"
		},

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
		show: function(elem) {
			assert.isElement(elem, "Dom.show(elem): {elem} ~");

			// 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
			elem.style.display = '';

			// 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
			if(getStyle(elem, 'display') === 'none')
				elem.style.display = p.getData(elem, 'display') || 'block';
		},
		
		/**
		 * 赋予元素的 display 属性 none。
		 * @param {Element} elem 元素。
		 */
		hide: function(elem) {
			assert.isElement(elem, "Dom.hide(elem): {elem} ~");
			var currentDisplay = styleString(elem, 'display');
			if(currentDisplay !== 'none') {
				p.setData(elem, 'display', currentDisplay);
				elem.style.display = 'none';
			}
		},
		
		/**
		 * 根据不同的内容进行计算。
		 * @param {Element} elem 元素。
		 * @param {String} type 输入。 一个 type
		 *            由多个句子用,连接，一个句子由多个词语用+连接，一个词语由两个字组成， 第一个字可以是下列字符之一:
		 *            m b p t l r b h w 第二个字可以是下列字符之一: x y l t b r
		 *            b。词语也可以是: outer inner 。
		 * @return {Number} 计算值。 mx+sx -> 外大小。 mx-sx -> 内大小。
		 */
		calc: (function() {

			var borders = {
				m: 'margin#',
				b: 'border#Width',
				p: 'padding#'
			}, map = {
				t: 'Top',
				r: 'Right',
				b: 'Bottom',
				l: 'Left'
			}, init, tpl;

			if(window.getComputedStyle) {
				init = 'var c=e.ownerDocument.defaultView.getComputedStyle(e,null);return ';
				tpl = '(parseFloat(c["#"]) || 0)';
			} else {
				init = 'return ';
				tpl = '(parseFloat(Dom.getStyle(e, "#")) || 0)';
			}

			/**
			 * 翻译 type。
			 * @param {String} type 输入字符串。
			 * @return {String} 处理后的字符串。
			 */
			function format(type) {
				var t, f = type.charAt(0);
				switch (type.length) {

					case 2:
						t = type.charAt(1);
						assert( f in borders || f === 's', "Dom.calc(e, type): {type} 中的 " + type + " 不合法", type);
						if( t in map) {
							t = borders[f].replace('#', map[t]);
						} else {
							return f === 's' ? 'e.offset' + (t === 'x' ? 'Width': 'Height'): '(' + format(f + (t !== 'y' ? 'l': 't')) + '+' + format(f + (t === 'x' ? 'r': 'b')) + ')';
						}

						break;

					case 1:
						if( f in map) {
							t = map[f].toLowerCase();
						} else if(f !== 'x' && f !== 'y') {
							assert(f === 'h' || f === 'w', "Dom.calc(e, type): {type} 中的 " + type + " 不合法", type);
							return 'Dom.styleNumber(e,"' + (f === 'h' ? 'height': 'width') + '")';
						} else {
							return f;
						}

						break;

					default:
						t = type;
				}

				return tpl.replace('#', t);
			}

			return function(elem, type) {
				assert.isElement(elem, "Dom.calc(elem, type): {elem} ~");
				assert.isString(type, "Dom.calc(elem, type): {type} ~");
				return (Dom.sizeMap[type] || (Dom.sizeMap[type] = new Function("e", init + type.replace(/\w+/g, format))))(elem);
			}
		})(),

		/**
		 * 设置一个元素可拖动。
		 * @param {Element} elem 要设置的节点。
		 */
		movable: function(elem) {
			assert.isElement(elem, "Dom.movable(elem): 参数 elem ~");
			if(!/^(?:abs|fix)/.test(styleString(elem, "position")))
				elem.style.position = "relative";
		},
		
		/**
		 * 获取元素的文档。
		 * @param {Element} elem 元素。
		 * @return {Document} 文档。
		 */
		getDocument: getDocument,

		/**
		 * 表示事件的参数。
		 * @class JPlus.Event
		 */
		Event: Class({

			/**
			 * 构造函数。
			 * @param {Object} target 事件对象的目标。
			 * @param {String} type 事件对象的类型。
			 * @param {Object} [e] 事件对象的属性。
			 * @constructor
			 */
			constructor: function(target, type, e) {
				assert.notNull(target, "Dom.Event.prototype.constructor(target, type, e): {target} ~");

				var me = this;
				me.target = target;
				me.type = type;
				apply(me, e);
			},
			
			/**
			 * 阻止事件的冒泡。
			 * @remark 默认情况下，事件会向父元素冒泡。使用此函数阻止事件冒泡。
			 */
			stopPropagation: function() {
				this.cancelBubble = true;
			},
			
			/**
			 * 取消默认事件发生。
			 * @remark 有些事件会有默认行为，如点击链接之后执行跳转，使用此函数阻止这些默认行为。
			 */
			preventDefault: function() {
				this.returnValue = false;
			},
			
			/**
			 * 停止默认事件和冒泡。
			 * @remark 此函数可以完全撤销事件。 事件处理函数中 return false 和调用 stop() 是不同的， return
			 *         false 只会阻止当前事件其它函数执行， 而 stop() 只阻止事件冒泡和默认事件，不阻止当前事件其它函数。
			 */
			stop: function() {
				this.stopPropagation();
				this.preventDefault();
			},
			
			/**
			 * 获取当前发生事件的控件。
			 * @return {Control} 发生事件的控件。
			 */
			getTarget: function() {
				assert(this.target, "Dom.Event.prototype.getTarget(): 当前事件不支持 getTarget 操作");
				return new Dom(this.target.nodeType === 3 ? this.target.parentNode: this.target);
			}
		}),

		/**
		 * 文档对象。
		 * @class Document 因为 IE6/7 不存在这些对象, 文档对象是对原生 HTMLDocument 对象的补充。 扩展
		 *        Document 也会扩展 HTMLDocument。
		 */
		Document: p.Native(document.constructor || {
			prototype: document
		})

	});

	/**
	 * @class Control
	 */
	apply(Control, {
	
		/**
		 * 将一个成员附加到 Control 对象和相关类。
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 DomList 实例。
		 * @return {Element} this
		 * @static
		 * 对 Element 扩展，内部对 Element DomList document 皆扩展。
		 *         这是由于不同的函数需用不同的方法扩展，必须指明扩展类型。 所谓的扩展，即一个类所需要的函数。 DOM 方法
		 *         有 以下种 1, 其它 setText - 执行结果返回 this， 返回 this 。(默认) 2
		 *         getText - 执行结果是数据，返回结果数组。 3 getElementById - 执行结果是DOM
		 *         或 ElementList，返回 DomList 包装。 4 hasClass -
		 *         只要有一个返回等于 true 的值， 就返回这个值。 参数 copyIf 仅内部使用。
		 */
		implement: function(members, listType, copyIf) {
			assert.notNull(members, "Control.implement" + ( copyIf ? 'If' : '') + "(members, listType): {members} ~");
		
			Object.each(members, function(value, func) {
		
				var i = this.length;
				while(i--) {
					var cls = this[i].prototype;
					if(!copyIf || !cls[func]) {
		
						if(!i) {
							switch (listType) {
								case 2:
									// return array
									value = function() {
										return this.invoke(func, arguments);
									};
									break;
		
								case 3:
									// return DomList
									value = function() {
										var r = new DomList;
										return r.concat.apply(r, this.invoke(func, arguments));
									};
									break;
								case 4:
									// return if true
									value = function() {
										var i = -1, item = null, target = new Dom();
										while(++i < this.length && !item) {
											target.dom = this[i];
											item = target[func].apply(target, arguments);
										}
										return item;
									};
									break;
								default:
									// return this
									value = function() {
										var len = this.length, i = -1, target;
										while(++i < len) {
											target = new Dom(this[i]);
											target[func].apply(target, arguments);
										}
										return this;
									};
							}
						}
		
						cls[func] = value;
					}
				}
		
			}, [DomList, Dom.Document, Control]);
		
			return this;

		},
	
		/**
		 * 若不存在，则将一个对象附加到 Element 对象。
		 * @static
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 DomList 实例。
		 * @param {Number} docType 说明如何复制到 Document 实例。
		 * @return {Element} this
		 */
		implementIf: function(obj, listType) {
			return this.implement(obj, listType, true);
		},
	
		/**
		 * 定义事件。
		 * @param {String} events 事件名。
		 * @param {String} baseEvent 基础事件。
		 * @param {Function} initEvent 触发器。
		 * @return {Function} 函数本身。
		 * @static
		 * @memberOf Element 原则 Control.addEvents 可以解决问题。 但由于 DOM
		 *           的特殊性，额外提供 defineEvents 方便定义适合 DOM 的事件。 defineEvents
		 *           主要解决 3 个问题:
		 *           <ol>
		 *           <li> 多个事件使用一个事件信息。
		 *           <p>
		 *           所有的 DOM 事件的 add 等 是一样的，因此这个函数提供一键定义:
		 *           JPlus.defineEvents('e1 e2 e3')
		 *           </p>
		 *           </li>
		 *           <li> 事件别名。
		 *           <p>
		 *           一个自定义 DOM 事件是另外一个事件的别名。 这个函数提供一键定义依赖:
		 *           JPlus.defineEvents('mousewheel', 'DOMMouseScroll')
		 *           </p>
		 *           </li>
		 *           <li> 事件委托。
		 *           <p>
		 *           一个自定义 DOM 事件经常依赖已有的事件。一个事件由另外一个事件触发， 比如 ctrlenter
		 *           是在 keyup 基础上加工的。 这个函数提供一键定义依赖:
		 *           JPlus.defineEvents('ctrlenter', 'keyup', function
		 *           (e) { (判断事件) })
		 *           </p>
		 *           </li>
		 * @example <code>
		 *
		 * Dom.defineEvents('mousewheel', 'DOMMouseScroll')  //  在 FF 下用   mousewheel
		 * 替换   DOMMouseScroll 。
		 *
		 * Dom.defineEvents('mouseenter', 'mouseover', function (e) {
		 * 	  if( !isMouseEnter(e) )   // mouseenter  是基于 mouseover 实现的事件，  因此在 不是
		 * mouseenter 时候 取消事件。
		 *        e.returnValue = false;
		 * });
		 *
		 * </code>
		 */
		addEvents: function(events, baseEvent, initEvent) {
	
			var ee = p.Events.control;
	
			if( typeof events !== 'string') {
				p.Object.addEvents.call(this, events);
				return this;
			}
		
			// 删除已经创建的事件。
			delete ee[events];
		
			assert(!initEvent || ee[baseEvent], "Control.addEvents(events, baseEvent, initEvent): 不存在基础事件 {baseEvent}。");
		
			// 对每个事件执行定义。
			map(events, Function.from(Function.isFunction(baseEvent) ? o.extendIf({
		
				initEvent : baseEvent
		
			}, eventObj) : {
		
				initEvent : initEvent ? function(e) {
					return ee[baseEvent].initEvent.call(this, e) !== false && initEvent.call(this, e);
				} : ee[baseEvent].initEvent,
				// 如果存在 baseEvent，定义别名， 否则使用默认函数。
				add : function(elem, type, fn) {
					eventObj.add(elem, baseEvent, fn);
				},
				remove : function(elem, type, fn) {
					eventObj.remove(elem, baseEvent, fn);
				},
				trigger: eventObj.trigger
			}), ee);
	
		
			return Control.addEvents;
	
		},
	
		/**
		 * 将指定名字的方法委托到当前对象指定的成员。
		 * @param {Object} control 类。
		 * @param {String} delegate 委托变量。
		 * @param {String} methods 所有成员名。
		 *            因此经常需要将一个函数转换为对节点的调用。
		 * @static
		 */
		delegate: function(control, target, setters, getters) {
			assert(control && control.prototype, "Control.delegate(control, target, setters, getters): {control} 必须是一个类", control);
			
			if(typeof getters === 'string'){
				Control.delegate(control, target, getters, true);
				getters = false;
			}
			
			map(setters, function(func) {
				return getters ? function(args1, args2) {
					return this[target][func](args1, args2);
				} : function(args1, args2) {
					this[target][func](args1, args2);
					return this;
				};
			}, control.prototype);
			return Control.delegate;
		}
	})

	.implement({
	
		/**
		 * 将当前节点添加到其它节点。
		 * @param {Element/String} elem=document.body 节点、控件或节点的 id 字符串。
		 * @return this 
		 * this.appendTo(parent) 相当于 parent.append(this) 。 
		 */
		appendTo: function(parent) {
		
			// parent 肯能为 true
			parent && parent !== true ? (parent.append ? parent : Dom.get(parent)).append(this) : this.attach(document.body, null);

			return this;
	
		},
	
		/**
		 * 删除元素子节点或本身。
		 * @param {Control} childControl 子控件。
		 * @return {Control} this
		 */
		remove: function(childControl) {
	
			if (arguments.length) {
				assert(childControl && this.hasChild(childControl), 'Control.prototype.remove(childControl): {childControl} 不是当前节点的子节点', childControl);
				this.removeChild(childControl);
			} else if (childControl = this.parentControl || this.getParent()){
				childControl.removeChild(this);
			}
	
			return this;
		},
	
		/**
	 	 * 删除一个节点的所有子节点。
		 * @return {Element} this
		 */
		empty: function() {
			var elem = this.dom;
			if(elem.nodeType == 1)
				o.each(elem.getElementsByTagName("*"), clean);
			while (elem = this.getLast(true))
				this.removeChild(elem);
			return this;
		},
	
		/**
		 * 释放节点所有资源。
		 */
		dispose: function() {
			if(this.dom.nodeType == 1){
				o.each(this.dom.getElementsByTagName("*"), clean)
				clean(this.dom);
			}
			
			this.remove();
		},
	
		/**
		 * 设置一个样式属性的值。
		 * @param {String} name CSS 属性名或 CSS 字符串。
		 * @param {String/Number} [value] CSS属性值， 数字如果不加单位，则函数会自动追为像素。
		 * @return {Element} this
		 */
		setStyle: function(name, value) {
		
			// 获取样式
			var me = this;
			
			assert.isString(name, "Control.prototype.setStyle(name, value): {name} ~");
			assert.isElement(me.dom, "Control.prototype.setStyle(name, value): 当前 dom 不支持样式");
		
			// 设置通用的属性。
			if(arguments.length == 1){
				me.dom.style.cssText = name;
				
			// 特殊的属性值。
			} else if( name in styles) {
		
				// setHeight setWidth setOpacity
				return me[styles[name]](value);
		
			} else {
				name = name.replace(rStyle, formatStyle);
		
				assert(value || !isNaN(value), "Control.prototype.setStyle(name, value): {value} 不是正确的属性值。", value);
		
				// 如果值是函数，运行。
				if( typeof value === "number" && !( name in Dom.styleNumbers))
					value += "px";
		
			}
		
			// 指定值。
			me.dom.style[name] = value;
		
			return me;

		},
	
		/**
		 * 设置连接的透明度。
		 * @param {Number} value 透明度， 0 - 1 。
		 * @return {Element} this
		 */
		setOpacity: 'opacity' in div.style ? function(value) {
		
			assert(value <= 1 && value >= 0, 'Control.prototype.setOpacity(value): {value} 必须在 0~1 间。', value);
			assert.isElement(this.dom, "Control.prototype.setStyle(name, value): 当前 dom 不支持样式");
		
			// 标准浏览器使用 opacity
			this.dom.style.opacity = value;
			return this;
		
		}: function(value) {
			var elem = this.dom, style = elem.style;
		
			assert(!+value || (value <= 1 && value >= 0), 'Control.prototype.setOpacity(value): {value} 必须在 0~1 间。', value);
			assert.isElement(elem, "Control.prototype.setStyle(name, value): 当前 dom 不支持样式");
		
			if(value)
				value *= 100;
			value = value || value === 0 ? 'opacity=' + value : '';
		
			// 获取真实的滤镜。
			elem = styleString(elem, 'filter');
		
			assert(!/alpha\([^)]*\)/i.test(elem) || rOpacity.test(elem), 'Control.prototype.setOpacity(value): 当前元素的 {filter} CSS属性存在不属于 alpha 的 opacity， 将导致 setOpacity 不能正常工作。', elem);
		
			// 当元素未布局，IE会设置失败，强制使生效。
			style.zoom = 1;
		
			// 设置值。
			style.filter = rOpacity.test(elem) ? elem.replace(rOpacity, value) : (elem + ' alpha(' + value + ')');
		
			return this;

		},
	
		/// #else
		
		/// setOpacity: function (value) {
		///
		/// 	assert(value <= 1 && value >= 0,
		//   'Control.prototype.setOpacity(value): {value} 必须在 0~1 间。',
		//    value);
		///
		/// 	// 标准浏览器使用 opacity
		/// 	(this.dom).style.opacity = value;
		/// 	return this;
		///
		/// },
		
		/// #endif
		
		/**
		 * 显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		show: function(duration, callBack) {
			Dom.show(this.dom);
			if (callBack) setTimeout(callBack, 0);
			return this;
		},
	
		/**
		 * 隐藏当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		hide: function(duration, callBack) {
			Dom.hide(this.dom);
			if (callBack) setTimeout(callBack, 0);
			return this;
		},
	
		/**
		 * 切换显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		toggle: function(duration, onShow, onHide, type, flag) {
			flag = (flag === undefined ? Dom.isHidden(this.dom): flag);
			return this[flag ? 'show': 'hide'](duration, flag ? onShow : onHide, type);
		},
	
		/**
		 * 设置元素不可选。
		 * @param {Boolean} value 是否可选。
		 * @return this
		 */
		setUnselectable: 'unselectable' in div ? function(value) {
			assert.isElement(this.dom, "Control.prototype.setUnselectable(value): 当前 dom 不支持此操作");
			this.dom.unselectable = value !== false ? 'on': '';
			return this;
		}: 'onselectstart' in div ? function(value) {
			assert.isElement(this.dom, "Control.prototype.setUnselectable(value): 当前 dom 不支持此操作");
			this.dom.onselectstart = value !== false ? Function.returnFalse: null;
			return this;
		}: function(value) {
			assert.isElement(this.dom, "Control.prototype.setUnselectable(value): 当前 dom 不支持此操作");
			this.dom.style.MozUserSelect = value !== false ? 'none': '';
			return this;
		},
	
		/**
		 * 将元素引到最前。
		 * @param {Control} [targetControl] 如果指定了参考控件，则控件将位于指定的控件之上。
		 * @return this
		 */
		bringToFront: function(targetControl) {
			assert(!targetControl || (targetControl.dom && targetControl.dom.style), "Control.prototype.bringToFront(elem): {elem} 必须为 空或允许使用样式的控件。", targetControl);
		
			var thisElem = this.dom, targetZIndex = targetControl&& (parseInt(styleString(targetControl.dom, 'zIndex')) + 1) || Dom.zIndex++;
		
			// 如果当前元素的 z-index 未超过目标值，则设置
			if(!(styleString(thisElem, 'zIndex') > targetZIndex))
				thisElem.style.zIndex = targetZIndex;
		
			return this;

		}, 
		
		/**
		 * 设置节点属性。
		 * @param {String} name 名字。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
		setAttr: function(name, value) {
			var elem = this.dom;
		
			/// #if CompactMode
			
			assert(name !== 'type' || elem.tagName !== "INPUT" || !elem.parentNode, "Control.prototype.setAttr(name, type): 无法修改INPUT元素的 type 属性。");
		
			/// #endif
			// 如果是节点具有的属性。
			if( name in attributes) {
		
				if(attributes[name].set)
					attributes[name].set(elem, name, value);
				else {
		
					assert(elem.tagName !== 'FORM' || name !== 'className' || typeof elem.className === 'string', "Control.prototype.setAttr(name, type): 表单内不能存在 name='className' 的节点。");
		
					elem[attributes[name]] = value;
		
				}
		
			} else if(value === null) {
		
				assert(elem.removeAttributeNode, "Control.prototype.setAttr(name, type): 当前元素不存在 removeAttributeNode 方法");
		
				if( value = elem.getAttributeNode(name)) {
					value.nodeValue = '';
					elem.removeAttributeNode(value);
				}
		
			} else {
		
				assert(elem.getAttributeNode, "Control.prototype.setAttr(name, type): 当前元素不存在 getAttributeNode 方法");
		
				var node = elem.getAttributeNode(name);
		
				if(node)
					node.nodeValue = value;
				else
					elem.setAttribute(name, value);
		
			}
		
			return this;

		},
	
		/**
		 * 快速设置节点全部属性和样式。
		 * @param {String/Object} name 名字。
		 * @param {Object} [value] 值。
		 * @return {Element} this
		 */
		set: function(name, value) {
			var me = this;
		
			if( typeof name === "string") {
		
				var elem = me.dom;
		
				// event 。
				if(name.match(/^on(\w+)/))
					me.on(RegExp.$1, value);
		
				// css 。
				else if(elem.style && ( name in elem.style || rStyle.test(name)))
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
		 * 增加类名。
		 * @param {String} className 类名。
		 * @return {Element} this
		 */
		addClass: function(className) {
			assert.isString(className, "Control.prototype.addClass(className): {className} ~");
		
			var elem = this.dom, classList = className.split(/\s+/), newClass, i;
		
			if(!elem.className && classList.length <= 1) {
				elem.className = className;
		
			} else {
				newClass = " " + elem.className + " ";
		
				for( i = 0; i < classList.length; i++) {
					if(newClass.indexOf(" " + classList[i] + " ") < 0) {
						newClass += classList[i] + " ";
					}
				}
				elem.className = newClass.trim();
			}
		
			return this;

		},
	
		/**
		 * 移除CSS类名。
		 * @param {String} [className] 类名。
		 */
		removeClass: function(className) {
			assert(!className || className.split, "Control.prototype.removeClass(className): {className} ~");
		
			var elem = this.dom, classList, newClass = "", i;
		
			if(className) {
				classList = className.split(/\s+/);
				newClass = " " + elem.className + " ";
				for( i = classList.length; i--; ) {
					newClass = newClass.replace(" " + classList[i] + " ", " ");
				}
				newClass = newClass.trim();
		
			}
		
			elem.className = newClass;
		
			return this;

		},
	
		/**
		 * 切换类名。
		 * @param {String} className 类名。
		 * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
		 * @return {Element} this
		 */
		toggleClass: function(className, toggle) {
			return (toggle !== undefined ? !toggle: this.hasClass(className)) ? this.removeClass(className): this.addClass(className);
		},
	
		/**
		 * 设置控件对应的文本值。
		 * @param {String/Boolean} 值。
		 * @return {Element} this
		 */
		setText: function(value) {
			var elem = this.dom;
			elem[textField[elem.nodeName] || attributes.innerText] = value;
			return this;
		},
	
		/**
		 * 设置当前控件的内部 HTML 字符串。
		 * @param {String} value 设置的新值。
		 * @return {Element} this
		 */
		setHtml: function(value) {
			var elem = this.dom,
				map = wrapMap.$default;
			
			assert(elem.nodeType === 1, "Control.prototype.setHtml(value): 仅当 dom.nodeType === 1 时才能使用此函数。"); 
			
			value = (map[1] + value + map[2]).replace(rXhtmlTag, "<$1></$2>");
			o.each(elem.getElementsByTagName("*"), p.removeData);
			
			try {
				elem.innerHTML = value;
				
			// 如果 innerHTML 出现错误，则直接使用节点方式操作。
			} catch(e){
				this.empty().append(value);
				return this;
			}
			if (map[0] > 1) {
				value = elem.lastChild;
				elem.removeChild(elem.firstChild);
				elem.removeChild(value);
				while (value.firstChild)
					elem.appendChild(value.firstChild);
			}
	
			return this;
		},

		/**
		 * 改变大小。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setSize: function(x, y) {
			var me = this,
			p = formatPoint(x, y);
		
			if (p.x != null) me.setWidth(p.x - Dom.calc(me.dom, 'bx+px'));
		
			if (p.y != null) me.setHeight(p.y - Dom.calc(me.dom, 'by+py'));
		
			return me;
		},
	
		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
		setWidth: function(value) {
		
			this.dom.style.width = value > 0 ? value + 'px': value <= 0 ? '0px': value;
			return this;
		},
	
		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
		setHeight: function(value) {
	
			this.dom.style.height = value > 0 ? value + 'px': value <= 0 ? '0px': value;
			return this;
		},
	
		/**
		 * 设置元素的相对位置。
		 * @param {Point} p
		 * @return {Element} this
		 */
		setOffset: function(p) {
		
			assert(o.isObject(p), "Control.prototype.setOffset(p): {p} 必须有 'x' 和 'y' 属性。", p);
			var s = this.dom.style;
			
			if(p.y != null)
				s.top = p.y + 'px';
				
			if(p.x != null)
				s.left = p.x + 'px';
			return this;
		},
	
		/**
		 * 设置元素的固定位置。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setPosition: function(x, y) {
			var me = this,
				offset = me.getOffset().sub(me.getPosition()),
				p = formatPoint(x, y);
		
			if (p.y != null) offset.y += p.y; 
			else offset.y = null;
		
			if (p.x != null) offset.x += p.x; 
			else offset.x = null;
		
			Dom.movable(me.dom);
		
			return me.setOffset(offset);
		},
	
		/**
		 * 滚到。
		 * @param {Element} dom
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setScroll: function(x, y) {
			var elem = this.dom,
				p = formatPoint(x, y);
		
			if (p.x != null) elem.scrollLeft = p.x;
			if (p.y != null) elem.scrollTop = p.y;
			return this;
	
		},
		
		delegate: function(selector, eventName, handler){
			
			assert.isFunction(handler, "Control.prototype.delegate(selector, eventName, handler): {handler}  ~");
			
			this.on(eventName, function(e){
				if(e.getTarget().match(selector)){
					return handler.call(this, e);
				}
			});
			
		}

	})

	.implement({
		
		/**
		 * 获取节点样式。
		 * @param {String} name 键。
		 * @return {String} 样式。 getStyle() 不被支持，需要使用 name 来获取样式。
		 */
		getStyle: function(name) {
		
			var elem = this.dom;
		
			assert.isString(name, "Control.prototype.getStyle(name): {name} ~");
			assert(elem.style, "Control.prototype.getStyle(name): 当前控件对应的节点不是元素，无法使用样式。");
		
			return elem.style[name = name.replace(rStyle, formatStyle)] || getStyle(elem, name);
		
		},
	
		/// #if CompactMode
		
		/**
		 * 获取透明度。
		 * @method
		 * @return {Number} 透明度。 0 - 1 范围。
		 */
		getOpacity: 'opacity' in div.style ? function() {
			return styleNumber(this.dom, 'opacity');
		}: function() {
			return rOpacity.test(styleString(this.dom, 'filter')) ? parseInt(RegExp.$1) / 100: 1;
		},
	
		/// #else
		///
		/// getOpacity: function () {
		///
		/// 	return styleNumber(this.dom, 'opacity');
		///
		/// },
		
		/// #endif
		
		/**
		 * 获取一个节点属性。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: function(name) {
			return Dom.getAttr(this.dom, name);
		},
	
		/**
		 * 检查是否含指定类名。
		 * @param {String} className
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function(className) {
			return Dom.hasClass(this.dom, className);
		},
	
		/**
		 * 获取值。
		 * @return {Object/String} 值。对普通节点返回 text 属性。
		 */
		getText: function() {
			return Dom.getText(this.dom);
		},
	
		/**
		 * 获取当前控件的内部 HTML 字符串。
		 * @return {String} HTML 字符串。
		 */
		getHtml: function() {
			assert(this.dom.nodeType === 1, "Control.prototype.getHtml(): 仅当 dom.nodeType === 1 时才能使用此函数。"); 
			return this.dom.innerHTML;
		},
	
		/**
		 * 获取元素可视区域大小。包括 border 大小。
		 * @return {Point} 位置。
		 */
		getSize: function() {
			var elem = this.dom;
		
			return new Point(elem.offsetWidth, elem.offsetHeight);
		},
	
		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Point} 位置。
		 */
		getWidth: function() {
			return styleNumber(this.dom, 'width');
		},
	
		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Point} 位置。
		 */
		getHeight: function() {
			return styleNumber(this.dom, 'height');
		},
	
		/**
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
		getScrollSize: function() {
			var elem = this.dom;
		
			return new Point(elem.scrollWidth, elem.scrollHeight);
		},
		
		/**
		 * 获取元素的相对位置。
		 * @return {Point} 位置。
		 */
		getOffset: function() {
			// 如果设置过 left top ，这是非常轻松的事。
			var elem = this.dom, left = elem.style.left, top = elem.style.top;
		
			// 如果未设置过。
			if(!left || !top) {
		
				// 绝对定位需要返回绝对位置。
				if(styleString(elem, "position") === 'absolute') {
					top = this.getOffsetParent();
					left = this.getPosition();
					if(!rBody.test(top.dom.nodeName))
						left = left.sub(top.getPosition());
					left.x -= styleNumber(elem, 'marginLeft') + styleNumber(top.dom, 'borderLeftWidth');
					left.y -= styleNumber(elem, 'marginTop') + styleNumber(top.dom, 'borderTopWidth');
		
					return left;
				}
		
				// 非绝对的只需检查 css 的style。
				left = getStyle(elem, 'left');
				top = getStyle(elem, 'top');
			}
		
			// 碰到 auto ， 空 变为 0 。
			return new Point(parseFloat(left) || 0, parseFloat(top) || 0);
		},
	
		/**
		 * 获取距父元素的偏差。
		 * @return {Point} 位置。
		 */
		getPosition: div.getBoundingClientRect ? function() {
			var elem = this.dom, 
				bound = elem.getBoundingClientRect(),
				doc = getDocument(elem),
				html = doc.dom,
				htmlScroll = doc.getScroll();
			return new Point(bound.left + htmlScroll.x - html.clientLeft, bound.top + htmlScroll.y - html.clientTop);
		}: function() {
			var elem = this.dom, p = new Point(0, 0), t = elem.parentNode;
		
			if(styleString(elem, 'position') === 'fixed')
				return new Point(elem.offsetLeft, elem.offsetTop).add(document.getScroll());
		
			while(t && !rBody.test(t.nodeName)) {
				p.x -= t.scrollLeft;
				p.y -= t.scrollTop;
				t = t.parentNode;
			}
			t = elem;
		
			while(elem && !rBody.test(elem.nodeName)) {
				p.x += elem.offsetLeft;
				p.y += elem.offsetTop;
				if(navigator.isFirefox) {
					if(styleString(elem, 'MozBoxSizing') !== 'border-box') {
						add(elem);
					}
					var parent = elem.parentNode;
					if(parent && styleString(parent, 'overflow') !== 'visible') {
						add(parent);
					}
				} else if(elem !== t && navigator.isSafari) {
					add(elem);
				}
		
				if(styleString(elem, 'position') === 'fixed') {
					p = p.add(document.getScroll());
					break;
				}
				elem = elem.offsetParent;
			}
			if(navigator.isFirefox && styleString(t, 'MozBoxSizing') !== 'border-box') {
				p.x -= styleNumber(t, 'borderLeftWidth');
				p.y -= styleNumber(t, 'borderTopWidth');
			}
		
			function add(elem) {
				p.x += styleNumber(elem, 'borderLeftWidth');
				p.y += styleNumber(elem, 'borderTopWidth');
			}
		
			return p;

		},
	
		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getScroll: getScroll

	}, 2)

	.implement({
		
		// 父节点。
		getParent: createTreeWalker(true, 'parentNode'),
		
		// 全部父节点。
		getAllParent: createTreeWalker(false, 'parentNode'),

		// 第一个节点。
		getFirst: createTreeWalker(true, 'nextSibling', 'firstChild'),

		// 后面的节点。
		getNext: createTreeWalker(true, 'nextSibling'),

		// 前面的节点。
		getPrevious: createTreeWalker(true, 'previousSibling'),

		// 后面的节点。
		getAllNext: createTreeWalker(false, 'nextSibling'),

		// 最后的节点。
		getLast: createTreeWalker(true, 'previousSibling', 'lastChild'),

		// 第一个节点。
		getChild: createTreeWalker(true, 'nextSibling', 'firstChild'),

		// 前面的节点。
		getAllPrevious: createTreeWalker(false, 'previousSibling'),

		// 全部子节点。
		getChildren: createTreeWalker(false, 'nextSibling', 'firstChild'),
		
		// 兄弟节点。
		getSiblings: function(args) {
			return this.getAllPrevious(args).concat(this.getAllNext(args));
		},
		
		// 号次。
		getIndex: 'nodeIndex' in div ? function(){
			return this.dom.nodeIndex;
		} : function() {
			var i = 0, elem = this.dom;
			while( elem = elem.previousSibling)
				if(elem.nodeType === 1)
					i++;
			return i;
		},

		// 全部子节点。
		getAll: function(args) {
			if(!args)
				args = '*';	
			else if(typeof args === 'function')
				return this.getAll().filter(args);
			var r = new DomList, nodes = this.dom.getElementsByTagName(args), i = 0, node;
			while( node = nodes[i++] ) {
				if(node.nodeType === 1){
					r.push(node);
				}	
			}

			return r;
		},

		/**
		 * 执行一个简单的选择器。
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		find: function(selector){
			assert.isString(selector, "Control.prototype.find(selector): selector ~。");
			var elem = this.dom, result;
			if(elem.nodeType !== 1) {
				return document.find.call(this, selector)
			}
			
			try{ 
				var oldId = elem.id, displayId = oldId;
				if(!oldId){
					elem.id = displayId = '__SELECTOR__';
					oldId = 0;
				}
				result = elem.querySelector('#' + displayId +' ' + selector);
			} catch(e) {
				result = query(selector, this)[0];
			} finally {
				if(oldId === 0){
					elem.id = null;	
				}
			}

			return result ? new Dom(result) : null;
		},
		
		/**
		 * 执行选择器。
		 * @method
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		query: function(selector){
			assert.isString(selector, "Control.prototype.find(selector): selector ~。");
			assert(selector, "Control.prototype.find(selector): {selector} 不能为空。", selector);
			var elem = this.dom, result;
			
			if(elem.nodeType !== 1) {
				return document.query.call(this, selector)
			}
			
			try{ 
				var oldId = elem.id, displayId = oldId;
				if(!oldId){
					elem.id = displayId = '__SELECTOR__';
					oldId = 0;
				}
				result = elem.querySelectorAll('#' + displayId +' ' + selector);
			} catch(e) {
				result = query(selector, this);
			} finally {
				if(oldId === 0){
					elem.id = null;	
				}
			}
			
			
			
			return new DomList(result);
		},
			
		// 偏移父位置。
		getOffsetParent: function() {
			var me = this.dom;
			while(( me = me.offsetParent) && !rBody.test(me.nodeName) && styleString(me, "position") === "static");
			return new Dom(me || getDocument(this.dom).body);
		},
	 
		/**
		 * 在某个位置插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @param {String} [where] 插入地点。 beforeBegin 节点外 beforeEnd 节点里
		 *            afterBegin 节点外 afterEnd 节点里
		 * @return {Element} 插入的节点。
		 */
		insert: function(where, html) {
		
			assert(' afterEnd beforeBegin afterBegin beforeEnd '.indexOf(' ' + where + ' ') >= 0, "Control.prototype.insert(where, html): {where} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", where);
		
			var me = this,
				parentControl = me,
				refChild = me;
				
			html = Dom.parse(html, me.dom);
		
			switch (where) {
				case "afterEnd":
					refChild = me.getNext(true);
				
					// 继续。
				case "beforeBegin":
					parentControl = me.getParent();
					assert(parentControl, "Control.prototype.insert(where, html): 节点无父节点时无法执行 insert({where})。", where);
					break;
				case "afterBegin":
					refChild = me.getFirst(true);
					break;
				default:
					refChild = null;
					break;
			}
		
			parentControl.insertBefore(html, refChild);
			return html;
		},
	
		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function(html) {
			html = Dom.parse(html, this);
			this.insertBefore(html, null);
			return html;
		},
		
		/**
		 * 将一个节点用另一个节点替换。
		 * @param {Element/String} html 内容。
		 * @return {Element} 替换之后的新元素。
		 */
		replaceWith: function(html) {
			var elem;
			html = Dom.parse(html, this.dom);
			if (elem = this.getParent()) {
				elem.insertBefore(html, this);
				elem.removeChild(this);
			}
			
			return html;
		},
	
		/**
		 * 创建并返回控件的副本。
		 * @param {Boolean} cloneEvent=false 是否复制事件。
		 * @param {Boolean} contents=true 是否复制子元素。
		 * @param {Boolean} keepId=false 是否复制 id 。
		 * @return {Control} 新的控件。
		 */
		clone: function(cloneEvent, contents, keepId) {
		
			var elem = this.dom,
				clone = elem.cloneNode(contents = contents !== false);
			
			if(elem.nodeType === 1){
				if (contents) 
					for (var elemChild = elem.getElementsByTagName('*'), cloneChild = clone.getElementsByTagName('*'), i = 0; cloneChild[i]; i++) 
						cleanClone(elemChild[i], cloneChild[i], cloneEvent, keepId);
			
				cleanClone(elem, clone, cloneEvent, keepId);
			}
		
			return this.constructor === Control ? new Dom(clone) : new this.constructor(clone);
		}
	 
	}, 3)

	.implement({
		
		match: function (selector) {
			return Dom.match(this.dom, selector);
		},
		
		isHidden: function(){
			return Dom.isHidden(this.dom) || styleString(this.dom, 'visibility') !== 'hidden';
		},
		
		/**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @param {Element} control 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: function(control) {
			var elem = this.dom;
			control = Dom.getNode(control);
			assert.notNull(control, "Control.prototype.contains(control):{control} ~");
			return control == elem || Dom.hasChild(elem, control);
		},
		
		/**
		 * 判断一个节点是否有子节点。
		 * @param {Element} [control] 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		hasChild: function(control) {
			return control ? Dom.hasChild(this.dom, Dom.getNode(control)): !Dom.isEmpty(this.dom);
		}
		
	}, 4);
	
	/**
	 * @class Document
	 */
	Dom.Document.implement({
		
		/**
		 * 插入一个HTML 。
		 * @param {String/Control} html 内容。
		 * @return {Element} 元素。
		 */
		append: function(html) {
			return new Dom(this.body).append(html);
		},
		
		/**
		 * 插入一个HTML 。
		 * @param {String/Control} html 内容。
		 * @return {Element} 元素。
		 */
		insert: function(where, html) {
			return new Dom(this.body).insert(where, html);
		},
		
		/**
		 * 插入一个HTML 。
		 * @param {String/Control} html 内容。
		 * @return {Element} 元素。
		 */
		remove: function() {
			var body = new Dom(this.body);
			body.remove.apply(body, arguments);
			return this;
		},
		
		find: function(selector){
			assert.isString(selector, "Control.prototype.find(selector): selector ~。");
			var result;
			try{
				result = this.querySelector(selector);
			} catch(e) {
				result = query(selector, this)[0];
			}
			return result ? new Dom(result) : null;
		},
		
		/**
		 * 执行选择器。
		 * @method
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		query: function(selector){
			assert.isString(selector, "Control.prototype.find(selector): selector ~。");
			var result;
			try{
				result = this.querySelectorAll(selector);
			} catch(e) {
				result = query(selector, this);
			}
			return new DomList(result);
		},
		
		// /**
		 // * 根据元素返回节点。
		 // * @param {String} ... 对象的 id 或对象。
		 // * @return {DomList} 如果只有1个参数，返回元素，否则返回元素集合。
		 // */
		// getDom: function(id) {
			// return typeof id == "string" ? this.getElementById(id): id;
		// },
// 		
		// /**
		 // * 根据元素返回封装后的控件。
		 // * @param {String} ... 对象的 id 或对象。
		 // * @return {DomList} 如果只有1个参数，返回元素，否则返回元素集合。
		 // */
		// getControl: function() {
			// return arguments.length === 1 ? new Dom(this.getDom(arguments[0])): new DomList(o.update(arguments, this.getDom, null, this));
		// },
		
		/**
		 * 获取元素可视区域大小。包括 padding 和 border 大小。
		 * @method getSize
		 * @return {Point} 位置。
		 */
		getSize: function() {
			var doc = this.dom;

			return new Point(doc.clientWidth, doc.clientHeight);
		},
		
		/**
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
		getScrollSize: function() {
			var html = this.dom, min = this.getSize(), body = this.body;

			return new Point(Math.max(html.scrollWidth, body.scrollWidth, min.x), Math.max(html.scrollHeight, body.scrollHeight, min.y));
		},

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
		
		xType: 'control',

		/**
		 * 滚到。
		 * @method setScroll
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Document} this 。
		 */
		setScroll: function(x, y) {
			var doc = this, p = formatPoint(x, y);
			if(p.x == null)
				p.x = doc.getScroll().x;
			if(p.y == null)
				p.y = doc.getScroll().y;
			(doc.defaultView || doc.parentWindow).scrollTo(p.x, p.y);

			return doc;
		}
		
	});

	// 变量初始化。

	Control.delegate(Control, 'dom', 'scrollIntoView focus blur select click submit reset');

	map("push shift unshift pop include indexOf each forEach", ap, DomList.prototype);
	DomList.prototype.insertItem = ap.insert;
	DomList.prototype.removeItem = ap.remove;

	map("filter slice splice reverse unique", function(func) {
		return function() {
			return new DomList(ap[func].apply(this, arguments));
		};
	}, DomList.prototype);
	
	Dom.prototype = Control.prototype;

	document.dom = document.documentElement;
		
	// 初始化 wrapMap
	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	// 下列属性应该直接使用。
	map("checked selected disabled value innerHTML textContent className autofocus autoplay async controls hidden loop open required scoped compact nowrap ismap declare noshade multiple noresize defer readOnly tabIndex defaultValue accessKey defaultChecked cellPadding cellSpacing rowSpan colSpan frameBorder maxLength useMap contentEditable", function(value) {
		attributes[value.toLowerCase()] = attributes[value] = value;
	});
	
	textField.INPUT = textField.SELECT = textField.TEXTAREA = 'value';
	
	textField['#text'] = textField['#comment'] = 'nodeValue';
	
	p.namespace("JPlus.Events.control");

	/**
	 * @type Function
	 */
	var initUIEvent,

		/**
		 * @type Function
		 */
		initMouseEvent,

		/**
		 * @type Function
		 */
		initKeyboardEvent,
		
		pep = Dom.Event.prototype,

		/**
		 * 默认事件。
		 * @type Object
		 * @hide
		 */
		eventObj = {
	
			/**
			 * 创建当前事件可用的参数。
			 * @param {Control} ctrl 事件所有者。
			 * @param {Event} e 事件参数。
			 * @param {Object} target 事件目标。
			 * @return {Event} e 事件参数。
			 */
			trigger: function(ctrl, type, fn, e) {
				ctrl = ctrl.dom;
				
				// IE 8- 在处理原生事件时肯能出现错误。
				try{
					if(!e.type){
						e = new Dom.Event(ctrl, type, e);
					}
				}catch(ex){
					e = new Dom.Event(ctrl, type);
				}
				return fn(e) && (!ctrl[ type = 'on' + type] || ctrl[type](e) !== false);
			},
			
			/**
			 * 添加绑定事件。
			 * @param {Control} ctrl 事件所有者。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 */
			add: div.addEventListener ? function(ctrl, type, fn) {
				ctrl.dom.addEventListener(type, fn, false);
			}: function(ctrl, type, fn) {
				ctrl.dom.attachEvent('on' + type, fn);
			},
			
			/**
			 * 删除事件。
			 * @param {Object} elem 对象。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 */
			remove: div.removeEventListener ? function(ctrl, type, fn) {
				ctrl.dom.removeEventListener(type, fn, false);
			}: function(ctrl, type, fn) {
				ctrl.dom.detachEvent('on' + type, fn);
			}
			
		},
		
		/**
		 * 浏览器使用的真实的 DOMContentLoaded 事件名字。
		 * @type String
		 */
		domReady;

	/// #if CompactMode

	if(isStandard) {

	/// #endif
		
		map('stop getTarget', pep, window.Event.prototype);
		initMouseEvent = initKeyboardEvent = initUIEvent = Function.empty;
		domReady = 'DOMContentLoaded';

	/// #if CompactMode
	} else {

		if(!('opacity' in div.style)) {
			styles.opacity = 'setOpacity';
		}
			
		initUIEvent = function(e) {
			if(!e.stop) {
				e.target = e.srcElement;
				e.stop = pep.stop;
				e.getTarget = pep.getTarget;
				e.stopPropagation = pep.stopPropagation;
				e.preventDefault = pep.preventDefault;
			}
		};
		
		// mouseEvent
		initMouseEvent = function(e) {
			if(!e.stop) {
				initUIEvent(e);
				e.relatedTarget = e.fromElement === e.target ? e.toElement: e.fromElement;
				var dom = getDocument(e.target).dom;
				e.pageX = e.clientX + dom.scrollLeft;
				e.pageY = e.clientY + dom.scrollTop;
				e.layerX = e.x;
				e.layerY = e.y;
				// 1 ： 单击 2 ： 中键点击 3 ： 右击
				e.which = (e.button & 1 ? 1: (e.button & 2 ? 3: (e.button & 4 ? 2: 0)));

			}
		};
		
		// keyEvents
		initKeyboardEvent = function(e) {
			if(!e.stop) {
				initUIEvent(e);
				e.which = e.keyCode;
			}
		};
		
		domReady = 'readystatechange';
		
		Dom.properties.OBJECT = 'outerHTML';

		attributes.style = {

			get: function(elem, name) {
				return elem.style.cssText.toLowerCase();
			},
			set: function(elem, name, value) {
				elem.style.cssText = value;
			}
		};

		if(navigator.isQuirks) {

			attributes.value = {

				node: function(elem, name) {
					assert(elem.getAttributeNode, "Control.prototype.getAttr(name, type): 当前元素不存在 getAttributeNode 方法");
					return elem.tagName === 'BUTTON' ? elem.getAttributeNode(name) || {
						value: ''
					}: elem;
				},
				
				get: function(elem, name) {
					return this.node(elem, name).value;
				},
				
				set: function(elem, name, value) {
					this.node(elem, name).value = value || '';
				}
			};

			attributes.href = attributes.src = attributes.usemap = {

				get: function(elem, name) {
					return elem.getAttribute(name, 2);
				},

				set: function(elem, name, value) {
					elem.setAttribute(name, value);
				}
			};
	
			try {
	
				// 修复IE6 因 css 改变背景图出现的闪烁。
				document.execCommand("BackgroundImageCache", false, true);
			} catch(e) {
	
			}

		}

	}
	
	/// #endif

	Control.addEvents
		("mousewheel blur focus focusin focusout scroll change select submit resize error load unload touchstart touchmove touchend hashchange", initUIEvent)
		("click dblclick DOMMouseScroll mousedown mouseup mouseover mouseenter mousemove mouseleave mouseout contextmenu selectstart selectend", initMouseEvent)
		("keydown keypress keyup", initKeyboardEvent);

	if(navigator.isFirefox)
		Control.addEvents('mousewheel', 'DOMMouseScroll');

	if(!navigator.isIE)
		Control.addEvents
			('mouseenter', 'mouseover', checkMouseEnter)
			('mouseleave', 'mouseout', checkMouseEnter);
	
	Control.implement(String.map('on un one trigger', Dom.prototype, {}));

	map('on un trigger', function (name) {
		Dom.Document.prototype[name] = function(){
			var doc = new Dom(this);
			doc[name].apply(doc, arguments);
			return this;
		};
	});
	
	/**
	 * 页面加载时执行。
	 * @param {Functon} fn 执行的函数。
	 * @member document.onReady
	 */

	/**
	 * 在文档载入的时候执行函数。
	 * @param {Functon} fn 执行的函数。
	 * @member document.onLoad
	 */


	map('ready load', function(readyOrLoad, isLoad) {

		var isReadyOrIsLoad = isLoad ? 'isReady': 'isLoaded';

		// 设置 ready load
		Dom[readyOrLoad] = function(fn, bind) {

			// 忽略参数不是函数的调用。
			if(!Function.isFunction(fn))
				fn = 0;

			// 如果已载入，则直接执行参数。
			if(Dom[isReadyOrIsLoad]) {

				if(fn)
					fn.call(bind, Dom.get);

				// 如果参数是函数。
			} else if(fn) {

				document.on(readyOrLoad, fn, bind);

				// 触发事件。
				// 如果存在 JS 之后的 CSS 文件， 肯能导致 document.body 为空，此时延时执行 DomReady
			} else if(document.body) {

				// 如果 isReady, 则删除
				if(isLoad) {

					// 使用系统文档完成事件。
					fn = [window, readyOrLoad];

					// 确保 ready 触发。
					Dom.ready();

				} else {
					fn = [document, domReady];
				}

				eventObj.remove({
					dom: fn[0]
				}, fn[1], arguments.callee);

				// 触发事件。
				if(document.trigger(readyOrLoad, Dom.get)) {

					// 先设置为已经执行。
					Dom[isReadyOrIsLoad] = true;

					// 删除事件。
					document.un(readyOrLoad);

				}
			} else {
				setTimeout(arguments.callee, 1);
			}

			return document;
		};
	});
	
	// 如果readyState 不是 complete, 说明文档正在加载。
	if(document.readyState !== "complete") {

		// 使用系统文档完成事件。
		eventObj.add({dom: document}, domReady, Dom.ready);

		eventObj.add({dom: window}, 'load', Dom.load, false);

		/// #if CompactMode
		
		// 只对 IE 检查。
		if(!isStandard) {

			// 来自 jQuery
			// 如果是 IE 且不是框架
			var topLevel = false;

			try {
				topLevel = window.frameElement == null;
			} catch(e) {
			}

			if(topLevel && document.documentElement.doScroll) {

				/**
				 * 为 IE 检查状态。
				 * @private
				 */
				(function() {
					if(Dom.isReady) {
						return;
					}

					try {
						// http:// javascript.nwbox.com/IEContentLoaded/
						document.documentElement.doScroll("left");
					} catch(e) {
						setTimeout(arguments.callee, 1);
						return;
					}

					Dom.ready();
				})();
			}
		}

		/// #endif
	} else {
		setTimeout(Dom.load, 1);
	}
	
	Point.format = formatPoint;
	
	div = null;

	apply(window, {

		Dom: Dom,

		Control: Control,

		Point: Point,
		
		DomList: DomList

	});

	Object.extendIf(window, {
		$$: Dom.get,
		$: Dom.query
	});
	
	/**
	 * @class
	 */

	/**
	 * Dom 对象的封装。
	 * @param {Node} dom 封装的元素。
	 */
	function Dom(dom) {
		this.dom = dom;
	}

	/**
	 * 获取元素的文档。
	 * @param {Node} elem 元素。
	 * @return {Document} 文档。
	 */
	function getDocument(elem) {
		assert(elem && (elem.nodeType || elem.setInterval), 'Dom.getDocument(elem): {elem} 必须是节点。', elem);
		return elem.ownerDocument || elem.document || elem;
	}

	/**
	 * 返回简单的遍历函数。
	 * @param {Boolean} getFirst 返回第一个还是返回所有元素。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
	function createTreeWalker(getFirst, next, first) {
		first = first || next;
		return getFirst ? function(args) {
			var node = this.dom[first];
			
			// 如果参数为空，则表示仅仅获取第一个节点，加速本函数的执行。
			if(args == null) {
				while(node) {
					if(node.nodeType === 1)
						return new Dom(node);
					node = node[next];
				}
			} else {
				args = getFilter(args);
				while(node) {
					if(args.call(this.dom, node))
						return new Dom(node);
					node = node[next];
				}
			}
			
			return null;
		}: function(args) {
			args = getFilter(args);
			var node = this.dom[first], r = new DomList;
			while(node) {
				if(args.call(this.dom, node))
					r.push(node);
				node = node[next];
			}
			return r;
		};
	}
	
	/**
	 * 获取一个选择器。
	 * @param {Number/Function/String/Boolean} args 参数。
	 * @return {Funtion} 函数。
	 */
	function getFilter(args) {
		
		// 如果存在 args，则根据不同的类型返回不同的检查函数。
		if(args){
			switch (typeof args) {
				
				// 数字返回一个计数器函数。
				case 'number':
					return function(elem) {
						return elem.nodeType === 1 && --args < 0;
					};
					
				// 字符串，表示选择器。
				case 'string':
					if(/^(?:[-\w:]|[^\x00-\xa0]|\\.)+$/.test(args)) {
						args = args.toUpperCase();
						return function(elem) {
							return elem.nodeType === 1 && elem.tagName === args;
						};
					}
					return args === '*' ? isElement : function(elem) {
						return elem.nodeType === 1 && Dom.match(elem, args);
					};
					
				// 布尔类型，而且是 true, 返回 Function.returnTrue，  表示不过滤。
				case 'boolean':
					return Function.returnTrue;
				
			}
	
			assert.isFunction(args, "Control.prototype.getXXX(args): {args} 必须是一个函数、空、数字或字符串。", args);
			
		} else {
			
			// 默认返回只判断节点的函数。
			args = isElement;
		}
		return args;
	}
	
	/**
	 * 判断一个节点是否为元素。
	 */
	function isElement(elem){
		return elem.nodeType === 1;
	}

	/**
	 * 判断发生事件的元素是否在当前鼠标所在的节点内。
	 * @param {Event} e 事件对象。
	 * @return {Boolean} 返回是否应该触发 mouseenter。
	 */
	function checkMouseEnter(e) {

		return this !== e.relatedTarget && !Dom.hasChild(this.dom, e.relatedTarget);
	}
	
	/**
	 * 删除由于拷贝导致的杂项。
	 * @param {Element} srcElem 源元素。
	 * @param {Element} destElem 目的元素。
	 * @param {Boolean} cloneEvent=true 是否复制数据。
	 * @param {Boolean} keepId=false 是否留下ID。
	 */
	function cleanClone(srcElem, destElem, cloneEvent, keepId) {

		if(!keepId && destElem.removeAttribute)
			destElem.removeAttribute('id');

		/// #if CompactMode
		
		if(destElem.clearAttributes) {

			// IE 会复制 自定义事件， 清楚它。
			destElem.clearAttributes();
			destElem.mergeAttributes(srcElem);
			p.removeData(destElem);

			if(srcElem.options)
				o.update(srcElem.options, 'selected', destElem.options, true);
		}

		/// #endif

		if(cloneEvent !== false) {
			
		    // event 作为系统内部对象。事件的拷贝必须重新进行 on 绑定。
		    var event = p.getData(srcElem, 'event'), dest;

		    if (event) {
		    	dest = new Dom(destElem);
			    for (cloneEvent in event)

				    // 对每种事件。
				    event[cloneEvent].handlers.forEach(function(handler) {

					    // 如果源数据的 target 是 src， 则改 dest 。
					    dest.on(cloneEvent, handler[0], handler[1].dom === srcElem ? dest : handler[1]);
				    });
			}
			
		}

		// 特殊属性复制。
		if( keepId = Dom.properties[srcElem.tagName])
			destElem[keepId] = srcElem[keepId];
	}

	/**
	 * 清除节点的引用。
	 * @param {Element} elem 要清除的元素。
	 */
	function clean(elem) {

		// 删除自定义属性。
		if(elem.clearAttributes)
			elem.clearAttributes();

		// 删除事件。
		new Dom(elem).un();

		// 删除句柄，以删除双重的引用。
		p.removeData(elem);

	}

	/**
	 * 到骆驼模式。
	 * @param {String} all 全部匹配的内容。
	 * @param {String} match 匹配的内容。
	 * @return {String} 返回的内容。
	 */
	function formatStyle(all, match) {
		return match ? match.toUpperCase(): styleFloat;
	}

	/**
	 * 读取样式字符串。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。
	 * @return {String} 字符串。
	 */
	function styleString(elem, name) {
		assert.isElement(elem, "Dom.styleString(elem, name): {elem} ~");
		return elem.style[name] || getStyle(elem, name);
	}

	/**
	 * 读取样式数字。
	 * @param {Object} elem 元素。
	 * @param {Object} name 属性名。
	 * @return {Number} 数字。
	 */
	function styleNumber(elem, name) {
		assert.isElement(elem, "Dom.styleNumber(elem, name): {elem} ~");
		var value = parseFloat(elem.style[name]);
		if(!value && value !== 0) {
			value = parseFloat(getStyle(elem, name));

			if(!value && value !== 0) {
				if( name in styles) {
					var style = Dom.getStyles(elem, Dom.display);
					Dom.setStyles(elem, Dom.display);
					value = parseFloat(getStyle(elem, name)) || 0;
					Dom.setStyles(elem, style);
				} else {
					value = 0;
				}
			}
		}

		return value;
	}

	/**
	 * 转换参数为标准点。
	 * @param {Number} x X坐标。
	 * @param {Number} y Y坐标。
	 * @return {Object} {x:v, y:v}
	 */
	function formatPoint(x, y) {
		return x && typeof x === 'object' ? x: {
			x: x,
			y: y
		};
	}

	/// #region Selector
	
	function throwError(string) {
		throw new SyntaxError('An invalid or illegal string was specified : "' + string + '"!');
	}

	function match(dom, selector){
		var r, i = -1;
		try{
			r = dom.parentNode.querySelectorAll(selector);
		} catch(e){
			r = query(selector, new Dom(dom.parentNode));
		}
		
		while(r[++i])
			if(r[i] === dom)
				return true;
		
		return false;
	}

	/**
	 * 使用指定的选择器代码对指定的结果集进行一次查找。
	 * @param {String} selector 选择器表达式。
	 * @param {DomList/Control} result 上级结果集，将对此结果集进行查找。
	 * @return {DomList} 返回新的结果集。
	 */
	function query(selector, result) {

		var prevResult = result, rBackslash = /\\/g, m, key, value, lastSelector, filterData;
		
		selector = selector.trim();

		// 解析分很多步进行，每次解析  selector 的一部分，直到解析完整个 selector 。
		while(selector) {
			
			// 保存本次处理前的选择器。
			// 用于在本次处理后检验 selector 是否有变化。
			// 如果没变化，说明 selector 不能被正确处理，即 selector 包含非法字符。
			lastSelector = selector;
			
			// 解析的第一步: 解析简单选择器
			
			// ‘*’ ‘tagName’ ‘.className’ ‘#id’
			if( m = /^(^|[#.])((?:[-\w\*]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {
				
				// 测试是否可以加速处理。
				if(!m[1] || (result[m[1] === '#' ? 'getElementById' : 'getElementsByClassName'])) {
					selector = RegExp.rightContext;
					switch(m[1]) {
						
						// ‘#id’
						case '#':
							result = result.getElementById(m[2]);
							result = new DomList(result && result.id === m[2] ? [result] : []);
							break;
							
						// ‘.className’
						case '.':
							result = new DomList(result.getElementsByClassName(m[2]));
							break;
							
						// ‘*’ ‘tagName’
						default:
							result = result.getAll(m[2].replace(rBackslash, ""));
							break;
								
					}
					
					// 如果仅仅为简单的 #id .className tagName 直接返回。
					if(!selector)
						break;
					
				// 无法加速，等待第四步进行过滤。
				} else {
					result = result.getAll();
				}
			
			// 解析的第二步: 解析父子关系操作符(比如子节点筛选)
			
			// ‘a>b’ ‘a+b’ ‘a~b’ ‘a b’ ‘a *’
			} else if(m = /^\s*([\s>+~])\s*(\*|(?:[-\w*]|[^\x00-\xa0]|\\.)*)/.exec(selector)) {
				selector = RegExp.rightContext;
				result = result[Dom.combinators[m[1]] || throwError(m[1])](m[2].replace(rBackslash, ""));

				// ‘a>b’: m = ['>', 'b']
				// ‘a>.b’: m = ['>', '']
				// result 始终实现了 IDom 接口，所以保证有 Dom.combinators 内的方法。

			// 解析的第三步: 解析剩余的选择器:获取所有子节点。第四步再一一筛选。
			} else {
				result = result.getAll();
			}
			
			// 解析的第四步: 筛选以上三步返回的结果。
	
			// ‘#id’ ‘.className’ ‘:filter’ ‘[attr’
			while(m = /^([#\.:]|\[\s*)((?:[-\w]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {
				selector = RegExp.rightContext;
				value = m[2].replace(rBackslash, "");
				
				// ‘#id’: m = ['#','id']
				
				// 筛选的第一步: 分析筛选器。
	
				switch (m[1]) {
	
					// ‘#id’
					case "#":
						filterData = ["id", "=", value];
						break;
	
					// ‘.className’
					case ".":
						filterData = ["class", "~=", value];
						break;
	
					// ‘:filter’
					case ":":
						filterData = Dom.pseudos[value] || throwError(value);
						args = undefined;
	
						// ‘selector:nth-child(2)’
						if( m = /^\(\s*("([^"]*)"|'([^']*)'|[^\(\)]*(\([^\(\)]*\))?)\s*\)/.exec(selector)) {
							selector = RegExp.rightContext;
							args = m[3] || m[2] || m[1];
						}
						
						
						break;
	
					// ‘[attr’
					default:
						filterData = [value.toLowerCase()];
						
						// ‘selector[attr]’ ‘selector[attr=value]’ ‘selector[attr='value']’  ‘selector[attr="value"]’    ‘selector[attr_=value]’
						if( m = /^\s*(?:(\S?=)\s*(?:(['"])(.*?)\2|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/.exec(selector)) {
							selector = RegExp.rightContext;
							if(m[1]) {
								filterData[1] = m[1];
								filterData[2] = m[3] || m[4];
								filterData[2] = filterData[2] ? filterData[2].replace(/\\([0-9a-fA-F]{2,2})/g, toHex).replace(rBackslash, "") : "";
							}
						}
						break;
				}
		
				var args, 
					oldResult = result,
					i = 0,
					elem;
				
				// 筛选的第二步: 生成新的集合，并放入满足的节点。
				
				result = new DomList();
				if(filterData.call) {
					
					// 仅有 2 个参数则传入 oldResult 和 result
					if(filterData.length === 3){
						filterData(args, oldResult, result);
					} else {
						while(elem = oldResult[i++]) {
							if(filterData(elem, args))
								result.push(elem);
						}
					}
				} else {
					while(elem = oldResult[i++]){
						var actucalVal = Dom.getAttr(elem, filterData[0]),
							expectedVal = filterData[2],
							tmpResult;
						switch(filterData[1]){
							case undefined:
								tmpResult = actucalVal != null;
								break;
							case '=':
								tmpResult = actucalVal === expectedVal;
								break;
							case '~=':
								tmpResult = (' ' + actucalVal + ' ').indexOf(' ' + expectedVal + ' ') >= 0;
								break;
							case '!=':
								tmpResult = actucalVal !== expectedVal;
								break;
							case '|=':
								tmpResult = ('-' + actucalVal + '-').indexOf('-' + expectedVal + '-') >= 0;
								break;
							case '^=':
								tmpResult = actucalVal && actucalVal.indexOf(expectedVal) === 0;
								break;
							case '$=':
								tmpResult = actucalVal && actucalVal.substr(actucalVal.length - expectedVal.length) === expectedVal;
								break;
							case '*=':
								tmpResult = actucalVal && actucalVal.indexOf(expectedVal) >= 0;
								break;
							default:
								throw 'Not Support Operator : "' + filterData[1] + '"'
						}
						
						if(tmpResult){
							result.push(elem);	
						}
					}
				}
			}
			
			// 最后解析 , 如果存在，则继续。

			if( m = /^\s*,\s*/.exec(selector)) {
				selector = RegExp.rightContext;
				return result.concat(query(selector, prevResult));
			}


			if(lastSelector.length === selector.length){
				throwError(selector);
			}
		}
		
		return result;
	}
	
	function toHex(x, y) {
		return String.fromCharCode(parseInt(y, 16));
	}

	/// #endregion
	
})(this);
/************************************
 * System.Fx.Base
 ************************************/
var Fx = Fx || {};

/**
 * 实现特效。
 * @class Fx.Base
 * @abstract
 */
Fx.Base = (function(){
	
	
	/// #region interval
	
	var cache = {};
	
	/**
	 * 定时执行的函数。
	 */
	function interval(){
		var i = this.length;
		while(--i >= 0)
			this[i].step();
	}
	
	/// #endregion
		
	/**
	 * @namespace Fx
	 */
	return Class({
	
		/**
		 * 每秒的运行帧次。
		 * @type {Number}
		 */
		fps: 50,
		
		/**
		 * 总运行时间。 (单位:  毫秒)
		 * @type {Number}
		 */
		duration: 500,
		
		/**
		 * 在特效运行时，第二个特效的执行方式。 可以为 'ignore' 'cancel' 'wait' 'restart' 'replace'
		 * @type {String}
		 */
		link: 'ignore',
		
		/**
		 * xType
		 * @type {String}
		 */
		xType: 'fx',
		
		/**
		 * 初始化当前特效。
		 * @param {Object} options 选项。
		 */
		constructor: function() {
			this._competeListeners = [];
		},
		
		/**
		 * 实现变化。
		 * @param {Object} p 值。
		 * @return {Object} p 变化值。
		 */
		transition: function(p) {
			return -(Math.cos(Math.PI * p) - 1) / 2;
		},
		
		/**
		 * 当被子类重写时，实现生成当前变化所进行的初始状态。
		 * @param {Object} from 开始位置。
		 * @param {Object} to 结束位置。
		 * @return {Base} this
		 */
		compile: function(from, to) {
			var me = this;
			me.from = from;
			me.to = to;
			return me;
		},
		
		/**
		 * 进入变换的下步。
		 */
		step: function() {
			var me = this, time = Date.now() - me.time;
			if (time < me.duration) {
				me.set(me.transition(time / me.duration));
			}  else {
				me.set(1);
				me.complete();
			}
		},
		
		/**
		 * @event step 当进度改变时触发。
		 * @param {Number} value 当前进度值。
		 */
		
		/**
		 * 根据指定变化量设置值。
		 * @param {Number} delta 变化量。 0 - 1 。
		 * @abstract
		 */
		set: function(value){
			this.trigger('step', Fx.compute(this.from, this.to, value));
		},
		
		/**
		 * 增加完成后的回调工具。
		 * @param {Function} fn 回调函数。
		 */
		ready: function(fn){
			assert.isFunction(fn, "Fx.Base.prototype.ready(fn): 参数 {fn} ~。    ");
			this._competeListeners.unshift(fn);	
			return this;
		},
		
		/**
		 * 检查当前的运行状态。
		 * @param {Object} from 开始位置。
		 * @param {Object} to 结束位置。
		 * @param {Number} duration=-1 变化的时间。
		 * @param {Function} [onStop] 停止回调。
		 * @param {Function} [onStart] 开始回调。
		 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 reset 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。 replace 直接替换成新的渐变。
		 * @return {Boolean} 是否可发。
		 */
		delay: function() {
			var me = this, args = arguments;
			
			//如正在运行。
			if(me.timer){
				switch (args[5] || me.link) {
					
					// 链式。
					case 'wait':
						this._competeListeners.unshift(function() {
							
							this.start.apply(this, args);
							return false;
						});
						
						//  如当前fx完成， 会执行 _competeListeners 。
						
						//  [新任务开始2, 新任务开始1]
						
						//  [新任务开始2, 回调函数] 
						
						//  [新任务开始2]
						
						//  []
						
						return false;
						
					case 'reset':
						me.pause();
						while(me._competeListeners.pop());
						break;
						
					// 停掉目前项。
					case 'cancel':
						me.stop();
						break;
						
					case 'replace':
						me.pause();
						break;
						
					// 忽视新项。
					default:
						return false;
				}
			}
			
			return true;
		},
		
		/**
		 * 开始运行特效。
		 * @param {Object} from 开始位置。
		 * @param {Object} to 结束位置。
		 * @param {Number} duration=-1 变化的时间。
		 * @param {Function} [onStop] 停止回调。
		 * @param {Function} [onStart] 开始回调。
		 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
		 * @return {Base} this
		 */
		start: function() {
			var me = this, args = arguments;
			
			if (!me.timer || me.delay.apply(me, args)) {
				
				// 如果 duration > 0  更新。
				if (args[2] > 0) this.duration = args[2];
				else if(args[2] < -1) this.duration /= -args[2];
				
				// 存储 onStop
				if (args[3]) {
					assert.isFunction(args[3], "Fx.Base.prototype.start(from, to, duration, onStop, onStart, link): 参数 {callback} ~。      ");
					me._competeListeners.push(args[3]);
				}
				
				// 执行 onStart
				if (args[4] && args[4].apply(me, args) === false) {
					return me.complete();
				}
			
				// 设置时间
				me.time = 0;
				
				me.compile(args[0], args[1]).set(0);
				me.resume();
			}
			return me;
		},
		
		/**
		 * 完成当前效果。
		 */
		complete: function() {
			var me = this;
			me.pause();
			var handlers = me._competeListeners;
			while(handlers.length)  {
				if(handlers.pop().call(me) === false)
					return me;
			}
			
			return me;
		},
		
		/**
		 * 中断当前效果。
		 */
		stop: function() {
			var me = this;
			me.set(1);
			me.pause();
			return me;
		},
		
		/**
		 * 暂停当前效果。
		 */
		pause: function() {
			var me = this;
			if (me.timer) {
				me.time = Date.now() - me.time;
				var fps = me.fps, value = cache[fps];
				value.remove(me);
				if (value.length === 0) {
					clearInterval(me.timer);
					delete cache[fps];
				}
				me.timer = undefined;
			}
			return me;
		},
		
		/**
		 * 恢复当前效果。
		 */
		resume: function() {
			var me = this;
			if (!me.timer) {
				me.time = Date.now() - me.time;
				var fps = me.fps, value = cache[fps];
				if(value){
					value.push(me);
					me.timer = value[0].timer;
				}else{
					me.timer = setInterval(Function.bind(interval, cache[fps] = [me]), Math.round(1000 / fps ));
				}
			}
			return me;
		}
		
	});
	

})();

/**
 * 常用计算。
 * @param {Object} from 开始。
 * @param {Object} to 结束。
 * @param {Object} delta 变化。
 */
Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};
/************************************
 * System.Fx.Animate
 ************************************/
(function(p){
	
	
	/// #region 字符串扩展
	
	/**
	 * 表示 十六进制颜色。
	 * @type RegExp
	 */
	var rhex = /^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})$/i,
	
		/**
		 * 表示 RGB 颜色。
		 * @type RegExp
		 */
		rRgb = /(\d+),\s*(\d+),\s*(\d+)/;
	
	/**
	 * @namespace String
	 */
	Object.extend(String, {
		
		/**
		 * 把十六进制颜色转为 RGB 数组。
		 * @param {String} hex 十六进制色。
		 * @return {Array} rgb RGB 数组。
		 */
		hexToArray: function(hex){
			assert.isString(hex, "String.hexToArray(hex): 参数 {hex} ~。");
			if(hex == 'transparent')
				return [255, 255, 255];
			var m = hex.match(rhex);
			if(!m)return null;
			var i = 0, r = [];
			while (++i <= 3) {
				var bit = m[i];
				r.push(parseInt(bit.length == 1 ? bit + bit : bit, 16));
			}
			return r;
		},
		
		/**
		 * 把 RGB 数组转为数组颜色。
		 * @param {Array} rgb RGB 数组。
		 * @return {Array} rgb RGB 数组。
		 */
		rgbToArray: function(rgb){
			assert.isString(rgb, "String.rgbToArray(rgb): 参数 {rgb} ~。");
			var m = rgb.match(rRgb);
			if(!m) return null;
			var i = 0, r = [];
			while (++i <= 3) {
				r.push(parseInt(m[i]));
			}
			return r;
		},
		
		/**
		 * 把 RGB 数组转为十六进制色。
		 * @param {Array} rgb RGB 数组。
		 * @return {String} hex 十六进制色。
		 */
		arrayToHex: function(rgb){
			assert.isArray(rgb, "String.arrayToHex(rgb): 参数 {rgb} ~。");
			var i = -1, r = [];
			while(++i < 3) {
				var bit = rgb[i].toString(16);
				r.push((bit.length == 1) ? '0' + bit : bit);
			}
			return '#' + r.join('');
		}
	});
	
	/// #endregion
	
	/**
	 * compute 简写。
	 * @param {Object} from 从。
	 * @param {Object} to 到。
	 * @param {Object} delta 变化。
	 * @return {Object} 结果。
	 */
	var c = Fx.compute,
	
		Dom = window.Dom,
		
		/**
		 * 缓存已解析的属性名。
		 */
		cache = {
			opacity: {
				set: function(target, name, from, to, delta){
					target.setOpacity(c(from, to, delta));
				},
				parse: self,
				get: function(target){
					return target.getOpacity();
				}
			},
			
			scrollTop:{
				set: function (target, name, from, to, delta) {
					target.setScroll(null, c(from, to, delta));
				},
				parse: self,
				get: function(target){
					return target.getScroll().y;
				}
			},
			
			scrollLeft:{
				set: function (target, name, from, to, delta) {
					target.setScroll(c(from, to, delta));
				},
				parse: self,
				get: function(target){
					return target.getScroll().x;
				}
			}
			
		},
	
		/**
		 * @class Animate
		 * @extends Fx.Base
		 */
		Animate = Fx.Animate = Fx.Base.extend({
			
			/**
			 * 当前绑定的节点。
			 * @type Control
			 * @protected
			 */
			target: null,
			
			/**
			 * 当前的状态存储。
			 * @type Object
			 * @protected
			 */
			current: null,
			
			/**
			 * 链接方式。
			 * @type String
			 */
			link: "wait",
			
			/**
			 * 初始化当前特效。
			 * @param {Object} options 选项。
			 * @param {Object} key 键。
			 * @param {Number} duration 变化时间。
			 */
			constructor: function(target){
				this.target = target;
				
				this._competeListeners = [];
			},
			
			/**
			 * 根据指定变化量设置值。
			 * @param {Number} delta 变化量。 0 - 1 。
			 * @override
			 */
			set: function(delta){
				var me = this,
					key,
					target = me.target,
					value;
				for(key in me.current){
					value = me.current[key];
					value.parser.set(target, key, value.from, value.to, delta);
				}
			},
			
			/**
			 * 生成当前变化所进行的初始状态。
			 * @param {Object} from 开始。
			 * @param {Object} to 结束。
			 */
			compile: function(from, to){
				assert.notNull(from, "Fx.Animate.prototype.start(from, to, duration, callback, link): 参数 {from} ~。");
				assert.notNull(to, "Fx.Animate.prototype.start(from, to, duration, callback, link): 参数 {to} ~。");
					
				// 对每个设置属性
				var me = this,
					key;
				
				// 生成新的 current 对象。
				me.current = {};
				
				for (key in to) {
					
					var parsed = undefined,
						fromValue = from[key],
						toValue = to[key],
						parser = cache[key = key.toCamelCase()];
					
					// 已经编译过，直接使用， 否则找到合适的解析器。
					if (!parser) {
						
						if(key in Dom.styleNumbers) {
							cache[key] = numberParser;
						} else {
							
							// 尝试使用每个转换器
							for (parser in Animate.parsers) {
								
								// 获取转换器
								parser = Animate.parsers[parser];
								parsed = parser.parse(toValue, key);
								
								// 如果转换后结果合格，证明这个转换器符合此属性。
								if (parsed || parsed === 0) {
									// 缓存，下次直接使用。
									cache[key] = parser;
									break;
								}
							}
							
						}
					}
					
					// 找到合适转换器
					if (parser) {
						me.current[key] = {
							from: parser.parse((fromValue ? fromValue === 'auto' : fromValue !== 0) ? parser.get(me.target, key) : fromValue),
							to: parsed === undefined ? parser.parse(toValue, key) : parsed,
							parser: parser
						};
						
						assert(me.current[key].from !== null && me.current[key].to !== null, "Animate.prototype.complie(from, to): 无法正确获取属性 {key} 的值({from} {to})。", key, me.current[key].from, me.current[key].to);
					}
					
				}
				
				return me;
			}
		
		}),
		
		numberParser = {
			set: function(target, name, from, to, delta){
				target.dom.style[name] = c(from, to, delta);
			},
			parse: function(value){
				return typeof value == "number" ? value : parseFloat(value);
			},
			get: function(target, name){
				return Dom.styleNumber(target.dom, name);
			}
		};
	
	Animate.parsers = {
		
		/**
		 * 数字。
		 */
		length: {
			
			set: eval("-[1,]") ? function(target, name, from, to, delta){
				
				target.dom.style[name] = c(from, to, delta) + 'px';
			} : function(target, name, from, to, delta){
				try {
					
					// ie 对某些负属性内容报错
					target.dom.style[name] = c(from, to, delta);
				}catch(e){}
			},
			
			parse: numberParser.parse,
			
			get: numberParser.get
			
		},
		
		/**
		 * 颜色。
		 */
		color: {
			
			set: function set(target, name, from, to, delta){
				target.dom.style[name] = String.arrayToHex([
					Math.round(c(from[0], to[0], delta)),
					Math.round(c(from[1], to[1], delta)),
					Math.round(c(from[2], to[2], delta))
				]);
			},
			
			parse: function(value){
				return String.hexToArray(value) || String.rgbToArray(value);
			},
			
			get: function(target, name){
				return Dom.getStyle(target.dom, name);
			}
	
		}
		
	};
	
	function self(v){
		return v;
	}
	
	/// #region 元素
	
	var height = 'height marginTop paddingTop marginBottom paddingBottom',
		
		maps = Animate.maps = {
			all: height + ' opacity width',
			opacity: 'opacity',
			height: height,
			width: 'width marginLeft paddingLeft marginRight paddingRight'
		},
	
		ep = Dom.prototype,
		show = ep.show,
		hide = ep.hide;
	
	Object.update(maps, function(value){
		return String.map(value, Function.from(0), {});
	});
	
	String.map('left right top bottom', Function.from({$slide: true}), maps);
	
	Control.implement({
		
		/**
		 * 获取和当前节点有关的 Animate 实例。
		 * @return {Animate} 一个 Animate 的实例。
		 */
		fx: function(){
			return p.getData(this, 'fx') || p.setData(this, 'fx', new Fx.Animate(this));
		}
		
	}, 2)
	
	.implement({
		
		/**
		 * 变化到某值。
		 * @param {String/Object} [name] 变化的名字或变化的末值或变化的初值。
		 * @param {Object} value 变化的值或变化的末值。
		 * @param {Number} duration=-1 变化的时间。
		 * @param {Function} [onStop] 停止回调。
		 * @param {Function} [onStart] 开始回调。
		 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
		 * @return this
		 */
		animate: function(){
			var args = arguments, value = args[1];
			if(typeof args[0] === 'string'){
				(args[1] = {})[args[0]] = value;
				args[0] = {};
			} else if(typeof value !== 'object'){
				Array.prototype.unshift.call(args, {});
			}
			
			if (args[2] !== 0) {
				value = this.fx();
				value.start.apply(value, args);
			} else {
				this.set(args[0], args[1]);
				if(args[4]) args[4].call(this);
				if(args[3]) args[3].call(this);
			}
			
			return this;
		},
		
		/**
		 * 显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		show: function(duration, callBack, type){
			var me = this;
			if (duration) {
				var elem = me.dom, savedStyle = {};
		       
				me.fx().start(getAnimate(type),  {}, duration, function(){
					Dom.setStyles(elem, savedStyle);
					
					if(callBack)
						callBack.call(me, true);
				}, function(from, to){
					if(!Dom.isHidden(elem))
						return false;
					Dom.show(elem);
					
					if(from.$slide){
						initSlide(from, elem, type, savedStyle);
					} else {
						savedStyle.overflow = elem.style.overflow;
						elem.style.overflow = 'hidden';
					}
					
					for(var style in from){
						savedStyle[style] = elem.style[style];
						to[style] = Dom.styleNumber(elem, style);
					}
				});
			} else {
				show.apply(me, arguments);
			}
			return me;
		},
		
		/**
		 * 隐藏当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		hide: function(duration, callBack, type){
			var me = this;
			if (duration) {
				var  elem = me.dom || me, savedStyle = {};
				me.fx().start({}, getAnimate(type), duration, function(){  
					Dom.hide(elem);
					Dom.setStyles(elem, savedStyle);
					if(callBack)
						callBack.call(me, false);
				}, function (from, to) {
					if(Dom.isHidden(elem))
						return false;
					if(to.$slide) {
						initSlide(to, elem, type, savedStyle);
					} else {
						savedStyle.overflow = elem.style.overflow;
						elem.style.overflow = 'hidden';
					}
					for(var style in to){
						savedStyle[style] = elem.style[style];
					}
				});
			}else{
				hide.apply(me, arguments);
			}
			return this;
		},
	
		/**
		 * 高亮元素。
		 * @param {String} color 颜色。
		 * @param {Function} [callBack] 回调。
		 * @param {Number} duration=500 时间。
		 * @return this
		 */
		highlight: function(color, duration, callBack){
			assert(!callBack || Function.isFunction(callBack), "Control.prototype.highlight(color, duration, callBack): 参数 {callBack} 不是可执行的函数。", callBack);
			var from = {},
				to = {
					backgroundColor: color || '#ffff88'
				};
			
			duration /= 2;
			
			this.fx().start(from, to, duration, null, function (from) {
				from.backgroundColor = Dom.getStyle(this.dom.dom, 'backgroundColor');
			}).start(to, from, duration, callBack);
			return this;
		}
	});
	
	/**
	 * 获取变换。
	 */
	function getAnimate(type){
		return Object.extend({}, maps[type || 'opacity']);
	}
	
	/**
	 * 初始化滑动变换。
	 */
	function initSlide(animate, elem, type, savedStyle){
		delete animate.$slide;
		elem.parentNode.style.overflow = 'hidden';
		var margin = 'margin' + type.charAt(0).toUpperCase() + type.substr(1);
		if(/^(l|r)/.test(type)){
			animate[margin] = -elem.offsetWidth;
			var margin2 = type.length === 4 ? 'marginRight' : 'marginLeft';
			animate[margin2] = elem.offsetWidth;
			savedStyle[margin2] = elem.style[margin2];
		} else {
			animate[margin] = -elem.offsetHeight;
		}
		 savedStyle[margin] = elem.style[margin];
	}
	

	/// #endregion
	
})(JPlus);
/************************************
 * System.Dom.Align
 ************************************/
Control.implement((function(){
	
	var setter1 = {
			
			l: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				var x = targetPosition.x - ctrlSize.x - offset;
				if(x <= documentPosition.x) {
					x = setter1.r(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, false);
				}
				
				return x;
			},
			
			r: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, checkOutOfRange) {
				var x = targetPosition.x + targetSize.x + offset;
				if(x + ctrlSize.x >= documentPosition.x + documentSize.x) {
					x = checkOutOfRange !== false ? setter1.l(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) : documentPosition.x;
				}
				
				return x;
			},
			
			c: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				return targetPosition.x + (targetSize.x - ctrlSize.x) / 2 + offset;
			},
			
			t: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				var y = targetPosition.y - ctrlSize.y - offset;
				if(y <= documentPosition.y) {
					y = setter1.b(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, false);
				}
				
				return y;
			},
			
			b: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, checkOutOfRange) {
				var y = targetPosition.y + targetSize.y + offset;
				if(y + ctrlSize.y >= documentPosition.y + documentSize.y) {
					if(checkOutOfRange === false) {
						if(ctrl.onOverflowY)
							ctrl.onOverflowY(documentSize.y);
						y = documentPosition.y;
					} else {
						y = setter1.t(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl);
					}
				}
				
				return y;
			}
			
		},
		
		setter2 = {
		
			l: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, checkOutOfRange) {
				var x = targetPosition.x + offset;
				if(x <= documentPosition.x) {
					x = checkOutOfRange !== false ? setter2.r(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) : documentPosition.x;
				}
				
				return x;
			},
			
			r: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				var x = targetPosition.x + targetSize.x - ctrlSize.x - offset;
				if(x <= documentPosition.x) {
					x = setter2.l(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, false);
				}
				
				return x;
			},
			
			c: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				return targetPosition.y + (targetSize.y - ctrlSize.y) / 2 + offset;
			},
			
			t: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				var y = targetPosition.y + offset;
				if(y <= documentPosition.y) {
					if(checkOutOfRange === false) {
						if(ctrl.onOverflowY)
							ctrl.onOverflowY(documentSize.y);
						y = documentPosition.y;
					} else {
						y = setter2.b(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl);
					}
				}
				
				return y;
			},
			
			b: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				var y = targetPosition.y + targetSize.y - ctrlSize.y - offset;
				if(y <= documentPosition.y) {
					y = setter2.t(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl);
				}
				
				return y;
			}
			
		},
		
		setter = {
			bl: [setter2.l, setter1.b],
			rt: [setter1.r, setter2.t],
			rb: [setter1.r, setter2.b],
			lt: [setter1.l, setter2.t],
			lb: [setter1.l, setter2.b],
			br: [setter2.r, setter1.b],
			tr: [setter2.r, setter1.t],
			tl: [setter2.l, setter1.t],
			rc: [setter1.r, setter2.c],
			bc: [setter1.c, setter1.b],
			tc: [setter1.c, setter1.t],
			lc: [setter1.l, setter2.c],
			cc: [setter1.c, setter2.c],
			
			'lb-': [setter2.l, setter2.b],
			'rt-': [setter2.r, setter2.t],
			'rb-': [setter2.r, setter2.b],
			'lt-': [setter2.l, setter2.t],
			'rc-': [setter2.r, setter2.c],
			'bc-': [setter1.c, setter2.b],
			'tc-': [setter1.c, setter2.t],
			'lc-': [setter2.l, setter2.c],
			
			'lb^': [setter1.l, setter1.b],
			'rt^': [setter1.r, setter1.t],
			'rb^': [setter1.r, setter1.b],
			'lt^': [setter1.l, setter1.t]
			
		};
		
		/*
		 *      tl   tc   tr
		 *      ------------
		 *   lt |          | rt
		 *      |          |
		 *   lc |    cc    | rc
		 *      |          |
		 *   lb |          | rb
		 *      ------------
		 *      bl   bc   br
		 */
	
	return {
		
		/**
		 * 基于某个控件，设置当前控件的位置。改函数让控件显示都目标的右侧。
		 * @param {Controls} ctrl 目标的控件。
		 * @param {String} align 设置的位置。如 lt rt 。完整的说明见备注。
		 * @param {Number} offsetX 偏移的X大小。
		 * @param {Number} offsetY 偏移的y大小。
		 * @memberOf Control
		 */
		align: function (ctrl, position,  offsetX, offsetY) {
			var ctrlSize = this.getSize(),
				targetSize = ctrl.getSize(),
				targetPosition = ctrl.getPosition(),
				documentSize = document.getSize(),
				documentPosition = document.getPosition();
					
			assert(!position || position in setter, "Control.prototype.align(ctrl, position,  offsetX, offsetY): {position} 必须是 l r c 和 t b c 的组合。如 lt", position);
				
			position = setter[position] || setter.lb;
			
			this.setPosition(
				position[0](ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offsetX || 0, this),
				position[1](ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offsetY || 0, this)
			);
		}
		
	};
	
})());

/************************************
 * System.Dom.Drag
 ************************************/
var Draggable = Class({
	
	initEvent: function (e) {
		e.draggable = this;
		e.dragTarget = this.target;
	},
	
	/**
	 * 触发 dragstart 事件。
	 * @param {Event} e 原生的 mousemove 事件。
	 */
	onDragStart: function(e){
		this.initEvent(e);
		// 如果都正常。
		return this.target.trigger('dragstart', e);
	},
	
	/**
	 * 触发 drag 事件。
	 * @param {Event} e 原生的 mousemove 事件。
	 */
	onDrag: function(e){
		this.initEvent(e);
		this.target.trigger('drag', e);
	},
	
	/**
	 * 触发 dragend 事件。
	 * @param {Event} e 原生的 mouseup 事件。
	 */
	onDragEnd: function(e){
		this.initEvent(e);
		return this.target.trigger('dragend', e);
	},
	
	/**
	 * 处理 mousedown 事件。
	 * 初始化拖动，当单击时，执行这个函数，但不执行 doDragStart。
	 * 只有鼠标移动时才会继续执行doDragStart。
	 * @param {Event} e 事件参数。
	 */
	initDrag: function(e){

		// 左键才继续
		if(e.which !== 1)
			return;
		
		if(Draggable.current) {
			Draggable.current.stopDrag(e);
		}
		
		e.preventDefault();
		
		var me = this;
		
		me.from = new Point(e.pageX, e.pageY);
		me.to = new Point(e.pageX, e.pageY);
		
		// 设置当前处理  mousemove 的方法。
		// 初始需设置 onDrag
		// 由 onDrag 设置为    onDrag
		me.handler = me.startDrag;
		
		me.timer = setTimeout(function(){
			me.startDrag(e);
		}, me.dragDelay);
		
		// 设置文档  mouseup 和   mousemove
		Dom.getDocument(me.handle.dom).on('mouseup', me.stopDrag, me).on('mousemove', me.handleDrag, me);
	
	},
	
	/**
	 * 处理 mousemove 事件。
	 * @param {Event} e 事件参数。
	 */
	handleDrag: function(e){
		
		e.preventDefault();
		
		this.to.x = e.pageX;
		this.to.y = e.pageY;
		
		// 调用函数处理。
		this.handler(e);
	},
	
	/**
	 * 处理 mousedown 或 mousemove 事件。开始准备拖动。
	 * @param {Event} e 事件。
	 * 这个函数调用 onDragStart 和 beforeDrag
	 */
	startDrag: function (e) {
		
		var me = this;
		
		//   清空计时器。
		clearTimeout(me.timer);
		
		Draggable.current = me;
		
		// 设置句柄。
		me.handler = me.drag;
		
		// 开始拖动事件，如果这个事件 return false，  就完全停止拖动。
		if (me.onDragStart(e)) {
			me.beforeDrag(e);
			me.drag(e);
		} else {
			// 停止。
			me.stopDragging();
		}
	},
	
	/**
	 * 处理 mousemove 事件。处理拖动。
	 * @param {Event} e 事件参数。
	 * 这个函数调用 onDrag 和 doDrag
	 */
	drag: function(e){
		this.onDrag(e);
		this.doDrag(e);
	},
	
	/**
	 * 处理 mouseup 事件。
	 * @param {Event} e 事件参数。
	 * 这个函数调用 onDragEnd 和 afterDrag
	 */
	stopDrag: function (e) {
		
		// 只有鼠标左键松开， 才认为是停止拖动。
		if(e.which !== 1)
			return;
		
		e.preventDefault();
		
		// 检查是否拖动。
		// 有些浏览器效率较低，肯能出现这个函数多次被调用。
		// 为了安全起见，检查 current 变量。
		if (Draggable.current === this) {
			
			this.stopDragging();
			
			this.onDragEnd(e);

			// 改变结束的鼠标类型，一般这个函数将恢复鼠标样式。
			this.afterDrag(e);
		
		} else {

			this.stopDragging();
			
		}
	},
	
	beforeDrag: function(e){
		this.offset = this.proxy.getOffset();
		document.body.style.cursor = this.target.getStyle('cursor');
		if(document.body.setCapture)
			document.body.setCapture();
		else
			document.body.style.pointerEvents = 'none';
	},
	
	doDrag: function(e){
		var me = this;
		me.proxy.setOffset({
			x: me.offset.x + me.to.x - me.from.x,
			y: me.offset.y + me.to.y - me.from.y
		});
	},
	
	afterDrag: function(){
		if(document.body.releaseCapture)
			document.body.releaseCapture();
		else
			document.body.style.pointerEvents = '';
		document.body.style.cursor = '';
		this.offset = null;
	},
	
	dragDelay: 500,
	
	constructor: function(dom, handle){
		this.proxy = this.target = dom;
		this.handle = handle || dom;
		this.setDraggable();
	},

	/**
	 * 停止当前对象的拖动。
	 */
	stopDragging: function(){
		Dom.getDocument(this.handle.dom).un('mousemove', this.handleDrag).un('mouseup', this.stopDrag);
		clearTimeout(this.timer);
		Draggable.current = null;
	},
	
	setDraggable: function(value){
		this.handle[value !== false ? 'on' : 'un']('mousedown', this.initDrag, this);
	}
	
});

/// #endregion

/// #region Element

/**
 * @class Element
 */
Control.implement({
	
	/**
	 * 使当前元素支持拖动。
	 * @param {Element} [handle] 拖动句柄。
	 * @return this
	 */
	setDraggable: function(handle) {
		var draggable = JPlus.getData(this, 'draggable');
		if(handle !== false) {
			if (handle === true) handle = null;
			if(draggable) {
				assert(!handle || draggable.handle.target === handle.target, "Control.prototype.setDraggable(handle): 无法重复设置 {handle}, 如果希望重新设置handle，使用以下代码：dom.setDraggable(false);JPlus.removeData(dom, 'draggable');dom.setDraggable(handle) 。", handle);
				draggable.setDraggable();
			} else  {
				Dom.movable(this.dom);
				draggable = JPlus.setData(this, 'draggable', new Draggable(this, handle));
			}
			
			
		} else if(draggable)
			draggable.setDraggable(false);
		return this;
	}
	
});

/// #endregion
	

/************************************
 * System.Dom.Resize
 ************************************/
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
/************************************
 * System.Dom.HashChange
 ************************************/
String.htmlEncode = (function() {
    var entities = {
        '&': '&amp;',
        '>': '&gt;',
        '<': '&lt;',
        '"': '&quot;'
    };
    
    function match(match, capture){
    	return entities[capture];
    }
    
    return function(value) {
        return value ? value.replace(/[&><"]/g, match) : '';
    };
})();

location.getHash = function() {
	var href = location.href,
	i = href.indexOf("#");

	return i >= 0 ? href.substr(i + 1) : '';
};


(function() {

	var hashchange = 'hashchange',
		document = window.document,
		win = new Dom(window),
		getHash = location.getHash;

	/**
	 * 当 hashchange 事件发生时，执行函数。
	 */
	Dom[hashchange] = function(fn) {
		fn ? win.on(hashchange, fn) && fn.call(win) : win.trigger(hashchange);
	};
	
	// 并不是所有浏览器都支持 hashchange 事件，
	// 当浏览器不支持的时候，使用自定义的监视器，每隔50ms监听当前hash是否被修改。
	if ('on' + hashchange in window && !(document.documentMode < 8)) return;

	var currentHash, 
	
		timer, 
		
		onChange = function() {
			win.trigger(hashchange);
		},
		
		poll = function() {
			var newToken = getHash();
	
			if (currentHash !== newToken) {
				currentHash = newToken;
				onChange();
			}
			timer = setTimeout(poll, 50);
	
		},
		
		start = function() {
			currentHash = getHash();
			timer = setTimeout(poll, 50);
		},
		
		stop = function() {
			clearTimeout(timer);
		};
		
	// 如果是 IE6/7，使用 iframe 模拟成历史记录。
	if (navigator.isQuirks) {

		var iframe;

		// 初始化的时候，同时创建 iframe
		start = function() {
			if (!iframe) {
				Dom.ready(function(){
					iframe = Dom.parse('<iframe style="display: none" height="0" width="0" tabindex="-1" title="empty"/>');
					iframe.one('load', function() {
						
						// 绑定当 iframe 内容被重写后处理。
						this.on("load", function() {
							// iframe 的 load 载入有 2 个原因：
							//	1. hashchange 重写 iframe
							//	2. 用户点击后退按钮
							
							// 获取当前保存的 hash
							var newHash = iframe.contentWindow.document.body.innerText,
								oldHash = getHash();
							
							
							// 如果是用户点击后退按钮导致的iframe load， 则 oldHash !== newHash
							if (oldHash != newHash) {
								
								// 将当前的 hash 更新为旧的 newHash
								location.hash = currentHash = newHash;
								
								// 手动触发 hashchange 事件。
								win.trigger(hashchange);
							}
							
						});
						
						// 首次执行，先保存状态。
						currentHash = getHash();
						poll();
					});
					
					iframe = iframe.dom;
					document.dom.appendChild(iframe);
					
				});
			} else {
				
				// 开始监听。
				currentHash = getHash();
				poll();
			}

		};
		// iframe: onChange 时，保存状态到 iframe 。
		onChange = function() {

			var hash = getHash();
			
			// 将历史记录存到 iframe 。
			var html = "<html><body>" + String.htmlEncode(hash) + "</body></html>";

			try {
				var doc = iframe.contentWindow.document;
				doc.open();
				doc.write(html);
				doc.close();
			} catch(e) {}

			win.trigger(hashchange);
		};
		
	}

	Control.addEvents({
		hashchange: {
			add: start,

			remove: stop

		}
	});

})();
/************************************
 * System.Utils.JSON
 ************************************/
var JSON = JSON || {};
	
Object.extend(JSON, {
	
	specialChars: {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

	replaceChars: function(chr){
		return JSON.specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
	},

	encode: JSON.stringify || function(obj){
		switch (Object.type(obj)){
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, JSON.replaceChars) + '"';
			case 'array':
				return '[' + String(Object.update(obj, JSON.encode, [])) + ']';
			case 'object':
				var string = [];
				for(var key in obj) {
					string.push(JSON.encode(key) + ':' + JSON.encode(obj[key]));
				}
				return '{' + string + '}';
			default:
				return String(obj);
		}
	},

	decode: function(string){
		if (typeof string != 'string' || !string.length) return null;
		
		if (JSON.parse)
			return JSON.parse(string);
		
		// 摘自 json2.js
		if (/^[\],:{}\s]*$/
                    .test(string.replace(/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        	return new Function('return ' + string)();
        	
        }
        
        throw new SyntaxError('JSON.parse: unexpected character\n' + value);
	}

});





/************************************
 * System.Browser.Cookies
 ************************************/
var Cookies = {
	
	/**
	 * 获取 Cookies 。
	 * @param {String} name 名字。
	 * @param {String} 值。
	 */
	get: function(name){
		
		assert.isString(name, "Cookies.get(name): 参数 name ~。");
		
		name = encodeURIComponent(name);
		
		var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	},
	
	/**
	 * 设置 Cookies 。
	 * @param {String} name 名字。
	 * @param {String} value 值。
	 * @param {Number} expires 有效天数。天。-1表示无限。
	 * @param {Object} props 其它属性。如 domain, path, secure    。
	 */
	set: function(name, value, expires, props){
		var e = encodeURIComponent,
		    updatedCookie = e(name) + "=" + e(value),
		    t;
		    
		    assert(updatedCookie.length < 4096, "Cookies.set(name, value, expires, props): 参数  value 内容过长，无法存储。");
		
		if(expires == undefined)
			expires = value === null ? -1 : 1000;
		   
		if(expires) {
			t = new Date();
			t.setHours(t.getHours() + expires * 24);
			updatedCookie += '; expires=' + t.toGMTString();
		}
		    
		for(t in props){
			updatedCookie = String.concat(updatedCookie, "; " + t, "=",  e(props[t])) ;
		}
		
		document.cookie = updatedCookie;
	}
};


/************************************
 * System.Browser.LocalStorage
 ************************************/
var LocalStorage = LocalStorage || {};

Object.extend(LocalStorage, {
	
	set: window.localStorage ? function(name, value){
		localStorage[name] = value;
	} : Cookies.set,
	
	get: window.localStorage ? function(name){
		return localStorage[name];
	} : Cookies.get,
	
	setJSON: function(name, value){
		LocalStorage.set(name, JSON.encode(value));
	},
	
	getJSON: function(name){
		name = LocalStorage.get(name);
		if(name)
			try{
				return JSON.decode(name);
			}catch(e){}
			
		
		return null;
	}
	
});
/************************************
 * System.Data.Collection
 ************************************/
var Collection = Class({
	
	/**
	 * 获取当前的项数目。
	 */
	length: 0,
	
	/**
	 * 对项初始化。
	 * @protected
	 * @virtual
	 */
	initItem: function (item) {
		return item;
	},
	
	onAdd: function(item){
		this.onInsert(item, this.length);
	},

	onInsert: Function.empty,
	
	onRemove: Function.empty,
	
	onBeforeSet: Function.empty,
	
	onAfterSet: Function.empty,
	
	add: function(item){
		assert.notNull(item, "Collection.prototype.add(item): 参数 {item} ~。");
		Array.prototype.push.call(this, item = this.initItem(item));
		this.onAdd(item);
		return item;
	},
	
	addRange: function(args){
		return Array.prototype.forEach.call(args && typeof args.length === 'number' ? args : arguments, this.add, this);
	},
	
	insert: function(index, item){
		assert.notNull(item, "Collection.prototype.insert(item): 参数 {item} ~。");
		index = Array.prototype.insert.call(this, index, item = this.initItem(item));
		this.onInsert(item, index + 1);
		return item;
	},
	
	clear: function(){
		var me = this;
		me.onBeforeSet();
		while (me.length) {
			var item = me[--me.length];
			delete me[me.length];
			me.onRemove(item, me.length);
		}
		me.onAfterSet();
		return me;
	},
	
	remove: function(item){
		assert.notNull(item, "Collection.prototype.remove(item): 参数 {item} ~。");
		var index = this.indexOf(item);
		this.removeAt(index);
		return index;
	},
	
	removeAt: function(index){
		var item = this[index];
		if(item){
			Array.prototype.splice.call(this, index, 1);
			delete this[this.length];
			this.onRemove(item, index);
		}
			
		return item;
	},
		
	set: function(index, item){
		var me = this;
		me.onBeforeSet();
		
		if(typeof index === 'number'){
			item = this.initItem(item);
			assert.notNull(item, "Collection.prototype.set(item): 参数 {item} ~。");
			assert(index >= 0 && index < me.length, 'Collection.prototype.set(index, item): 设置的 {index} 超出范围。请确保  0 <= index < ' + this.length, index);
			item = me.onInsert(item, index);
			me.onRemove(me[index], index);
			me[index] = item;
		} else{
			if(me.length)
				me.clear();
			index.forEach(me.add, me);
		}
		
		me.onAfterSet();
		return me;
	}
	
});

String.map("indexOf forEach each invoke lastIndexOf item filter", Array.prototype, Collection.prototype);

/************************************
 * Milk.Core.Common
 ************************************/
/************************************
 * Milk.Core.ScrollableControl
 ************************************/
var ScrollableControl = Control.extend({

	/**
	 * 当新控件被添加时执行。
	 * @param {Object} childControl 新添加的元素。
	 * @param {Number} index 元素被添加的位置。
	 * @protected virtual
	 */
	onControlAdded: function(childControl, index){
		index = this.controls[index];
		assert(childControl && childControl.attach, "Control.prototype.onControlAdded(childControl, index): {childControl} \u5FC5\u987B\u662F\u63A7\u4EF6\u3002", childControl);
		childControl.attach(this.container.dom, index ? index.dom : null);
	},
	
	/**
	 * 当新控件被移除时执行。
	 * @param {Object} childControl 新添加的元素。
	 * @param {Number} index 元素被添加的位置。
	 * @protected virtual
	 */
	onControlRemoved: function(childControl, index){
		assert(childControl && childControl.detach, "Control.prototype.onControlRemoved(childControl, index): {childControl} \u5FC5\u987B\u662F\u63A7\u4EF6\u3002", childControl);
		childControl.detach(this.container.dom);
	},

	/**
	 * 当被子类重新时，实现创建一个子控件列表。
	 * @return {ScrollableControl.ControlCollection} 子控件列表。
	 * @protected virtual
	 */
	createControlsInstance: function(){
		return new ScrollableControl.ControlCollection(this);
	},
	
	// /**
	 // * 获取当前控件用于存放子节点的容器控件。
	 // * @protected virtual
	 // */
	// getContainer: function(){
		// return this;
	// },
	
	/**
	 * 从 DOM 树更新 controls 属性。
	 * @protected virtual
	 */
	init: function(){
		this.container = Dom.get(this.container.dom);
		this.controls.addRange(this.container.getChildren(true));
	},
	
	/**
	 * 根据用户的输入创建一个新的子控件。
	 * @param {Object} item 新添加的元素。
	 * @return {Control} 一个控件，根据用户的输入决定。
	 * @protected virtual
	 * 默认地，如果输入字符串和DOM节点，将转为对应的控件。
	 */
	initChild: Dom.parse,
	
	removeChild: function (childControl) {
		return this.controls.remove(childControl);
	},
	
	insertBefore: function (newControl, childControl) {
		return childControl === null ? this.controls.add(newControl) : this.controls.insert(this.controls.indexOf(childControl), newControl);
	},
	
	/**
	 * 获取目前所有子控件。
	 * @type {Control.ControlCollection}
	 * @name controls
	 */
	constructor: function(){
		this.container = this;
		this.controls = this.createControlsInstance();
		//   this.loadControls();
		Control.prototype.constructor.apply(this, arguments);
	},
	
	empty: function(){
		this.controls.clear();
		return this;
	}

});

///  #region ControlCollection

/**
 * 存储控件的集合。
 * @class
 * @extends Collection
 */
ScrollableControl.ControlCollection = Collection.extend({
	
	/**
	 * 初始化 Control.ControlCollection 的新实例。
	 * @constructor
	 * @param {ScrollableControl} owner 当前集合的所属控件。
	 */
	constructor: function(owner){
		this.owner = owner;
	},
	
	/**
	 * 当被子类重写时，初始化子元素。
	 * @param {Object} item 添加的元素。
	 * @return {Object} 初始化完成后的元素。
	 */
	initItem: function(item){
		return this.owner.initChild(item);
	},
	
	/**
	 * 通知子类一个新的元素被添加。
	 * @param {Object} childControl 新添加的元素。
	 * @param {Number} index 元素被添加的位置。
	 */
	onInsert: function(childControl, index){
		
		// 如果控件已经有父控件。
		if(childControl.parentControl) {
			childControl.parentControl.controls.remove(childControl);
		}
		childControl.parentControl = this.owner;
		
		// 执行控件添加函数。
		this.owner.onControlAdded(childControl, index);
	},
	
	/**
	 * 通知子类一个元素被移除。
	 * @param {Object} childControl 新添加的元素。
	 * @param {Number} index 元素被添加的位置。
	 */
	onRemove: function(childControl, index){
		this.owner.onControlRemoved(childControl, index);
		childControl.parentControl = null;
	}
	
});


/// #endregion
/************************************
 * Milk.Core.ListControl
 ************************************/
var ListControl = ScrollableControl.extend({
	
	xType: 'listcontrol',
	
	tpl: '<div></div>',
	
	onControlAdded: function(childControl, index){
		var t = childControl;
		if(childControl.dom.tagName !== 'LI') {
			childControl = Dom.create('li', 'x-' + this.xType + '-content');
			childControl.append(t);
		}
		
		index = this.controls[index];
		this.container.insertBefore(childControl, index && index.getParent());
		
		// 更新选中项。
		if(this.baseGetSelected(childControl)){
			this.setSelectedItem(t);
		}
		
	},
	
	onControlRemoved: function(childControl, index){
		var t = childControl;
		if(childControl.dom.tagName !== 'LI'){
			childControl = childControl.getParent();
			childControl.removeChild(t);
		}
		
		this.container.removeChild(childControl);
		
		// 更新选中项。
		if(this.getSelectedItem() == t){
			this.selectedItem = null;
			this.setSelectedIndex(index);
		}
	},
	
	/**
	 * 获取指定子控件的最外层 <li>元素。
	 */
	getContainerOf: function(childControl){
		return childControl.dom.tagName === 'LI' ? childControl : childControl.getParent('li');
	},
	
	/**
	 * 获取包含指定节点的子控件。
	 */
	getItemOf: function(node){
		var me = this.controls, ul = this.container.dom;
		while(node){
			if(node.parentNode === ul){
				for(var i = me.length; i--;){
					if((ul = me[i].dom) && (ul === node || ul.parentNode === node)){
						return me[i];
					}
				}
				break;
			}
			node = node.parentNode;
		}
		
		return null;
	},
	
	init: function(options){
		this.items = this.controls;
		var classNamePreFix = 'x-' + this.xType;
		this.addClass(classNamePreFix);
		
		// 获取容器。
		var container = this.container = this.getFirst('ul');
		if(container) {
			// 已经存在了一个 UL 标签，转换为 items 属性。
			this.controls.addRange(container.query('>li').addClass(classNamePreFix + '-content'));
		} else {
			container = this.container = Dom.create('ul', '');
			this.dom.appendChild(container.dom);
		}
		container.addClass(classNamePreFix + '-container');
	},
	
	// 选择功能
	
	/**
	 * 当前的选中项。
	 */
	selectedItem: null,
	
	/**
	 * 底层获取某项的选中状态。该函数仅仅检查元素的 class。
	 */
	baseGetSelected: function (itemContainerLi) {
		return itemContainerLi.hasClass('x-' + this.xType + '-selected');
	},
	
	/**
	 * 底层设置某项的选中状态。该函数仅仅设置元素的 class。
	 */
	baseSetSelected: function (itemContainerLi, value) {
		itemContainerLi.toggleClass('x-' + this.xType + '-selected', value);
	},
	
	onOverFlowY: function(max){
		this.setHeight(max);
	},
	
	/**
	 * 当选中的项被更新后触发。
	 */
	onChange: function (old, item){
		return this.trigger('change', old);
	},
	
	/**
	 * 当某项被选择时触发。如果返回 false， 则事件会被阻止。
	 */
	onSelect: function (item){
		return this.trigger('select', item);
	},
	
	/**
	 * 获取当前选中项的索引。如果没有向被选中，则返回 -1 。
	 */
	getSelectedIndex: function () {
		return this.controls.indexOf(this.getSelectedItem());
	},
	
	/**
	 * 设置当前选中项的索引。
	 */
	setSelectedIndex: function (value) {
		return this.setSelectedItem(this.controls[value]);
	},
	
	/**
	 * 获取当前选中的项。如果不存在选中的项，则返回 null 。
	 */
	getSelectedItem: function () {
		return this.selectedItem;
	},
	
	/**
	 * 设置某一项为选中状态。对于单选框，该函数会同时清除已有的选择项。
	 */
	setSelectedItem: function(item){
		
		// 先反选当前选择项。
		var old = this.getSelectedItem();
		if(old && (old = this.getContainerOf(old)))
			this.baseSetSelected(old, false);
	
		if(this.onSelect(item)){
		
			// 更新选择项。
			this.selectedItem = item;
			
			if(item != null){
				item = this.getContainerOf(item);
			//	if(!navigator.isQuirks)
			//		item.scrollIntoView();
				this.baseSetSelected(item, true);
				
			}
			
		}
			
		if(old !== item)
			this.onChange(old, item);
			
		return this;
	},
	
	/**
	 * 获取选中项的文本内容。
	 */
	getText: function () {
		var selectedItem = this.getSelectedItem();
		return selectedItem ? selectedItem.getText() : '';
	},
	
	/**
	 * 查找并选中指定文本内容的项。如果没有项的文本和当前项相同，则清空选择状态。
	 */
	setText: function (value) {
		var t = null;
		this.controls.each(function(item){
			if(item.getText() === value){
				t = item;
				return false;
			}
		}, this);
		
		return this.setSelectedItem(t);
	},
	
	/**
	 * 切换某一项的选择状态。
	 */
	toggleItem: function(item){
		
		// 如果当前项已选中，则表示反选当前的项。
		return  this.setSelectedItem(item === this.getSelectedItem() ? null : item);
	},
	
	/**
	 * 确保当前有至少一项被选择。
	 */
	select: function () {
		if(!this.selectedItem) {
			this.setSelectedIndex(0);
		}
		
		return this;
	},
	
	/**
	 * 选择当前选择项的下一项。
	 */
	selectNext: function(up){
		var oldIndex = this.getSelectedIndex(), newIndex, maxIndex = this.controls.length - 1;
		if(oldIndex != -1) {
			newIndex = oldIndex + ( up !== false ? 1 : -1);
			if(newIndex < 0) newIndex = maxIndex;
			else if(newIndex > maxIndex) newIndex = 0;
		} else {
			newIndex = up !== false ? 0 : maxIndex;
		}
		return this.setSelectedIndex(newIndex);
	},
	
	/**
	 * 选择当前选择项的上一项。
	 */
	selectPrevious: function(){
		return this.selectNext(false);
	},
	
	/**
	 * 设置某个事件发生之后，自动选择元素。
	 */
	bindSelector: function(eventName){
		this.on(eventName, function(e){
			var item = this.getItemOf(e.target);
			if(item){
				this.setSelectedItem(item);
			}
		}, this);
		return this;
	}
	
}).addEvents({select:{}, change:{}});


/************************************
 * Milk.Core.ContainerControl
 ************************************/
var ContainerControl = ScrollableControl.extend({
	
	initHeader: function(header){
		Dom.get(this.dom).insert('afterBegin', header);
		header.setHtml('<h2></h2>');
	},
	
	toggleHeader: function (value) {
		if(this.header){
			if(!value) {
				this.header.remove();
				this.header = null;
			}
		} else if(value){
			this.initHeader(this.header = Dom.create('div', 'x-' + this.xType + '-header'));
		}
	},
	
	getTitle: function(){
		return (this.header.find('h2, h3, h4, h5') || this.header.find('a')).getText();
	},
	
	setTitle: function(value){
		if(value != null){
			this.toggleHeader(true);
			(this.header.find('h2, h3, h4, h5') || this.header.find('a')).setText(value);
		} else {
			this.toggleHeader(false);
		}
		return this;
	},
	
	init: function(){
		var fix = '.x-' + this.xType;
		this.header = this.find(fix + '-header');
		this.container = this.find(fix + '-body');
	},
	
	getText: function(){
		return this.container.getText();
	},
	
	getHtml: function(){
		return this.controls.length === 1 ? this.controls[0].getHtml() : this.container.getHtml();
	},
	
	setText: function(value){
		this.empty().append(Dom.create('div', 'x-' + this.xType + '-container').setText(value));
		return this;
	},
	
	setHtml: function(value){
		this.empty().append(Dom.create('div', 'x-' + this.xType + '-container').setHtml(value));
		return this;
	}

});
/************************************
 * Milk.Core.ContentControl
 ************************************/
var ContentControl = Control.extend({
	
	/**
	 * 当前正文。
	 * @type Element/Control
	 * @property container
	 * @proected
	 */
	
	/**
	 * 当被子类改写时，实现创建添加和返回一个图标节点。
	 * @protected
	 * @virtual
	 */
	createIcon: function(){
		return  Dom.create('span', 'x-icon');
	},
	
	insertIcon: function(icon){
		if(icon)
			this.container.insert('afterBegin', icon);
	},
	
	init: function(){
		this.container = new Dom(this.dom);
	},
	
	/**
	 * 获取当前显示的图标。
	 * @name icon
	 * @type {Element}
	 */
	
	/**
	 * 设置图标。
	 * @param {String} icon 图标。
	 * @return {Panel} this
	 */
	setIcon: function(icon) {
		
		if(icon === null){
			if(this.icon) {
				this.icon.remove();
				this.icon = null;
			}
			
			return this;
				
		}
		
		if(!this.icon || !this.icon.getParent()) {
			
			this.insertIcon(this.icon = this.createIcon());
		}
		
		this.icon.dom.className = "x-icon x-icon-" + icon;
		
		return this;
	},
	
	setText: function(value){
		this.container.setText(value);
		this.insertIcon(this.icon);
		
		return this;
	},
	
	setHtml: function(value){
		this.container.setHtml(value);
		this.insertIcon(this.icon);
		
		return this;
	}
	
});


Control.delegate(ContentControl, 'container', 'setWidth setHeight empty', 'insertBefore removeChild contains append getHtml getText getWidth getHeight');
/************************************
 * Milk.Core.ICollapsable
 ************************************/
var ICollapsable = {
	
	/**
	 * 获取目前是否折叠。
	 * @virtual
	 * @return {Boolean} 获取一个值，该值指示当前面板是否折叠。
	 */
	isCollapsed: function() {
		return this.container && Dom.isHidden(this.container.dom);
	},
	
	collapseDuration: -1,
	
	onToggleCollapse: function(value){
		
	},
	
	onCollapse: function(){
		this.trigger('collapse');
		this.onToggleCollapse(true);
	},
	
	onExpand: function(){
		this.trigger('expand');
		this.onToggleCollapse(false);
	},
	
	collapse: function(duration){
		var me = this;
		me.container && me.container.hide(duration === undefined ? me.collapseDuration : duration, function(){
			me.addClass('x-' + me.xType + '-collapsed');
			me.onCollapse();
		}  , 'height');
		return this;
	},
	
	expand: function(duration){
		this.removeClass('x-' + this.xType + '-collapsed');
		this.container && this.container.show(duration === undefined ? this.collapseDuration : duration, Function.bind(this.onExpand, this), 'height');
		return this;
	},
	
	/**
	 * 切换面板的折叠。
	 * @method toggleCollapse
	 * @param {Number} collapseDuration 时间。
	 */
	toggleCollapse: function(duration) {
		return this.isCollapsed() ? this.expand(duration) : this.collapse(duration);
	}
	
};
/************************************
 * Milk.Core.IDropDownMenuContainer
 ************************************/
var IDropDownMenuContainer = {
	
	/**
	 * 获取当前控件的下拉菜单。
	 * @type Control
	 * @property dropDownMenu
	 */
	
	dropDownMenuWidth: 'auto',
	
	onDropDownMenuOpen: function(){
		this.trigger('dropdownmenuopen');
	},
	
	onDropDownMenuClose: function(){
		this.trigger('dropdownmenuclose');
	},

	setDropDownMenu: function(control){
		
		control = Dom.get(control);
		
		// 设置下拉菜单。
		this.dropDownMenu = control.addClass('x-dropdownmenu').hide();
		
		// 如果当前节点已经添加到 DOM 树，则同时添加 control 。
		if(!control.getParent('body')){
			
			var tagName = this.dom.tagName;
			
			// 给 div 和 span 更多关心。
			if(tagName === 'DIV' || tagName === 'SPAN'){
				Dom.movable(this.dom);
				control.appendTo(this);
			} else {
				control.appendTo(this.getParent());
			}
			
			if(navigator.isQuirks && control.getParent().getStyle('z-index') === 0)
				control.getParent().setStyle('z-index', 1);
		}
		
	},
	
	realignDropDownMenu: function (offsetX, offsetY) {
		this.dropDownMenu.align(this, 'bl', offsetX, offsetY);
	},
	
	toggleDropDownMenu: function(e){
		if(e) this._dropDownMenuTrigger = e.target;
		return this._dropDownMenuVisible ? this.hideDropDownMenu() : this.showDropDownMenu();
	},
	
	showDropDownMenu: function(){
		
		if(this._dropDownMenuVisible){
			return ;	
		}
		
		this._dropDownMenuVisible = true;
		this.dropDownMenu.show();
		this.realignDropDownMenu(0, -1);
		
		var size = this.dropDownMenuWidth;
		if(size === 'auto') {
			size = this.getSize().x;
			if(size < Dom.styleNumber(this.dropDownMenu.dom, 'min-width'))
				size = -1;
		}
		
		if(size !== -1) {
			this.dropDownMenu.setSize(size);
		}
		
		this.onDropDownMenuOpen();
		
		document.on('mouseup', this.dropDownMenuMouseUpHandler = Function.bind(this.hideDropDownMenu, this));
	},
	
	hideDropDownMenu: function (e) {
		
		// 如果是来自事件的关闭，则检测是否需要关闭菜单。
		if(e){
			e = e.target;
			if([this._dropDownMenuTrigger, this.dropDownMenu.dom, this.dom].indexOf(e) >= 0 || Dom.hasChild(this.dropDownMenu.dom, e) || Dom.hasChild(this.dom, e)) 
				return;
		}
		
		this.onDropDownMenuClose();
		this.dropDownMenu.hide();
		document.un('mouseup', this.dropDownMenuMouseUpHandler);
		
		this._dropDownMenuVisible = false;
	}
	
};
/************************************
 * Milk.Core.Splitter
 ************************************/
/************************************
 * Milk.Button.Button
 ************************************/
var Button = ContentControl.extend({
	
	options: {
		type: 'button'
	},
	
	tpl: '<button class="x-button" type="button"></button>',
	
	create: function(options){
		var type = options.type;
		delete options.type;
		return Dom.parseNode(this.tpl.replace('"button"', '"' + type + '"'));
	},
	
	getActived: function(){
		return this.hasClass('x-button-actived');
	},
	
	setActived: function(value){
		this.toggleClass('x-button-actived', value);
	},
	
	getDisabled: function(){
		return this.container.getAttr('disabled') !== false ;
	},
	
	setDisabled: function(value){
		value = value !== false;
		this.toggleClass('x-button-disabled', value);
		this.container.setAttr('disabled', value);
	}
	
});

/************************************
 * Milk.Button.MenuButton
 ************************************/
var MenuButton = Button.extend(IDropDownMenuContainer).implement({
	
	xType: 'menubutton',
	
	tpl: '<button class="x-button"><span class="x-button-menu x-button-menu-down"></span></button>',
	
	init: function () {
		this.base('init');
		this.addClass('x-' + this.xType);
		this.menuButton = this.find('.x-button-menu');
		this.on('click', this.toggleDropDownMenu);
		this.setDropDownMenu(new Menu());
		this.items = this.controls = this.dropDownMenu.controls;
		this.dropDownMenu.on('click', this.onSelectItem, this);
	},
	
	onDropDownMenuOpen: function(){
		this.setActived(true);
		this.trigger('dropdownmenuopen');
	},
	
	onDropDownMenuClose: function(){
		this.trigger('dropdownmenuclose');
		this.setActived(false);
	},
	
	onSelectItem: function(){
		this.hideDropDownMenu();
		return false;
	},
	
	setText: function () {
		this.base('setText');
		this.append(this.menuButton);
		return this;
	},
	
	setHtml: function () {
		this.base('setHtml');
		this.append(this.menuButton);
		return this;
	}
	
});
/************************************
 * Milk.Button.SplitButton
 ************************************/
var SplitButton = MenuButton.extend({
	
	xType: 'splitbutton',
	
	tpl: '<span class="x-splitbutton x-buttongroup">\
				<button class="x-button">&nbsp;</button>\
				<button class="x-button"><span class="x-button-menu x-button-menu-down"></span></button>\
			</span>',
	
	init: function () {
		this.container = this.find('.x-button');
		this.menuButton = this.find('.x-button:last-child');
		this.menuButton.on('click', this.toggleDropDownMenu, this);
		this.setDropDownMenu(new Menu().appendTo(this.dom));
		this.menuButton.appendTo(this.dom);
		this.items = this.controls = this.dropDownMenu.controls;
		this.dropDownMenu.on('click', this.onSelectItem, this);
	},
	
	setText: ContentControl.prototype.setText,
	
	setHtml: ContentControl.prototype.setHtml
	
});
/************************************
 * Milk.Button.ButtonGroup
 ************************************/
/************************************
 * Milk.Button.CloseButton
 ************************************/
/************************************
 * Milk.Button.LinkButton
 ************************************/
/************************************
 * Milk.Button.Menu-Alt
 ************************************/
var MenuItem = ContentControl.extend({
	
	xType: 'menuitem',
	
	tpl: '<a class="x-menuitem"><span class="x-icon x-icon-none"></span></a>',
	
	subMenu: null,
	
	/**
	 * 
	 */
	init: function(){
		this.base('init');
		this.setUnselectable();
		this.on('mouseover', this.onMouseEnter);
		this.on('mouseout', this.onMouseLeave);
		
		var subMenu = this.find('.x-menu');
		if(subMenu){
			this.setSubMenu(new Menu(subMenu));
		}
	},
	
	setSubMenu: function(menu){
		if (menu) {
			this.subMenu = menu.hide();
			menu.floating = false;
			this.addClass('x-menuitem-menu');
			this.on('mouseup', this._cancelHideMenu);
		} else {
			menu.floating = true;
			this.removeClass('x-menuitem-menu');
			this.un('mouseup', this._cancelHideMenu);
		}
	},
	
	_cancelHideMenu: function(e){
		e.stopPropagation();
	},
	
	toggleIcon: function(icon, val){
		this.icon.toggleClass(icon, val);
		return this;
	},
	
	onMouseEnter: function(){
		
		// 使用父菜单打开本菜单，显示子菜单。
		this.parentControl && this.parentControl.showSub(this);

	},
	
	_hideTargetMenu: function(e){
		var tg = e.relatedTarget;
		while(tg && tg.className != 'x-menu') {
			tg = tg.parentNode;
		}
		
		if (tg) {   
			var dt = JPlus.data(tg, 'menu');
			
			
			tg.hideSub();
		}
		
	},
	
	onMouseLeave: function(e){
		
		// 没子菜单，需要自取消激活。
		// 否则，由父菜单取消当前菜单的状态。
		// 因为如果有子菜单，必须在子菜单关闭后才能关闭激活。
		
		if(!this.subMenu)
			 this.setSelected(false);
			 
	},
	
	setSelected: function(value){
		this.getParent().toggleClass('x-menuitem-selected', value);
		this.toggleClass('x-menuitem-selected', value);
		return this;
	},
	
	getSelected: function(){
		return this.hasClass('x-menuitem x-menuitem-selected');
	},
	
	setChecked: function(value){
		this.find('.x-icon').dom.className = 'x-icon x-icon-' + (value === false ? 'unchecked' : value !== null ? 'checked' : 'none');
		return this;
	},
	
	getChecked: function(){
		return this.hasClass('x-menuitem x-menuitem-checked');
	},
	
	setDisabled: function(value){
		this.getParent().toggleClass('x-menuitem-disabled', value);
		this.toggleClass('x-menuitem-disabled', value);
		return this;
	},
	
	getDisabled: function(){
		return this.hasClass('x-menuitem x-menuitem-disabled');
	}

});

var MenuSeperator = Control.extend({
	
	tpl: '<div class="x-menu-seperator"></div>',
	
	init: Function.empty
	
});

var Menu = ListControl.extend({
	
	xType: 'menu',
	
	initChild: function (item) {
		if(item instanceof MenuItem || item instanceof MenuSeperator){
			return item;
		}
		if(item === '-'){
			return new 	MenuSeperator();
		}
		
		if(item instanceof Control && item.hasClass('x-menuitem')){
			return new MenuItem(item);
		}
		
		var menu = new MenuItem();
		menu.append(item);
		return menu;
	},
	
	init: function(){
		var me = this;
		me.base('init');
		
		// 绑定节点和控件，方便发生事件后，根据事件源得到控件。
		JPlus.setData(this.dom, 'menu', this);
	},
	
	showMenu: function(){
		this.show();
		this.onShow();
	},
	
	hideMenu: function(){
		this.hide();
		this.onHide();
	},
	
	/**
	 * 当前菜单依靠某个控件显示。
	 * @param {Control} ctrl 方向。
	 */
	showAt: function(x, y){
		
		if(!this.getParent('body')){
			this.appendTo();
		}
		
		// 显示节点。
		this.showMenu();
		
		this.setPosition(x, y);
		
		return this;
	},
	
	/**
	 * 当前菜单依靠某个控件显示。
	 * @param {Control} ctrl 方向。
	 */
	showBy: function(ctrl){
		
		if(!this.getParent('body')){
			this.appendTo(ctrl.getParent());
		}
		
		// 显示节点。
		this.showMenu();
		
		this.align(ctrl, 'rt', -5, -5);
		
		return this;
	},
	
	onShow: function(){
		this.floating = true;
		document.one('mouseup', this.hideMenu, this);
	},
	
	/**
	 * 关闭本菜单。
	 */
	onHide: function(){
		
		// 先关闭子菜单。
		this.hideSub();
	},
	
	/**
	 * 打开本菜单子菜单。
	 * @protected
	 */
	showSub: function(item){
		
		// 如果不是右键的菜单，在打开子菜单后监听点击，并关闭此子菜单。
		if(!this.floating)
			document.one('mouseup', this.hideSub, this);
		
		// 隐藏当前项子菜单。
		this.hideSub();
		
		// 激活本项。
		item.setSelected(true);
		
		if (item.subMenu) {
			
			// 设置当前激活的项。
			this.currentSubMenu = item;
			
			// 显示子菜单。
			item.subMenu.showBy(item);
			
		}
	},
	
	/**
	 * 关闭本菜单打开的子菜单。
	 * @protected
	 */
	hideSub: function(){
		
		// 如果有子菜单，就隐藏。
		if(this.currentSubMenu) {
			
			// 关闭子菜单。
			this.currentSubMenu.subMenu.hide();
			
			// 取消激活菜单。
			this.currentSubMenu.setSelected(false);
			this.currentSubMenu = null;
		}
	}
	
});



/************************************
 * Milk.Button.ContextMenu
 ************************************/
var ContextMenu = Menu.extend({
	
	floating: true,
	
	setControl: function(ctrl){
		ctrl.on('contextmenu', this.onContextMenu, this);
		
		return this;
	},
	
	setDisbale: function(disbale){
		this.disabled = disbale;
	},
	
	onContextMenu: function(e){ 
		if(!this.disabled)
			this.showAt(e.pageX === undefined ? event.x : e.pageX, e.pageY === undefined ? event.y : e.pageY);
		e.stop();
	}
	
});
/************************************
 * Milk.Form.IInput
 ************************************/
var IInput = {
	
	setAttr: function (name, value) {
		if(typeof value === 'boolean'){
			this.toggleClass('x-' + this.xType + '-' + name, value);
		}
		return this.base('setAttr');
	},
	
	setDisabled: function (value) {
		return this.setAttr('disabled', value !== false);
	},
	
	getDisabled: function () {
		return this.getAttr('disabled');
	},
	
	setReadOnly: function (value) {
		return this.setAttr('readonly', value !== false);
	},
	
	getReadOnly: function () {
		return this.getAttr('readonly');
	},
	
	setName: function (value) {
		return this.setAttr('name', value);
	},
	
	getName: function () {
		return this.getAttr('name');
	},
	
	getForm: function () {
		return Dom.get(this.dom.form);
	},
	
	clear: function(){
		return this.setText('');
	},
	
	select: function(){
		this.dom.select();
		return this;
	}
	
};
/************************************
 * Milk.Form.Form
 ************************************/
/************************************
 * Milk.Form.ListBox
 ************************************/
var ListBox = ListControl.extend(IInput).implement({
	
	xType: 'listbox',
	
	/**
	 * 当用户点击一项时触发。
	 */
	onItemClick: function (item) {
		return this.trigger('itemclick', item);
	},
	
	/**
	 * 当一个选项被选中时触发。
	 */
	onSelect: function(item){
		
		// 如果存在代理元素，则同步更新代理元素的值。
		if(this.formProxy)
			this.formProxy.value = this.baseGetValue(item);
			
		return this.trigger('select', item);
	},
	
	/**
	 * 点击时触发。
	 */
	onClick: function (e) {
		
		// 如果无法更改值，则直接忽略。
		if(this.getDisabled() || this.getReadOnly())
			return;
			
		//获取当前项。
		var item = this.getItemOf(e.target);
		if(item && !this.clickItem(item)){
			e.stop();
		}
	},
	
	/**
	 * 模拟点击一项。
	 */
	clickItem: function(item){
		if(this.onItemClick(item)){
			this.toggleItem(item);
			return true;
		}
		
		return false;
	},
	
	init: function(options){
		var t;
		if(this.dom.tagName === 'SELECT'){
			t = this.dom;
			this.dom = this.create(options);
			t.parentNode.replaceChild(this.dom, t);
		}
		
		this.base('init');
			
		this.on('click', this.onClick);
		
		if(t)
			this.copyItemsFromSelect(t);
		
	},
	
	setName: function (value) {
		if(!this.formProxy){
			this.formProxy = Dom.parseNode('<input type="hidden">');
			this.formProxy.value = this.getValue();
			this.dom.appendChild(this.formProxy);
		}
		
		this.formProxy.name = value;
		return this;
		
	},
	
	getName: function () {
		return this.formProxy && this.formProxy.name;
	},
	
	/**
	 * 底层获取一项的值。
	 */
	baseGetValue: function(item){
		return item ? item.value !== undefined ? item.value : item.getText() : null;
	},
	
	/**
	 * 获取选中项的值，如果每天项被选中，则返回 null 。
	 */
	getValue: function(){
		var selectedItem = this.getSelectedItem();
		return selectedItem ? this.baseGetValue(selectedItem) : this.formProxy ? this.formProxy.value : null;
	},
	
	/**
	 * 查找并选中指定值内容的项。如果没有项的值和当前项相同，则清空选择状态。
	 */
	setValue: function(value){
		
		// 默认设置为值。
		if(this.formProxy)
			this.formProxy.value = value;
			
		var t;
		
		this.controls.each(function(item){
			if(this.baseGetValue(item) === value){
				t = item;
				return false;
			}
		}, this);
		
		return this.setSelectedItem(t);
	},
	
	getForm: function () {
		return Dom.get(this.formProxy && this.formProxy.form);
	},
	
	/**
	 * 反选择一项。
	 */
	clear: function () {
		return  this.setSelectedItem(null);
	},
	
	copyItemsFromSelect: function(select){
		if(select.name){
			this.setName(select.name);
			select.name = '';
		}
		for(var node = select.firstChild; node; node = node.nextSibling) {
			if(node.tagName  === 'OPTION') {
				var item = this.controls.add(Dom.getText(node));
					
				item.value = node.value;
				if(node.selected){
					this.setSelectedItem(item);
				}
			}
		}
		
		if(select.onclick)
			this.dom.onclick = select.onclick;
		
		if(select.onchange)
			this.on('change', select.onchange);
		
	}
	
});

/************************************
 * Milk.Form.TextBox
 ************************************/
var TextBox = Control.extend({
	
	xType: 'textbox',
	
	tpl: '<input type="text" class="x-textbox">',
	
	onChange: function(old, text){
		this.trigger('change', old);
	},
	
	setText: function (value) {
		var old = this.getText();
		this.base('setText');
		
		if(old !== value)
			this.onChange(old, value);
	}
	
}).implement(IInput);
/************************************
 * Milk.Form.TextArea
 ************************************/
/************************************
 * Milk.Form.CombinedTextBox
 ************************************/
var CombinedTextBox = TextBox.extend({
	
	tpl: '<span class="x-combinedtextbox">\
			<input type="text" class="x-textbox" type="text"/>\
			<button class="x-button"><span class="x-button-menu"></span></button>\
		</span>',
	
	/**
	 * @protected
	 */
	setMenuType: function(type){
		this.menuButton.find('.x-button-menu').dom.className = 'x-icon x-icon-' + type;
		return this;
	},
	
	setText: function(value){
		var old = this.getText();
		Dom.prototype.setText.call(this.textBox, value);
		
		if(old !== value)
			this.onChange(old, value);
	},
	
	/**
	 * @protected
	 * @override
	 */
	init: function(){
		
		if(this.dom.tagName === 'INPUT'){
			var t = this.dom;
			this.dom = document.createElement('span');
			if(t.parentNode)
				t.parentNode.replaceChild(this.dom, t);
				
			this.dom.className = 'x-combinedtextbox';
			this.dom.appendChild(t);
			this.dom.appendChild(Dom.parseNode('<button class="x-button"><span class="x-button-menu x-button-menu-down"></span></button>'));
		}
		
		this.addClass('x-combinedtextbox');
		this.textBox = new TextBox(this.find('[type=text]'));
		this.menuButton = this.find('.x-button');
	},
	
	setAttr: function (name, value) {
		if(typeof value === 'boolean'){
			return this.textBox.setAttr(name, value);
		}
		return this.base('setAttr');
	},
	
	setDisabled: function(value){
		value = value !== false;
		this.menuButton.setAttr('disabled', value ? 'disabled' : '').toggleClass('x-button-disabled', value);
		return this.base('setDisabled');
	}

});

Control.delegate(CombinedTextBox, 'textBox', 'setReadOnly setName select', 'getDisabled getReadOnly getText getName getForm');
/************************************
 * Milk.Form.ComboBox
 ************************************/
var ComboBox = CombinedTextBox.extend(IDropDownMenuContainer).implement({
	
	xType: 'combobox',
	
	onKeyDown: function(e){
		switch(e.keyCode) {
			case 40:
			case 38:
				this.showDropDownMenu();
				this.dropDownMenu.selectNext(e.keyCode === 40);
			    e.preventDefault();
			    return;
			case 13:
			case 10:
				var currentIndex = this.dropDownMenu.getSelectedIndex();
				if(currentIndex != -1) {
					this.onSelectItem(this.controls[currentIndex]);
					e.preventDefault();
				}
		}
	},
	
	onDropDownMenuOpen: function(){
		
		// 默认选中当前项。
		this.updateDropDownMenu();
		this.trigger('dropdownmenuopen');
	},
	
	onSelect: function(item){
		return this.trigger('select', item);
	},
	
	onSelectItem: function (item) {
		if(this.onSelect(item)) {
			this.hideDropDownMenu();
			this.setSelectedItem(item);
		}
		return false;
		
	},
	
	init: function (options) {
		
		// 1. 初始化下拉菜单

		// 创建下拉菜单
		var listBox = new ListBox(), defaultSelectedItem;
		
		// 绑定 mouseover 时改变当前的项。
		listBox.bindSelector('mouseover');
		
		// 设置下拉菜单
		this.setDropDownMenu(listBox);
		
		// 绑定下拉菜单的点击事件
		listBox.on('itemclick', this.onSelectItem, this);
		
		// 关联下拉菜单列表和当前列表。
		this.items = this.controls = listBox.controls;
		
		// 2. 处理 <select>
		
		// 如果初始化的时候传入一个 <select> 则替换 <select>, 并拷贝相关数据。
		if(this.dom.tagName === 'SELECT') {
			var select = this.dom;
			
			// 调用 create 重新生成 dom 。
			this.dom = this.create(options);
			
			// 替换 <select> 为新的 dom。
			select.parentNode.replaceChild(this.dom, select);
			
			// 让 listBox 拷贝 <select> 的成员。
			listBox.copyItemsFromSelect(select);
			
			// 设置文本框为只读的。
			this.setDropDownList();
			
			// 获取默认选中的项，方便在下文设置默认值。
			defaultSelectedItem = listBox.getSelectedItem();
			
		}
		
		// 3. 初始化文本框
		
		// 初始化文本框
		this.base('init');
		
		if(this.textBox.dom.name){
			this.setName(this.textBox.dom.name);
			this.textBox.dom.name = '';
		}
		
		// 4. 绑定事件
		
		// 设置默认值。
		if(defaultSelectedItem) {
			listBox.clear();
			this.onSelectItem(defaultSelectedItem);	
		}
		
		// 设置点击下拉菜单时执行菜单显示。
		this.menuButton.on('click', this.toggleDropDownMenu, this);
		
		// 监听键盘事件。
		this.on('keydown', this.onKeyDown);
		
		// IE6 Hack: keydown 无法监听到回车。
		if(navigator.isIE6) {
			this.on('keypress', this.onKeyDown);	
		}
	},
	
	/**
	 * 设置当前组合框是否允许用户输入自定义的值。
	 */
	setDropDownList: function (value) {
		var textBox = this.find('.x-textbox');
		if(textBox.dom.readOnly = value !== false){
			textBox.addClass('x-combobox-dropdownlist').on('click', this.toggleDropDownMenu, this);	
		} else {
			textBox.removeClass('x-combobox-dropdownlist').un('click', this.toggleDropDownMenu, this);
		}
		return this;
	},
	
	/**
	 * 获取当前组合框的值。
	 */
	getValue: function(){
		return this.dropDownMenu.getValue();
	},
	
	/**
	 * 设置当前组合框的值。
	 */
	setValue: function(value){
		var old = this.getValue();
		
		this.dropDownMenu.setValue(value);
		
		if(this.formProxy) {
			this.formProxy.value = value;
		}
		
		var t = this.dropDownMenu.getSelectedItem();
		
		// 如果选择的项，则表示 value 设置成功。
		if(t) {
			this.setText(t.getText());
			
		// 否则， 找不到对应 value 的项。
		} else if(old !== value){
			this.onChange(old, value);
		}
		return this;
	},
	
	/**
	 * 将当前文本的值同步到下拉菜单。
	 */
	updateDropDownMenu: function(){
		return this.dropDownMenu.setText(this.getText());
	},
	
	setName: ListBox.prototype.setName,
	
	getName: ListBox.prototype.getName,
	
	setSelectedItem: function(value){
		this.setValue(this.dropDownMenu.baseGetValue(value));
	},
	
	getSelectedItem: function(){
		return this.updateDropDownMenu().getSelectedItem();
	},
	
	setSelectedIndex: function(value){
		return this.setSelectedItem(this.items[value]);
	},
	
	getSelectedIndex: function(){
		return this.updateDropDownMenu().getSelectedIndex();
	}

}).addEvents({select:{}});
/************************************
 * Milk.Form.Select
 ************************************/
/************************************
 * Milk.Form.CheckBox
 ************************************/
/************************************
 * Milk.Form.RadioButton
 ************************************/
/************************************
 * Milk.Form.SearchTextBox
 ************************************/
var SearchTextBox = CombinedTextBox.extend({
	
	xType: 'searchtextbox',
	
	tpl: '<span class="x-combinedtextbox">\
				<input type="text" class="x-textbox x-searchtextbox" type="text" value="文本框" id="id"/><button class="x-searchtextbox-search"></button>\
			</span>',
	
	init: function(){
		this.base('init');
		this.textBox.on('focus', this.textBox.select);
	}
});




/************************************
 * Milk.Form.Suggest
 ************************************/
var Suggest = Control.extend({
	
	xType: 'suggest',
	
	onKeyDown: function(e){
		switch(e.keyCode) {
			case 40:
			case 38:
				this.showDropDownMenu();
				this.dropDownMenu.selectNext(e.keyCode === 40);
			    e.preventDefault();
			    return;
			case 13:
			case 10:
				var currentIndex = this.dropDownMenu.getSelectedIndex();
				if(currentIndex != -1) {
					this.onSelectItem(this.controls[currentIndex]);
					e.preventDefault();
				}
		}
	},
	
	getSuggestItems: function(text){
		if(!this._values){
			this._values = this.controls.invoke('getText', []);
		}
		
		text = text.toLowerCase();
		return this._values.filter(function(value){
			return value.toLowerCase().indexOf(text) >= 0;
		});
	},
	
	showSuggest: function(){
		var text = this.getText();
		var items = this.getSuggestItems(text);
		
		if(!items || !items.length || (items.length === 1 && items[0] === text))  {
			return this.hideDropDownMenu();
		}
		
		this.items.set(items);
		
		this.showDropDownMenu();
		this.dropDownMenu.selectedItem = null;
		this.dropDownMenu.setSelectedIndex(0);
	},
	
	onKeyUp: function(e){
		switch(e.keyCode) {
			case 40:
			case 38:
			case 13:
			case 36:
			case 37:
			    return;
		}
		
		
		this.showSuggest();
	},
	
	onSelectItem: function(item){
		this.setText(item.getText());
		this.hideDropDownMenu();
		return false;
	},
	
	init: function(options){
		
		var suggest = new ListBox();
		
		suggest.bindSelector('mouseover');
		
		suggest.on('itemclick', this.onSelectItem, this);
		
		suggest.on('mousedown', function(e){
			e.preventDefault();
			this._dropDownMenuDown = true;
		}, this);
		
		suggest.on('mouseup', function(){
			this._dropDownMenuDown = false;
		}, this);
		
		this.setDropDownMenu(suggest);
		
		this.items = this.controls = suggest.controls;
		
		this.on('keydown', this.onKeyDown);
		
		if(navigator.isIE6) {
			this.on('keypress', this.onKeyDown);
		}
		
		this.on('focus', this.showSuggest);
		
		this.on('keyup', this.onKeyUp);
		
		this.on('blur', function (e) {
			var me = this;
			if(this._dropDownMenuDown)
				return;
			this.hideDropDownMenu();
			this._dropDownMenuDown = false;
		});
		
		this.setAttr('autocomplete', 'off');
	}
	
}).implement(IDropDownMenuContainer);

// Suggest.SuggestListBox = ListBox.extend({
// 	
	// xType: 'suggest'
// 	
// });
/************************************
 * Milk.Container.Tabbable
 ************************************/
var Tabbable = ListControl.extend({
	
	xType: 'tabbable',
	
	init: function(){
		this.base('init');
		
		this.bindSelector('click');
	}

});
/************************************
 * Milk.Container.Stackable
 ************************************/
/************************************
 * Milk.Container.Accordion
 ************************************/
var Accordion = ScrollableControl.extend({
	
	/**
	 * xType
	 * @type String
	 */
	xType: 'accordion',
	
	collapseDuration: 200,
	
	activedTab: null,
	
	create:function(options){
		var div = document.createElement('div');
		div.className = 'x-accordion';
		return div;
	},
	
	onControlAdded: function(childControl, index){
		this.base('onControlAdded');
		childControl.collapseDuration = this.collapseDuration;
		
		if(this.activedTab){
			childControl.addClass('x-accordion-collapsed');
			childControl.onCollapse();
		} else {
			this.activedTab = childControl;
			childControl.onExpand();
		}
	},
	
	init:function(options){
		this.query('>.x-accordion-panel').each(function(value){
			this.controls.add(new Accordion.TabPage(value));
		}, this);
	},
	
	/**
	 * 包装元素为 TabPage 。
	 */
	initChild: function (item) {
		return item instanceof Accordion.TabPage ? item : new Accordion.TabPage().setTitle(item || ' ');
	},
	
	getActivedTab: function(){
		return this.activedTab;
	},
	
	setActivedTab: function(tabPage){
		if(this.activedTab === tabPage)
			return;
			
		this.activedTab.collapse();
		tabPage.expand();
		this.activedTab = tabPage;
	}
	
});



Accordion.TabPage = ContainerControl.extend({
	
	parent: null,
	
	tpl: '<div class="x-accordion-panel">\
			<div class="x-accordion-header">\
	                <a href="javascript:;">\
	                </a>\
	              </div>\
				<div class="x-accordion-body">\
					\
				</div>\
			</div>',
	
	init: function(){
		var me = this;
		me.header = me.find('.x-accordion-header').on('click', function(e){
			this.parentControl.setActivedTab(this);
		}, me);
		
		me.container = me.find('.x-accordion-body');
		 
	},
	
	/**
	 * xType
	 * @type String
	 */
	xType: 'accordion'
	
}).implement(ICollapsable);
/************************************
 * Milk.Container.Panel
 ************************************/
var Panel = ContainerControl.extend({
	
	tpl: '<div class="x-panel">\
				<div class="x-panel-body">\
				</div>\
			</div>',
	
	/**
	 * xType
	 * @type String
	 */
	xType: 'panel'
	
}).implement(ICollapsable);


/************************************
 * Milk.DataView.Table
 ************************************/
/************************************
 * Milk.Page.Scaffolding
 ************************************/
/************************************
 * Milk.Page.Grid-Fluid
 ************************************/
/************************************
 * Milk.Page.Grid
 ************************************/
/************************************
 * Milk.Page.Breadcrumb
 ************************************/
/************************************
 * Milk.Page.Pagination
 ************************************/
/************************************
 * Milk.Page.Pager
 ************************************/
/************************************
 * Milk.Display.IToolTip
 ************************************/
var IToolTip = {
	
	/**
	 * 当指针在具有指定工具提示文本的控件内保持静止时，工具提示保持可见的时间期限。-1表示不自动隐藏。 0 表示始终不显示。
	 * @type Number
	 */
	autoDelay: -1,
	
	/**
	 * 工具提示显示之前经过的时间。
	 * @type Number
	 */
	initialDelay: 1000,
	
	/**
	 * 指针从一个控件移到另一控件时，必须经过多长时间才会出现后面的工具提示窗口。
	 * @type Number
	 */
	reshowDelay: 100,
	
	duration: -1,
	
	getArrowType: function(){
		return 'top';
	},
	
	setArrowType: Function.empty,
	
	getArrowSize: function(){
		return {
			x: 0,
			y: 0	
		};
	},
	
	getArrowOffset: function(){
		return {
			x: 0,
			y: 0	
		};
	},
	
	initToolTip: Function.empty,
	
	onHide: Function.empty,
	
	onShow: function(x, y){
		
		if(this.autoDelay > 0) {
			me.timer = setTimeout(Function.bind(this.hide, this), this.autoDelay);
		}
		
	},
	
	showAt: function(x, y){
		if(!this.getParent('body')){
			this.appendTo();
		}
		if(this.autoDelay) {
			this.show(this.duration, this.onShow, 'opacity');
			this.setPosition(x, y);
		}
		
		return this;
	},
	
	showBy: function(ctrl, offsetY, offsetX){
		ctrl = Dom.get(ctrl);
		if(!this.getParent('body')){
			this.appendTo(ctrl.getParent());
		}
		var arrowType = this.getArrowType(),
			targetPosition = ctrl.getPosition(),
			targetSize = ctrl.getSize();
		offsetY = offsetY || 0;
		offsetX = offsetX || 0;
		
		if(arrowType !== 'none') {
			this.show();
			var arrowOffset = this.getArrowOffset(),
				arrowSize = this.getArrowSize();
			switch(arrowType){
				case 'top':
					offsetX += (targetSize.x - arrowSize.x) / 2 - arrowOffset.x;
					offsetY += targetSize.y + arrowSize.y;
					break;
				case 'left':
					offsetX += targetSize.x + arrowSize.x;
					offsetY += (targetSize.y) / 2 - arrowOffset.y;
					break;
				case 'right':
					offsetX -= this.getSize().x + arrowSize.x;
					offsetY += (targetSize.y) / 2 - arrowOffset.y;
					break;
				case 'bottom':
					offsetX += (targetSize.x - arrowSize.x) / 2 - arrowOffset.x;
					offsetY -= arrowSize.y + this.getSize().y;
					break;
			}
			this.hide();
			
		}
		
		this.initToolTip(ctrl);
		return this.showAt(targetPosition.x + offsetX, targetPosition.y + offsetY);
	},
	
	/**
	 * 设置某个控件工具提示。
	 */
	setToolTip: function(ctrl, caption, direction, offsetY, offsetX){
		ctrl = Dom.get(ctrl);
		ctrl.on('mouseover', function(){
			var me = this;
			if(me.timer)
				clearTimeout(me.timer);
			if(me.initialDelay >= 0){
				me.timer = setTimeout(function(){
					me.timer = 0;
					if(caption)
						me.setText(caption);
					if(direction)
						me.setArrowType(direction);
					me.showBy(ctrl, offsetY, offsetX);
				}, me.initialDelay);
			}
		}, this);
		
		ctrl.on('mouseout', this.close, this);
		
		
		return this;
		
	},
	
	close: function(){
		var me = this;
		if(me.timer) {
			clearTimeout(me.timer);
			me.timer = 0;
		}
		me.hide(me.duration, this.onHide, 'opacity');
		return this;
	}
	
};



/************************************
 * Milk.Display.Thumbnail
 ************************************/
/************************************
 * Milk.Display.Icon
 ************************************/
/************************************
 * Milk.Display.List
 ************************************/
/************************************
 * Milk.Display.Arrow
 ************************************/
/************************************
 * Milk.Display.Tip
 ************************************/
/************************************
 * Milk.Display.TipBox
 ************************************/
/************************************
 * Milk.Display.ProgressBar
 ************************************/
/************************************
 * Milk.Display.Bubble
 ************************************/
/************************************
 * Milk.Display.ToolTip
 ************************************/
var ToolTip = ContentControl.extend(IToolTip).implement({
	
	tpl: '<div class="x-tooltip">\
			<span class="x-arrow x-arrow-top">\
				<span class="x-arrow-fore">◆</span>\
			</span>\
			<div class="x-tooltip-container"></div>\
		</div>',
	
	getArrowType: function(){
		var arrow = this.find('.x-arrow'), r = 'none';
		
		if(arrow){
			['top', 'bottom', 'left', 'right'].each(function(value){
				if(arrow.hasClass('x-arrow-' + value)) {
					r = value;
					return false;	
				}
			});
		}
		return r;
	},
	
	setArrowType: function(value){
		this.find('.x-arrow').dom.className = 'x-arrow x-arrow-' + value;
		return this;
	},
	
	getArrowSize: function(){
		return this.find('.x-arrow').getSize();
	},
	
	getArrowOffset: function(){
		return this.find('.x-arrow').getOffset();
	},

	init: function(){
		this.container = this.find('.x-tooltip-container');
		this.hide();
	}


});

/**
 * 显示一个提示。
 * @param {Element} elem 用来对齐的元素。
 * @param {String} text 显示的文本。
 * @param {Number} offsetY=2 Y 的偏移，负值向上。 
 * @param {Number} offsetX=0 X 的偏移，负值向左。 
 */
ToolTip.show = function(ctrl, text, offsetY, offsetX){
	return new ToolTip().setText(text).showBy(Dom.get(ctrl), offsetY === undefined ? 2 : offsetY, offsetX);
};








/************************************
 * Milk.Display.BalloonTip
 ************************************/
var BalloonTip = ContainerControl.extend(IToolTip).implement({
	
	xType: 'balloontip',
	
	tpl: '<div class="x-balloontip">\
		    	<span class="x-arrow x-arrow-bottom">\
					<span class="x-arrow-fore">◆</span>\
				</span>\
				<div class="x-balloontip-body">\
					\
				</div>\
		    </div>',
	
	getArrowType: function(){
		var arrow = this.find('.x-arrow'), r = 'none';
		
		if(arrow){
			['top', 'bottom', 'left', 'right'].each(function(value){
				if(arrow.hasClass('x-arrow-' + value)) {
					r = value;
					return false;	
				}
			});
		}
		return r;
	},
	
	setArrowType: function(value){
		this.find('.x-arrow').dom.className = 'x-arrow x-arrow-' + value;
		return this;
	},
	
	getArrowSize: function(){
		return this.find('.x-arrow').getSize();
	},
	
	getArrowOffset: function(){
		return this.find('.x-arrow').getOffset();
	},

	init: function(){
		this.base('init');
		this.hide();
	}


});

/**
 * 显示一个提示。
 * @param {Element} elem 用来对齐的元素。
 * @param {String} text 显示的文本。
 * @param {Number} offsetY=2 Y 的偏移，负值向上。 
 * @param {Number} offsetX=0 X 的偏移，负值向左。 
 */
BalloonTip.show = function(ctrl, text, offsetY, offsetX){
	return new ToolTip().setText(text).showBy(Dom.get(ctrl), offsetY === undefined ? 2 : offsetY, offsetX);
};




/************************************
 * Milk.Display.Line
 ************************************/
/************************************
 * Milk.DataView.TreeView
 ************************************/
var TreeNode = ScrollableControl.extend(ICollapsable).implement({
	
	/**
	 * 更新节点前面的占位符状态。
	 */
	_updateSpan: function(){
		
		var span = this.getSpan(0), current = this;
		
		while((current = current.parent) && (span = span.getPrevious())){
			
			span.dom.className = current.isLastNode() ? 'x-treenode-space x-treenode-none' : 'x-treenode-space';
		
		}
		
		this.updateNodeType();
	},
	
	/**
	 * 更新一个节点前面指定的占位符的类名。
	 */
	_setSpan: function(depth, className){
		
		this.nodes.each(function(node){
			var first = node.getFirst(depth).dom;
			if(first.tagName == 'SPAN')
				first.className = className;
			node._setSpan(depth, className);
		});
		
	},
	
	_markAsLastNode: function(){
		this.addClass('x-treenode-last');
		this._setSpan(this.depth - 1, 'x-treenode-space x-treenode-none');
	},
	
	_clearMarkAsLastNode: function(){
		this.removeClass('x-treenode-last');
		this._setSpan(this.depth - 1, 'x-treenode-space');
	},
	
	_initContainer: function(childControl){
		var me = this, li = Dom.create('li', 'x-list-content');
		li.append(childControl);
		
		// 如果 子节点有子节点，那么插入子节点的子节点。
		if(childControl.container){
			li.append(childControl.container);
		}
		
		if(childControl.duration === -1){
			childControl.duration = me.duration;
		}
		
		return li;
	},
	
	updateNodeType: function(){
		this.setNodeType(this.nodes.length === 0 ? 'normal' : this.isCollapsed() ? 'plus' : 'minus');
	},
	
	xType: 'treenode',
		   
	depth: 0,
	
	create: function(){
		var div = Dom.create('div', 'x-' + this.xType);
		div.append(Dom.create('span', ''));
		return div.dom;
	},
	
	onDblClick: function(e){
		this.toggleCollapse();
		e.stop();
	},
	
	init: function(options){
		this.content = this.getLast();
		this.setUnselectable();
		this.on('dblclick', this.onDblClick, this);
		this.nodes = this.controls;
		this.container = null;
	},
	
	initChild: function(childControl){
		if(!(childControl instanceof TreeNode)) {
			var t = childControl;
			childControl = new TreeNode();
			if(typeof t === 'string')
				childControl.setText(t);
			else
				Dom.get(childControl).append(t);
		}
		return childControl;
	},
	
	onControlAdded: function(childControl, index){
		var me = this,
			t = this.initContainer(childControl),
			re = this.controls[index];
		
		this.container.insertBefore(t, re && re.getParent());
		
		// 只有 已经更新过 才去更新。
		if(this.depth || this instanceof TreeView){
			childControl.setDepth(this.depth + 1);
		}
		
		me.update();
	},
	
	onControlRemoved: function(childControl, index){
		this.container.removeChild(childControl.getParent());
		childControl.parent = null;
		this.update();
	},
	
	initContainer: function(childControl){
		
		// 第一次执行创建容器。
		this.container = Dom.create('ul', 'x-list-container x-treeview-container');
		
		if(this instanceof TreeView){
			this.dom.appendChild(this.container.dom);	
		} else if(this.dom.parentNode){
			this.dom.parentNode.appendChild(this.container.dom);	
		}
		
		this.initContainer = this._initContainer;
		
		return this.initContainer (childControl);
		
	},
	
	// 由于子节点的改变刷新本节点和子节点状态。
	update: function(){
		
		// 更新图标。
		this.updateNodeType();
		
		// 更新 lastNode
		if(this.nodes.length){
			var currentLastNode = this.nodes[this.nodes.length - 1],
				lastNode = this.lastNode;
			if (lastNode !== currentLastNode) {
				currentLastNode._markAsLastNode();
				this.lastNode = currentLastNode;
				if (lastNode) lastNode._clearMarkAsLastNode();
			}
		}
		
	},
	
	setNodeType: function(type){
		var handle = this.getSpan(0);
		if(handle) {
			handle.dom.className = 'x-treenode-space x-treenode-' + type;
		}
		return this;
	},
	
	expandAll: function(duration, maxDepth){
		if (this.container && maxDepth !== 0) {
			this.expand(duration);
			this.nodes.invoke('expandAll', [duration, --maxDepth]);
		}
		return this;
	},
	
	collapseAll: function(duration, maxDepth){
		if (this.container && maxDepth !== 0) {
			this.nodes.invoke('collapseAll', [duration, --maxDepth]);
			this.collapse(duration);
		}
		return this;
	},
	
	isLastNode: function(){
		return this.parent &&  this.parent.lastNode === this;
	},
	
	onToggleCollapse: function(value){
		this.setNodeType(this.nodes.length === 0 ? 'normal' : value ? 'plus' : 'minus');
		if(!value && (value = this.getNext('ul'))){
			value.dom.style.height = 'auto';
		}
	},
	
	// 获取当前节点的占位 span 。 最靠近右的是 index == 0
	getSpan: function(index){
		return this.content.getPrevious(index);
	},

	// 设置当前节点的深度。
	setDepth: function(value){
		
	
		var currentDepth = this.depth, span, elem = this.dom;
		
		assert(value >= 0, "value 非法。 value = {0}", value);
		
		// 删除已经存在的占位符。
		
		while(currentDepth > value){
			elem.removeChild(elem.firstChild);
			currentDepth--;
		}
	
		// 重新生成占位符。
	
		while(currentDepth < value){
			span = document.createElement('span');
			span.className ='x-treenode-space';
			elem.insertBefore(span, elem.firstChild);
			currentDepth++;
		}
		
		if(elem.lastChild.previousSibling)
			elem.lastChild.previousSibling.onclick = Function.bind(this.toggleCollapse, this);
		
		// 更新深度。
		
		this.depth = value;
		
		this._updateSpan();
		
		// 对子节点设置深度+1
		this.nodes.invoke('setDepth', [value + 1]);
	},
	
	toString: function(){
		return String.format("{0}#{1}", this.getText(), this.depth);
	}

});


Control.delegate
	(TreeNode, 'content', 'setHtml setText')
	(TreeNode, 'content', 'getHtml getText', true);

var TreeView = TreeNode.extend({
	
	xType: 'treeview',
	
	isCollapsed: function () {
		return this.nodes.each(function(value){return value.isCollapsed();});
	},
	
	collapse: function () {
		this.nodes.invoke('collapse', arguments);
		this.onCollapse();
		return this;
	},
	
	expand: function (duration) {
		this.nodes.invoke('expand', arguments);
		this.onExpand();
		return this;
	}
	
});


