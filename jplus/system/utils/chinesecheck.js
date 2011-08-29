//===========================================
//  适合中国环境的数据合法检验   chinesecheck.js  A
//===========================================


namespace(".Check.", {

	isQQ: function(value){
		
	},
	
	isChinese: function(value){
		  ( /[^\u4E00-\u9FA5]/g )
	},
	
	/**
	 * 验证是否合法的身份证。
	 * @param {Object} value
	 */
	isId: function(value){
		
	},
	
	isFullWidth: function(value){
		   /[^\uFF00-\uFFFF]$/g
	},
	
	isPhone: function(value){
		
	},
	
	isTelNumber: function(value){
		
	},
	
	/**
	 * 是否为邮政编码。
	 * @param {Object} value
	 */
	isPostCode: function(value){
		
	}



});
