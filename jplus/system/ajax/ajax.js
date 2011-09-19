//===========================================
//  请求    A
//===========================================


using("System.Ajax.Request");


/**
 * 处理异步请求的功能。
 * @class Ajax
 */
namespace(".Ajax", Request.extend({
	
	onError: function(errorMessage){
		this.trigger("error", errorMessage);
	},

	onReadyStateChange: function(exception){
		var me = this, xhr = me.xhr;
			
		if(xhr && (exception || xhr.readyState === 4)) {
			
			// 删除 readystatechange  。
			xhr.onreadystatechange = Function.empty;
			
			try{
				
				if(exception) {
					if(exception === true) {
						xhr.abort();
						me.onTimeout(xhr);
						exception = 'Request Timeout';
					}
				} else {
					exception = !JPlus.checkStatusCode(xhr.status) && xhr.statusText;
				}
					
				if (exception)
					me.onError(exception, xhr);
				else
					// xhr[/xml/.test(xhr.getResponseHeader('content-type')) ? 'responseXML' : 'responseText']
					me.onSuccess(xhr.responseText, xhr);
				
				me.onComplete(exception, xhr);
					
			} finally {
		
				xhr = me.xhr = null;
			
			}
		}
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
	 * 获取请求头。
	 */
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
	},
	
	/**
	 * 获取或设置是否忽略缓存。
	 * @property disableCache=false
	 */
	
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
			
		assert(url != undefined, "Ajax.prototype.send(data): 当前请求不存在 url 属性，无法提交请求。");
		assert(["GET", "POST", "PUT", "DELETE"].indexOf(type) > -1, "Ajax.prototype.send(data): 当前请求的 {type} 不合法， type 应该是 GET POST PUT DELETE 之一(注意全大写)。", type);
		
		if (me.xhr && !me.delay(data)) {
			return me;
		}
		
		me.onStart(data);
		
		/// #region 数据
			
		// 改成字符串。
		if(typeof data !== 'string')
			data = String.param(data);
		
		// get  请求
		if (data && type == 'GET') {
			url = me.combineUrl(url, data);
			data = null;
		}
		
		// 禁止缓存，为地址加上随机数。
		if(me.disableCache){
			url = me.combineUrl(url, JPlus.id++);
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
		
			//  出现错误地址时  ie 在此产生异常
			me.onReadyStateChange(e.message);
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
			me.onReadyStateChange();
		};
		
		
		try {
			xhr.send(data);
		} catch (e) {
			me.onReadyStateChange(e.message);
			return me;
		}
		
		// 不是同步时，火狐不会自动调用 onreadystatechange
		if (!async)
			me.onReadyStateChange();
		else if (me.timeouts > 0) {
			setTimeout(function() {
				me.onReadyStateChange(true);
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
	
}));

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
	
	k = k.toUpperCase();
	
	return function(url, data, onsuccess, onerror, timeouts, ontimeout, oncomplete) {
		assert.isString(url, "Ajax." + k.toLowerCase() + "(url, data, onsuccess, onerror, timeouts, ontimeout, oncomplete): 参数{url} 必须是一个地址。如果需要提交至本页，使用 location.href。");
		new Ajax({
			url: url,
			onSuccess: onsuccess || emptyFn,
			onError: onerror || emptyFn,
			timeouts: timeouts,
			onTimeout: ontimeout || emptyFn,
			onComplete: oncomplete || emptyFn,
			type: k
		}).send(data);
	};
}, Ajax);


