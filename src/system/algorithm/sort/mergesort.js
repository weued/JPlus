//===========================================
//  归并 排序算法     
//===========================================


using("System.Algorithm.Sort.Sort");

namespace(".Sorter.", {

	/**
	 * 对集合进行快速排序。
	 * @param {Object} iterater 集合。
	 * @param {Number} start 开始排序的位置。
	 * @param {Number} end 结束排序的位置。
	 * @param {Function} fn 比较函数。
	 * @memberOf JPlus.Sorter
	 */
	mergeSort: (function() {
	
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
			qsort.apply(null, JPlus.Sorter._setup(arguments));
			
			return arguments[0];
		};
		
	})()
	
// 	
    // /**
     // * Method: mergeSort
     // * Does the physical sorting. Called
     // * recursively.
     // *
     // * Parameters:
     // * arr - the array to sort
     // *
     // * returns: the sorted array
     // */
    // mergeSort : function (arr) {
        // if (arr.length <= 1) {
            // return arr;
        // }
// 
        // var middle = (arr.length) / 2,
            // left = arr.slice(0, middle),
            // right = arr.slice(middle),
            // result;
        // left = this.mergeSort(left);
        // right = this.mergeSort(right);
        // result = this.merge(left, right);
        // return result;
    // },

    // /**
     // * Method: merge
     // * Does the work of merging to arrays in order.
     // *
     // * parameters:
     // * left - the left hand array
     // * right - the right hand array
     // *
     // * returns: the merged array
     // */
    // merge : function (left, right) {
        // var result = [];
// 
        // while (left.length > 0 && right.length > 0) {
            // if (this.comparator((left[0]).get(this.col), (right[0])
                    // .get(this.col)) <= 0) {
                // result.push(left[0]);
              // //  left = left.slice(1);
            // } //else {
                // result.push(right[0]);
              // //  right = right.slice(1);
            // }
        // }
     //  while (left.length > 0) {
         //   result.push(left[0]);
         //  // left = left.slice(1);
     //   }
    //    while (right.length > 0) {
     //       result.push(right[0]);
          //  right = right.slice(1);
    //    }
    //    return result;
  //  }

});

});



