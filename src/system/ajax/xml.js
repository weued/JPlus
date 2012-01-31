//===========================================
//  请求处理XML数据     A
//===========================================

using("System.Ajax.Ajax");

Ajax.XML = Ajax.extend({
	
	onSuccess: function(response, xhr){
		this.trigger("success", xhr.responeXML);
	}

});












/**
 * @class CC.util.JSONPConnector
 * 该类实现JSONP跨域请求，并实现XMLHttpRequest类常用方法，使得可以直接应用到{@link CC.Ajax}类中.<br>
 * 要发起JSONP请求，可利用{@link CC.Ajax}类，不必直接调用本类。
 * <br>JSONP原理:<br><pre>
Jsonp原理：
首先在客户端注册一个callback, 然后把callback的名字传给服务器。
此时，服务器生成 json 数据,然后以 javascript 语法的方式，生成一个function , function 名字就是传递上来的参数 jsonp.
最后将 json 数据直接以入参的方式，放置到 function 中，这样就生成了一段 js 语法的文档，返回给客户端。
客户端浏览器，解析script标签，并执行返回的 javascript 文档，此时数据作为参数，传入到了客户端预先定义好的 callback 函数里.（动态执行回调函数）
</pre>
 * @constructor
 * @param {Object} config
 */

/**
 * @cfg {Function} onreadystatechange 状态变更后回调
 */

CC.create('CC.util.JSONPConnector', null, {
    
    initialize : function(cfg){
        this.cfg = cfg;
    },
    
/**
 * 中止请求
 */
    abort : function(){
        if(!this.cleaned)
            this._clean();
    },
    
    setRequestHeader : fGo,
    getResponseHeader : fGo,

    open : function(method, url){
        if(url)
            this.url = url;
    },
    
    send : function(data){
        var cfg = this.cfg || {},
            url = this.url || cfg.url, 
            isQ = url.indexOf('?')>=0,
            win = cfg.win || window,
            fn  = 'jsonp_' + (+new Date() + CC.uniqueID()),
            doc = cfg.win ? CC.frameDoc(win) : document,
            script = doc.createElement('script'),
            jsonp = cfg.jsonp || 'jsonp',
            hd = doc.getElementsByTagName("head")[0],
            self = this;
            
        url = url + ( isQ ? '&'+jsonp+'='+fn : '?'+jsonp+'='+fn);
        
        data && ( url = url + ( typeof data === 'string' ? data : CC.queryString(data) ));

        script.type = 'text/javascript';
        cfg.charset && (script.charset = cfg.charset);
        cfg.deffer  && (script.deffer  = cfg.deffer);
        script.src = url;
        
        win[fn] = function(){
            self._clean();
        };
        
        this._win = win;
        this._script = script;
        this._fn = fn;
        
        this.cleaned = false;
        
        // jsonp callback
        win[fn] = function(){
            if(!self.cleaned){
                self._clean();
                self._fireState(4, 200, arguments);
            }
        };

        script.onreadystatechange = script.onload = function(e){
            var rs = this.readyState;
            if( !self.cleaned && (!rs || rs === 'loaded' || rs === 'complete') ){
                self._clean();
                self._fireState(4, -1);
            }
        };
                
        hd.appendChild(script);
    },
    
    _clean : function(){
        if(!this.cleaned){
            try {
                this._win[this._fn] = null;
                try{ delete this._win[this._fn]; }catch(ex){}
                delete this._win;
                delete this._fn;
                this._script.onreadystatechange = null;
                this._script.parentNode.removeChild(this._script);
                delete this._script;
                delete this.cfg;
            }catch(e){}
            this.cleaned = true;
        }
    },
    
    _fireState : function(rs, status, args){
        this.readyState = rs;
        if(status !== undefined)
            this.status = status;
        this.onreadystatechange.apply(this, args);
    }
});