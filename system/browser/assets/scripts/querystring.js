//===========================================
//  查询   querystring.js     A
//===========================================


JPlus.namespace("JSON").fromQueryString = function (value) {
	var r = {};
	if(value){
		if(value.charAt(0) == '?') value = value.substr(1);
		value.split('&').each(function(value, key){
			key = decodeURIComponent(value[0]);
		    value = value.split('=');
		    try{
		    	r[key] = decodeURIComponent(value[1]);
		    }catch(e){
		    	r[key] = value[1];
		    }
		});
	}
	
	
	return r;
};

location.queryString = JSON.fromQueryString(location.search);


