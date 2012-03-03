//===========================================
//  希尔排序算法   
//===========================================



using("System.Algorithm.Sort.Sort");
	
/**
 * 对集合进行希尔排序。
 * @param {Object} iterater 集合。
 * @param {Number} start 开始排序的位置。
 * @param {Number} end 结束排序的位置。
 * @param {Function} fn 比较函数。
 * @memberOf JPlus.Sorter
 */
Sorter.shell = function(iterater){

	var args = Sorter._setup(arguments),
		start = args[1],
		end = args[2],
		fn = args[3];
	for (var gap = (end - start) >> 1; gap > 0; gap = gap >> 1) {
		for (var i = gap + start; i < end; i++) {
			for (var temp = iterater[i], j = i; (j - gap >= start) && fn(temp, iterater[j - gap]); j -= gap) {
				iterater[j] = iterater[j - gap];
			}
			iterater[j] = temp;
		}
	}
	
	return iterater;
};



