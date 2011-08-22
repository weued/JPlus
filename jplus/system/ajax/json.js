//===========================================
//  请求处理JSON数据            A
//===========================================

using("System.Ajax.Ajax");





JPlus.Ajax.JSON = JPlus.Ajax.extend({

	/**
	 * 获取请求头。
	 */
	headers: Object.extendIf({
		'Accept': 'application/json'
	}, JPlus.Ajax.prototype.headers),
	
	parseJSON: function(response){
		return eval("(" + response + ")");
	},
	
	onSuccess: function(response){
		this.trigger("success", this.parseJSON(response));
	}

});



String.map("get post", function(k) {
	
	JPlus.Ajax[k + 'JSON'] = function(url, data, onsuccess, onerror, timeouts, ontimeout){
		var emptyFn = Function.empty;
		new Ajax.JSON({
			url: url,
			onSuccess: onsuccess && function(){
				try{
					var json = this.parseJSON(response);
				} catch(e) {
					return null;
				}
				return onsuccess.call(json);
			},
			onError: onerror || emptyFn,
			timeouts: timeouts,
			onTimeout: ontimeout || emptyFn,
			type: k.toUpperCase()
		}).send(data);
	};


});



