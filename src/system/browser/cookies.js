//===========================================
//  Cookie辅助              A
//===========================================


/**
 * 浏览器 Cookies 处理。
 * @param {Object} name 名字。
 */
var Cookies = {
	
	/**
	 * 获取 Cookies 。
	 * @param {String} name 名字。
	 * @param {String} 值。
	 */
	get: function(name){
		
		assert.isString(name, "Cookies.get(name): 参数 name ~。");
		
		name = encodeURIComponent(name);
		
		var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	},
	
	/**
	 * 设置 Cookies 。
	 * @param {String} name 名字。
	 * @param {String} value 值。
	 * @param {Number} expires 有效天数。天。-1表示无限。
	 * @param {Object} props 其它属性。如 domain, path, secure    。
	 */
	set: function(name, value, expires, props){
		var e = encodeURIComponent,
		    updatedCookie = e(name) + "=" + e(value),
		    t;
		    
		    assert(updatedCookie.length < 4096, "Cookies.set(name, value, expires, props): 参数  value 内容过长，无法存储。");
		
		if(expires == undefined)
			expires = value === null ? -1 : 1000;
		   
		if(expires) {
			t = new Date();
			t.setHours(t.getHours() + expires * 24);
			updatedCookie += '; expires=' + t.toGMTString();
		}
		    
		for(t in props){
			updatedCookie = String.concat(updatedCookie, "; " + t, "=",  e(props[t])) ;
		}
		
		document.cookie = updatedCookie;
	}
};


