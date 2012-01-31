//===========================================
//  枚举       A
//===========================================



Object.extend(namespace(".Enum", function (flag){
	
	var args = arguments, r = [];
	
	if(flag === true){
		Array.prototype.shift.call(args);
	}
	
	Object.each(args, function(value, i){
		r[value] = flag === true ? 1 << i : i;
	})
	
	return r;
}), {
	
	/**
	 * 根据某个值返回枚举的大小。
	 * @param {Object} enumObj 枚举类型对象。
	 * @param {Number} enumValue 枚举的内容。
	 */
	getName: function(enumObj, enumValue){
		for(var i in enumObj)
        	if( enumObj[i] === enumValue)
            	return i;
    	return null;
	}
});