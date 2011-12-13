//===========================================
//  请求       A
//===========================================



using("System.Ajax.Ajax");		
	  

/**
 * 判断请求是否修改。
 * @param {XMLHttpRequest} xhr 请求。
 * @param {String} url 地址。
 * @return {Boolean} 布尔值。
 */
Ajax.httpNotModified = function( xhr, url ){
	try{
		var xhrRes = xhr.getResponseHeader('Last-Modified');

		// 火狐返回状态  200.检查是否修改
		return xhr.status == 304 || xhrRes == XMLHttpRequest.lastModified[url];
	}catch(e){}
	return false;
 };
 
 
 
Ajax.implement({
 
	setModifiedSince: function(data){
	
	},
	
	getHeader: function(name){
	
	}
 
 });
	
	
