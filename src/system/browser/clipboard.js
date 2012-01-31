//===========================================
//  剪切板辅助   clipboard.js     A
//===========================================

/**
 * 复制文本到系统剪贴板。
 * @param {String} content 内容。
 * @return {Boolean} 是否成功。
 */
namespace(".ClipBoard.", {
	setText: (function(){
	    if (window.clipboardData) {
			return function(content){
				window.clipboardData.clearData();
				window.clipboardData.setData("Text", content);
				return true;
			};
		} else if (navigator.isOpera) {
			return function(content){
				window.location = content;
				return true;
			}
		} else if (window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			} catch (e) {
				return function(){
					trace.error ("您使用的FireFox浏览器安全设置过高,以至于影响程序的正常响应！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");	
					return false;
				};
			}
			
			
			return function(content){
				var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
				if (!clip) return false;
				var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
				if (!trans) return false;
				trans.addDataFlavor('text/unicode');
				var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				str.data = content;
				trans.setTransferData("text/unicode", str, content.length * 2);
				var clipid = Components.interfaces.nsIClipboard;
				if (!clipid) return false;
				clip.setData(trans, null, clipid.kGlobalClipboard);
				return true;
			}
		}
	
	})(),
	
	getText: function () {

	}

});