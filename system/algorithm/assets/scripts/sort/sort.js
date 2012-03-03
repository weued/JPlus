//===========================================
//  排序    
//===========================================




/**
 * 提供排序算法。
 */
JPlus.namespace("Sorter", {
	
	/**
	 * 默认比较的函数。
	 * @param {Object} a 比较的参数。
	 * @param {Object} b 比较的参数。
	 * @return {Boolean} 布尔。表示 a 是否比 b 大。
	 * @private
	 */
    _defaultSorter: function(a,b){return a<b;},
	
	/**
	 * 配置参数。
	 * @param {Object} iterater 集合。
	 * @param {Number} start 开始排序的位置。
	 * @param {Number} end 结束排序的位置。
	 * @param {Function} fn 比较函数。
	 */
	_setup: function(args){
        assert.isNumber(args[0] && args[0].length, "Sorter._setup(iterater, start, end, fn): 参数 {iterater} 必须有 length 属性。");
		args.length = 4;
		args[1] = args[1] || 0;
		if(args[2] === undefined)
			args[2] = args[0].length;
		args[3] = args[3] || this._defaultSorter;
		
		assert.between(args[1], 0, args[2] + 1, "Sorter._setup(iterater, start, end, fn): 参数 {start} ~。");
		assert.between(args[2], args[1], args[0].length + 1, "Sorter._setup(iterater, start, end, fn): 参数 {end} ~。");
		assert.isFunction(args[3], "Sorter._setup(iterater, start, end, fn): 参数 {fn} ~。");
		return args;
	},
	
	/**
	 * 冒泡排序。
	 * @param {Object} iterater 集合。
	 * @param {Number} start 开始排序的位置。
	 * @param {Number} end 结束排序的位置。
	 * @param {Function} fn 比较函数。
	 */
    sort : function(iterater){
    
		var args = Sorter._setup(arguments),
			start = args[1],
			end = args[2],
			fn = args[3];
		
        for(;start < end; start++)
		    for(var k = start + 1;k < end; k++)
			    if(fn(iterater[k], iterater[start])) {
					var c = iterater[start];
			        iterater[start] = iterater[k];
			        iterater[k] = c;
				}

		return iterater;
	}
	
});




