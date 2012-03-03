/**
 * @fileOverview 通过改变CSS实现的变换。
 * @author xuld
 */


using("System.Dom.Element");
using("System.Fx.Base");


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
