//===========================================
//  堆排序算法            
//===========================================


using("System.Algorithm.Sort.Sort");

namespace("Sorter", {

	/**
	 * 对集合进行快速排序。
	 * @param {Object} iterater 集合。
	 * @param {Number} start 开始排序的位置。
	 * @param {Number} end 结束排序的位置。
	 * @param {Function} fn 比较函数。
	 * @memberOf JPlus.Sorter
	 */
	heapSort: (function() {
	
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
	

    // /**
     // * APIMethod: sort
     // * Actually runs the sort on the data
     // *
     // * Returns: the sorted data
     // */
    // sort : function () {
        // this.fireEvent('start');
// 
        // var count = this.data.length,
            // end;

        // if (count === 1) {
            // return this.data;
        // }
// 
        // if (count > 2) {
            // this.heapify(count);

            // end = count - 1;
            // while (end > 1) {
                // this.data.swap(end, 0);
                // end = end - 1;
                // this.siftDown(0, end);
            // }
        // } else {
            // // check then order the two we have
            // if ((this.comparator((this.data[0]).get(this.col), (this.data[1])
                    // .get(this.col)) > 0)) {
                // this.data.swap(0, 1);
            // }
        // }
// 
        // this.fireEvent('stop');
        // return this.data;
    // },

    // /**
     // * Method: heapify
     // * Puts the data in Max-heap order
     // *
     // * Parameters: count - the number of records we're sorting
     // */
    // heapify : function (count) {
        // var start = Math.round((count - 2) / 2);
// 
        // while (start >= 0) {
            // this.siftDown(start, count - 1);
            // start = start - 1;
        // }
    // },

    // /**
     // * Method: siftDown
     // *
     // * Parameters: start - the beginning of the sort range end - the end of the
     // * sort range
     // */
    // siftDown : function (start, end) {
        // var root = start,
            // child;
// 
        // while (root * 2 <= end) {
            // child = root * 2;
            // if ((child + 1 < end) && (this.comparator((this.data[child]).get(this.col),
                            // (this.data[child + 1]).get(this.col)) < 0)) {
                // child = child + 1;
            // }
       //     if ((this.comparator((this.data[root]).get(this.col),
      //              (this.data[child]).get(this.col)) < 0)) {
      //          this.data.swap(root, child);
       //         root = child;
       //     } else {
            //    return;
        //  }
        //  }
  //  }

});

});



