//===========================================
//  解码器   encoder.js         A
//===========================================



namespace(".Encoder.", {
	
	toUTF8: function (value) {
var a = [], i = 0;
        
        for (; i < str.length ;) a[i] = ("00" + str.charCodeAt(i ++).toString(16)).slice(-4);
        
        return "\\u" + a.join("\\u");

	},
	
	fromUTF8 : function(str){
		return unescape(str.replace(/\\/g, "%"));

	}


});