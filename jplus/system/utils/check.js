//===========================================
//  数据合法检验      A
//===========================================



namespace(".Check.", {
	
	/**
	 * 测试是否为数字
	 * @param {String} value
	 * @return {Boolean}
	 */
    isNumber: function(value) {
        
    },
    
	/**
	 * 测试字符串是否为邮箱格式.
	 * @param {String} value
	 * @return {Boolean}
	 */
    isMail : function(value) {
        return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value);
    },
	
	/**
	 * 判断一个值是否为 int32 表示范围内的值。
	 */
	isInt: function(){
		
	},
	
	/**
	 * 判断一个值是否为无符整数。
	 * @param {Object} value
	 */
	isInteger:function(value){
    	return /\d+/.test(val);
	},
	
	isDate: function (value){
   		var result=str.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
   		if(result==null) return false;
   		var d=new Date(result[1], result[3]-1, result[4]);
   		return (d.getFullYear()==result[1] && d.getMonth()+1==result[3] && d.getDate()==result[4]);
	},
	
	isLetterOrDight: function (str){
		var result=str.match(/^[a-zA-Z0-9]+$/);
		if(result==null) return false;
		return true;
	},
	
	isUrl: function(){
		
	},
	
	/**
	 * 检查一个密码的复杂度。 
	 * @param {Object} value
	 * @return {Number} 数字越大，复杂度越高。 这个数字在 0 - 5 变化。
	 */
	checkPasswordLevel: function(value){
		return value.replace(/^(?:(?=.{4})(?=.*([a-z])|.)(?=.*([A-Z])|.)(?=.*(\d)|.)(?=.*(\W)|.).*|.*)$/, "$1$2$3$4").length;
	},
	
	isNotEmpty: function(value){
		return value.length > 0;
	},
	
	/**
	 * 判断是否为合法用户名。合法的用户名必须是非数字开头的 字母、_、数字、中文。
	 * @param {Object} value
	 */
	isUserName: function(value){
		
	}
	
		
}); 
