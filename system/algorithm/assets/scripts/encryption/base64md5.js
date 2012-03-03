//===========================================
//  MD5 算法           A
//===========================================

using("System.Algorithm.Encryption.Md5");

/**
 * 计算一个字符串的 MD5值。
 * @param {String} s 字符串。
 * @return {String} md5 字符串。 
 */
(function(){
	
	var base64pad = "";
	
	/**
	 * @param {String} base64pad 对齐 base-64 字符。
	 */
    
	var e = Encryption,
	
		tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	
    /**
     * 计算一个字符串的 MD5值。
     * @param {String} s 字符串。
     * @return {String} md5 字符串。 
     */
    function b64_md5(s){
        return binl2b64(e.md5c(e.str2binl(s), s.length * Encryption.charSize));
    }
    
    /**
     * 转换数组到 base-64 的字符串。
     */
    function binl2b64(binarray){
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) |
            (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) |
            ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) 
                    str += base64pad;
                else 
                    str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
            }
        }
        return str;
    }
    
    e.base64Md5 = b64_md5;
	e.binl2b64 = binl2b64;
    
})();

