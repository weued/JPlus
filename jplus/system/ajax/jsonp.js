//===========================================
//  请求处理JSON-P数据          
//   A: aki xuld
//===========================================



using("System.Ajax.Request");

namespace(".Ajax.", null);


Ajax.JSONP = Request.extend({

    onReadyStateChange: function(exception){
        var me = this, script = me.script;
        if (script && (exception || !script.readyState || /loaded|complete/.test(script.readyState))) {
        
            // 删除全部绑定的函数。
            script.onload = script.onreadystatechange = null;
            
            // 删除当前脚本。
            script.parentNode.removeChild(script);
            
            // 删除回调。
            delete window[me.callback];
            
            try {
            
                if (exception === true) {
                    me.onTimeout(script);
                    exception = 'Request Timeout';
                }
                
                me.onComplete(script);
                
            }
            finally {
            
                script = me.script = null;
                
            }
        }
    },
    
    jsonp: 'callback',
    
    send: function(data){
        var me = this, url = me.url, script, t;
        
        if (me.script && !me.delay(data)) 
            return me;
        
        me.onStart(data);
        
        // 改成字符串。
        if (typeof data !== 'string') {
        
            if (data && data[me.jsonp]) {
                me.callback = data[me.jsonp];
                delete data[me.jsonp];
            }
            
            data = String.param(data);
        }
        
        url = me.combineUrl(url, data).replace(/(.)=(\?)(&|$)/, function(match, group1, group2, group3){
            return (group1 === '?' ? me.jsonp : group1) + '=' + (me.callback || (me.callback = 'jsonp' + JPlus.id++)) + group3;
        });
        
        script = me.script = document.createElement("script");
        t = document.getElementsByTagName("script")[0];
        
        window[me.callback] = function(){
            me.onSuccess.apply(me, arguments);
        };
        
        script.src = url;
        script.type = "text/javascript";
        
        t.parentNode.insertBefore(script, t);
        
        if (me.timeouts > 0) {
            setTimeout(function(){
                me.onReadyStateChange(true);
            }, me.timeouts);
        }
        
        script.onload = script.onreadystatechange = function(){
            me.onReadyStateChange();
        };
    },
    
    abort: function(){
        this.onAbort();
        this.onReadyStateChange('Aborted');
    }
});





Ajax.getJSONP = function(url, data, onsuccess, timeouts, ontimeout, oncomplete){
    assert.isString(url, "Ajax.getJSONP(url, data, onsuccess, timeouts, ontimeout): 参数{url} 必须是一个地址。如果需要提交至本页，使用 location.href。");
    var emptyFn = Function.empty;
    new Ajax.JSONP({
        url: url,
        onSuccess: onsuccess || emptyFn,
        timeouts: timeouts,
        onTimeout: ontimeout || emptyFn,
        onComplete: oncomplete || emptyFn
    }).send(data);
};


// 
// send : function(data){
// 		
// assert(this.url, "地址必须不空");
// 		
// /**
// * 临时
// */
// var t,
// 			
// /**
// * 当前实例。
// * @type Ajax
// */
// me = this,
// 				
// /**
// * 数据。
// * @type mixed
// */
// data = data || this.data
// 				
// /**
// * 位置。
// * @type String
// */
// url = me.url,
// 				
// /**
// * 类型。
// * @type String
// */
// dataType = me.dataType,
// 	            
// /**
// * 触发一个事件。
// * @param {Object} name 事件。
// * @param {Object} e 事件参数。
// */
// dispatch = me.triggerListener ? function(name, e){
// return me.triggerListener(name, e);
// }: function(name, e){
// name = "on" + name;
// return !me[name] || me[name](e) !== false;
// },
// 
// /**
// * 请求。
// * @type String
// */
// type = me.type && me.type.toUpperCase() || "GET";
// 			
// /// #region 数据
// 			
// // 如果开始不是字符串。改成参数。
// if (typeof data !== 'string') 
// data = String.param(data);
// 			
// // 构建jsonp请求字符集串。jsonp是跨域请求，要加上callback=？后面将会进行加函数名
// if (dataType == 'jsonp') {
// me.jsonp = me.jsonp || "callback";
// if (!data.match(jsre) || (type == 'GET' && !url.match(jsre))) {
// data = String.concat(data, data.length ? '&' : '', me.jsonp, '=?');
// dataType = 'json';
// }
// }
// 			
// // 生成 JSON 函数
// if (dataType == 'json' && (data.length && data.match(jsre) || url.match(jsre))) {
// var jsonp = "jsonp" + (++JPlus.id), t = '=' + jsonp + '$1';
// 				
// // 替换所有  =？
// if (data.length) 
// data = data.replace(jsre, t);
// 				
// url = url.replace(jsre, t);
// 				
// dataType = 'js';
// 				
// // jsonp   回调函数
// window[jsonp] = function(tmp){
// data = tmp;
// if(dispatch("success"))
// dispatch("complete");
// 					
// // 回收资源
// window[jsonp] = undefined;
// 					
// try {
// delete window[jsonp];
// }  catch (e) {
// }
// if (head) 
// head.removeChild(script);
// };
// }
// 			
// if (me.cache === false && type == 'GET') {
// t = Date.now();
// var ret = url.replace(/(\?|&)_=.*?(&|$)/, '$1_=' + t + '$2');
// url = ret + ((ret == url) ? (url.contain('?') ? '&' : '?') + '_=' + t : '');
// }
// 			
// if (data.length && type == 'GET') {
// url += (url.contain('?') ? '&' : '?') + data;
// data = me.data = null;
// }
// 			
// 			
// // 获取绝对位置
// t = /^(\w+:)?\/\/([^\/?#]+)/.exec(url);
// 			
// // 当 GET 为跨站请求
// if (dataType == 'js' && type == 'GET' && t &&
// (t[1] && t[1] != location.protocol || t[2] != location.host)) {
// 			
// assert(me.async, "当前请求为跨站脚本请求，不支持同步");
// 				
// if(init() === false){
// return me;
// }
// 				
// var head = document.getElementsByTagName('head')[0];
// var script = document.createElement('script');
// script.src = url;
// if (me.charset != null) 
// script.charset = me.charset;
// script.type = "text/javascript";
// 				
// // 指定加载函数
// if (!jsonp) {
// var done = false;
// 					
// // 指定加载事件
// script.onload = script.onreadystatechange = function(){
// if (!done &&
// (!this.readyState ||
// this.readyState == 'loaded' ||
// this.readyState == 'complete')) {
// done = true;
// success();
// complete();
// 							
// // 避免内存泄露
// script.onload = script.onreadystatechange = null;
// head.removeChild(script);
// }
// };
// }
// 				
// head.appendChild(script);
// 				
// // 通过TAG完成加载
// return me;
// }
// 			
// /// #endregion
// 			
// var requestDone = false;
// 			
// var xhr = me.xhr || new XMLHttpRequest();
// 	
// try {
// 			
// if (me.username) 
// xhr.open(type, url, me.async, me.username, me.password);
// else 
// xhr.open(type, url, me.async);
// } catch (e) {
// 				
// //  出现错误地址时  ie 在此产生异常
// trace.error(e.message);
// me.status = "error";
// dispatch("error", xhr);
// dispatch("complete");
// return me;
// }
// 			
// try {
// if (me.ifModified) 
// xhr.setRequestHeader('If-Modified-Since', (me.ifModified === true ? XMLHttpRequest.lastModified[me.url] : me.ifModified) || 'Thu, 01 Jan 1970 00:00:00 GMT');
// 				
// if (!me.contentType) 
// me.contentType = "application/x-www-form-urlencoded";
// 				
// xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
// 				
// if (me.charset)
// xhr.setRequestHeader("Accept-Charset", me.charset);
// 				
// xhr.setRequestHeader('Content-Type', me.contentType);
// 				
// t = dataType && Ajax.accepts[dataType] ? (Ajax.accepts[dataType] + ', */*') : Ajax.accepts._default;
// 				
// xhr.setRequestHeader('Accept', t);
// } catch (e) {
// 			
// } 
// 			
// if (!dispatch("init")) {
// xhr.abort();
// return me;
// }
// 			
// var onreadystatechange = function(flag, isTimeout){
// 				
// if (xhr.readyState == 0) {		//没有任何状态
// clear();
// } else if (!requestDone && xhr && (xhr.readyState == 4 || isTimeout)) {
// requestDone = true;
// 					
// clear();
// 					
// me.status = isTimeout ? isTimeout : !XMLHttpRequest.isOk(xhr) ? (xhr.statusText || 'error') : me.ifModified && XMLHttpRequest.httpNotModified(xhr, me.url) ? 'notmodified' : 'success';
// 					
// if (me.status == 'success') {
// try {//初期确定字符串。如果进入if，说明成功
// var ct = xhr.getResponseHeader('content-type'), xml = type == 'xml' || !type && ct && ct.contain('xml'), data = xml ? xhr.responseXML : Ajax.decode(xhr.responseText, me.charset);
// 							
// assert(!xml || data.documentElement.tagName != 'parsererror', "处理XML产生错误,以下字符不是有效XML\me\n{0}", data);
// 							
// if (typeof data === 'string') {
// // 如果是  js  则执行
// if (dataType == "js") 
// JPlus.eval(data);
// 								
// // 如果是  json  则执行
// else if (dataType == 'json') 
// data = window.eval('(' + data + ')');
// }
// 							
// 							
// }catch (e) {
// trace.error("\"{0}\"   不是合法的 {1} 。转换错误", data, dataType);
// me.status = 'parsererror';
// }
// 						
// }
// 						
// //完成成功
// if (me.status == 'success') {
// var modRes;
// try {
// modRes = xhr.getResponseHeader('Last-Modified');
// }  catch (e) {
// }
// 						
// if (me.ifModified && modRes){
// if(!XMLHttpRequest.lastModified)XMLHttpRequest.lastModified = {};
// XMLHttpRequest.lastModified[me.url] = modRes;
// } 
// 						
// // JSONP自己处理回调函数
// if (!jsonp) 
// dispatch("success", {data : data, contentType : ct, xml : xml});
// }
// 					
// //判断是否超时
// if (isTimeout) {
// xhr.abort();
// if(isTimeout == "timeout")
// dispatch("ontimeout");
// }
// 					
// if (me.status != 'success')
// dispatch("error", xhr);
// 					
// dispatch("complete");
// 					
// if (me.saveState)
// me.xhr = xhr;
// 						
// if (me.async)
// xhr = null;
// }
// 				
// };
// 			
// //异步时，定义计时器跟踪状态
// if (me.async) {
// var ival = setInterval(onreadystatechange, 13),
// clear = function(){
// if (ival) {
// clearInterval(ival);
// ival = null;
// }
// };
// 				
// if (me.timeouts > 0) 
// setTimeout(function(){
// if (xhr && !requestDone) 
// onreadystatechange(0, "timeout");
// }, me.timeouts);
// }
// 			
// try {
// xhr.send(Ajax.encode(data, me.charset));
// } catch (e) {
// 				
// //  opera  将在此出现错误
// trace.error(e.message);
// onreadystatechange(0, "error");
// }
// 			
// if(me.saveState){	//加速下次初始化
// me.data = data;
// me.url = url;
// me.dataType = dataType;
// }
// 			
// // 不是同步时，火狐不会自动调用 onreadystatechange
// if (!me.async) 
// onreadystatechange();
// 			
// return me;
// 					
// },
// 		
// 
// 
// 
// /**
// * @class CC.util.JSONPConnector
// * 该类实现JSONP跨域请求，并实现XMLHttpRequest类常用方法，使得可以直接应用到{@link CC.Ajax}类中.<br>
// * 要发起JSONP请求，可利用{@link CC.Ajax}类，不必直接调用本类。
// * <br>JSONP原理:<br><pre>
// Jsonp原理：
// 首先在客户端注册一个callback, 然后把callback的名字传给服务器。
// 此时，服务器生成 json 数据,然后以 javascript 语法的方式，生成一个function , function 名字就是传递上来的参数 jsonp.
// 最后将 json 数据直接以入参的方式，放置到 function 中，这样就生成了一段 js 语法的文档，返回给客户端。
// 客户端浏览器，解析script标签，并执行返回的 javascript 文档，此时数据作为参数，传入到了客户端预先定义好的 callback 函数里.（动态执行回调函数）
// </pre>
// * @constructor
// * @param {Object} config
// */
// 
// /**
// * @cfg {Function} onreadystatechange 状态变更后回调
// */
// 
// CC.create('CC.util.JSONPConnector', null, {
//     
// initialize : function(cfg){
// this.cfg = cfg;
// },
//     
// /**
// * 中止请求
// */
// abort : function(){
// if(!this.cleaned)
// this._clean();
// },
//     
// setRequestHeader : fGo,
// getResponseHeader : fGo,
// 
// open : function(method, url){
// if(url)
// this.url = url;
// },
//     
// send : function(data){
// var cfg = this.cfg || {},
// url = this.url || cfg.url, 
// isQ = url.indexOf('?')>=0,
// win = cfg.win || window,
// fn  = 'jsonp_' + (+new Date() + CC.uniqueID()),
// doc = cfg.win ? CC.frameDoc(win) : document,
// script = doc.createElement('script'),
// jsonp = cfg.jsonp || 'jsonp',
// hd = doc.getElementsByTagName("head")[0],
// self = this;
//             
// url = url + ( isQ ? '&'+jsonp+'='+fn : '?'+jsonp+'='+fn);
//         
// data && ( url = url + ( typeof data === 'string' ? data : CC.queryString(data) ));
// 
// script.type = 'text/javascript';
// cfg.charset && (script.charset = cfg.charset);
// cfg.deffer  && (script.deffer  = cfg.deffer);
// script.src = url;
//         
// win[fn] = function(){
// self._clean();
// };
//         
// this._win = win;
// this._script = script;
// this._fn = fn;
//         
// this.cleaned = false;
//         
// // jsonp callback
// win[fn] = function(){
// if(!self.cleaned){
// self._clean();
// self._fireState(4, 200, arguments);
// }
// };
// 
// script.onreadystatechange = script.onload = function(e){
// var rs = this.readyState;
// if( !self.cleaned && (!rs || rs === 'loaded' || rs === 'complete') ){
// self._clean();
// self._fireState(4, -1);
// }
// };
//                 
// hd.appendChild(script);
// },
//     
// _clean : function(){
// if(!this.cleaned){
// try {
// this._win[this._fn] = null;
// try{ delete this._win[this._fn]; }catch(ex){}
// delete this._win;
// delete this._fn;
// this._script.onreadystatechange = null;
// this._script.parentNode.removeChild(this._script);
// delete this._script;
// delete this.cfg;
// }catch(e){}
// this.cleaned = true;
// }
// },
//     
// _fireState : function(rs, status, args){
// this.readyState = rs;
// if(status !== undefined)
// this.status = status;
// this.onreadystatechange.apply(this, args);
// }
// });
