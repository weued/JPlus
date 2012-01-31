//===========================================
//  请求处理JSON数据            
//   A: xuld
//===========================================

using("System.Ajax.Ajax");

JPlus.namespace("Ajax").JSON = Ajax.extend({
	
	/**
	 * 获取请求头。
	 */
	headers: Object.extendIf({
		'Accept': 'application/json'
	}, Ajax.prototype.headers),
	
	parseJSON: function(response){
		return eval("(" + response + ")");
	},
	
	onSuccess: function(response){
		this.trigger("success", this.parseJSON(response));
	}

});



String.map("get post", function(k) {
	
	Ajax[k + 'JSON'] = function(url, data, onsuccess, onerror, timeouts, ontimeout, oncomplete){
		var emptyFn = Function.empty;
		new Ajax.JSON({
			url: url,
			onSuccess: function(response){
				try{
					var json = this.parseJSON(response);
				} catch(e) {
					this.onError(e.message);
					return null;
				}
				return onsuccess && onsuccess.call(this,  json);
			},
			onError: onerror || emptyFn,
			timeouts: timeouts,
			onTimeout: ontimeout || emptyFn,
			onComplete: oncomplete || emptyFn,
			type: k.toUpperCase()
		}).send(data);
	};


});



