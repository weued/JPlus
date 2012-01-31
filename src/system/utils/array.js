//===========================================
//  数组扩展        A
//===========================================

/**
 * 数组。
 * @class Array
 */
Array.implementIf({
	
	/// #if SupportIE8

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
	
	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			//i 本来就是小于 this.length 还用判断么？
			if (i in this) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){//跟上边一样
			if ((i in this) && fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},

	/// <summary>
	/// 合并2个数组，第2个数组不覆盖原成员。
	/// </summary>
	/// <params name="array" type="Array">数组</params>
	/// <returns type="Array">数组</returns>
	concat: function(array){
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
//		var m = [];
//		for(var i = start || 0,len = length || this.length - i;i<len;i++)
//			m[i] = Object.clone(this[i]);
//		return m;
		var start = start || 0, len = length || 0;
		return len === 0 ? this.slice(start) : this.slice(start,start+len);
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

	/**
     * 没看懂这个函数的意义
     * sortFn:排序规则
     */
    sortByRandom: function(sortFn) {
        var result = [], array = this , sortFn = sortFn || function(){return Math.rand(0, array.length - 1);};
		while(array.length > 0){
			var index = sortFn();
			result.push(array[index]);
			array.remove(index);
		}
		return result;
    },
	
	// 是否包含某项
	contains:function(item){
		return RegExp("\\b"+item+"\\b").test(this);
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
    },

///<summary>获取数组中的最小值。语法：min()</summary>
		///<returns type="number">返回数组中的最小值。</returns>
	min: function(){
		return Math.min.apply(null, this);
	},

///<summary>获取数组中的最大值。语法：max()</summary>
		///<returns type="number">返回数组中的最大值。</returns>
	max: function(){
		return Math.max.apply(null, this);
	},

	average: function(){
		return this.length ? this.sum() / this.length : 0;
	},

	sum: function(){
		var result = 0, l = this.length;
		if (l){
			while (l--) result += this[l];
		}
		return result;
	},

	checkRepeat : function() {
		///<summary>检查数组中是否存在重复值。语法：checkRepeat()</summary>
		///<returns type="boolean">若数组中存在重复值，则返回 true，否则返回 false。</returns>
	    for (var i = 0; i < this.length - 1; i++) {
	        for (var j = i + 1; j < this.length; j++) {
	            if (this[i] == this[j]) {
	                return true;
	            }
	        }
	    }
	
	    return false;
	},
	
	findFirstNotOf : function(a){
		var o = this;
		for ( var i=0,length=o.length; i<length; i++)
			if(o[i] != a)
				return i;
		return -1;
	},

	findLastNotOf : function(a){
		var o = this;
		for ( var i=o.length-1; i>=0; i--)
			if(o[i] != a)
				return i;
		return -1;
	},

	shuffle: function(){
		for (var i = this.length; i && --i;){
			var temp = this[i], r = Math.floor(Math.random() * ( i + 1 ));
			this[i] = this[r];
			this[r] = temp;
		}
		return this;
	},

	/**
	 * 复制到另一个数组。
	 * @param {Object} o 位置。
	 * @return {Array} 参数的内容。
	 */
	copyTo: function(o) {
		var i = o.length;
		forEach.call(this, function(x) {
			o[i++] = x;
		});
		return o;
	}
		

});


