//===========================================
//  数组扩展        A
//===========================================

/**
 * 数组。
 * @class Array
 */
Array.implementIf({
	
	/// #ifdef SupportIE8

	/// <summary>
	/// 对数组每个元素判断一个函数返回true。
	/// </summary>
	/// <params name="fn" type="Function">函数。参数 value, index, this</params>
	/// <params name="bind" type="Object" optional="true">绑定的对象</params>
	/// <returns type="Boolean">全部返回 true则返回 true。</returns>
	every: function(fn, bind){
		bind = bind || this;
		for (var i = 0, l = this.length; i < l; i++){
			if (!fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},
	
	filter: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) results.push(this[i]);
		}
		return results;
	},
	
	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},

	/// <summary>
	/// 合并2个数组，第2个数组不覆盖原成员。
	/// </summary>
	/// <params name="array" type="Array">数组</params>
	/// <returns type="Array">数组</returns>
	concat : function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},
	
	/// #endif

	/// <summary>
	/// 返回数组的副本
	/// </summary>
	/// <params name="start" type="Number" optional="true">位置</params>
	/// <params name="length" type="Number" optional="true">长度</params>
	/// <returns type="Array" > 拷贝的数组 </returns>
	clone : function(start,length){
		var m = [];
		for(var i = start || 0,len = length || this.length - i;i<len;i++)
			m[i] = Object.clone(this[i]);
		return m;
	},
	
	/// <summary>
	/// 删除数组中等价false的内容。
	/// </summary>
	/// <returns type="Boolean">全部返回 true则返回 true。</returns>
	clean: function(){
		return this.filter(function(x){return !x;});
	},

	/// <summary>
	/// 对数组链至对象
	/// </summary>
	/// <params name="fn" type="Function">函数。参数 value, index, this</params>
	/// <params name="bind" type="Object" optional="true">绑定的对象</params>
	/// <returns type="Array">数组</returns>
	link: function(object){
		var result = [];
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	/// <summary>
	/// 返回数组的随机位置的值。
	/// </summary>
	/// <returns type="Object">内容</returns>
	random : function(){
		return this.length > 0 ? this[Math.rand(0, this.length - 1)] : null;
	},
    
	append: function(array){
		this.push.apply(this, array);
		return this;
	},

	/**
     * 
     */
    sortByRandom: function(array, sortFn) {
        
    },

	first: function(){
		return this[0];
	},

	last: function(){
		return this[this.length - 1];
	},

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	clear: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var type = typeOf(this[i]);
			if (type == 'null') continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	},

	pick: function(){
		for (var i = 0, l = this.length; i < l; i++){
			if (this[i] != null) return this[i];
		}
		return null;
	},
	
	/**
     * Perform a set difference A-B by subtracting all items in array B from array A.
     *
     * @param {Array} arrayA
     * @param {Array} arrayB
     * @return {Array} difference
     */
    difference: function(array) {
        var clone = slice.call(arrayA),
            ln = clone.length,
            i, j, lnB;

        for (i = 0,lnB = arrayB.length; i < lnB; i++) {
            for (j = 0; j < ln; j++) {
                if (clone[j] === arrayB[i]) {
                    erase(clone, j, 1);
                    j--;
                    ln--;
                }
            }
        }

        return clone;
    }

});
