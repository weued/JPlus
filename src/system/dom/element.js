/**
 * @fileOverview 提供最底层的 DOM 辅助函数。
 */

// Core - 核心部分
// Parse - 节点解析部分
// Traversing - 节点转移部分
// Manipulation - 节点处理部分
// Style - CSS部分
// Attribute - 属性部分
// Event - 事件部分
// DomReady - 加载部分
// Dimension - 尺寸部分
// Offset - 定位部分

(function(window) {

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
				return Dom.parse(this.tpl);
			},
			
			/**
			 * 当被子类重写时，渲染控件。
			 * @method
			 * @param {Object} options 配置。
			 * @protected
			 * @virtual
			 */
			init: Function.empty,
		
			/**
			 * 将当前控件插入到指定父节点，并显示在指定节点之前。
			 * @param {Node} parentNode 渲染的目标。
			 * @param {Node} refNode=null 渲染的位置。
			 * @protected
			 */
			attach: function(parentNode, refNode) {
				assert(parentNode.nodeType, 'Control.prototype.attach(parentNode, refNode): {parentNode} 必须是 DOM 节点。', parentNode);
				assert(refNode === null || refNode.nodeType, 'Control.prototype.attach(parentNode, refNode): {refNode} 必须是 null 或 DOM 节点 。', refNode);
				parentNode.insertBefore(this.dom, refNode);
			},
		
			/**
			 * 移除节点本身。
			 * @param {Node} parentNode 渲染的目标。
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
	
				// 如果指定的节点已经在 DOM 树上，且重写了 render 方法，则调用之。
				if(me.dom.parentNode && this.render !== Control.prototype.render) {
					this.render(me.dom.parentNode, me.dom.nextSibling);
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
		 * @class NodeList
		 * NodeList 是对元素数组的只读包装。 NodeList 允许快速操作多个节点。 NodeList 的实例一旦创建，则不允许修改其成员。
		 */
		NodeList = Class({
	
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
				return new Dom(this[index < 0 ? this.length + index: index]);
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
				assert(args && typeof args.length === 'number', "NodeList.prototype.invoke(func, args): {args} 必须是数组, 无法省略。", args);
				var r = [], targets;
				ap.forEach.call(this, function(value) {
					targets = new Dom(value);
					assert(targets[func] && targets[func].apply, "NodeList.prototype.invoke(func, args): Control 不包含方法 {func}。", func);
					r.push(targets[func].apply(targets, args));
				});
				return r;
			},
			
			/**
			 * 初始化 NodeList 实例。
			 * @param {Array/NodeList} nodes 节点集合。
			 * @constructor
			 */
			constructor: function(nodes) {
	
				if(nodes) {
	
					assert(nodes.length !== undefined, 'NodeList.prototype.constructor(nodes): {nodes} 必须是一个 NodeList 或 Array 类型的变量。', nodes);
	
					var len = this.length = nodes.length;
					while(len--)
						this[len] = nodes[len].dom || nodes[len];

				}

			},
			
			/**
			 * 将参数数组添加到当前集合。
			 * @param {Element/NodeList} value 元素。
			 * @return this
			 */
			concat: function() {
				for(var args = arguments, i = 0; i < args.length; i++){
					var value = args[i], j = -1;
					if(typeof value.length !== 'number')
						value = [value];
						
					while(++j < value.length)
						this.include(value[j].dom || value[j]);
					
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
		 * 函数 Dom.parse使用的新元素缓存。
		 * @type Object
		 */
		cache = {},
	
		/**
		 * 处理 <div/> 格式标签的正则表达式。
		 * @type RegExp
		 */
		rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	
		/**
		 * 在 Dom.parse 和 setHtml 中对 HTML 字符串进行包装用的字符串。
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
	
		/// #if SupportIE6
		/**
		 * CSS 选择器。 对于 IE6/7 提供自定义的选择器。
		 */
		/*   cssSelector = div.querySelectorAll ? [ 	function(selector) {
		return (this.dom).querySelector(selector);
		},
	
		function(selector) {
		return new NodeList((this.dom).querySelectorAll(selector));
		}]: CssSelector(),
	
		/// #else
	
		/// cssSelector = [function(selector) {
		/// return (this.dom).querySelector(selector);
		/// }, function(selector) {
		/// return new NodeList((this.dom).querySelectorAll(selector));
		/// }],
	
		/// #endif */
		
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
						return elem.offsetHeight === 0 ? 'auto': elem.offsetHeight -  Dom.getSize(elem, 'by+py') + 'px';
					case 'width':
						return elem.offsetWidth === 0 ? 'auto': elem.offsetWidth -  Dom.getSize(elem, 'bx+px') + 'px';
					case 'opacity':
						return new Dom(elem).getOpacity.toString();
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
		
		cssSelector = [],
	
		/**
		 * 判断 body 节点的正则表达式。
		 * @type RegExp
		 */
		rBody = /^(?:BODY|HTML|#document)$/i;

	apply(Dom, {

		/**
		 * 转换一个HTML字符串到节点。
		 * @param {String/Element} html 字符。
		 * @param {Element} context=document 生成节点使用的文档中的任何节点。
		 * @param {Boolean} cachable=true 是否缓存。
		 * @return {Element/TextNode/DocumentFragment} 元素。
		 * @static
		 */
		parse: function(html, context, cachable) {

			// 不是 html，直接返回。
			if( typeof html === 'string') {

				var srcHTML = html;

				// 查找是否存在缓存。
				html = cache[srcHTML];
				context = context && context.ownerDocument || document;

				assert(context.createElement, 'Dom.parse(html, context, cachable): {context} 必须是 DOM 节点。', context);

				if(html && html.ownerDocument === context) {

					// 复制并返回节点的副本。
					html = html.cloneNode(true);

				} else {

					// 测试查找 HTML 标签。
					var tag = /<([\w:]+)/.exec(srcHTML);
					cachable = cachable !== false;

					if(tag) {

						assert.isString(srcHTML, 'Dom.parse(html, context, cachable): {html} ~');
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

							assert(context.createDocumentFragment, 'Dom.parse(html, context, cachable): {context} 必须是 DOM 节点。', context);
							html = context.createDocumentFragment();
							while(wrap.firstChild) {
								html.appendChild(wrap.firstChild);
							}
						}

						assert(html, "Dom.parse(html, context, cachable): 无法根据 {html} 创建节点。", srcHTML);

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
		 * 根据一个 id 获取元素。如果传入的id不是字符串，则直接返回参数。
		 * @param {String/Element/Control} id 要获取元素的 id 或元素。
	 	 * @return {Control} 元素。
		 */
		get: function(id) {
			return new Dom( typeof id == "string" ? document.getElementById(id): id);
		},

		query: function(selector) {
			return document.findAll(selector);
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
		 * 获取一个节点属性。
		 * @static
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
						assert( f in borders || f === 's', "Dom.getSize(e, type): {type} 中的 " + type + " 不合法", type);
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
							assert(f === 'h' || f === 'w', "Dom.getSize(e, type): {type} 中的 " + type + " 不合法", type);
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
				assert.isElement(elem, "Dom.getSize(elem, type): {elem} ~");
				assert.isString(type, "Dom.getSize(elem, type): {type} ~");
				return (Dom.sizeMap[type] || (Dom.sizeMap[type] = new Function("e", init + type.replace(/\w+/g, format))))(elem);
			}
		})(),

		/**
		 * 设置一个元素可拖动。
		 * @param {Element} elem 要设置的节点。
		 * @static
		 */
		setMovable: function(elem) {
			assert.isElement(elem, "Dom.setMovable(elem): 参数 elem ~");
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
				assert.notNull(target, "JPlus.Event.prototype.constructor(target, type, e): {target} ~");

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
		 * @param {Number} listType = 1 说明如何复制到 NodeList 实例。
		 * @return {Element} this
		 * @static 对 Element 扩展，内部对 Element NodeList document 皆扩展。
		 *         这是由于不同的函数需用不同的方法扩展，必须指明扩展类型。 所谓的扩展，即一个类所需要的函数。 DOM 方法
		 *         有 以下种 1, 其它 setText - 执行结果返回 this， 返回 this 。(默认) 2
		 *         getText - 执行结果是数据，返回结果数组。 3 getElementById - 执行结果是DOM
		 *         或 ElementList，返回 NodeList 包装。 4 hasClass -
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
									// return NodeList
									value = function() {
										var r = new NodeList;
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
										var len = this.length, i = -1, target = new Dom();
										while(++i < len) {
											target.dom = this[i];
											target[func].apply(target, arguments);
										}
										return this;
									};
							}
						}
		
						cls[func] = value;
					}
				}
		
			}, [NodeList, Dom.Document, Control]);
		
			return this;

		},
	
		/**
		 * 若不存在，则将一个对象附加到 Element 对象。
		 * @static
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 NodeList 实例。
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
			map(events, Function.from(Function.isFunction(baseEvent) ? {
		
				initEvent : baseEvent
		
			} : {
		
				initEvent : initEvent ? function(e) {
					return ee[baseEvent].initEvent.call(this, e) !== false && initEvent.call(this, e);
				} : ee[baseEvent].initEvent,
				// 如果存在 baseEvent，定义别名， 否则使用默认函数。
				add : function(elem, type, fn) {
					elem.addEventListener(baseEvent, fn, false);
				},
				remove : function(elem, type, fn) {
					elem.removeEventListener(baseEvent, fn, false);
				}
			}), ee);
	
		
			return Control.addEvents;
	
		},
	
		/**
		 * 将指定名字的方法委托到当前对象指定的成员。
		 * @param {Object} control 类。
		 * @param {String} delegate 委托变量。
		 * @param {String} methods 所有成员名。
		 *            因此经常需要将一个函数转换为对节点的调用。
		 */
		delegate: function(control, target, methods) {
			assert(control && control.prototype, "Control.delegate(control, target, methods, type, methods2, type2): {control} 必须是一个类", control);
		
			map(methods, function(func) {
				return function(args1, args2) {
					return this[target][func](args1, args2) || this;
				};
			}, control.prototype);
			return Control.delegate;
		}
	})

	.implement({
	
		/**
		 * 将当前节点添加到其它节点。
		 * @param {Element/String} elem=document.body 节点、控件或节点的 id 字符串。
		 * @return {Element} this this.appendTo(parent) 相当于
		 *         elem.appendChild(this) 。 appendTo 同时执行 render(parent,
		 *         null) 通知当前控件正在执行渲染。
		 */
		appendTo: function(parent) {
		
			// parent 肯能为 true
			(parent && parent.length ? Dom.get(parent): new Dom(document.body)).insertBefore(this, null);
	
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
			} else if (childControl = this.getParent()){
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
			while (elem = this.getLast())
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
		 * 设置内容样式。
		 * @param {String} name CSS 属性名或 CSS 字符串。
		 * @param {String/Number} [value] CSS属性值， 数字如果不加单位，则自动转为像素。
		 * @return {Element} this setStyle('cssText') 不被支持，需要使用 name，
		 *         value 来设置样式。
		 */
		setStyle: function(name, value) {
		
			// 获取样式
			var me = this;
			
			assert.isString(name, "Control.prototype.setStyle(name, value): {name} ~");
			assert.isElement(me.dom, "Control.prototype.setStyle(name, value): 当前 dom 不支持样式");
		
			// 没有键 返回 cssText
			if( name in styles) {
		
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
		toggle: function(duration, callBack, type, flag) {
			return this[(flag === undefined ? this.isHidden(): flag) ? 'show': 'hide'](duration, callBack, type);
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
			elem[elem.nodeType !== 1 ? 'nodeValue': elem.value !== undefined ? 'value': attributes.innerText] = value;
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
		
			o.each(elem.getElementsByTagName("*"), clean);
			elem.innerHTML = value;
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
		
			if (p.x != null) me.setWidth(p.x - Dom.getSize(me.dom, 'bx+px'));
		
			if (p.y != null) me.setHeight(p.y - Dom.getSize(me.dom, 'by+py'));
		
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
		
			assert(o.isObject(p) && 'x' in p && 'y' in p, "Control.prototype.setOffset(p): {p} 必须有 'x' 和 'y' 属性。", p);
			var s = this.dom.style;
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
			var me = this,
				offset = me.getOffset().sub(me.getPosition()),
				p = formatPoint(x, y);
		
			if (p.y) offset.y += p.y;
		
			if (p.x) offset.x += p.x;
		
			Dom.setMovable(me.dom);
		
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
	
		}

	})

	.implement(p.IEvent)

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
		/// 	return parseFloat(styleString(this.dom, 'opacity')) || 0;
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
			var elem = this.dom;
			return elem[elem.nodeType !== 1 ? 'nodeValue': elem.value !== undefined ? 'value': attributes.innerText];
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
					top = this.get('offsetParent');
					left = this.getPosition();
					if(!rBody.test(top.nodeName))
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
	
		/**
		* 执行一个简单的选择器。
		* @method
		* @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		* @return {Element/undefined} 节点。
		*/
		findAll: cssSelector[1],
		
		getParent: createTreeWalker(true, 'parentNode'),

		// 第一个节点。
		getFirst: createTreeWalker(true, 'nextSibling', 'firstChild'),

		// 后面的节点。
		getNext: createTreeWalker(true, 'nextSibling'),

		// 前面的节点。
		getPrevious: createTreeWalker(true, 'previousSibling'),

		// 最后的节点。
		getLast: createTreeWalker(true, 'previousSibling', 'lastChild'),

		// 第一个节点。
		getChild: createTreeWalker(true, 'nextSibling', 'firstChild'),

		// 全部子节点。
		getChildren: createTreeWalker(false, 'nextSibling', 'firstChild'),
		
		// 兄弟节点。
		getSiblings: function(elem, args) {
			return this.getChildren(args).remove(this.dom);
		},
			
		// 号次。
		getIndex: function() {
			var i = 0, elem = this.dom;
			while( elem = elem.previousSibling)
				if(elem.nodeType === 1)
					i++;
			return i;
		},

		// 全部子节点。
		filter: 'all' in div ? function(args) { // 返回数组
			args = getFilter(args);
			assert.isFunction(args, "Control.prototype.filter(args): {args} ~");
			var r = new NodeList;
			ap.forEach.call(elem.all, function(elem) {
				if(args(elem))
					r.push(elem);
			});
			return r;
		}: function(args) {
			args = getFilter(args);
			assert.isFunction(fn, "Control.prototype.filter(args): {args} ~");
			var r = new NodeList, nodes = [elem];
			while(elem = nodes.pop()) {
				for( elem = elem.firstChild; elem; elem = elem.nextSibling)
					if(elem.nodeType === 1) {
						if(fn(elem))
							r.push(elem);
						nodes.push(elem);
					}
			}

			return r;
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
		
			switch (where) {
				case "afterEnd":
					refChild = me.getNext();
				
					// 继续。
				case "beforeBegin":
					parentControl = me.getParent();
					assert(parentControl, "Control.prototype.insert(where, html): 节点无父节点时无法执行 insert({where})。", where);
					break;
				case "afterBegin":
					refChild = me.getFirst();
					break;
				default:
					refChild = null;
					break;
			}
		
			return parentControl.insertBefore(document.parse(html, me.dom), refChild);
		},
	
		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function(html) {
			html = document.parse(html, this);
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
			html = document.parse(html, this.dom);
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

		/**
		 * 执行一个简单的选择器。
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		find: cssSelector[0],

		/**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @param {Element} control 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: function(control) {
			var elem = this.dom;
			assert.notNull(control, "Control.prototype.contains(control):{control} ~");
			return control.dom == elem || Dom.hasChild(elem, control.dom);
		},
		
		/**
		 * 判断一个节点是否有子节点。
		 * @param {Element} [control] 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		hasChild: function(control) {
			return control ? Dom.hasChild(this.dom, control.dom): !!this.getFirst();
		},
		
		/**
		 * 判断一个节点是否隐藏。
		 * @return {Boolean} 隐藏返回 true 。
		 */
		isHidden: function() {
			var elem = this.dom;

			return (elem.style.display || getStyle(elem, 'display')) === 'none';
		}
		
	}, 4);
	
	/**
	 * @class Document
	 */
	Dom.Document.implement({

		/**
		 * 解析一个 html 字符串返回相应的控件。
		 * @param {String/Element} html 字符。
		 * @param {Element} context=document 生成节点使用的文档中的任何节点。
		 * @param {Boolean} cachable=true 是否缓存。
		 * @return {Control} 控件。
		 */
		parse: function(html, context, cachable) {

			assert.notNull(html, 'Dom.parse(html, context, cachable): {html} ~');

			return html.dom ? html: new Dom(Dom.parse(html, context, cachable));
		},
		
		/**
		 * 创建一个节点。
		 * @param {Object} tagName
		 * @param {Object} className
		 */
		createControl: function(tagName, className) {
			assert.isString(tagName, 'Document.prototype.create(tagName, className): {tagName} ~');
			var div = this.createElement(tagName);
			div.className = className;
			return new Dom(div);
		},
		
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
		
		/**
		 * 根据元素返回节点。
		 * @param {String} ... 对象的 id 或对象。
		 * @return {NodeList} 如果只有1个参数，返回元素，否则返回元素集合。
		 */
		getDom: function(id) {
			return typeof id == "string" ? this.getElementById(id): id;
		},
		
		/**
		 * 根据元素返回封装后的控件。
		 * @param {String} ... 对象的 id 或对象。
		 * @return {NodeList} 如果只有1个参数，返回元素，否则返回元素集合。
		 */
		getControl: function() {
			return arguments.length === 1 ? new Dom(this.getDom(arguments[0])): new NodeList(o.update(arguments, this.getDom, null, this));
		},
		
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
			if(p.x == null)
				p.x = doc.getScroll().x;
			if(p.y == null)
				p.y = doc.getScroll().y;
			doc.defaultView.scrollTo(p.x, p.y);

			return doc;
		}
		
	});

	// 变量初始化。

	Control.delegate(Control, 'dom', 'scrollIntoView focus blur select click submit reset');

	map("push shift unshift pop include indexOf each forEach insert", ap, NodeList.prototype);

	map("filter slice splice reverse unique", function(func) {
		return function() {
			return new NodeList(ap[func].apply(this, arguments));
		};
	}, NodeList.prototype);
	
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
		eventObj = p.namespace("JPlus.Events.control.$default", {
	
			/**
			 * 创建当前事件可用的参数。
			 * @param {Object} elem 对象。
			 * @param {Event} e 事件参数。
			 * @param {Object} target 事件目标。
			 * @return {Event} e 事件参数。
			 */
			trigger: function(elem, type, fn, e) {
				return fn( e = new Dom.Event(elem, type, e)) && (!elem[ type = 'on' + type] || elem[type](e) !== false);
			},
			
			/**
			 * 添加绑定事件。
			 * @param {Object} elem 对象。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 */
			add: document.addEventListener ? function(ctrl, type, fn) {
				ctrl.dom.addEventListener(type, fn, false);
			}: function(ctrl, type, fn) {
				ctrl.dom.attachEvent('on' + type, listener);
			},
			
			/**
			 * 删除事件。
			 * @param {Object} elem 对象。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 */
			remove: document.removeEventListener ? function(ctrl, type, fn) {
				ctrl.dom.removeEventListener(type, fn, false);
			}: function(ctrl, type, fn) {
				ctrl.dom.detachEvent('on' + type, listener);
			}
			
		}),
		
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

		/**
		 * 返回当前文档默认的视图。
		 * @type {Window}
		 */
		if(!document.defaultView)
			document.defaultView = document.parentWindow;

		if(!('opacity' in div.style)) {
			styles.opacity = 'setOpacity';
		}
			
		initUIEvent = function(e) {
			if(!e.stop) {
				e.target = e.srcElement;
				for(var prop in pep) {
					e[prop] = pep[prop];
				}
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

		}

		try {

			// 修复IE6 因 css 改变背景图出现的闪烁。
			document.execCommand("BackgroundImageCache", false, true);
		} catch(e) {

		}

	}
	
	/// #endif

	Control.addEvents
		("mousewheel blur focus focusin focusout scroll change select submit error load unload", initUIEvent)
		("click dblclick DOMMouseScroll mousedown mouseup mouseover mouseenter mousemove mouseleave mouseout contextmenu selectstart selectend", initMouseEvent)
		("keydown keypress keyup", initKeyboardEvent);

	if(navigator.isFirefox)
		Control.addEvents('mousewheel', 'DOMMouseScroll');

	if(!navigator.isIE)
		Control.addEvents
			('mouseenter', 'mouseover', checkMouseEnter)
			('mouseleave', 'mouseout', checkMouseEnter);

			
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

	/// #else
	/// var domReady = 'DOMContentLoaded';
	/// #endif
	map('Ready Load', function(ReadyOrLoad, isLoad) {

		var readyOrLoad = ReadyOrLoad.toLowerCase(), isReadyOrLoad = isLoad ? 'isReady': 'isLoaded';

		// 设置 onReady Load
		document['on' + ReadyOrLoad] = function(fn) {

			// 忽略参数不是函数的调用。
			if(!Function.isFunction(fn))
				fn = 0;

			// 如果已载入，则直接执行参数。
			if(document[isReadyOrLoad]) {

				if(fn)
					fn.call(document);

				// 如果参数是函数。
			} else if(fn) {

				document.on(readyOrLoad, fn);

				// 触发事件。
				// 如果存在 JS 之后的 CSS 文件， 肯能导致 document.body 为空，此时延时执行 DomReady
			} else if(document.body) {

				// 如果 isReady, 则删除
				if(isLoad) {

					// 使用系统文档完成事件。
					fn = [window, readyOrLoad];

					// 确保 ready 触发。
					document.onReady();

				} else {
					fn = [document, domReady];
				}

				eventObj.remove({
					dom: fn[0]
				}, fn[1], arguments.callee);

				// 触发事件。
				if(document.trigger(readyOrLoad)) {

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
	
	// 如果readyState 不是 complete, 说明文档正在加载。
	if(document.readyState !== "complete") {

		// 使用系统文档完成事件。
		eventObj.add({dom: document}, domReady, document.onReady);

		eventObj.add({dom: window}, 'load', document.onLoad, false);

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
					if(document.isReady) {
						return;
					}

					try {
						// http:// javascript.nwbox.com/IEContentLoaded/
						document.documentElement.doScroll("left");
					} catch(e) {
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

	apply(window, {

		Dom: Dom,

		Control: Control,

		NodeList: NodeList

	});

	Object.extendIf(window, {
		$: Dom.get,
		$$: Dom.query
	});
	
	div = null;
	
	/**
	 * @class
	 */

	/**
	 * Dom 对象的封装。
	 */
	function Dom(dom) {
		this.dom = dom;
	}

	/**
	 * 获取元素的文档。
	 * @param {Element} elem 元素。
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
			if(args != null) 
				args = getFilter(args);
			var node = this.dom[first];
			while(node) {
				if(node.nodeType === 1 && (!args || args.call(this.dom, node)))
					return new Dom(node);
				node = node[next];
			}
			return null;
		}: function(args) {
			if(args != null) 
				args = getFilter(args);
			var node = this.dom[first], r = new NodeList;
			while(node) {
				if(node.nodeType === 1 && (!args || args.call(this.dom, node)))
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
			case 'undefined':
				return Function.returnTrue;
		}

		assert.isFunction(args, "Control.prototype.getXXX(args): {args} 必须是一个函数、空、数字或字符串。", args);
		return args;
	}

	/**
	 * 判断发生事件的元素是否在当前鼠标所在的节点内。
	 * @param {Event} e 事件对象。
	 * @return {Boolean} 返回是否应该触发 mouseenter。
	 */
	function checkMouseEnter(e) {

		return this !== e.relatedTarget && !Dom.hasChild(this, e.relatedTarget);
	}
	
	/**
	 * 删除由于拷贝导致的杂项。
	 * @param {Element} srcElem 源元素。
	 * @param {Element} destElem 目的元素。
	 * @param {Boolean} cloneEvent=true 是否复制数据。
	 * @param {Boolean} keepId=false 是否留下ID。
	 * @return {Element} 元素。
	 */
	function cleanClone(srcElem, destElem, cloneEvent, keepId) {

		if(!keepId && destElem.removeAttribute)
			destElem.removeAttribute('id');

		/// #if SupportIE8
		if(destElem.clearAttributes) {

			// IE 会复制 自定义事件， 清楚它。
			destElem.clearAttributes();
			destElem.mergeAttributes(srcElem);
			// 在 IE delete destElem.$data 出现异常。
			p.removeData(destElem);

			if(srcElem.options)
				o.update(srcElem.options, 'selected', destElem.options, true);
		}

		/// #endif
		if(cloneEvent !== false)
			p.cloneEvent(srcElem, destElem);

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

	/// #if CompactMode
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
			'.': 'Dom.hasClass(_,#)',
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
			while(selector) {

				// 执行简单的选择器。
				match = rSimpleSelector.exec(selector);

				// 如果不返回 null, 说明这是简单的选择器。
				// #id .class tagName 选择器 会进入if语句。
				if(match) {

					// 记录当前选择器已被处理过的部分的长度。
					matchSize = match[0].length;

					// 条件。
					type = 0;

					// 选择器的内容部分， 如 id class tagName
					value = tests[match[1]].replace('#', toJsString(match[2]));

					// 如果之后有 . # > + ~ [, 则回退一个字符，下次继续处理。
					if(match[4]) {
						matchSize--;

					} else {

						// 保存当前的值，以追加空格。
						tokens.push([type, value]);

						// 如果末尾有空格，则添加，否则说明已经是选择器末尾，跳出循环:)。
						if(match[3]) {
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
					if(match[2]) {
						type = 0;
						value = 'Dom.getAttr(_,' + toJsString(match[2]) + ')';
						if(match[4])
							value = '(' + value + '||"")' + attrs[match[4]].replace('#', toJsString(match[8] || match[6]));

						// + > ~
					} else if(match[1] === ',') {
						selector = selector.substring(matchSize);
						break;
					} else {
						type = 1;
						value = match[1];
					}
				}

				// 忽略多个空格。
				if(type === 1 && tokens.item(-1) + '' === '1,')
					tokens.pop();

				// 经过处理后， token 的出现顺序为 0 1 1 0 1 1...
				tokens.push([type, value]);

				// 去掉已经处理的部分。
				selector = selector.substring(matchSize);

			}

			// 删除最后多余的空格。
			if(tokens.item(-1) + '' === '1,')
				tokens.pop();

			// 计算 map 的个数。
			i = match = matchSize = 0;

			if(first)
				while( value = tokens[i++])
				matchSize += value[0];

			// 从第一个 token 开始，生成代码。
			while( value = tokens[match++]) {

				// 是否只需第一个元素。
				type = ++matchCount == matchSize;

				// 如果返回列表，则创建列表。
				if(!type)
					codes.push('n=new NodeList;');

				if(matchCount === 2) {
					codes.push('if((_=e)');

					for( i = match - 1; --i; )codes.push('&&', tokens[i][1]);

					codes.push(')c.include(_);');

				}

				// 加入遍历现在集合的代码。
				codes.push('for(i=0;i<c.length;i++) {', maps[value[1]]);

				codes.push('if(_.nodeType===1');

				// 处理条件。
				// 如果有条件则处理。
				while(tokens[match] && tokens[match][0] === 0)codes.push('&&', tokens[match++][1]);

				codes.push(')');

				codes.push( type ? 'return JPlus.$(_);}': 'n.include(_);}c=n;');

			}

			codes.push('return ');
			if(selector)
				codes.push( type ? '(Dom.CssSelector[0].call(e,': 'c.concat(Dom.CssSelector[1].call(e,', toJsString(selector), '))');
			else
				codes.push( type ? 'null': 'c');

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

		return Dom.CssSelector = [

		function(selector) {
			return (findCache[selector] || (findCache[selector] = parse(selector, true)))(this.dom);
		},

		function(selector) {
			return (findAllCache[selector] || (findAllCache[selector] = parse(selector)))(this.dom);
		}];

	}

	/// #endif
	
})(this);
