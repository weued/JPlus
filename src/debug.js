


// ===========================================
//   调试        C
// ===========================================

///  #ifdef Debug
///  #region 调试


/**
 * @namespace String
 */
Object.extend(String, {
	
	/**
	 * 将字符串转为 utf-8 字符串。
	 * @param {String} s 字符串。
	 * @return {String} 返回的字符串。
	 */
	toUTF8:function (s) {
		return s.replace(/[^\x00-\xff]/g, function (a,b) {
			return '\\u' + ((b=a.charCodeAt()) < 16 ? '000' : b<256 ? '00' : b<4096 ? '0' : '') + b.toString(16);
		});
	},
    
	/**
	 * 将字符串从 utf-8 字符串转义。
	 * @param {String} s   字符串。
	 * @return {String} 返回的字符串。
	 */
	fromUTF8:function (s) {
		return s.replace(/\\u([0-9a-f]{3})([0-9a-f])/gi,function (a,b,c) {return String.fromCharCode((parseInt(b,16)*16+parseInt(c,16)))})
	}
		
});
 


/**
 * 调试输出。
 * @param {Object} obj 值。
 * @param {String} args 格式化的字符串。
 */
function trace(obj, args) {

	if (arguments.length == 0 || !JPlus.trace) return; // 关闭调试
	
	var useConsole = window.console && console.log;

	if (typeof obj == "string") {
		if(arguments.length > 1)
			obj = String.format.apply(trace.inspect, arguments);
		// 存在       console
		//   IE8  存在控制台，这是好事，但问题是IE8的控制台对对象输出全为 [object] 为了更好的调试，我们期待自定义的调试信息。
		//    为了支持类的输出，也不使用默认的函数输出
	} else if (!useConsole || navigator.isIE8) {
		obj = trace.inspect(obj, args);
	}


	if (useConsole) console.log(obj);
	else trace.write(obj);
}

/**
 * @namespace trace
 */
Object.extendIf(trace, {
	
	/**
	 * 输出方式。  {@param {String} message 信息。}
	 * @type Function
	 */
	write: function (message) {
		alert(message);
	},
	
	/**
	 * 输出类的信息。
	 * @param {Object} [obj] 要查看成员的对象。如果未提供这个对象，则显示全局的成员。
	 * @param {Boolean} showPredefinedMembers=true 是否显示内置的成员。
	 */
	api: (function () {
		
		var nodeTypes = 'Window Element Attr Text CDATASection Entity EntityReference ProcessingInstruction Comment HTMLDocument DocumentType DocumentFragment Document Node'.split(' '),
		
			definedClazz = 'String Date Array Number RegExp Function XMLHttpRequest Object'.split(' ').concat(nodeTypes),
	
			predefinedNonStatic = {
				'Object': 'valueOf hasOwnProperty toString',
				'String': 'length charAt charCodeAt concat indexOf lastIndexOf match quote slice split substr substring toLowerCase toUpperCase trim sub sup anchor big blink bold small fixed fontcolor italics link',
				'Array': 'length pop push reverse shift sort splice unshift concat join slice indexOf lastIndexOf filter forEach', /* ' every map some reduce reduceRight'  */
				'Number': 'toExponential toFixed toLocaleString toPrecision',
				'Function': 'length apply call',
				'Date': 'getDate getDay getFullYear getHours getMilliseconds getMinutes getMonth getSeconds getTime getTimezoneOffset getUTCDate getUTCDay getUTCFullYear getUTCHours getUTCMinutes getUTCMonth getUTCSeconds getYear setDate setFullYear setHours setMinutes setMonth setSeconds setTime setUTCDate setUTCFullYear setUTCHours setUTCMilliseconds setUTCMinutes setUTCMonth setUTCSeconds setYear toGMTString toLocaleString toUTCString',
				'RegExp': 'exec test'
			},
			
			predefinedStatic = {
				'Array': 'isArray',
				'Number': 'MAX_VALUE MIN_VALUE NaN NEGATIVE_INFINITY POSITIVE_INFINITY',
				'Date': 'now parse UTC'
			},
			
			APIInfo = Class({
				
				memberName: '',
				
				title: 'API 信息:',
				
				prefix: '',
				
				getPrefix: function (obj) {
					if(!obj) return "";
					for(var i = 0; i < definedClazz.length; i++) {
						if(window[definedClazz[i]] === obj) {
							return this.memberName = definedClazz[i];
						}
					}
					
					return this.getTypeName(obj, window, "", 3);
				},
				
				getTypeName: function (obj, base, baseName, deep) {
								
					for(var memberName in base) {
						if(base[memberName] === obj) {
							this.memberName = memberName;
							return baseName + memberName;
						}
					}
				           
					if(deep-- > 0) {
						for(var memberName in base) {
							try{
								if(base[memberName] && isUpper(memberName, 0)) {
									memberName = this.getTypeName(obj, base[memberName], baseName + memberName + ".", deep);
									if(memberName) 
										return memberName;
								}
							}catch(e) {}
						}
					}
					
					return '';
				},
				
				getBaseClassDescription: function (obj) {
					if(obj && obj.base) {
						var extObj = this.getTypeName(obj.base, window, "", 3);
						return " 类" + (extObj && extObj != "JPlus.Object"  ? "(继承于 " + extObj + " 类)" : "");
					}
					
					return " 类";
				},
				
				/**
				 * 获取类的继承关系。
				 */
				getExtInfo: function (clazz) {
					if(!this.baseClasses) {
						this.baseClassNames = [];
						this.baseClasses = [];
						while(clazz && clazz.prototype) {
							var name = this.getPrefix(clazz);
							if(name) {
								this.baseClasses.push(clazz);
								this.baseClassNames.push(name);	
							}
							
							clazz = clazz.base;
						}
					}
					
					
				},
				
				constructor: function (obj, showPredefinedMembers) {
					this.members = {};
					this.sortInfo = {};
				
					this.showPredefinedMembers = showPredefinedMembers !== false;
					this.isClass = obj === Function || (obj.prototype && obj.prototype.constructor !== Function);
					
					//  如果是普通的变量。获取其所在的原型的成员。
					if(!this.isClass && obj.constructor !== Object) {
						this.prefix = this.getPrefix(obj.constructor);
						
						if(!this.prefix) {
							var nodeType = obj.replaceChild ? obj.nodeType : obj.setInterval && obj.clearTimeout ? 0 : null;
							if(nodeType) {
								this.prefix = this.memberName = nodeTypes[nodeType];
								if(this.prefix) {
									this.baseClassNames = ['Node', 'Element', 'HTMLElement', 'Document'];
									this.baseClasses = [window.Node, window.Element, window.HTMLElement, window.HTMLDocument];
								}
							}
						}
						
						if(this.prefix) {
							this.title = this.prefix + this.getBaseClassDescription(obj.constructor) + "的实例成员: ";
							this.prefix += '.prototype.';
						}
						
						if([Number, String, Boolean].indexOf(obj.constructor) === -1) {
							var betterPrefix = this.getPrefix(obj);
							if(betterPrefix) {
								this.orignalPrefix = betterPrefix + ".";
							}
						}
							
					}
					
					if(!this.prefix) {
						
						this.prefix = this.getPrefix(obj);
						 
						// 如果是类或对象， 在这里遍历。
						if(this.prefix) {
							this.title = this.prefix + (this.isClass ? this.getBaseClassDescription(obj) : ' ' + getMemberType(obj, this.memberName)) + "的成员: ";
							this.prefix += '.';
						}
					
					}
				    
					// 如果是类，获取全部成员。
					if(this.isClass) {
						this.getExtInfo(obj);
						this.addStaticMembers(obj);
						this.addStaticMembers(obj.prototype, 1, true);
						delete this.members.prototype;
						if(this.showPredefinedMembers) {
							this.addPredefinedNonStaticMembers(obj, obj.prototype, true);
							this.addPredefinedMembers(obj, obj, predefinedStatic);
						}
						
					} else {
						this.getExtInfo(obj.constructor);
						// 否则，获取当前实例下的成员。
						this.addStaticMembers(obj);
						
						if(this.showPredefinedMembers && obj.constructor) {
							this.addPredefinedNonStaticMembers(obj.constructor, obj);
						}
					
					}
				},
				
				addStaticMembers: function (obj, nonStatic) {
					for(var memberName in obj) {
						try {
							this.addMember(obj, memberName, 1, nonStatic);
						} catch(e) {
						}
					}
					
				},
				
				addPredefinedMembers: function (clazz, obj, staticOrNonStatic, nonStatic) {
					for(var type in staticOrNonStatic) {
						if(clazz === window[type]) {
							staticOrNonStatic[type].forEach(function (memberName) {
								this.addMember(obj, memberName, 5, nonStatic);
							}, this);
						}
					}
				},
				
				addPredefinedNonStaticMembers: function (clazz, obj, nonStatic) {
					
					if(clazz !== Object) {
						
						predefinedNonStatic.Object.forEach(function (memberName) {
							if(clazz.prototype[memberName] !== Object.prototype[memberName]) {
								this.addMember(obj, memberName, 5, nonStatic);
							}
						}, this);
					
					}
						
					if(clazz === Object && !this.isClass) {
						return;	
					}
					
					this.addPredefinedMembers(clazz, obj, predefinedNonStatic, nonStatic);
					
					
					
				},
				
				addMember: function (base, memberName, type, nonStatic) {
					
					var hasOwnProperty = Object.prototype.hasOwnProperty,
						owner = hasOwnProperty.call(base, memberName),
						prefix,
						extInfo = '';
						
					nonStatic = nonStatic ? 'prototype.' : '';
					
					// 如果 base 不存在 memberName 的成员，则尝试在父类查找。
					if(owner) {
						prefix = this.orignalPrefix || (this.prefix + nonStatic);
						type--;  // 自己的成员置顶。
					} else {
						
						// 搜索包含当前成员的父类。
						this.baseClasses.each(function (baseClass, i) {
							if(baseClass.prototype[memberName] === base[memberName] && hasOwnProperty.call(baseClass.prototype, memberName)) {
								prefix = this.baseClassNames[i] + ".prototype.";
								
								if(nonStatic)
									extInfo = '(继承的)';
									
								return  false;
							}
						}, this);
						
						// 如果没找到正确的父类，使用当前类替代，并指明它是继承的成员。
						if(!prefix) {   
							prefix = this.prefix + nonStatic;
							extInfo = '(继承的)';
						}
						
						
						
					}
					
					this.sortInfo[this.members[memberName] = (type >= 4 ? '[内置]' : '') + prefix + getDescription(base, memberName) + extInfo] = type + memberName;
					
				},
				
				copyTo: function (value) {
					for(var member in this.members) {
						value.push(this.members[member]);
					}
					
					if(value.length) {
						var sortInfo = this.sortInfo;
						value.sort(function (a, b) {return sortInfo[a] < sortInfo[b] ? -1 : 1;});
						value.unshift(this.title);
					} else {
						value.push(this.title + '没有可用的 API 信息。');
					}
					
					
					
				}
				
				
			});
		
		
		initPredefined(predefinedNonStatic);
		initPredefined(predefinedStatic);
	
		function initPredefined(predefined) {
			for(var obj in predefined)
				predefined[obj] = predefined[obj].split(' ');
		}
	
		function isEmptyObject(obj) {
			
			// null 被认为是空对象。
			// 有成员的对象将进入 for(in) 并返回 false 。
			for(obj in (obj || {}))
				return false;
			return true;
		}
		
		// 90 是 'Z' 65 是 'A'
		function isUpper(str, index) {
			str = str.charCodeAt(index);
			return str <= 90 && str >= 65;
		}

		function getMemberType(obj, name) {
			
			// 构造函数最好识别。
			if(typeof obj === 'function' && name === 'constructor')
				return '构造函数';
			
			// IE6 的 DOM 成员不被认为是函数，这里忽略这个错误。
			// 有 prototype 的函数一定是类。
			// 没有 prototype 的函数肯能是类。
			// 这里根据命名如果名字首字母大写，则作为空类理解。
			// 这不是一个完全正确的判断方式，但它大部分时候正确。
			// 这个世界不要求很完美，能解决实际问题的就是好方法。
			if(obj.prototype && obj.prototype.constructor)
				return !isEmptyObject(obj.prototype) || isUpper(name, 0) ? '类': '函数';
			
			// 最后判断对象。
			if(Object.isObject(obj))
				return name.charAt(0) === 'I' && isUpper(name, 1) ? '接口' : '对象';
			
			// 空成员、值类型都作为属性。
			return '属性';
		}
		
		function getDescription(base, name) {
			return name + ' ' + getMemberType(base[name], name);
		}
	
		return function (obj, showPredefinedMembers) {
			var r = [];
			
			// 如果没有参数，显示全局对象。
			if(arguments.length === 0) {
				for(var i = 0; i < 7; i++) {
					r.push(getDescription(window, definedClazz[i]));	
				}
	
				for(var name in JPlus)
					if(window[name] && (isUpper(name, 0) || window[name] === JPlus[name]))
						r.push(getDescription(window, name));
				
				r.sort();
				r.unshift('全局对象: ');

			} else if(obj != null) {
				new APIInfo(obj, showPredefinedMembers).copyTo(r);
			} else {
				r.push('无法对 ' + (obj === null ? "null" : "undefined") + ' 分析');
			}
	
			trace(r.join('\r\n'));
	
		};
		
	})() ,
	
	/**
	 * 得到输出指定内容的函数。
	 * @return {Function}
	 */
	from: function (msg) {
		return function () {
			trace(msg, arguments);
			return msg;
		};
	},

	/**
	 * 遍历对象每个元素。
	 * @param {Object} obj 对象。
	 */
	dir: function (obj) {
		if (JPlus.trace) {
			if (window.console && console.dir) 
				console.dir(obj);
			else 
				if (obj) {
					var r = "{\r\n", i;
					for (i in obj) 
						r += "\t" + i + " = " + trace.inspect(obj[i], 1) + "\r\n";
					r += "}";
					trace(r);
				}
		}
	},
	
	/**
	 * 获取对象的字符串形式。
	 * @param {Object} obj 要输出的内容。
	 * @param {Number/undefined} deep=0 递归的层数。
	 * @return String 成员。
	 */
	inspect: function (obj, deep) {
		
		if( deep == null ) deep = 0;
		switch (typeof obj) {
			case "function":
				if(deep == 0 && obj.prototype && obj.prototype.xType) {
					// 类
					return String.format(
							"class {0} : {1} {2}",
							obj.prototype.xType,
							(obj.prototype.base && obj.prototype.base.xType || "Object"),
							trace.inspect(obj.prototype, deep + 1)
						);
				}
				
				//  函数
				return deep == 0 ? String.fromUTF8(obj.toString()) : "function ()";
				
			case "object":
				if (obj == null) return "null";
				if(deep >= 3)
					return obj.toString();

				if(Array.isArray(obj)) {
					return "[" + Object.update(obj, trace.inspect, []).join(", ") + "]";
					
				}else{
					if(obj.setInterval && obj.resizeTo)
						return "window";
					if (obj.nodeType) {
						if(obj.nodeType == 9)
							return 'document';
						if (obj.tagName) {
							var tagName = obj.tagName.toLowerCase(), r = tagName;
							if (obj.id) {
								r += "#" + obj.id;
								if (obj.className) 
									r += "." + obj.className;
							}
							else 
								if (obj.outerHTML) 
									r = obj.outerHTML;
								else {
									if (obj.className) 
										r += " class=\"." + obj.className + "\"";
									r = "<" + r + ">" + obj.innerHTML + "</" + tagName + ">  ";
								}
							
							return r;
						}
						
						return '[Node name=' + obj.nodeName + 'value=' + obj.nodeValue + ']';
					}
					var r = "{\r\n", i;
					for(i in obj)
						r += "\t" + i + " = " + trace.inspect(obj[i], deep + 1) + "\r\n";
					r += "}";
					return r;
				}
			case "string":
				return deep == 0 ? obj : '"' + obj + '"';
			case "undefined":
				return "undefined";
			default:
				return obj.toString();
		}
	},
	
	/**
	 * 输出信息。
	 * @param {Object} ... 内容。
	 */
	log: function () {
		if (JPlus.trace) {
			if (window.console && console.log && console.log.apply) {
				console.log.apply(console, arguments);
			} else {
				trace(Object.update(arguments, trace.inspect, []).join(" "));
			}
		}
	},

	/**
	 * 输出一个错误信息。
	 * @param {Object} msg 内容。
	 */
	error: function (msg) {
		if (JPlus.trace) {
			if (window.console && console.error) 
				console.error(msg); //   如果错误在此行产生，说明这是预知错误。
				
			else {
				throw msg;
			}
		}
	},
	
	/**
	 * 输出一个警告信息。
	 * @param {Object} msg 内容。
	 */
	warn: function (msg) {
		if (JPlus.trace) {
			if (window.console && console.warn) 
				console.warn(msg);
			else 
				trace.write("[警告]" + msg);
		}
	},

	/**
	 * 输出一个信息。
	 * @param {Object} msg 内容。
	 */
	info: function (msg) {
		if (JPlus.trace) {
			if (window.console && console.info) 
				console.info(msg);
			else 
				trace.write("[信息]" + msg);
		}
	},

	/**
	 * 如果是调试模式就运行。
	 * @param {Function} f 函数。
	 * @return String 返回运行的错误。如无错, 返回空字符。
	 */
	ifDebug: function (f) {
		if (!JPlus.debug) return;
		try {
			f();
			return "";
		} catch(e) {
			return e;
		}
	},
	
	/**
	 * 清除调试信息。  (没有控制台时，不起任何作用)
	 */
	clear: function () {
		if( window.console && console.clear)
			console.clear();
	},

	/**
	 * 空函数，用于证明函数已经执行过。
	 */
	count: function () {
		trace(JPlus.id++);
	},

	/**
	 * 如果false则输出。
	 * @param {Boolean} condition 字段。
	 * @return {String} msg  输出的内容。
	 */
	ifNot: function (condition, msg) {
		if (!condition) trace.warn(msg);
	},
	
	/**
	 * 输出一个函数执行指定次使用的时间。
	 * @param {Function} fn 函数。
	 * @param {Number} times=1000 运行次数。
	 */
	time: function (fn, times) {
		trace("[时间] " + trace.runTime(fn, times));
	},
	
	/**
	 * 测试某个函数运行一定次数的时间。
	 * @param {Function} fn 函数。
	 * @param {Number} times=1000 运行次数。
	 * @return {Number} 运行的时间 。
	 */
	runTime: function (fn, times) {
		times = times || 1000;
		var d = Date.now();
		while (times-- > 0)
			fn();
		return Date.now() - d;
	}

});

/**
 * 确认一个值正确。
 * @param {Object} bValue 值。
 * @param {String} msg="断言失败" 错误后的提示。
 * @return {Boolean} 返回 bValue 。
 * @example
 * <code>
 * assert(true, "{value} 错误。", value);
 * </code>
 */
function assert(bValue, msg) {
	if (!bValue && JPlus.debug) {
	
		 var val = arguments;

		// 如果启用 [参数] 功能
		if (val.length > 2) {
			var i = 2;
			msg = msg.replace(/\{([\w\.\(\)]*?)\}/g, function (s, x) {
				return val.length <= i ? s : x + " = " + String.ellipsis(trace.inspect(val[i++]), 200);
			});
		}else {
			msg = msg || "断言失败";
		}

		// 错误源
		val = arguments.callee.caller;
		
		if (JPlus.stackTrace !== false) {
		
			while (val.debugStepThrough) 
				val = val.caller;
			
			if (val) msg += "\r\n--------------------------------------------------------------------\r\n" + String.ellipsis(String.fromUTF8(val.toString()), 600);
			
		}

		if(JPlus.trace)
			trace.error(msg);
		else
			throw new Error(msg);

	}

	return !!bValue;
}

(function () {
	
	function  assertInternal(asserts, msg, value, dftMsg) {
		return assert(asserts, msg ?  msg.replace('~', dftMsg) : dftMsg, value);
	}
	
	function assertInternal2(fn, dftMsg, args) {
		return assertInternal(fn(args[0]), args[1], args[0], dftMsg);
	}
	
	/**
	 * @namespace assert
	 */
	Object.extend(assert, {
		
		/**
		 * 确认一个值为函数变量。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 * @example
		 * <code>
		 * assert.isFunction(a, "a ~");
		 * </code>
		 */
		isFunction: function () {
			return assertInternal2(Function.isFunction, "必须是函数", arguments);
		},
		
		/**
		 * 确认一个值为数组。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isArray: function () {
			return assertInternal2(Array.isArray, "必须是数组", arguments);
		},
		
		/**
		 * 确认一个值为函数变量。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isObject: function (value, msg) {
			return assertInternal(Object.isObject(value) || Function.isFunction(value) || value.nodeType, msg, value,  "必须是引用的对象", arguments);
		},
		
		/**
		 * 确认一个值为数字。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isNumber: function (value, msg) {
			return assertInternal(typeof value == 'number' || value instanceof Number, msg, value, "必须是数字");
		},
		
		/**
		 * 确认一个值为节点。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isNode: function (value, msg) {
			return assertInternal(value && value.nodeType, msg, value, "必须是 DOM 节点");
		},
		
		/**
		 * 确认一个值为节点。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isElement: function (value, msg) {
			return assertInternal(value && value.style, msg, value, "必须是 Element 对象");
		},
		
		/**
		 * 确认一个值是字符串。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isString: function (value, msg) {
			return assertInternal(typeof value == 'string' || value instanceof String, msg, value, "必须是字符串");
		},
		
		/**
		 * 确认一个值是日期。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isDate: function (value, msg) {
			return assertInternal(Object.type(value) == 'date' || value instanceof Date, msg, value, "必须是日期");
		},
		
		/**
		 * 确认一个值是正则表达式。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isRegExp: function (value, msg) {
			return assertInternal(Object.type(value) == 'regexp' || value instanceof RegExp, msg, value, "必须是正则表达式");
		},
	
		/**
		 * 确认一个值非空。
		 * @param {Object} value 值。
		 * @param {String} argsName 变量的名字字符串。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		notNull: function (value, msg) {
			return assertInternal(value != null, msg, value, "不可为空");
		},
	
		/**
		 * 确认一个值在 min ， max 间。
		 * @param {Number} value 判断的值。
		 * @param {Number} min 最小值。
		 * @param {Number} max 最大值。
		 * @param {String} argsName 变量的米各庄。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		between: function (value, min, max, msg) {
			return assertInternal(value >= min && !(value >= max), msg, value, "超出索引, 它必须在 [" + min + ", " + (max === undefined ? "+∞" : max) + ") 间");
		},
	
		/**
		 * 确认一个值属于一个类型。
		 * @param {Object} v 值。
		 * @param {String/Array} types 类型/表示类型的参数数组。
		 * @param {String} message 错误的提示信息。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		instanceOf: function (v, types, msg) {
			if (!Array.isArray(types)) types = [types];
			var ty = typeof v,
				iy = Object.type(v);
			return assertInternal(types.filter(function (type) {
				return type == ty || type == iy;
			}).length, msg, v, "类型错误。");
		},
	
		/**
		 * 确认一个值非空。
		 * @param {Object} value 值。
		 * @param {String} argsName 变量的参数名。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		notEmpty: function (value, msg) {
			return assertInternal(value && value.length, msg, value, "为空");
		}

	});
	
	assertInternal.debugStepThrough = assertInternal2.debugStepThrough = true;
	
	
	for(var fn in assert) { 
		assert[fn].debugStepThrough = true;
	}

	
})();

/// #endregion
/// #endif

//===========================================================


