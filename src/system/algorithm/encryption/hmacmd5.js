//===========================================
//  MD5 算法      A
//===========================================


using("System.Algorithm.Encryption.Md5");

/**
 * 计算一个字符串的 MD5值。
 * @param {String} s 字符串。
 * @return {String} md5 字符串。 
 */
(function(){
    
	var e = Encryption;
	
    /**
     * 计算一个字符串的 MD5值。
     * @param {String} s 字符串。
     * @return {String} md5 字符串。 
     */
    function hex_hmac_md5(key, data){
        return e.binl2hex(core_hmac_md5(key, data));
    }
    
	
    /**
     * 计算 HMAC-MD5 。
     */
    function core_hmac_md5(key, data){
		assert.notNull(key, "key");
		assert.notNull(data, "data");
        var bkey = e.str2binl(key);
        if (bkey.length > 16) 
            bkey = e.md5c(bkey, key.length * e.charSize);
        
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        
        var hash = e.md5c(ipad.concat(e.str2binl(data)), 512 + data.length * e.charSize);
        return e.md5c(opad.concat(hash), 512 + 128);
    }
    
	e.hmacMd5 = hex_hmac_md5;
	e.hmacMd5c = core_hmac_md5;
    
})();

