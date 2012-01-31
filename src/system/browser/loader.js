//===========================================
//  文件载入   loader.js  A
//===========================================

/**
 * 允许动态载入一个模块。
 */
namespace("Loader", {
	
	javascript: function(source, properties){
		if (!properties) properties = {};

		var script = new Element('script', {src: source, type: 'text/javascript'}),
			doc = properties.document || document,
			load = properties.onload || properties.onLoad;

		delete properties.onload;
		delete properties.onLoad;
		delete properties.document;

		if (load){
			if (typeof script.onreadystatechange != 'undefined'){
				script.addEvent('readystatechange', function(){
					if (['loaded', 'complete'].contains(this.readyState)) load.call(this);
				});
			} else {
				script.addEvent('load', load);
			}
		}

		return script.set(properties).inject(doc.head);
	},

	css: function(source, properties){
		if (!properties) properties = {};

		var link = new Element('link', {
			rel: 'stylesheet',
			media: 'screen',
			type: 'text/css',
			href: source
		});

		var load = properties.onload || properties.onLoad,
			doc = properties.document || document;

		delete properties.onload;
		delete properties.onLoad;
		delete properties.document;

		if (load) link.addEvent('load', load);
		return link.set(properties).inject(doc.head);
	},

	image: function(source, properties){
		if (!properties) properties = {};

		var image = new Image(),
			element = document.id(image) || new Element('img');

		['load', 'abort', 'error'].each(function(name){
			var type = 'on' + name,
				cap = 'on' + name.capitalize(),
				event = properties[type] || properties[cap] || function(){};

			delete properties[cap];
			delete properties[type];

			image[type] = function(){
				if (!image) return;
				if (!element.parentNode){
					element.width = image.width;
					element.height = image.height;
				}
				image = image.onload = image.onabort = image.onerror = null;
				event.delay(1, element, element);
				element.fireEvent(name, element, 1);
			};
		});

		image.src = element.src = source;
		if (image && image.complete) image.onload.delay(1);
		return element.set(properties);
	},

	images: function(sources, options){
		sources = Array.from(sources);

		var fn = function(){},
			counter = 0;

		options = Object.merge({
			onComplete: fn,
			onProgress: fn,
			onError: fn,
			properties: {}
		}, options);

		return new Elements(sources.map(function(source, index){
			return Asset.image(source, Object.append(options.properties, {
				onload: function(){
					counter++;
					options.onProgress.call(this, counter, index, source);
					if (counter == sources.length) options.onComplete();
				},
				onerror: function(){
					counter++;
					options.onError.call(this, counter, index, source);
					if (counter == sources.length) options.onComplete();
				}
			}));
		}));
	}
	
});





// 
		// loadResource : function(attr, callback, autoremove, doc) {
					// // javascript , img..
					// var src = CC.delAttr(attr, 'src');
					// // css style sheet
					// var href = CC.delAttr(attr, 'href');
					// // tag
					// var res = this.$C(attr, doc);
					// if(callback || autoremove){
  					// if(res.readyState) {
  						// //IE
  						// res.onreadystatechange = function() {
  							// if (res.readyState == "loaded" ||
  							// res.readyState == "complete") {
  								// res.onreadystatechange = null;
  								// if(autoremove)
  								  // setTimeout(function(){res.parentNode.removeChild(res)},1)
  								// if(callback)
  								// callback.call(res);
  							// }
  						// };
  					// }else{
  						// //Others
  						// res.onload = function() {
  							// if(autoremove)
  							  // setTimeout(function(){res.parentNode.removeChild(res)},1)
  							// if(callback)
  							  // callback.call(res);
  						// };
  					// }
				  // }
// 					
					// if(src)
					 // res.src = src;
// 					
					// if(href)
					 // res.href = href;
// 					
					// this.$T('head')[0].appendChild(res);
// 					
					// return res;
				// },
/**
 * 加载JavaScript脚本文件
 * @param {String} url
 * @param {Function} callback
 * @param {String} [id]
 */
        // loadScript: function(url, callback, id) {
          // var nd = this.loadResource({
                // tagName: 'script',
                // src: url,
                // type: 'text/javascript'
          // }, callback, true);
//           
          // if(id) 
          	// nd.id = id;
          // return nd;
        // }
        // ,
/**
 * 加载一个CSS样式文件
 * @param {String} url 加载css的路径
 * @param {Function} callback 
 * @param {String} [id] style node id
 * @return {DOMElement} link node
 */
        // loadCSS: function(url, callback, id) {
          // var nd = this.loadResource({
                // tagName: 'link',
                // rel: 'stylesheet',
                // href: url,
                // type: 'text/css'
          // }, callback);
          // if(id) 
          	// nd.id = id;
          // return nd;
        // }
        // ,
/**
 * 应用一段CSS样式文本.
 * <pre><code>
   CC.loadStyle('.g-custom {background-color:#DDD;}');
   //在元素中应用新增样式类
   &lt;div class=&quot;g-custom&quot;&gt;动态加载样式&lt;/div&gt;
   </code></pre>
 * @param {String} id 生成的样式style结点ID\
 * @param {String} 样式文本内容
 */
        // loadStyle: function(ss, doc) {
          // var styleEl = this._styleEl;
          // if(!styleEl){
            // styleEl = this._styleEl = this.$C( {
              // tagName: 'style',
              // type: 'text/css'
            // });
            // this.$T('head')[0].appendChild(styleEl);
          // }
          // styleEl.styleSheet && (styleEl.styleSheet.cssText += ss) || styleEl.appendChild((doc||document).createTextNode(ss));
          // return styleEl;    }
   





       
   
        