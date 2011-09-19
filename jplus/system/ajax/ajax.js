//===========================================
//  请求    A
//===========================================



/**
 * 处理异步请求的功能。
 * @class Ajax
 */
namespace(".Ajax", Class({
	
	onStart: function(data){
		this.trigger("start", data);
	},
	
	onSuccess: function(response, xhr){
		this.trigger("success", response);
	},
	
	onError: function(e, xhr){
		this.trigger("error", e);
	},
	
	onTimeout: function(xhr){
		this.trigger("timeout");
	},
	
	onComplete: function(xhr, status){
		this.trigger("complete", xhr);
	},

	onAbort: function(){
		this.trigger("abort");
	},

	onStateChange: function(isTimeout){
		var me = this, xhr = me.xhr, status;
			
		if(xhr && (xhr.readyState === 4 || isTimeout)) {
			
		
			// 删除 readystatechange  。
			xhr.onreadystatechange = Function.empty;
			
			// 删除目前的活动对象。
			me.xhr = null;
			
			if(isTimeout === true){
				xhr.abort();
				me.onTimeout(xhr);
				status = 'Request Timeout';
			} else if(isTimeout) {
				status = 'error';
			} else {
				isTimeout = true;
			
				status = !JPlus.checkStatusCode(xhr.statusCode) && (xhr.statusText || 'error');
			}
			
			
			
			if (!status) {
				// xhr[/xml/.test(xhr.getResponseHeader('content-type')) ? 'responseXML' : 'responseText']
				me.onSuccess(xhr.responseText, xhr);
			} else {
				if(isTimeout === true) {
					isTimeout = new Error(status);
				}
				
				isTimeout.xhr = xhr;
				me.onError(isTimeout, xhr);
			}
			
			me.onComplete(xhr, status);
		
			xhr = null;
		}
	},

	/**
	 * 初始化当前请求。
	 * @param {Object} obj 配置对象。
	 * @constructor Ajax
	 */
	constructor: function(obj) {
		Object.extend(this, obj);
	},
	
	/**
	 * 获取或设置请求类型。
	 */
	type: 'GET',
	
	/**
	 * 获取或设置是否为异步请求。
	 */
	async: true,
	
	/**
	 * 多个请求同时发生后的处理方法。 wait - 等待上个请求。 cancel - 中断上个请求。 ignore - 忽略新请求。
	 */
	link: 'wait',
	
	/**
	 * 获取请求头。
	 */
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
	},
	
	/**
	 * 获取或设置是否忽略缓存。
	 */
	disableCache: false,
	
	/**
	 * 发送请求前检查。
	 * @param {Object} data 数据。
	 * @return {Boolean} 是否可发。
	 */
	check: function(data) {
		var me = this;
		
		// 当前无请求， 可请求。
		if (!me.xhr) return true;
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
	 */
	send: function(data) {
	
		assert.notNull(this.url, "Ajax.prototype.send(data, chain): {this.url} ~。", this.url);
		assert(/^(GET|POST|PUT)$/.test(this.type), "{this.type} 必须是 GET、PUT 或 POST (注意大小写) 。",this.type);
		
		
		/**
		 * 当前实例。
		 * @type Ajax
		 * @ignore
		 */
		var me = this,  
			
			/**
			 * 类型。
			 * @type String
			 */
			type = me.type,  
			
			/**
			 * 当前请求。
			 * @type String
			 */
			url = me.url,  
			
			/**
			 * 是否异步请求。
			 * @type Boolean
			 */
			async = me.async;
		
		if (!me.check(data)) {
			return me;
		}
		
		me.onStart(data);
		
		/// #region 数据
			
		// 改成字符串。
		if(typeof data !== 'string')
			data = String.param(data);
		
		// get  请求
		if (data && type == 'GET') {
			url += (url.indexOf('?') >= 0 ? '&' : '?') + data;
			data = null;
		}
		
		// 禁止缓存，为地址加上随机数。
		if(me.disableCache){
			url += (url.indexOf('?') >= 0 ? '&' : '?') + JPlus.id++;
		}
		
		/// #endregion
		
		/// #region 打开
		
		/**
		 * 请求对象。
		 * @type XMLHttpRequest
		 * @ignore
		 */
		var xhr = me.xhr = new XMLHttpRequest();
		
		try {
		
			if ('username' in me) 
				xhr.open(type, url, async, me.username, me.password);
			else xhr.open(type, url, async);
				
				
		} catch (e) {
		
			me.xhr = null;
			e.xhr = xhr;
			//  出现错误地址时  ie 在此产生异常
			me.onError(e, xhr);
			me.onComplete(xhr, "error");
			return me;
		}
		
		/// #endregion
		
		/// #region 设置文件头
		
		for(var key in me.headers)
			try {
				xhr.setRequestHeader(key, me.headers[key]);
			} catch (e){
				trace.error(e);
			}
		
		/// #endregion
		
		/// #region 发送
		
		// 监视 提交是否完成
		xhr.onreadystatechange = function(){
			me.onStateChange(false);
		};
		
		
		try {
			xhr.send(data);
		} catch (e) {
			me.onStateChange(e);
			return me;
		}
		
		// 不是同步时，火狐不会自动调用 onreadystatechange
		if (!async)
			me.onStateChange();
		else if (me.timeouts > 0) {
			setTimeout(function() {
				me.onStateChange(true);
			}, me.timeouts);
		}
		
		
		/// #endregion
		
		return me;
		
	},
	
	/**
	 * 设置地址的编码。
	 * @param {String} [value] 字符集。
	 * @return this
	 */
	setEncoding: function(value){
		
		if(value)
			this.setHeader("Accept-Charset", value);
		return this.setHeader('contentType', 'application/x-www-form-urlencoded' + (value ? '; charset=' + value : ''));

	},
	
	/**
	 * 设置请求头。
	 * @param {String} key 键。
	 * @param {String} text 值。
	 * @return this
	 */
	setHeader: function(key, text){
		if(!this.hasOwnProperty("header"))
			this.header = Object.clone(this.header);
		
		this.header[key] = text;
		
		return this;
	},
	
	/**
	 * 停止当前的请求。
	 * @return this
	 */
	abort: function() {
		if (this.xhr) {
			this.xhr.abort();
			this.onAbort();
			this.xhr = null;
		}
		
		return this;
	},
	
	/**
	 * xType。
	 */
	xType: "ajax"
	
}).addEvents());

String.map("get post", function(k) {
	
	var emptyFn = Function.empty;

	/**
	 * 快速请求一个地址。
	 * @param {String} url 地址。
	 * @param {String/Object} data 数据。
	 * @param {Function} [onsuccess] 成功回调函数。
	 * @param {Function} [onerror] 错误回调函数。
	 * @param {Object} timeouts=-1 超时时间， -1 表示不限。
	 * @param {Function} [ontimeout] 超时回调函数。
	 * @method Ajax.get
	 */
	
	/**
	 * 快速请求一个地址。
	 * @param {String} url 地址。
	 * @param {String/Object} data 数据。
	 * @param {Function} [onsuccess] 成功回调函数。
	 * @param {Function} [onerror] 错误回调函数。
	 * @param {Object} timeouts=-1 超时时间， -1 表示不限。
	 * @param {Function} [ontimeout] 超时回调函数。
	 * @method Ajax.post
	 */
	
	return function(url, data, onsuccess, onerror, timeouts, ontimeout) {
		assert.isString(url, "Ajax." + k + "(url, data, onsuccess, onerror, timeouts, ontimeout): 参数{url} 必须是一个地址。如果需要提交至本页，使用 location.href。");
		new Ajax({
			url: url,
			onSuccess: onsuccess || emptyFn,
			onError: onerror || emptyFn,
			timeouts: timeouts,
			onTimeout: ontimeout || emptyFn,
			type: k.toUpperCase()
		}).send(data);
	};
}, Ajax);


