//===========================================
//  所有控件的基类。    
//   A: xuld
//===========================================


/// #ifndef SupportUsing
/// #define imports
/// #endif
	
/// #ifdef SupportUsing

/**
 * @namespace JPlus
 */
namespace("JPlus.", {
		
	/**
	 * 如果使用了 UI 库，则 theme 表示默认皮肤。
	 * @config {String}
	 * @value 'default'
	 */
	theme: 'default',
	
	/**
	 * 如果使用了 UI 库，则  resource 表示公共的主题资源。
	 * config {String}
	 * @value 'share'
	 */
	resource: 'share',
	
	/**
	 * 导入一个名字空间的资源。
	 * @static
	 * @param {String} resource 资源地址。* 表示公共地址和主题地址， ~ 表示公共地址。
	 * @param {Array} [themes] 主题。
	 * theme 定义了使用的主题， 他会替换 resource 内的 * ， 
	 * 比如 imports("Resources.*.Text", ["v", "f"]) 
	 * 实际上是  imports("Resources.v.Text")  imports("Resources.f.Text") 
	 * 如果 resource 有 * ，但用户未提供 theme ， 则使用   [JPlus.resource, JPlus.theme] 。
	 * <br>
	 * 有关名字空间的说明， 见 {@link namespace} 。
	 * @example
	 * <code>
	 * imports("Resources.*.Text");
	 * </code>
	 */
	imports: imports
	
});


function imports(resource, themes){

	assert(resource && resource.indexOf, "imports(resource, themes): 参数 {resource} 不是合法的名字空间。", resource);
	assert(!themes || Array.isArray(themes), "imports(resource, themes): 参数 {themes} 必须是数组或省略。", themes);

	if(resource.indexOf('*') > -1) {
	 	(themes || [JPlus.resource, JPlus.theme]).forEach(function(value) {
			using(resource.replace('*', value), true);
		});
	} else {
		using(resource.replace('~', JPlus.resource), true);
	}
}
	
/// #endif


imports("Resources.*.Control.Core");
using("System.Dom.Element");

/**
 * 所有控件基类。
 * @class Control
 * @abstract
 * @extends Element
 * 控件的周期：
 * constructor  -  创建控件对于的 Javascript 类。 不建议重写，除非你知道你在做什么。
 * create - 创建本身的 dom 节点。 可重写 - 默认使用  this.tpl 创建。
 * init - 初始化控件本身。 可重写 - 默认为无操作。
 * appendTo - 渲染控件到文档。 不建议重写，如果你希望额外操作渲染事件，则重写。
 * dispose - 删除控件。不建议重写，如果一个控件用到多个 dom 内容需重写。
 */
namespace(".Control", JPlus.Element.extend({
	
	/**
	 * 封装的节点。
	 * @type Element
	 */
	dom: null,

	/**
	 * 根据一个节点返回。
	 * @param {String/Element/Object} [options] 对象的 id 或对象或各个配置。
	 */
	constructor: function (options) {
		
		// 这是所有控件共用的构造函数。
		
		var me = this,
		
			// 临时的配置对象。
			opt = Object.extend({}, me.options || {}),
			
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
				
				// 保存 dom 。
				dom = options.dom;
				delete options.dom;
				
				// 复制成员到临时配置。
				Object.extend(opt, options);
			}
		}
		
		// 如果 dom 的确存在，使用已存在的， 否则使用 create(opt)生成节点。
		me.dom = dom ? p.$(dom) : me.create(opt);
		
		assert(me.dom && me.dom.nodeType, "Control.prototype.constructor(options): 当前实例的 dom 属性为空，或此属性不是 DOM 对象。(检查 options.dom 是否是合法的节点或ID(options 或 options.dom 指定的ID的节点不存在?) 或当前实例的 create 方法是否正确返回一个节点)\r\n当前控件: {dom} {xType}", me.dom, me.xType);
		
		// 调用 init 初始化控件。
		me.init(opt);
		
		// 复制各个选项。
		Object.set(me, opt);
	},
	
	/**
	 * 当被子类重写时，生成当前控件。
	 * @param {Object} options 选项。
	 * @protected
	 */
	create: function() {
		
		assert(this.tpl, "Control.prototype.create(): 当前类不存在 tpl 属性。Control.prototype.create 会调用 tpl 属性，根据这个属性中的 HTML 代码动态地生成节点并返回。子类必须定义 tpl 属性或重写 Control.prototype.create 方法。");
		
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
	 * xType 。
	 */
	xType: "control",
	
	/**
     * 创建并返回控件的副本。
     * @param {Boolean} keepId=fasle 是否复制 id 。
     * @return {Control} 新的控件。
     */
	clone: function(keepId) {
		
		// 创建一个控件。
		return  new this.constructor(this.dom.clone(false, true, keepId));
		
	}
	
}));

/**
 * 获取一个唯一的用来代理元素。
 * @param {String} className 类名。
 * @return {Element} 元素。
 */
Control.getProxy = function(className){
	var proxy = this._proxy;
	if(!proxy){
	
		proxy = this._proxy = document.create('div')
			.hide()
			.appendTo();
			
		/**
		 * 打开代理元素。
		 */
		proxy.mask = function(elem){
			
			return this.show()
					.setOffset(elem.getOffsets())
					.setSize(elem.getSize());
		};
	}
	
	proxy.className = 'x-proxy ' + className;
	return proxy;
};

/**
 * 将指定名字的方法委托到当前对象指定的成员。
 * @param {Object} control 类。
 * @param {String} delegate 委托变量。
 * @param {String} methods 所有成员名。
 * @param {Number} type 类型。 1 - 返回本身 2 - 返回委托返回 3 - 返回自己，参数作为控件。 4 - 增加事件调用。
 * @param {String} [methods2] 成员。
 * @param {String} [type2] 类型。
 * 由于一个控件本质上是对 DOM 的封装， 因此经常需要将一个函数转换为对节点的调用。
 */
Control.delegate = function(control, target, methods, type, methods2, type2) {
	
	if (methods2) 
		arguments.callee(control, target, methods2, type2);
	
	assert(control && control.prototype, "Control.delegate(control, target, methods, type, methods2, type2): 参数 {control} 必须是一个类", control);
	assert.isNumber(type, "Control.delegate(control, target, methods, type, methods2, type2): 参数 {type} ~。");
	
	if(type === 4){
		var onName = 'on' + target;
		target = target.toLowerCase();
		if(!(onName in control.prototype))
			control.prototype[onName] = function(){
				this.trigger(target);
			}; 
	}
	
	String.map(methods, function(name) {
		switch (type) {
			case 2:
				return function() {
					var me = this[target];
					return me[name].apply(me, arguments);
				};
			case 3:
				return function(control1, control2) {
					return this[target][name](control1 && control1.dom || control1, control2 ? control2.dom || control2 : null);
				};
			case 4:
				return  function(args1, args2){
					this.dom[name](args1, args2);
					this[onName]();
					return this;
				};
			default:
				return function() {
					var me = this[target];
					me[name].apply(me, arguments);
					return this;
				};
		}
	}, control.prototype);
	
	return arguments.callee;
};

Control.delegate(Control, 'dom', 'addEventListener removeEventListener scrollIntoView focus blur', 2, 'appendChild removeChild insertBefore replaceChild', 3);


