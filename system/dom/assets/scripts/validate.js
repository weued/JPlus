//===========================================
//  为表单元素增加 validate 事件   validate.js     A
//===========================================



using("System.Dom.Element");

var Validator = Class({
	
	target: null,
	
	getText: function(){
		return this.target.getText().trim();
	},
	
	createValidator: function(validateType, value, errorMsg){
		switch(validateType){
			case 'required':
				return value ? function(validator){
					return validator.getText() ? '' : (errorMsg || Validator.messages.required);
				} : null;
			case 'maxLength':
				return value >= 0 ? function(validator){
					var len = validator.getText().length;
					return len <= value ? '' : String.format(errorMsg || Validator.messages.maxLength, value, len);
				} : null;
			case 'minLength':
				return value >= 0 ? function(validator){
					var len = validator.getText().length;
					return len >= value ? '' : String.format(errorMsg || Validator.messages.minLength, value, len);
				} : null;
			case 'pattern':
				return value ? function(validator){
					return value.test(validator.getText()) ? '' : (errorMsg || Validator.messages.pattern);
				} : null;
			case 'dataType':
				switch(value) {
					case 'email':
						return this.createValidator('pattern', /^([a-zA-Z0-9]|[._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/, errorMsg || Validator.messages.email);
					case 'id': 
						return this.createValidator('pattern', /^\d{15}$|^\d{17}(?:\d|x|X)$/, errorMsg || Validator.messages.id);
					case 'pinyin':
						return this.createValidator('pattern', /^[a-zA-Z]+$/, errorMsg || Validator.messages.pinyin);
					case 'letter':
						return this.createValidator('pattern', /^\w*$/, errorMsg || Validator.messages.letter);
					case 'number':
						return this.createValidator('pattern', /^[+-\.\d]*$/, errorMsg || Validator.messages.number);
					case 'integer':
						return this.createValidator('pattern', /^\d*$/, errorMsg || Validator.messages.integer);
				/* 	case 'password':
						return function(validator){
							var val = validator.target.getText();
							var trim = val.replace(/[a-zA-Z0-9]/g, '');
							if(!val) {
								return validator.messages.required;
							}
							if(val.length < 6 || val.length > 20) {
								return validator.messages.required;
							}
						errorMsg
						};
						var other = target.dom.form && $$(dom.form).findAll('[type=password]');
						if(other.length != 2) {
							return ;
						}
						
						if(flag) {
							flag = validatePassword(other.value, me, other);
							if(flag !== '此为必填项' && flag != '两次密码输入不同')
								other.validated(flag);
						}
							
						var s = value.replace(/[a-zA-Z0-9]/g, '');
						if (value.length == 0) {
							return '此为必填项';
						} else if (value.length < 6 || value.length > 20) {
							return '密码长度必须为6-20个字符';
						} else if (s) {
							return '密码不得包含"'+s+'"等字符';
						} else if(other.value){
							return other.value == me.value ? '' : '两次密码输入不同';
						} else {
							return '';
						}
		
		
						other = other[0] == dom ? other[1] : other[0];
						dom.validators.push(function(){
							return validatePassword(this.value, other, this, 1);
						});
						
						return; */
					case 'phone':
						return this.createValidator('pattern',/((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, errorMsg || Validator.messages.phone);
					case 'mobile':
						return this.createValidator('pattern',/^\d{11}$/, errorMsg || Validator.messages.phone);
					case 'url':
						return this.createValidator('pattern',/^http:\/\//i, errorMsg || Validator.messages.url);
				}
		}
	},
	
	set: function(validateType, value, errorMsg){
		if(Object.isObject(validateType)){
			for(value in validateType){
				this.set(value, validateType[value]);
			}
		} else {
		
			// 删除存在的同名验证函数。
			this.validators.remove(this.validators[validateType]);
			
			// 生成新的验证函数。
			value = this.createValidator(validateType, value, errorMsg);
			
			if(value)
				this.validators.push(this.validators[validateType] = value);
		}
		
		
		return this;
	},
	
	constructor: function(target){
		this.target = Dom.get(target);
		this.validators = [];
	},
	
	/**
	 * 立即执行验证操作。
	 */
	validate: function(){
	
		// 允许禁用验证。
		if(this.disabled !== true) {
				
			for(var i = 0, result, async; i < this.validators.length; i++){
				result = this.validators[i].call(this, this);
				if(result && result !== true){
					this.validated(result);
					return false;
					
				// 如果验证函数直接返回了 null 表示正在异步验证。此时验证组件不显示结果。
				} else if(result === null){
					async = true;
				}
			}
			
			if(async) {
				this.onAsync();
				return null;
			} else
				this.validated('');
		
		}
		
		return true;
	},
	
	/**
	 * 通知验证组件验证操作已完成，并显示相应的错误提示。
	 */
	validated: function(result){
		if(typeof result === 'boolean')
			result = result ? '' : '验证失败';
		
		if(!result)
			this.onSuccess(result);
		else
			this.onError(result);
			
		this.onComplete(result);
		
		return this.isValidated = !result;
	},
	
	/**
	 * 刷新验证状态。
	 */
	reset: function(updateUI){
		return this.trigger('reset', updateUI);
	},
	
	onAsync: function(){
		return this.trigger('async');
	},
	
	onSuccess: function(result){
		return this.trigger('success', result);
	},
	
	onError: function(result){
		return this.trigger('error', result);
	},
	
	onComplete: function(result){
		return this.trigger('complete', result);
	}
	
});

Validator.messages = {
	
	required: '此项为必填项',
	
	maxLength: '最多只能有 {0} 个字符',
	
	minLength: '至少需要 {0} 个字符',
	
	pinyin: '拼音应该为字母，不能含空格',
	
	pattern: '格式不正确',
	
	email: '请填写有效的邮箱地址。',
	
	id: '请填写正确的身份证',
	
	letter: '只能填写字母和数字',
	
	number: '只能填写数字',
	
	integer: '只能填写整数',
	
	date: '请填写正确的日期',
	
	url: '请填写正确的地址。地址以 http:// 开头',
	
	password: '两次密码输入不同',
	
	phone: '请填写正确的号码'


};



