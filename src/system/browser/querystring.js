//===========================================
//  查询   querystring.js     A
//===========================================



(function(q){
        var search = location.search,
        	dc = decodeURIComponent;
		if(!search) return;
		search.substring(1).split('&').each(function(value){
		    value = value.split('=');
		    try{
		    	q[dc(value[0])] = value.length > 1 ? dc(value[1]) : null;
		    }catch(e){
		    	
		    }
		    
		    
		    
		});
})(location.queryString = {});