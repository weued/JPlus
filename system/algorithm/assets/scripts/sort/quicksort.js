//===========================================
//  快速排序算法    
//===========================================


using("System.Algorithm.Sort.Sort");

/**
 * 对集合进行快速排序。
 * @param {Object} iterater 集合。
 * @param {Number} start 开始排序的位置。
 * @param {Number} end 结束排序的位置。
 * @param {Function} fn 比较函数。
 * @memberOf JPlus.Sorter
 */
Sorter.quickSort = (function() {

	function qsort(iterater, start, end, fn) {
		
		if(start >= end)
			return;
	
		var temp = iterater[start], low = start, high = end;
		do {
			while (high > low && !fn(iterater[high], temp)) 
				high--;
				
			if (low < high)
				iterater[low++] = iterater[high];
			
			
			while (low < high && fn(iterater[low], temp)) 
				low++;
				
			if (low < high)
				iterater[high--] = iterater[low];

		}while (low < high);
		iterater[low] = temp;
		
		qsort(iterater, start, high - 1, fn);
		qsort(iterater, high + 1, end, fn);
		
	}
	
	return function() {
		qsort.apply(null, Sorter._setup(arguments));
		
		return arguments[0];
	};
	
})();



