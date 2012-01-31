//===========================================
//  预加载一个图片 
//    A: xuld
//===========================================



JPlus.namespace("Dom", {

	preload: (function(){
		
		var loadings = [], isLoading = false;
		
		function loadNext(){
			
			if(isLoading) {
				setTimeout(loadNext, 10);
				return;
			}
				
			if(!loadings.length)
				return;
				
			isLoading = true;
			var src = loadings.shift(), img = document.createElement('img');
			img.src = src;
			img.onload = img.onerror = function(){
				img = img.onload = img.onerror = img.src = null;
				isLoading = false;
			};
		}
		
		/**
		 * 预载入一个地址的资源。
		 * @param {String} src 图片地址。
		 */
		return function(src){
			loadings.push(src);
			loadNext();
		};
		
	})()

});
