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
