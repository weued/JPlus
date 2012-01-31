//===========================================
//  查询   navigator.js     A
//===========================================

Object.extendIf(navigator, (function(ua) {

	var w = this,
	
		//检查信息
		engine = window.opera ? 'Presto' : w.ActiveXObject ? 'Trident' : document.getBoxObjectFor != null || w.mozInnerScreenX != null ? 'Gecko' : document.childNodes && !document.all && !navigator.taintEnabled ? 'Webkit' : 'Other',

		//平台
		platform = (ua.match(/(?:Webos|Android)/i) || [window.orientation ? 'Ipod' : navigator.platform])[0];
	
	navigator["is" + platform] = navigator["is" + engine] = true;
	
	//结果
	return {
		
		/**
		 * 是否是标准CSS模式。
		 * @type {Boolean}
		 */
		isStrict: document.compatMode == "CSS1Compat",

		/**
		 * 浏览器平台。
		 * @type String
		 */
		platform: platform,
		
		/**
		 * 浏览器引擎名。
		 * @type String
		 */
		engine: engine
		
		// /**
 // * APIProperty: {Boolean} isAir
 // * indicates if JxLib is running in an Adobe Air environment.  This is
 // * normally auto-detected but you can manually set it by declaring the Jx
 // * namespace before including jxlib:
 // * (code)
 // * Jx = {
 // *   isAir: true
 // * }
 // * (end)
 // */
// if (!$defined(Jx.isAir)) {
  // (function() {
    // /**
     // * Determine if we're running in Adobe AIR.
     // */
    // var aScripts = document.getElementsByTagName('SCRIPT'),
        // src = aScripts[0].src;
    // if (src.contains('app:')) {
   //     Jx.isAir = true;
 //   } else {
 //     Jx.isAir = false;
 //   }
 // })(); }
		
	}
})(navigator.userAgent));
