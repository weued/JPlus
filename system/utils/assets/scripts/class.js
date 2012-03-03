//===========================================
//  类扩展   class.js  A
//===========================================

Object.extend(JPlus.Object, {
	
	/**
	 * 扩充类的静态成员。
	 * @param {Object} obj
	 */
	statics: function(obj){
		assert(obj, "JPlus.Object.statics(obj): 参数 {obj} 不能为空。", obj);
				
		return Object.extend(this, obj);
	},
	
	
	/**
	 * 扩充类的静态成员。
	 * @param {Object} obj
	 */
	staticsIf: function(obj){
		assert(obj, "JPlus.Object.staticsIf(obj): 参数 {obj} 不能为空。", obj);
				
		return Object.extendIf(this, obj);
	}
	
	
});


[String, Array, Function, Date, Element, Number].forEach(JPlus.Native);

			
			