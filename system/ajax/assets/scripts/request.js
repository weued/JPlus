/**
 * @fileOverview 提供最底层的 AJAX 辅助函数。
 */

var Ajax = Ajax || {};

/**
 * 提供一个请求的基本功能。
 * @class Request
 * @abstract
 */
Ajax.Request = Class({
	
	/**
	 * 返回变量的地址形式。
	 * @param { Base} obj 变量。
	 * @return {String} 字符串。
	 * @example <code>
	 * String.param({a: 4, g: 7}); //  a=4&g=7
	 * </code>
	 */
	toParam: function (obj) {
		if (!obj)
	        return "";
	    var s = [], e = encodeURIComponent;
	    Object.each(obj, function(value, key) {
	        s.push(e(key) + '=' + e(value));
	    });
	
	    // %20 -> + 。
	    return s.join('&').replace(/%20/g, '+');
	},
	
	combineUrl: function (url, param) {
		return url + (url.indexOf('?') >= 0 ? '&' : '?') + param;
	},
	
	onStart: function(data){
		this.trigger("start", data);
	},
	
	onSuccess: function(response){
		this.trigger("success", response);
	},
	
	onError: function(errorMessage){
		this.trigger("error", errorMessage);
	},
	
	onTimeout: function(){
		this.trigger("timeout");
	},
	
	onComplete: function(status){
		this.trigger("complete", status);
	},

	onAbort: function(){
		this.trigger("abort");
	},
	
	/**
	 * 多个请求同时发生后的处理方法。 wait - 等待上个请求。 cancel - 中断上个请求。 ignore - 忽略新请求。
	 */
	link: 'wait',

	/**
	 * 初始化当前请求。
	 * @param {Object} obj 配置对象。
	 * @constructor Ajax
	 */
	constructor: function(obj) {
		Object.extend(this, obj);
	},
	
	/**
	 * 发送请求前检查。
	 * @param {Object} data 数据。
	 * @return {Boolean} 是否可发。
	 * @protected virtual
	 */
	delay: function(data) {
		var me = this;
		
		switch (me.link) {
			case 'wait':
			
				// 在 complete 事件中处理下一个请求。
				me.one('complete', function() {
					this.send(data, true);
					return false;
				});
				return false;
			case 'cancel':
			
				// 中止请求。
				me.abort();
				return true;
			default:
				assert(!link || link == 'ignore', "Ajax.prototype.send(data): 成员 {link} 必须是 wait、cancel、ignore 之一。", me.link);
				return false;
		}
		return true;
	},
	
	/**
	 * 超时的时间大小。 (单位: 毫秒)
	 * @property timeouts
	 * @type Number
	 */
	 
	 /**
	  * 是否允许缓存。
	  * @property enableCache
	  * @type Boolean
	  */
	
	/**
	 * 发送请求。
	 * @param {Object} [data] 发送的数据。
	 * @method send
	 * @abstract
	 */
	
	/**
	 * 停止当前的请求。
	 * @return this
	 * @method abort
	 * @abstract
	 */
	
	/**
	 * xType。
	 */
	xType: "request"
	
});


