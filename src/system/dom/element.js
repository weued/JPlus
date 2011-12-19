/**
 * @fileOverview 元素。提供最底层的 DOM 辅助函数。
 */

(function(window) {

	// 可用的宏
	// ElementSplit - 是否将当前文件分开为子文件
	// ElementCore - 核心部分
	// ElementTraversing - 节点转移部分
	// ElementManipulation - 节点处理部分
	// ElementStyle - CSS部分
	// ElementAttribute - 属性部分
	// ElementEvent - 事件部分
	// ElementDomReady - 加载部分
	// ElementDimension - 尺寸部分
	// ElementOffset - 定位部分

	/// #if !ElementSplit
	/// 	#define ElementCore
	/// 	#define ElementTraversing
	/// 	#define ElementManipulation
	/// 	#define ElementStyle
	/// 	#define ElementAttribute
	/// 	#define ElementEvent
	/// 	#define ElementDomReady
	/// 	#define ElementDimension
	/// 	#define ElementOffset
	/// #endif

	/**
	 * Object 简写。
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
		 * document 简写。
		 * @type Document
		 */
		document = window.document,
	
		/**
		 * JPlus 简写。
		 * @namespace JPlus
		 */
		p = JPlus,
	
		/// #if SupportIE6
	
		/**
		 * 元素。
		 * @type Function 如果页面已经存在 Element， 不管是不是用户自定义的，都直接使用。只需保证 Element 是一个函数即可。
		 */
		e = window.Element || function() {
		},
	
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
		$ = getElementById,
	
		/// #if ElementCore
	
		/**
		 * 函数Element.parse使用的新元素缓存。
		 * @type Object
		 */
		cache = {},
	
		/**
		 * 处理 <div/> 格式标签的正则表达式。
		 * @type RegExp
		 */
		rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	
		/**
		 * 判断是否可以复制的元素的正则表达式。
		 * @type RegExp
		 */
		rNoClone = /<(?:script|object|embed|option|style)/i,
	
		/**
		 * 获取标签名的正则表达式。
		 * @type RegExp
		 */
		rTagName = /<([\w:]+)/,
	
		/**
		 * 在 Element.parse 和 setHtml 中对 HTML 字符串进行包装用的字符串。
		 * @type Object 部分元素只能属于特定父元素， wrapMap 列出这些元素，并使它们正确地添加到父元素中。 IE678
		 *       会忽视第一个标签，所以额外添加一个 div 标签，以保证此类浏览器正常运行。
		 */
		wrapMap = {
		    $default: navigator.isStandard ? [0, '', ''] : [1, '$<div>', '</div>'],
		    option: [1, '<select multiple="multiple">', '</select>'],
		    legend: [1, '<fieldset>', '</fieldset>'],
		    thead: [1, '<table>', '</table>'],
		    tr: [2, '<table><tbody>', '</tbody></table>'],
		    td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
		    col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
		    area: [1, '<map>', '</map>']
		},
	
		/// #endif
	
		/// #if ElementTraversing
	
		/// #if SupportIE6
	
		/**
		 * CSS 选择器。 对于 IE6/7 提供自定义的选择器。
		 */
		cssSelector = div.querySelectorAll ? [function(selector) {
			return (this.dom || this).querySelector(selector);
		}, function(selector) {
			return new ElementList((this.dom || this).querySelectorAll(selector));
		}] : CssSelector(),
	
		/// #else
	
		/// cssSelector = [function(selector) {
		/// return (this.dom || this).querySelector(selector);
		/// }, function(selector) {
		/// return new ElementList((this.dom || this).querySelectorAll(selector));
		/// }],
	
		/// #endif
	
		/// #endif
	
		/// #if ElementAttribute
	
		/**
		 * 表示事件的表达式。
		 * @type RegExp
		 */
		rEventName = /^on(\w+)/,
	
		/**
		 * 特殊属性的列表。
		 * @type Object
		 */
		attributes = {
		    innerText: 'innerText' in div ? 'innerText' : 'textContent',
		    'for': 'htmlFor',
		    'class': 'className'
		},
	
		/// #endif
	
		/// #if ElementStyle
	
		/**
		 * 特殊样式的列表。
		 * @type Object
		 */
		styles = {
		    height: 'setHeight',
		    width: 'setWidth'
		},
	
		/// #if SupportIE8
	
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
	
			assert.isElement(elem, "Element.getStyle(elem, name): 参数 {elem} ~。");
	
			// 获取真实的样式owerDocument返回elem所属的文档对象
			// 调用getComputeStyle的方式为(elem,null)
			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
	
			// 返回 , 在 火狐如果存在 IFrame， 则 computedStyle == null
			// http://drupal.org/node/182569
			return computedStyle ? computedStyle[name] : null;
	
		} : function(elem, name) {
	
			assert.isElement(elem, "Element.getStyle(elem, name): 参数 {elem} ~。");
	
			// 特殊样式保存在 styles 。
			if (name in styles) {
				switch (name) {
					case 'height':
						return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - e.getSize(elem, 'by+py') + 'px';
					case 'width':
						return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - e.getSize(elem, 'bx+px') + 'px';
					case 'opacity':
						return ep.getOpacity.call(elem).toString();
				}
			}
			// currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
			// currentStyle是运行时期样式与style属性覆盖之后的样式
			var r = elem.currentStyle;
	
			if (!r)
				return "";
	
			r = r[name];
	
			// 来自 jQuery
	
			// 如果返回值不是一个带px的 数字。 转换为像素单位
			if (/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {
	
				// 保存初始值
				var style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;
	
				// 放入值来计算
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = name === "fontSize" ? "1em" : (r || 0);
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
		/// // 获取样式
		/// var computedStyle =
		// elem.ownerDocument.defaultView.getComputedStyle(elem, null);
		///
		/// // 返回
		/// return computedStyle ? computedStyle[ name ] : null;
		///
		/// },
	
		/// #endif
	
		/// #endif
	
		/// #if ElementAttribute || ElementStyle
	
		/**
		 * 是否属性的正则表达式。
		 * @type RegExp
		 */
		rStyle = /-(\w)|float/,
	
		/**
		 * float 属性的名字。
		 * @type String
		 */
	
		// IE：styleFloat Other：cssFloat
		styleFloat = 'cssFloat' in div.style ? 'cssFloat' : 'styleFloat',
	
		/// #endif
	
		/// #if ElementEvent
	
		/**
		 * @class Event 用来支持自定义事件的事件对象。
		 */
		pep = {
	
		    /**
			 * 构造函数。
			 * @param {Object} target 事件对象的目标。
			 * @param {String} type 事件对象的类型。
			 * @param {Object} [e] 事件对象的属性。
			 * @constructor
			 */
		    constructor: function(target, type, e) {
			    assert.notNull(target, "JPlus.Event.prototype.constructor(target, type, e): 参数 {target} ~。");
	
			    var me = this;
			    me.target = target;
			    me.srcElement = $(target.dom || target);
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
			 * @example <code>
		     * document.addEventListener('click', function () {
		     * 	
		     * });
		     * </code>
			 */
		    addEventListener: document.addEventListener ? function(type, listener) {
	
			    // 因为 IE 不支持，所以忽略 第三个参数。
			    this.addEventListener(type, listener, false);
	
		    } : function(type, listener) {
	
			    // IE8- 使用 attachEvent 。
			    this.attachEvent('on' + type, listener);
	
		    },
	
		    /**
			 * 移除一个监听器。
			 * @method
			 * @param {String} type 类型。
			 * @param {Function} listener 函数。
			 * @param {Boolean} state 类型。
			 * @seeAlso addEventListener
			 * @example <code>
		     * document.removeEventListener('click', function () {
		     * 
		     * });
		     * </code>
			 */
		    removeEventListener: document.removeEventListener ? function(type, listener) {
	
			    // 因为 IE 不支持，所以忽略 第三个参数。
			    this.removeEventListener(type, listener, false);
	
		    } : function(type, listener) {
	
			    // IE8- 使用 detachEvent 。
			    this.detachEvent('on' + type, listener);
	
		    }
	
		},
	
		/// #endif
	
		/// #if ElementDomReady
	
		/// #if SupportIE8
	
		/**
		 * 浏览器使用的真实的 DOMContentLoaded 事件名字。
		 * @type String
		 */
		domReady = navigator.isStandard ? 'DOMContentLoaded' : 'readystatechange',
	
		/// #else
	
		/// domReady = 'DOMContentLoaded',
	
		/// #endif
	
		/// #endif
	
		/// #if ElementDimension
	
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
			    assert(p && 'x' in p && 'y' in p, "Point.prototype.add(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
			    return new Point(this.x + p.x, this.y + p.y);
		    },
	
		    /**
			 * 将一个点坐标减到当前值。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
		    sub: function(p) {
			    assert(p && 'x' in p && 'y' in p, "Point.prototype.sub(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
			    return new Point(this.x - p.x, this.y - p.y);
		    }
	
		})),
	
		/**
		 * 文档对象。
		 * @class Document 文档对象是对原生 HTMLDocument 对象的补充， 因为 IE6/7 不存在这些对象。 扩展
		 *        Document 也会扩展 HTMLDocument。
		 */
		Document = p.Native(document.constructor || {
			prototype: document
		}),
	
		/**
		 * 所有控件基类。
		 * @class Control
		 * @abstract
		 * @extends Element 控件的周期： constructor - 创建控件对于的 Javascript 类。
		 *          不建议重写，除非你知道你在做什么。 create - 创建本身的 dom 节点。 可重写 - 默认使用 this.tpl 创建。
		 *          init - 初始化控件本身。 可重写 - 默认为无操作。 render - 渲染控件到文档。
		 *          不建议重写，如果你希望额外操作渲染事件，则重写。 detach - 删除控件。不建议重写，如果一个控件用到多个 dom
		 *          内容需重写。
		 */
		Control = namespace(
		        ".Control",
		        Class({
	
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
		            constructor: function(options) {
	
			            // 这是所有控件共用的构造函数。
	
			            var me = this,
	
			            // 临时的配置对象。
			            opt = apply({}, me.options),
	
			            // 当前实际的节点。
			            dom;
	
			            assert(!arguments.length || options, "Control.prototype.constructor(options): 参数 {options} 不能为空。", options);
	
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
			            me.dom = dom ? $(dom) : me.create(opt);
	
			            assert(
			                    me.dom && me.dom.nodeType,
			                    "Control.prototype.constructor(options): 当前实例的 dom 属性为空，或此属性不是 DOM 对象。(检查 options.dom 是否是合法的节点或ID(options 或 options.dom 指定的ID的节点不存在?) 或当前实例的 create 方法是否正确返回一个节点)\r\n当前控件: {dom} {xType}",
			                    me.dom, me.xType);
	
			            // 调用 init 初始化控件。
			            me.init(opt);
	
			            // 处理样式。
			            if ('style' in opt) {
				            assert(me.dom.style, "Control.prototype.constructor(options): 当前控件不支持样式。");
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
	
			            assert(this.tpl,
			                    "Control.prototype.create(): 当前类不存在 tpl 属性。Control.prototype.create 会调用 tpl 属性，根据这个属性中的 HTML 代码动态地生成节点并返回。子类必须定义 tpl 属性或重写 Control.prototype.create 方法返回节点。");
	
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
		            cloneNode: function(cloneContent) {
			            return new this.constructor(this.dom.cloneNode(cloneContent));
		            },
	
		            /**
					 * 创建并返回控件的副本。
					 * @param {Boolean} keepId=fasle 是否复制 id 。
					 * @return {Control} 新的控件。
					 */
		            clone: function(keepId) {
	
			            // 创建一个控件。
			            return new this.constructor(this.dom.nodeType === 1 ? this.dom.clone(false, true, keepId) : this.dom.cloneNode(!keepId));
	
		            }
	
		        })),
	
		/**
		 * 节点集合。
		 * @class ElementList
		 * @extends Array ElementList 是对元素数组的只读包装。 ElementList 允许快速操作多个节点。
		 *          ElementList 的实例一旦创建，则不允许修改其成员。
		 */
		ElementList = namespace(".ElementList",
	
		/// #if SupportIE6
	
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
			 * 初始化 ElementList 实例。
			 * @param {Array/ElementList} doms 节点集合。
			 * @constructor
			 */
		    constructor: function(doms) {
	
			    if (doms) {
	
				    assert(doms.length !== undefined, 'ElementList.prototype.constructor(doms): 参数 {doms} 必须是一个 NodeList 或 Array 类型的变量。', doms);
	
				    var len = this.length = doms.length;
				    while (len--)
					    this[len] = doms[len];
	
				    /// #if SupportIE8
	
				    // 检查是否需要为每个成员调用 $ 函数。
				    if (!navigator.isStandard)
					    o.update(this, $);
	
				    /// #endif
	
			    }
	
		    },
	
		    /**
			 * 将参数数组添加到当前集合。
			 * @param {Element/ElementList} value 元素。
			 * @return this
			 */
		    concat: function(value) {
			    if (value) {
				    value = value.length !== undefined ? value : [value];
				    for ( var i = 0, len = value.length; i < len; i++)
					    this.include(value[i]);
			    }
	
			    return this;
		    },
	
		    /**
			 * 对每个元素执行 cloneNode, 并返回新的元素的集合。
			 * @param {Boolean} cloneContent 是否复制子元素。
			 * @return {ElementList} 复制后的新元素组成的新集合。
			 */
		    cloneNode: function(cloneContent) {
			    var i = this.length, r = new ElementList();
			    while (i--)
				    r[i] = this[i].cloneNode(cloneContent);
			    return r;
		    },
	
		    /**
			 * xType
			 */
		    xType: "elementlist"
	
		}));

	/// #if SupportIE6

	if (navigator.isQuirks) {
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

        /// #if ElementCore

        /**
		 * 转换一个HTML字符串到节点。
		 * @param {String/Element} html 字符。
		 * @param {Element} context 生成节点使用的文档中的任何节点。
		 * @param {Boolean} cachable=true 是否缓存。
		 * @return {Element/TextNode/DocumentFragment} 元素。
		 * @static
		 */
        parse: function(html, context, cachable) {

            assert.notNull(html, 'Element.parse(html, context, cachable): 参数 {html} ~。');

            // 已经是 Element 或 ElementList。
            if (html.xType)
	            return html;

            if (html.nodeType)
	            return new Control(html);

            var div = cache[html];

            context = context && context.ownerDocument || document;

            assert(context.createElement, 'Element.parse(html, context, cachable): 参数 {context} 必须是 DOM 节点。', context);

            if (div && div.ownerDocument === context) {

	            // 复制并返回节点的副本。
	            div = div.cloneNode(true);

            } else {

	            // 过滤空格 // 修正 XHTML
	            var tag = rTagName.exec(html);

	            if (tag) {

		            assert.isString(html, 'Element.parse(html, context, cachable): 参数 {html} ~。');

		            div = context.createElement("div");

		            var wrap = wrapMap[tag[1].toLowerCase()] || wrapMap.$default;

		            div.innerHTML = wrap[1] + html.trim().replace(rXhtmlTag, "<$1></$2>") + wrap[2];

		            // 转到正确的深度
		            for (tag = wrap[0]; tag--;)
			            div = div.lastChild;

		            // 一般使用最后的节点， 如果存在最后的节点，使用父节点。
		            // 如果有多节点，则复制到片段对象。
		            if (div.lastChild !== div.firstChild) {
			            div = new ElementList(div.childNodes);
		            } else {

			            /// #if SupportIE8

			            div = $(div.lastChild);

			            /// #endif

			            assert(div, "Element.parse(html, context, cachable): 无法根据 {html} 创建节点。", html);

		            }

	            } else {

		            // 创建文本节点。
		            div = context.createTextNode(html);
	            }

	            div = div.xType ? div : new Control(div);

	            if (cachable !== undefined ? cachable : !rNoClone.test(html)) {
		            cache[html] = div.cloneNode(true);

		            // 特殊属性复制。
		            // if (html = e.properties[div.tagName])
		            // cache[html][html] = div[html];
	            }

            }

            return div;

        },

        /// #endif

        /// #if ElementManipulation

        /**
		 * 判断指定节点之后有无存在子节点。
		 * @param {Element} elem 节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
		 */
        hasChild: div.compareDocumentPosition ? function(elem, child) {
            assert.isNode(elem, "Element.hasChild(elem, child): 参数 {elem} ~。");
            assert.isNode(child, "Element.hasChild(elem, child): 参数 {child} ~。");
            return !!(elem.compareDocumentPosition(child) & 16);
        } : function(elem, child) {
            assert.isNode(elem, "Element.hasChild(elem, child): 参数 {elem} ~。");
            assert.isNode(child, "Element.hasChild(elem, child): 参数 {child} ~。");
            while (child = child.parentNode)
	            if (elem === child)
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

        /// #endif

        /// #if ElementTraversing

        /**
		 * 用于 get 的名词对象。
		 * @type String
		 */
        treeWalkers: {

            // 全部子节点。
            all: 'all' in div ? function(elem, fn) { // 返回数组
                assert.isFunction(fn, "Element.prototype.get('all', args): 参数 {args} ~。");
                var r = new ElementList;
                ap.forEach.call(elem.all, function(elem) {
	                if (fn(elem))
		                r.push(elem);
                });
                return r;
            } : function(elem, fn) {
                assert.isFunction(fn, "Element.prototype.get('all', args): 参数 {args} ~。");
                var r = new ElementList, doms = [elem];
                while (elem = doms.pop()) {
	                for (elem = elem.firstChild; elem; elem = elem.nextSibling)
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
                assert.isFunction(args, "Element.prototype.get('closest', args): 参数 {args} 必须是函数");
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
            even: function(elem, args) {
                return this.children(elem, function(elem) {
	                return args = !args;
                });
            },

            // 兄弟节点。
            siblings: function(elem, args) {
                return this.previouses(elem, args).concat(this.nexts(elem, args));
            },

            // 号次。
            index: function(elem) {
                var i = 0;
                while (elem = elem.previousSibling)
	                if (elem.nodeType === 1)
		                i++;
                return i;
            },

            // 偏移父位置。
            offsetParent: function(elem) {
                var me = elem;
                while ((me = me.offsetParent) && !rBody.test(me.nodeName) && styleString(me, "position") === "static")
	                ;
                return $(me || getDocument(elem).body);
            }

        },

        /// #endif

        /// #if ElementAttributes

        /**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
        attributes: attributes,

        /**
		 * 获取一个节点属性。
		 * @static
		 * @param {Element} elem 元素。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
        getAttr: function(elem, name) {

            assert.isNode(elem, "Element.getAttr(elem, name): 参数 {elem} ~。");

            // if(navigator.isSafari && name === 'selected' &&
			// elem.parentNode) { elem.parentNode.selectIndex;
			// if(elem.parentNode.parentNode)
			// elem.parentNode.parentNode.selectIndex; }

            var fix = attributes[name];

            // 如果是特殊属性，直接返回Property。
            if (fix) {

	            if (fix.get)
		            return fix.get(elem, name);

	            assert(!elem[fix] || !elem[fix].nodeType, "Element.getAttr(elem, name): 表单内不能存在 {name} 的元素。", name);

	            // 如果 这个属性是自定义属性。
	            if (fix in elem)
		            return elem[fix];
            }

            assert(elem.getAttributeNode, "Element.getAttr(elem, name): 参数 {elem} 不支持 getAttribute。", elem);

            // 获取属性节点，避免 IE 返回属性。
            fix = elem.getAttributeNode(name);

            // 如果不存在节点， name 为 null ，如果不存在节点值， 返回 null。
            return fix && (fix.value || null);

        },

        /**
		 * 检查是否含指定类名。
		 * @param {Element} elem 元素。
		 * @param {String} className 类名。
		 * @return {Boolean} 如果存在返回 true。
		 */
        hasClass: function(elem, className) {
            assert.isNode(elem, "Element.hasClass(elem, className): 参数 {elem} ~。");
            assert(className && (!className.indexOf || !/[\s\r\n]/.test(className)),
                    "Element.hasClass(elem, className): 参数 {className} 不能空，且不允许有空格和换行。");
            return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
        },

        /// #endif

        /// #if ElementStyle

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

            // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
            elem.style.display = '';

            // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
            if (getStyle(elem, 'display') === 'none')
	            elem.style.display = p.getData(elem, 'display') || 'block';
        },

        /**
		 * 赋予元素的 display 属性 none。
		 * @param {Element} elem 元素。
		 */
        hide: function(elem) {
            var currentDisplay = styleString(elem, 'display');
            if (currentDisplay !== 'none') {
	            p.setData(elem, 'display', currentDisplay);
	            elem.style.display = 'none';
            }
        },

        /**
		 * 获取指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 * @return {Object} 收集的属性。
		 */
        getStyles: function(elem, styles) {
            assert.isElement(elem, "Element.getStyles(elem, styles): 参数 {elem} ~。");

            var r = {};
            for ( var style in styles) {
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
            assert.isElement(elem, "Element.getStyles(elem, styles): 参数 {elem} ~。");

            apply(elem.style, styles);
        },

        /// #endif

        /// #if ElementDimension || ElementStyle

        /**
		 * 根据不同的内容进行计算。
		 * @param {Element} elem 元素。
		 * @param {String} type 输入。 一个 type
		 *            由多个句子用,连接，一个句子由多个词语用+连接，一个词语由两个字组成， 第一个字可以是下列字符之一:
		 *            m b p t l r b h w 第二个字可以是下列字符之一: x y l t r
		 *            b。词语也可以是: outer inner 。
		 * @return {Number} 计算值。 mx+sx -> 外大小。 mx-sx -> 内大小。
		 */
        getSize: (function() {

            var borders = {
                m: 'margin#',
                b: 'border#Width',
                p: 'padding#'
            }, map = {
                t: 'Top',
                r: 'Right',
                b: 'Bottom',
                l: 'Left'
            }, init, tpl, rWord = /\w+/g;

            if (window.getComputedStyle) {
	            init = 'var c=e.ownerDocument.defaultView.getComputedStyle(e,null);return ';
	            tpl = '(parseFloat(c["#"]) || 0)';
            } else {
	            init = 'return ';
	            tpl = '(parseFloat(Element.getStyle(e, "#")) || 0)';
            }

            /**
			 * 翻译 type。
			 * @param {String} type 输入字符串。
			 * @return {String} 处理后的字符串。
			 */
            function format(type) {
	            var t, f = type.charAt(0);
	            switch (type.length) {

		            // borders + map
		            // borders + x|y
		            // s + x|y
		            case 2:
			            t = type.charAt(1);
			            assert(f in borders || f === 's', "Element.getSize(e, type): 参数 type 中的 " + type + " 不合法");
			            if (t in map) {
				            t = borders[f].replace('#', map[t]);
			            } else {
				            return f === 's' ? 'e.offset' + (t === 'x' ? 'Width' : 'Height') : '(' + format(f + (t !== 'y' ? 'l' : 't')) + '+'
				                    + format(f + (t === 'x' ? 'r' : 'b')) + ')';
			            }

			            break;

		            // map
		            // w|h
		            case 1:
			            if (f in map) {
				            t = map[f].toLowerCase();
			            } else if (f !== 'x' && f !== 'y') {
				            assert(f === 'h' || f === 'w', "Element.getSize(elem, type): 参数 type 中的 " + type + " 不合法");
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

            return function(elem, type) {
	            assert.isElement(elem, "Element.getSize(elem, type): 参数 {elem} ~。");
	            assert.isString(type, "Element.getSize(elem, type): 参数 {type} ~。");
	            return (e.sizeMap[type] || (e.sizeMap[type] = new Function("e", init + type.replace(rWord, format))))(elem);
            }

        })(),

        /// #endif

        /// #if ElementDimension

        /**
		 * 设置一个元素可拖动。
		 * @param {Element} elem 要设置的节点。
		 * @static
		 */
        setMovable: function(elem) {
            assert.isElement(elem, "Element.setMovable(elem): 参数 elem ~。");
            if (!rMovable.test(styleString(elem, "position")))
	            elem.style.position = "relative";
        },

        /// #endif

        /**
		 * 将一个成员附加到 Element 对象和相关类。
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 ElementList 实例。
		 * @return {Element} this
		 * @static 对 Element 扩展，内部对 Element ElementList document 皆扩展。
		 *         这是由于不同的函数需用不同的方法扩展，必须指明扩展类型。 所谓的扩展，即一个类所需要的函数。 DOM 方法
		 *         有 以下种 1, 其它 setText - 执行结果返回 this， 返回 this 。(默认) 2
		 *         getText - 执行结果是数据，返回结果数组。 3 getElementById - 执行结果是DOM
		 *         或 ElementList，返回 ElementList 包装。 4 hasClass -
		 *         只要有一个返回等于 true 的值， 就返回这个值。 参数 copyIf 仅内部使用。
		 */
        implement: function(members, listType, copyIf) {

            assert.notNull(members, "Element.implement" + (copyIf ? 'If' : '') + "(members, listType): 参数 {members} ~。");

            Object.each(members, function(value, func) {

	            var i = this.length;
	            while (i--) {
		            var cls = this[i].prototype;
		            if (!copyIf || !cls[func]) {

			            if (!i) {
				            switch (listType) {
					            case 2: // return array
						            value = function() {
							            return this.invoke(func, arguments);
						            };
						            break;

					            case 3: // return ElementList
						            value = function() {
							            var args = arguments, r = new ElementList;
							            this.forEach(function(node) {
								            r.concat(node[func].apply(node, args));
							            });
							            return r;

						            };
						            break;
					            case 4: // return if true
						            value = function() {
							            var me = this, i = -1, item = null;
							            while (++i < me.length && !item)
								            item = me[i][func].apply(me[i], arguments);
							            return item;
						            };
						            break;
					            default: // return this
						            value = function() {
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

            /// #if SupportIE8

            if (ep.$version) {
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
        implementIf: function(obj, listType) {
            return this.implement(obj, listType, true);
        },

        /**
		 * 定义事件。
		 * @param {String} 事件名。
		 * @param {Function} trigger 触发器。
		 * @return {Function} 函数本身
		 * @static
		 * @memberOf Element 原则 Element.addEvents 可以解决问题。 但由于 DOM
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
        addEvents: function(events, baseEvent, initEvent) {

            var ee = p.Events.element;

            if (Object.isObject(events)) {
	            p.Object.addEvents.call(this, events);
	            return this;
            }

            assert.isString(events, "Element.addEvents(events, baseEvent, initEvent): 参数 {events} ~或对象。");

            // 删除已经创建的事件。
            delete ee[events];

            assert(!initEvent || ee[baseEvent], "Element.addEvents(events, baseEvent, initEvent): 不存在基础事件 {baseEvent}。");

            // 对每个事件执行定义。
            map(events, Function.from(o.extendIf(Function.isFunction(baseEvent) ? {

	            initEvent: baseEvent

            } : {

                initEvent: initEvent ? function(e) {
	                return ee[baseEvent].initEvent.call(this, e) !== false && initEvent.call(this, e);
                } : ee[baseEvent].initEvent,

                // 如果存在 baseEvent，定义别名， 否则使用默认函数。
                add: function(elem, type, fn) {
	                elem.addEventListener(baseEvent, fn, false);
                },

                remove: function(elem, type, fn) {
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

	/// #if !SupportIE8 && (ElementEvent || ElementDomReady)

	/**
	 * xType
	 * @type String
	 */
	.implementIf(apply({
		xType: "element"
	}, eventObj))

	/// #else

	/// .implementIf({xType: "element"})

	/// #endif

	.implement({

        /// #if ElementManipulation

        /**
		 * 将当前节点添加到其它节点。
		 * @param {Element/String} elem=document.body 节点、控件或节点的 id 字符串。
		 * @return {Element} this this.appendTo(parent) 相当于
		 *         elem.appendChild(this) 。 appendTo 同时执行 render(parent,
		 *         null) 通知当前控件正在执行渲染。
		 */
        appendTo: function(parent) {

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
        render: function(parent, refNode) {
            assert(parent && parent.insertBefore, 'Element.prototype.render(parent, refNode): 参数 {parent} 必须是 DOM 节点或控件。', parent);
            assert(refNode || refNode === null, 'Element.prototype.render(parent, refNode): 参数 {refNode} 必须是 null 或 DOM 节点或控件。', refNode);
            return parent.insertBefore(this.dom || this, refNode);
        },

        /**
		 * 删除元素子节点或本身。
		 * @param {Object/Undefined} child 子节点。
		 * @return {Element} this
		 */
        remove: function(child) {

            // 没有参数， 删除本身。
            if (!arguments.length)
	            return this.detach();

            assert(!child || this.hasChild(child), 'Element.prototype.remove(child): 参数 {child} 不是当前节点的子节点', child);
            child.detach ? child.detach() : this.removeChild(child);
            return this;
        },

        /**
		 * 删除一个节点的所有子节点。
		 * @return {Element} this
		 */
        empty: function() {
            var elem = this.dom || this;
            o.each(elem.getElementsByTagName("*"), clean);
            while (elem.lastChild)
	            elem.removeChild(elem.lastChild);
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
        dispose: function() {
            var elem = this.dom || this;
            o.each(elem.getElementsByTagName("*"), clean);
            this.detach();
        },

        /// #endif

        /// #if ElementStyle

        /**
		 * 设置内容样式。
		 * @param {String} name CSS 属性名或 CSS 字符串。
		 * @param {String/Number} [value] CSS属性值， 数字如果不加单位，则自动转为像素。
		 * @return {Element} this setStyle('cssText') 不被支持，需要使用 name，
		 *         value 来设置样式。
		 */
        setStyle: function(name, value) {

            assert.isString(name, "Element.prototype.setStyle(name, value): 参数 {name} ~。");

            // 获取样式
            var me = this;

            // 没有键 返回 cssText
            if (name in styles) {

	            // setHeight setWidth setOpacity
	            return me[styles[name]](value);

            } else {
	            name = name.replace(rStyle, formatStyle);

	            assert(value || !isNaN(value), "Element.prototype.setStyle(name, value): 参数 {value} 不是正确的属性值。", value);

	            // 如果值是函数，运行。
	            if (typeof value === "number" && !(name in e.styleNumbers))
		            value += "px";

            }

            // 指定值。
            (me.dom || me).style[name] = value;

            return me;
        },

        /// #if SupportIE8

        /**
		 * 设置连接的透明度。
		 * @param {Number} value 透明度， 0 - 1 。
		 * @return {Element} this
		 */
        setOpacity: 'opacity' in div.style ? function(value) {

            assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);

            // 标准浏览器使用 opacity
            (this.dom || this).style.opacity = value;
            return this;

        } : function(value) {

            var elem = this.dom || this, style = elem.style;

            assert(!+value || (value <= 1 && value >= 0), 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);

            if (value)
	            value *= 100;

            value = value || value === 0 ? 'opacity=' + value : '';

            // 获取真实的滤镜。
            elem = styleString(elem, 'filter');

            assert(!/alpha\([^)]*\)/i.test(elem) || rOpacity.test(elem),
                    'Element.prototype.setOpacity(value): 当前元素的 {filter} CSS属性存在不属于 alpha 的 opacity， 将导致 setOpacity 不能正常工作。', elem);

            // 当元素未布局，IE会设置失败，强制使生效。
            style.zoom = 1;

            // 设置值。
            style.filter = rOpacity.test(elem) ? elem.replace(rOpacity, value) : (elem + ' alpha(' + value + ')');

            return this;

        },

        /// #else

        /// setOpacity: function (value) {
        ///
        /// assert(value <= 1 && value >= 0,
		// 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。',
		// value);
        ///
        /// // 标准浏览器使用 opacity
        /// (this.dom || this).style.opacity = value;
        /// return this;
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

            e.show(this.dom || this);
            if (callBack)
	            setTimeout(callBack, 0);
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

            e.hide(this.dom || this);
            if (callBack)
	            setTimeout(callBack, 0);
            return this;
        },

        /**
		 * 切换显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
        toggle: function(duration, callBack, type, flag) {
            return this[(flag === undefined ? this.isHidden() : flag) ? 'show' : 'hide'](duration, callBack, type);
        },

        /**
		 * 设置元素不可选。
		 * @param {Boolean} value 是否可选。
		 * @return this
		 */
        setUnselectable: 'unselectable' in div ? function(value) {

            (this.dom || this).unselectable = value !== false ? 'on' : '';
            return this;
        } : 'onselectstart' in div ? function(value) {

            (this.dom || this).onselectstart = value !== false ? Function.returnFalse : null;
            return this;
        } : function(value) {

            (this.dom || this).style.MozUserSelect = value !== false ? 'none' : '';
            return this;
        },

        /**
		 * 将元素引到最前。
		 * @param {Element} [elem] 参考元素。
		 * @return this
		 */
        bringToFront: function(elem) {

            assert(!elem || (elem.dom && elem.dom.style) || elem.style, "Element.prototype.bringToFront(elem): 参数 {elem} 必须为 元素或为空。", elem);

            var thisElem = this.dom || this, targetZIndex = elem && (parseInt(styleString(elem.dom || elem, 'zIndex')) + 1) || e.zIndex++;

            // 如果当前元素的 z-index 未超过目标值，则设置
            if (!(styleString(thisElem, 'zIndex') > targetZIndex))
	            thisElem.style.zIndex = targetZIndex;

            return this;
        },

        /// #endif

        /// #if ElementAttribute

        /**
		 * 设置节点属性。
		 * @param {String} name 名字。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
        setAttr: function(name, value) {

            var elem = this.dom || this;

            /// #if SupportIE6

            assert(name !== 'type' || elem.tagName !== "INPUT" || !elem.parentNode, "Element.prototype.setAttr(name, type): 无法修改INPUT元素的 type 属性。");

            /// #endif

            // 如果是节点具有的属性。
            if (name in attributes) {

	            if (attributes[name].set)
		            attributes[name].set(elem, name, value);
	            else {

		            assert(elem.tagName !== 'FORM' || name !== 'className' || typeof me.className === 'string',
		                    "Element.prototype.setAttr(name, type): 表单内不能存在 name='className' 的节点。");

		            elem[attributes[name]] = value;

	            }

            } else if (value === null) {

	            assert(elem.removeAttributeNode, "Element.prototype.setAttr(name, type): 当前元素不存在 removeAttributeNode 方法");

	            if (value = elem.getAttributeNode(name)) {
		            value.nodeValue = '';
		            elem.removeAttributeNode(value);
	            }

            } else {

	            assert(elem.getAttributeNode, "Element.prototype.setAttr(name, type): 当前元素不存在 getAttributeNode 方法");

	            var node = elem.getAttributeNode(name);

	            if (node)
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

            if (typeof name === "string") {

	            var elem = me.dom || me;

	            // event 。
	            if (name.match(rEventName))
		            me.on(RegExp.$1, value);

	            // css 。
	            else if (elem.style && (name in elem.style || rStyle.test(name)))
		            me.setStyle(name, value);

	            // attr 。
	            else
		            me.setAttr(name, value);

            } else if (o.isObject(name)) {

	            for (value in name)
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

          	assert(className && !/[\s\r\n]/.test(className), "Element.prototype.addClass(className): 参数 {className} 不能空，且不允许有空格和换行。如果需要添加多个类名，可以调用多次 addClass 。");
            
            if(!this.hasClass(className)){
                var elem = this.dom || this;
            	elem.className = elem.className ? elem.className + ' ' + className : className;
            }

            return this;
        },

        /**
		 * 移除CSS类名。
		 * @param {String} className 类名。
		 */
        removeClass: function(className) {
            var elem = this.dom || this;

         	assert(!className || !/[\s\r\n]/.test(className), "Element.prototype.addClass(className): 参数 {className} 不能空，且不允许有空格和换行。如果需要删除多个类名，可以调用多次 removeClass 。");
            
            elem.className = className ? (" " + elem.className + " ").replace(" " + className + " ", " ").trim() : '';

            return this;
        },

        /**
		 * 切换类名。
		 * @param {String} className 类名。
		 * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
		 * @return {Element} this
		 */
        toggleClass: function(className, toggle) {
            return (toggle !== undefined ? !toggle : this.hasClass(className)) ? this.removeClass(className) : this.addClass(className);
        },

        /**
		 * 设置值。
		 * @param {String/Boolean} 值。
		 * @return {Element} this
		 */
        setText: function(value) {
            var elem = this.dom || this;

            if (elem.nodeType !== 1)
	            elem.nodeValue = value;
            else
	            switch (elem.tagName) {
		            case "SELECT":
			            if (elem.type === 'select-multiple' && value != null) {

				            assert.isString(value, "Element.prototype.setText(value): 参数  {value} ~。");

				            value = value.split(',');
				            o.each(elem.options, function(e) {
					            e.selected = value.indexOf(e.value) > -1;
				            });

				            break;

			            }

			            // 继续执行
		            case "INPUT":
		            case "TEXTAREA":
			            elem.value = value;
			            break;
		            default:
			            elem[attributes.innerText] = value;
	            }

            return this;
        },

        /**
		 * 设置 HTML 。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
        setHtml: function(value) {
            var elem = this.dom || this, map = wrapMap.$default;
            value = (map[1] + value + map[2]).replace(rXhtmlTag, "<$1></$2>");

            o.each(elem.getElementsByTagName("*"), clean);
            elem.innerHTML = value;
            if (map[0]) {
	            value = elem.lastChild;
	            elem.removeChild(elem.firstChild);
	            elem.removeChild(value);
	            while (value.firstChild)
		            elem.appendChild(value.firstChild);
            }

            return this;
        },

        /// #endif

        /// #if ElementDimension

        /**
		 * 改变大小。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
        setSize: function(x, y) {
            var me = this, p = formatPoint(x, y);

            if (p.x != null)
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
        setWidth: function(value) {

            (this.dom || this).style.width = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
            return this;
        },

        /**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
        setHeight: function(value) {

            (this.dom || this).style.height = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
            return this;
        },

        /// #endif

        /// #if ElementOffset

        /**
		 * 设置元素的相对位置。
		 * @param {Point} p
		 * @return {Element} this
		 */
        setOffset: function(p) {

            assert(o.isObject(p) && 'x' in p && 'y' in p, "Element.prototype.setOffset(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
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
        setPosition: function(x, y) {
            var me = this, offset = me.getOffset().sub(me.getPosition()), p = formatPoint(x, y);

            if (p.y)
	            offset.y += p.y;

            if (p.x)
	            offset.x += p.x;

            e.setMovable(me.dom || me);

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
            var elem = this.dom || this, p = formatPoint(x, y);

            if (p.x != null)
	            elem.scrollLeft = p.x;
            if (p.y != null)
	            elem.scrollTop = p.y;
            return this;

        }

    /// #endif

    })

	/// #if ElementEvent

	.implement(p.IEvent)

	/// #endif

	.implement({

	    /// #if ElementStyle

	    /**
		 * 获取节点样式。
		 * @param {String} key 键。
		 * @param {String} value 值。
		 * @return {String} 样式。 getStyle() 不被支持，需要使用 name 来设置样式。
		 */
	    getStyle: function(name) {

		    assert.isString(name, "Element.prototypgetStyle(name): 参数 {name} ~。");

		    var elem = this.dom || this;

		    return elem.style[name = name.replace(rStyle, formatStyle)] || getStyle(elem, name);

	    },

	    /// #if SupportIE8

	    /**
		 * 获取透明度。
		 * @method
		 * @return {Number} 透明度。 0 - 1 范围。
		 */
	    getOpacity: 'opacity' in div.style ? function() {
		    return styleNumber(this.dom || this, 'opacity');
	    } : function() {
		    return rOpacity.test(styleString(this.dom || this, 'filter')) ? parseInt(RegExp.$1) / 100 : 1;
	    },

	    /// #else
	    ///
	    /// getOpacity: function () {
	    ///
	    /// return parseFloat(styleString(this.dom || this, 'opacity')) || 0;
	    ///
	    /// },

	    /// #endif

	    /// #endif

	    /// #if ElementAttribute

	    /**
		 * 获取一个节点属性。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
	    getAttr: function(name) {
		    return e.getAttr(this.dom || this, name);
	    },

	    /**
		 * 检查是否含指定类名。
		 * @param {String} className
		 * @return {Boolean} 如果存在返回 true。
		 */
	    hasClass: function(className) {
		    return e.hasClass(this.dom || this, className);
	    },

	    /**
		 * 获取值。
		 * @return {Object/String} 值。对普通节点返回 text 属性。
		 */
	    getText: function() {
		    var elem = this.dom || this;
		    if (elem.nodeType !== 1)
			    return elem.nodeValue;

		    switch (elem.tagName) {
			    case "SELECT":
				    if (elem.type != 'select-one') {
					    var r = [];
					    o.each(elem.options, function(s) {
						    if (s.selected && s.value)
							    r.push(s.value)
					    });
					    return r.join(',');
				    }

				    // 继续执行
			    case "INPUT":
			    case "TEXTAREA":
				    return elem.value;
			    default:
				    return elem[attributes.innerText];
		    }
	    },

	    /**
		 * 获取值。
		 * @return {String} 值。
		 */
	    getHtml: function() {

		    return (this.dom || this).innerHTML;
	    },

	    /// #if ElementDimension

	    /**
		 * 获取元素可视区域大小。包括 border 大小。
		 * @return {Point} 位置。
		 */
	    getSize: function() {
		    var elem = this.dom || this;

		    return new Point(elem.offsetWidth, elem.offsetHeight);
	    },

	    /**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Point} 位置。
		 */
	    getWidth: function() {
		    return styleNumber(this.dom || this, 'width');
	    },

	    /**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Point} 位置。
		 */
	    getHeight: function() {
		    return styleNumber(this.dom || this, 'height');
	    },

	    /**
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
	    getScrollSize: function() {
		    var elem = this.dom || this;

		    return new Point(elem.scrollWidth, elem.scrollHeight);
	    },

	    /// #endif

	    /// #if ElementOffset

	    /**
		 * 获取元素的相对位置。
		 * @return {Point} 位置。
		 */
	    getOffset: function() {

		    // 如果设置过 left top ，这是非常轻松的事。
		    var elem = this.dom || this, left = elem.style.left, top = elem.style.top;

		    // 如果未设置过。
		    if (!left || !top) {

			    // 绝对定位需要返回绝对位置。
			    if (styleString(elem, "position") === 'absolute') {
				    top = this.get('offsetParent');
				    left = this.getPosition();
				    if (!rBody.test(top.nodeName))
					    left = left.sub(top.getPosition());
				    left.x -= styleNumber(elem, 'marginLeft') + styleNumber(top, 'borderLeftWidth');
				    left.y -= styleNumber(elem, 'marginTop') + styleNumber(top, 'borderTopWidth');

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

		    var elem = this.dom || this, bound = elem.getBoundingClientRect(), doc = getDocument(elem), html = doc.dom, htmlScroll = doc.getScroll();

		    return new Point(bound.left + htmlScroll.x - html.clientLeft, // TODO
		    bound.top + htmlScroll.y - html.clientTop);
	    } : function() {

		    var elem = this.dom || this, p = new Point(0, 0), t = elem.parentNode;

		    if (styleString(elem, 'position') === 'fixed')
			    return new Point(elem.offsetLeft, elem.offsetTop).add(document.getScroll());

		    while (t && !rBody.test(t.nodeName)) {
			    p.x -= t.scrollLeft;
			    p.y -= t.scrollTop;
			    t = t.parentNode;
		    }

		    t = elem;

		    while (elem && !rBody.test(elem.nodeName)) {
			    p.x += elem.offsetLeft;
			    p.y += elem.offsetTop;
			    if (navigator.isFirefox) {
				    if (styleString(elem, 'MozBoxSizing') !== 'border-box') {
					    add(elem);
				    }
				    var parent = elem.parentNode;
				    if (parent && styleString(parent, 'overflow') !== 'visible') {
					    add(parent);
				    }
			    } else if (elem !== t && navigator.isSafari) {
				    add(elem);
			    }

			    if (styleString(elem, 'position') === 'fixed') {
				    p = p.add(document.getScroll());
				    break;
			    }

			    elem = elem.offsetParent;
		    }
		    if (navigator.isFirefox && styleString(t, 'MozBoxSizing') !== 'border-box') {
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
	    getScroll: function() {
		    var elem = this.dom || this;
		    return new Point(elem.scrollLeft, elem.scrollTop);
	    }

	/// #endif

	}, 2)

	.implement({

        /// #if ElementTraversing

        /**
		 * 执行一个简单的选择器。
		 * @method
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
        findAll: cssSelector[1],

        /**
		 * 获得相匹配的节点。
		 * @param {String/Function/Number} treeWalker 遍历函数，该函数在 {#link
		 *            Element.treeWalkers} 指定。
		 * @param {Object} [args] 传递给遍历函数的参数。
		 * @return {Element} 元素。
		 */
        get: function(treeWalker, args) {

            switch (typeof treeWalker) {
	            case 'string':
		            break;
	            case 'function':
		            args = treeWalker;
		            treeWalker = 'all';
		            break;
	            case 'number':
		            if (treeWalker < 0) {
			            args = -treeWalker;
			            treeWalker = 'last';
		            } else {
			            args = treeWalker;
			            treeWalker = 'first';
		            }

            }

            assert(Function.isFunction(e.treeWalkers[treeWalker]), 'Element.prototype.get(treeWalker, args): 不支持 {treeWalker}类型 的节点关联。', treeWalker);
            return e.treeWalkers[treeWalker](this.dom || this, args);
        },

        /// #endif

        /// #if ElementManipulation

        /**
		 * 在某个位置插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @param {String} [where] 插入地点。 beforeBegin 节点外 beforeEnd 节点里
		 *            afterBegin 节点外 afterEnd 节点里
		 * @return {Element} 插入的节点。
		 */
        insert: function(html, where) {

            var elem = this.dom || this, p, refNode = elem;

            assert.isNode(elem, "Element.prototype.insert(html, where): this.dom || this 返回的必须是 DOM 节点。");
            assert(!where || 'afterEnd beforeBegin afterBegin beforeEnd '.indexOf(where + ' ') != -1,
                    "Element.prototype.insert(html, where): 参数 {where} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", where);
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
		            assert(p, "Element.prototype.insert(html, where): 节点无父节点时无法插入 {this}", elem);
		            break;
	            default:
		            assert(!where || where == 'beforeEnd' || where == 'afterBegin',
		                    'Element.prototype.insert(html, where): 参数 {where} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。', where);
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
        append: function(html) {

            // 如果新元素有适合自己的渲染函数。
            return e.parse(html, this.dom || this).render(this, null);
        },

        /**
		 * 将一个节点用另一个节点替换。
		 * @param {Element/String} html 内容。
		 * @return {Element} 替换之后的新元素。
		 */
        replaceWith: function(html) {
            var elem = this.dom || this;

            html = e.parse(html, elem);
            // assert.isNode(html, "Element.prototype.replaceWith(html):
			// 参数 {html} ~或 html片段。");
            if (elem.parentNode) {
	            html.render(elem.parentNode, elem);
	            this.dispose();
            }
            return html;
        },

        /**
		 * 复制节点。
		 * @param {Boolean} cloneEvent=false 是否复制事件。
		 * @param {Boolean} contents=true 是否复制子元素。
		 * @param {Boolean} keepId=false 是否复制 id 。
		 * @return {Element} 元素。
		 */
        clone: function(cloneEvent, contents, keepId) {

            assert.isElement(this, "Element.prototype.clone(cloneEvent, contents, keepid): this 必须是 nodeType = 1 的 DOM 节点。");

            var elem = this, clone = elem.cloneNode(contents = contents !== false);

            if (contents)
	            for ( var elemChild = elem.getElementsByTagName('*'), cloneChild = clone.getElementsByTagName('*'), i = 0; cloneChild[i]; i++)
		            cleanClone(elemChild[i], cloneChild[i], cloneEvent, keepId);

            cleanClone(elem, clone, cloneEvent, keepId);

            return clone;
        }

    /// #endif

    }, 3)

	.implement({

	    /// #if ElementTraversing

	    /**
		 * 执行一个简单的选择器。
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
	    find: cssSelector[0],

	    /// #endif

	    /// #if ElementManipulation

	    /**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
	    contains: function(child) {
		    var elem = this.dom || this;
		    assert.isNode(elem, "Element.prototype.contains(child): this.dom || this 返回的必须是 DOM 节点。");
		    assert.notNull(child, "Element.prototype.contains(child):参数 {child} ~。");
		    child = child.dom || child;
		    return child == elem || e.hasChild(elem, child);
	    },

	    /**
		 * 判断一个节点是否有子节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
	    hasChild: function(child) {
		    var elem = this.dom || this;
		    return child ? e.hasChild(elem, child.dom || child) : elem.firstChild !== null;
	    },

	    /// #endif

	    /// #if ElementStyle

	    /**
		 * 判断一个节点是否隐藏。
		 * @param {Element} elem 元素。
		 * @return {Boolean} 隐藏返回 true 。
		 */
	    isHidden: function() {
		    var elem = this.dom || this;

		    return (elem.style.display || getStyle(elem, 'display')) === 'none';
	    }

	/// #endif

	}, 4);

	getWindowScroll = 'pageXOffset' in window ? function() {
		var win = this.defaultView;
		return new Point(win.pageXOffset, win.pageYOffset);
	} : ep.getScroll;

	/**
	 * @class Document
	 */
	Document.implement({

	    /// #if ElementManipulation

	    /**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
	    append: function(html) {
		    return $(this.body).append(html);
	    },

	    /// #endif

	    /// #if ElementCore

	    /**
		 * 创建一个节点。
		 * @param {Object} tagName
		 * @param {Object} className
		 */
	    create: function(tagName, className) {

		    assert.isString(tagName, 'Document.prototype.create(tagName, className): 参数 {tagName} ~。');

		    /// #if SupportIE6

		    var div = $(this.createElement(tagName));

		    /// #else

		    /// var div = this.createElement(tagName);

		    /// #endif

		    div.className = className;

		    return div;
	    },

	    /// #endif

	    /// #if ElementDimension

	    /**
		 * 获取元素可视区域大小。包括 margin 和 border 大小。
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

	    /// #if ElementOffset

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
	    setScroll: function(x, y) {
		    var doc = this, p = formatPoint(x, y);
		    if (p.x == null)
			    p.x = doc.getScroll().x;
		    if (p.y == null)
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
	    getDom: function() {
		    return arguments.length === 1 ? $(this.getElementById(arguments[0])) : new ElementList(o.update(arguments, this.getElementById, null, this));
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
		 * @param {String} [type2] 类型。 由于一个控件本质上是对 DOM 的封装，
		 *            因此经常需要将一个函数转换为对节点的调用。
		 */
	    delegate: function(control, target, methods, type, methods2, type2) {

		    if (methods2)
			    Control.delegate(control, target, methods2, type2);

		    assert(control && control.prototype, "Control.delegate(control, target, methods, type, methods2, type2): 参数 {control} 必须是一个类", control);
		    assert.isNumber(type, "Control.delegate(control, target, methods, type, methods2, type2): 参数 {type} ~。");

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

	Control.delegate(Control, 'dom', 'addEventListener removeEventListener scrollIntoView focus blur', 2, 'appendChild removeChild insertBefore replaceChild',
	        3);

	/**
	 * 将当前列表添加到指定父节点。
	 * @param {Element/Control} parent 渲染的目标。
	 * @param {Element/Control} refNode 渲染的位置。
	 * @protected
	 */
	ElementList.prototype.render = function(parent, refNode) {
		parent = parent.dom || parent;
		for ( var i = 0, len = this.length; i < len; i++)
			parent.insertBefore(this[i], refNode);
	};

	/// #if ElementCore

	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	/// #endif

	/// #if ElementNode

	map('checked disabled selected', function(treeWalker) {
		return function(elem, args) {
			args = args !== false;
			return this.children(elem, function(elem) {
				return elem[treeWalker] !== args;
			});
		};
	}, e.treeWalkers);

	/// #endif

	/**
	 * 获取节点本身。
	 */
	document.dom = document.documentElement;

	/// #if SupportIE8

	if (navigator.isStandard) {

		/// #endif

		/// #if ElementEvent

		window.Event.prototype.stop = pep.stop;

		initMouseEvent = initKeyboardEvent = initUIEvent = function(e) {

			if (!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

		};

		/// #endif

		/// #if SupportIE8

	} else {

		ep.$version = 1;

		$ = function(id) {

			// 获取节点本身。
			var dom = getElementById(id);

			// 把 Element 成员复制到节点。
			// 根据 $version 决定是否需要拷贝，这样保证每个节点只拷贝一次。
			if (dom && dom.nodeType === 1 && dom.$version !== ep.$version)
				o.extendIf(dom, ep);

			return dom;

		};

		/**
		 * 返回当前文档默认的视图。
		 * @type {Window}
		 */
		document.defaultView = document.parentWindow;

		/// #if ElementEvent

		initUIEvent = function(e) {
			if (!e.stop) {
				e.target = $(e.srcElement);
				e.stopPropagation = pep.stopPropagation;
				e.preventDefault = pep.preventDefault;
				e.stop = pep.stop;
			}
		};

		// mouseEvent
		initMouseEvent = function(e) {
			if (!e.stop) {
				initUIEvent(e);
				e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
				var dom = getDocument(e.target).dom;
				e.pageX = e.clientX + dom.scrollLeft;
				e.pageY = e.clientY + dom.scrollTop;
				e.layerX = e.x;
				e.layerY = e.y;
				// 1 ： 单击 2 ： 中键点击 3 ： 右击
				e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));

			}
		};

		// keyEvents
		initKeyboardEvent = function(e) {
			if (!e.stop) {
				initUIEvent(e);
				e.which = e.keyCode;
			}
		};

		e.properties.OBJECT = 'outerHTML';

		try {

			// 修复IE6 因 css 改变背景图出现的闪烁。
			document.execCommand("BackgroundImageCache", false, true);
		} catch (e) {

		}

		/// #endif

	}

	/// #endif

	apply(p, {

	    $: $,

	    /**
		 * 元素。
		 */
	    Element: e,

	    /// #if ElementEvent

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

	/// #if ElementAttribute

	// 下列属性应该直接使用。
	map("checked selected disabled value innerHTML textContent className autofocus autoplay async controls hidden loop open required scoped compact nowrap ismap declare noshade multiple noresize defer readOnly tabIndex defaultValue accessKey defaultChecked cellPadding cellSpacing rowSpan colSpan frameBorder maxLength useMap contentEditable", function(value) {
        attributes[value.toLowerCase()] = attributes[value] = value;
    });

	if (!navigator.isStandard) {

		attributes.style = {

		    get: function(elem, name) {
			    return elem.style.cssText.toLowerCase();
		    },

		    set: function(elem, name, value) {
			    elem.style.cssText = value;
		    }

		};

		if (navigator.isQuirks) {

			attributes.value = {

			    node: function(elem, name) {
				    assert(elem.getAttributeNode, "Element.prototype.getAttr(name, type): 当前元素不存在 getAttributeNode 方法");
				    return elem.tagName === 'BUTTON' ? elem.getAttributeNode(name) || {
					    value: ''
				    } : elem;
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

		}

	}

	/// #endif

	/// #if ElementStyle

	if (!('opacity' in div.style)) {
		styles.opacity = 'setOpacity';
	}

	/// #endif

	/// #if ElementEvent

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
	    trigger: function(elem, type, fn, e) {
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
	    add: function(elem, type, fn) {
		    elem.addEventListener(type, fn, false);
	    },

	    /**
		 * 删除事件。
		 * @param {Object} elem 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
	    remove: function(elem, type, fn) {
		    elem.removeEventListener(type, fn, false);
	    }

	});

	e.addEvents("mousewheel blur focus focusin focusout scroll change select submit error load unload", initUIEvent)(
	        "click dblclick DOMMouseScroll mousedown mouseup mouseover mouseenter mousemove mouseleave mouseout contextmenu selectstart selectend",
	        initMouseEvent)("keydown keypress keyup", initKeyboardEvent);

	if (navigator.isFirefox)
		e.addEvents('mousewheel', 'DOMMouseScroll');

	if (!navigator.isIE)
		e.addEvents('mouseenter', 'mouseover', checkMouseEnter)('mouseleave', 'mouseout', checkMouseEnter);

	/// #endif

	/// #if !defind(SupportIE8) && (ElementEvent || ElementDomReady)

	o.extendIf(window, eventObj);

	/// #endif

	/// #if ElementDomReady

	map('Ready Load', function(ReadyOrLoad, isLoad) {

		var readyOrLoad = ReadyOrLoad.toLowerCase(), isReadyOrLoad = isLoad ? 'isReady' : 'isLoaded';

		// 设置 onReady Load
		document['on' + ReadyOrLoad] = function(fn) {

			// 忽略参数不是函数的调用。
			if (!Function.isFunction(fn))
				fn = 0;

			// 如果已载入，则直接执行参数。
			if (document[isReadyOrLoad]) {

				if (fn)
					fn.call(document);

				// 如果参数是函数。
			} else if (fn) {

				document.on(readyOrLoad, fn);

				// 触发事件。
				// 如果存在 JS 之后的 CSS 文件， 肯能导致 document.body 为空，此时延时执行 DomReady
			} else if (document.body) {

				// 如果 isReady, 则删除
				if (isLoad) {

					// 使用系统文档完成事件。
					fn = [window, readyOrLoad];

					// 确保 ready 触发。
					document.onReady();

				} else {

					fn = [document, domReady];
				}

				fn[0].removeEventListener(fn[1], arguments.callee, false);

				// 触发事件。
				if (document.trigger(readyOrLoad)) {

					// 先设置为已经执行。
					document[isReadyOrLoad] = true;

					// 删除事件。
					document.un(readyOrLoad);

				}
			} else {
				setTimeout(arguments.callee, 1);
			}

			return document;
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

	// 如果readyState 不是 complete, 说明文档正在加载。
	if (document.readyState !== "complete") {

		// 使用系统文档完成事件。
		document.addEventListener(domReady, document.onReady, false);

		window.addEventListener('load', document.onLoad, false);

		/// #if SupportIE8

		// 只对 IE 检查。
		if (!navigator.isStandard) {

			// 来自 jQuery

			// 如果是 IE 且不是框架
			var topLevel = false;

			try {
				topLevel = window.frameElement == null;
			} catch (e) {
			}

			if (topLevel && document.documentElement.doScroll) {

				/**
				 * 为 IE 检查状态。
				 * @private
				 */
				(function() {
					if (document.isReady) {
						return;
					}

					try {
						// http:// javascript.nwbox.com/IEContentLoaded/
						document.documentElement.doScroll("left");
					} catch (e) {
						setTimeout(arguments.callee, 1);
						return;
					}

					document.onReady();
				})();
			}
		}

		/// #endif

	} else {
		setTimeout(document.onLoad, 1);
	}

	/// #endif

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
		assert(elem && (elem.nodeType || elem.setInterval), 'Element.getDocument(elem): 参数 {elem} 必须是节点。', elem);
		return elem.ownerDocument || elem.document || elem;
	}

	/// #if ElementTraversing

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
		} : function(elem, args) {
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first], r = new ElementList;
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					r.push(node);
				node = node[next];
			}
			return r;
		};
	}

	/// #if SupportIE6

	/**
	 * 简单的CSS选择器引擎。 只为 IE6/7 FF 2 等老浏览器准备。 代码最短优先，效率不高。
	 */
	function CssSelector() {

		/**
		 * 属性操作符，#表示值。
		 */
		var attrs = {
			    '=': '===#',
			    '^=': '.indexOf(#)===0',
			    '*=': '.indexOf(#)>=0',
			    '|=': '.split(/\\b+/).indexOf(#)===0',
			    '~=': '.split(/\\b+/).indexOf(#)>=0'
			},
	
			/**
			 * 连接符转为代码。
			 */
			maps = {
			    '': 't=c[i].getElementsByTagName("*");j=0;while(_=t[j++])',
			    '>': 'for(_=c[i].firstChild;_;_=_.nextSibling)',
			    '~': 'for(_=c[i];_;_=_.nextSibling)',
			    '+': 'for(_=c[i];_&&_.nodeType !== 1;_=_.nextSibling);if(_)'
			},
	
			/**
			 * 基本选择器。
			 */
			tests = {
			    '.': 'Element.hasClass(_,#)',
			    '#': '_.id===#',
			    '': '_.tagName===#.toUpperCase()'
			},
	
			/**
			 * find 查询函数缓存。
			 */
			findCache = {},
	
			/**
			 * findAll 查询函数缓存。
			 */
			findAllCache = {},
	
			/**
			 * 用于提取简单部分的正式表达式。 一个简单的表达式由2个部分组成。 前面部分可以是 #id .className tagName
			 * 后面部分可以是 (任意空格) # . > + ~ [ , 并不是全部选择器都是简单选择器。下列情况是复杂的表达式。 > + ~ ,
			 * [attrName] [attrName=attrVal] [attrName='attrVal']
			 * [attrName="attrVal"]
			 */
			rSimpleSelector = /^\s*([#.]?)([*\w\u0080-\uFFFF_-]+)(([\[#.>+~,])|\s*)/,
	
			/**
			 * 复杂的表达式。 只匹配 > + ~ , [ 开头的选择器。其它选择器被认为非法表达式。 如果是 [ 开头的表达式， 则同时找出
			 * [attrName] 后的内容。
			 */
			rRelSelector = /^\s*([>+~,]|\[([^=]+?)\s*(([\^\*\|\~]?=)\s*('([^']*?)'|"([^"]*?)"|([^'"][^\]]*?))\s*)?\])/;

		/**
		 * 分析选择器，并返回一个等价的函数。
		 * @param {String} selector css3 选择器。
		 * @return {Function} 返回执行选择器的函数。函数的参数是 elem, 表示当前的元素。 只支持下列选择器及组合： #id
		 *         .class tagName [attr] [attr=val] (val
		 *         可以是单引号或双引号或不包围的字符串，但不支持\转义。) [attr!=val] [attr~=val]
		 *         [attr^=val] [attr|=val] 选择器组合方式有： selctor1selctor2
		 *         selctor1,selctor2 selctor1 selctor2 selctor1>selctor2
		 *         selctor1~selctor2 selctor1+selctor2
		 */
		function parse(selector, first) {

			// filter 0 - 对已有元素进行过滤
			// seperator 1 - 计算分隔操作

			var type, value, tokens = [[1, '']], matchSize, match, codes = ['var c=[e],n,t,i,j,_;'], i, matchCount = 0;

			// 只要还有没有处理完的选择器。
			while (selector) {

				// 执行简单的选择器。
				match = rSimpleSelector.exec(selector);

				// 如果不返回 null, 说明这是简单的选择器。
				// #id .class tagName 选择器 会进入if语句。
				if (match) {

					// 记录当前选择器已被处理过的部分的长度。
					matchSize = match[0].length;

					// 条件。
					type = 0;

					// 选择器的内容部分， 如 id class tagName
					value = tests[match[1]].replace('#', toJsString(match[2]));

					// 如果之后有 . # > + ~ [, 则回退一个字符，下次继续处理。
					if (match[4]) {
						matchSize--;

					} else {

						// 保存当前的值，以追加空格。
						tokens.push([type, value]);

						// 如果末尾有空格，则添加，否则说明已经是选择器末尾，跳出循环:)。
						if (match[3]) {
							type = 1;
							value = '';
						} else {
							selector = null;
							break;
						}
					}
				} else {

					// 处理 ~ + > [ , 开头的选择器， 不是这些开头的选择器是非法选择器。
					match = rRelSelector.exec(selector);

					assert(match, "CssSelector.parse(selector): 选择器语法错误(在 " + selector + ' 附近)');

					// 记录当前选择器已被处理过的部分的长度。
					matchSize = match[0].length;

					// [ 属性 ]
					if (match[2]) {
						type = 0;
						value = 'Element.getAttr(_,' + toJsString(match[2]) + ')';
						if (match[4])
							value = '(' + value + '||"")' + attrs[match[4]].replace('#', toJsString(match[8] || match[6]));

						// + > ~
					} else if (match[1] === ',') {
						selector = selector.substring(matchSize);
						break;
					} else {
						type = 1;
						value = match[1];
					}
				}

				// 忽略多个空格。
				if (type === 1 && tokens.item(-1) + '' === '1,')
					tokens.pop();

				// 经过处理后， token 的出现顺序为 0 1 1 0 1 1...
				tokens.push([type, value]);

				// 去掉已经处理的部分。
				selector = selector.substring(matchSize);

			}

			// 删除最后多余的空格。
			if (tokens.item(-1) + '' === '1,')
				tokens.pop();

			// 计算 map 的个数。
			i = match = matchSize = 0;

			if (first)
				while (value = tokens[i++])
					matchSize += value[0];

			// 从第一个 token 开始，生成代码。
			while (value = tokens[match++]) {

				// 是否只需第一个元素。
				type = ++matchCount == matchSize;

				// 如果返回列表，则创建列表。
				if (!type)
					codes.push('n=new ElementList;');

				if (matchCount === 2) {
					codes.push('if((_=e)');

					for (i = match - 1; --i;)
						codes.push('&&', tokens[i][1]);

					codes.push(')c.include(_);');

				}

				// 加入遍历现在集合的代码。
				codes.push('for(i=0;i<c.length;i++) {', maps[value[1]]);

				codes.push('if(_.nodeType===1');

				// 处理条件。

				// 如果有条件则处理。
				while (tokens[match] && tokens[match][0] === 0)
					codes.push('&&', tokens[match++][1]);

				codes.push(')');

				codes.push(type ? 'return JPlus.$(_);}' : 'n.include(_);}c=n;');

			}

			codes.push('return ');
			if (selector)
				codes.push(type ? '(Element.CssSelector[0].call(e,' : 'c.concat(Element.CssSelector[1].call(e,', toJsString(selector), '))');
			else
				codes.push(type ? 'null' : 'c');

			// trace.info(tokens);
			// trace.info(codes.join(' '));

			return new Function('e', codes.join(''));
		}

		/**
		 * 把一个字符串转为Javascript的字符串。
		 * @param {String} value 输入的字符串。
		 * @return {String} 带双引号的字符串。
		 */
		function toJsString(value) {
			return '"' + value.replace(/"/g, '\\"') + '"';
		}

		return e.CssSelector = [
	
			function(selector) {
				return (findCache[selector] || (findCache[selector] = parse(selector, true)))(this.dom || this);
			},
	
			function(selector) {
				return (findAllCache[selector] || (findAllCache[selector] = parse(selector)))(this.dom || this);
			}
			
		];
	}

	/**
	 * 获取一个选择器。
	 * @param {Number/Function/String} args 参数。
	 * @return {Funtion} 函数。
	 */
	function getFilter(args) {
		switch (typeof args) {
			case 'number':
				return function(elem) {
					return --args < 0;
				};
			case 'string':
				args = args.toUpperCase();
				return function(elem) {
					return elem.tagName === args;
				};
		}

		assert.isFunction(args, "Element.prototype.get(treeWalker, args): 参数 {fn} 必须是一个函数、空、数字或字符串。", args);
		return args;
	}

	/// #endif

	/// #endif

	/// #if ElementManipulation

	/**
	 * 删除由于拷贝导致的杂项。
	 * @param {Element} srcElem 源元素。
	 * @param {Element} destElem 目的元素。
	 * @param {Boolean} cloneEvent=true 是否复制数据。
	 * @param {Boolean} keepId=false 是否留下ID。
	 * @return {Element} 元素。
	 */
	function cleanClone(srcElem, destElem, cloneEvent, keepId) {

		if (!keepId)
			destElem.removeAttribute('id');

		/// #if SupportIE8

		if (destElem.clearAttributes) {

			// IE 会复制 自定义事件， 清楚它。
			destElem.clearAttributes();
			destElem.mergeAttributes(srcElem);
			// 在 IE delete destElem.$data 出现异常。
			destElem.removeAttribute("$data");

			if (srcElem.options)
				o.update(srcElem.options, 'selected', destElem.options, true);
		}

		/// #endif

		if (cloneEvent !== false)
			p.cloneEvent(srcElem, destElem);

		// 特殊属性复制。
		if (keepId = e.properties[srcElem.tagName])
			destElem[keepId] = srcElem[keepId];
	}

	/**
	 * 清除节点的引用。
	 * @param {Element} elem 要清除的元素。
	 */
	function clean(elem) {

		// 删除自定义属性。
		if (elem.clearAttributes)
			elem.clearAttributes();

		// 删除事件。
		p.IEvent.un.call(elem);

		// 删除句柄，以删除双重的引用。
		if (elem.$data)
			elem.$data = null;

	}

	/// #endif

	/// #if ElementEvent

	/**
	 * 判断发生事件的元素是否在当前鼠标所在的节点内。
	 * @param {Event} e 事件对象。
	 * @return {Boolean} 返回是否应该触发 mouseenter。
	 */
	function checkMouseEnter(event) {

		return this !== event.relatedTarget && !e.hasChild(this, event.relatedTarget);

		/*
		 * var parent = e.relatedTarget; while (parent) {
		 * 
		 * if(parent === this) return false;
		 * 
		 * parent = parent.parentNode; }
		 */
	}

	/// #endif

	/// #if ElementAttribute

	/**
	 * 到骆驼模式。
	 * @param {String} all 全部匹配的内容。
	 * @param {String} match 匹配的内容。
	 * @return {String} 返回的内容。
	 */
	function formatStyle(all, match) {
		return match ? match.toUpperCase() : styleFloat;
	}

	/// #endif

	/// #if ElementStyle

	/**
	 * 读取样式字符串。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。
	 * @return {String} 字符串。
	 */
	function styleString(elem, name) {
		assert.isElement(elem, "Element.styleString(elem, name): 参数 {elem} ~。");
		return elem.style[name] || getStyle(elem, name);
	}

	/**
	 * 读取样式数字。
	 * @param {Object} elem 元素。
	 * @param {Object} name 属性名。
	 * @return {Number} 数字。
	 */
	function styleNumber(elem, name) {
		assert.isElement(elem, "Element.styleNumber(elem, name): 参数 {elem} ~。");
		var value = parseFloat(elem.style[name]);
		if (!value && value !== 0) {
			value = parseFloat(getStyle(elem, name));

			if (!value && value !== 0) {
				if (name in styles) {
					var style = e.getStyles(elem, e.display);
					e.setStyles(elem, e.display);
					value = parseFloat(getStyle(elem, name)) || 0;
					e.setStyles(elem, style);
				} else {
					value = 0;
				}
			}
		}

		return value;
	}

	/// #endif

	/**
	 * 转换参数为标准点。
	 * @param {Number} x X坐标。
	 * @param {Number} y Y坐标。
	 * @return {Object} {x:v, y:v} 
	 */
	function formatPoint(x, y) {
		return x && typeof x === 'object' ? x : {
		    x: x,
		    y: y
		};
	}

})(this);
