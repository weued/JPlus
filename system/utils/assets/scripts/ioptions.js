//===========================================
//  使类有选项功能   iptions.js     A
//===========================================

/**
 * 使类具有扩展自身的方法。
 * @interface JPlus.IOptions
 */
var IOptions = {
	
	/**
	 * 对当前类扩展属性。
	 * @param {Object} options 配置。
	 */
	setOptions: function(options, value){
		return Object.set(this, options, value);
	}
	
};
