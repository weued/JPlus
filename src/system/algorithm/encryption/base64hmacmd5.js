//===========================================
//  MD5 算法       A
//===========================================


using("System.Algorithm.Encryption.Base64Md5");
using("System.Algorithm.Encryption.HmacMd5");

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
    function b64_hmac_md5(key, data){
		assert.notNull(key, "key");
		assert.notNull(data, "data");
        return e.binl2b64(e.md5c(key, data));
    }
    
    e.base64HmacMd5 = b64_hmac_md5;
    
})();

