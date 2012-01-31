//===========================================
//  使类有选项功能   iptions.js     A
//===========================================

/**
 * 使类具有扩展自身的方法。
 * @interface Py.IOptions
 */
namespace('.IOptions', {
	
	/**
	 * 对当前类扩展属性。
	 * @param {Object} options 配置。
	 */
	setOptions: function(options){
		if(!Object.isObject(options)){
			var data = {};
			data[options] = arguments[1];
			options = data;
		}
		return Object.set(this, options);
	}
	
});
