//===========================================
//  模板引擎
//   A: xuld
//===========================================


/*
 * 
 * 
 * 
 * 
 * 
 * <div>{if a==2}{else}{end}</div>
 * 
 * 
 * 
 * 
 */


/**
 * @class Tpl
 */
namespace(".Tpl.", {
	
	cache: {},
	
	encodeJs: function(input){
		return input.replace(/[\r\n]/g, '\\n').replace(/"/g, '\\"');
	},
	
	_blockStatck: [],
	
	processCommand: function(command){
		var c = command.match(/^(if|for|end|else|eval|\W+)(\b[\s\S]*)?$/);
		if(c) {
			command = c[2];
			switch(c[1]) {
				case "end":
					return this._blockStatck.pop() === "for" ? "});" : "}";
				case 'if':
					this._blockStatck.push('if');
					assert(command, "Tpl.processCommand(command): 无法处理命令{if " + command + " } (for 命名的格式为 {for condition}");
					return "if(" + command + ") {";
				case 'eval':
					return command;
				case 'else':
					return /^\s*if ([\s\S]*)$/.exec(command) ? '} else if(' + RegExp.$1 + ') {' : '} else {';
				case 'for':
					this._blockStatck.push('for');
					command = command.split(/\s*in\s*/);
					assert(command.length === 2 && command[0] && command[1], "Tpl.processCommand(command): 无法处理命令{for " + c[2] + " } (for 命名的格式为 {for var_name in obj}");
					return 'Object.each(' + command[1] + ', function(' + command[0] + ', $index, $value) {';
				default:
					return '$tpl += "' + this.encodeJs(c[0]) + '";';
			}
		}
			
		return command ? '$tpl += ' + command + ';' : '';
	},
	
	/**
	 * 把一个模板编译为函数。
	 * @param {String} tpl 表示模板的字符串。
	 * @return {Function} 返回的函数。
	 */
	compile: function(tpl){
		
		var output = 'var $tpl="";with($data){',
			
			// 块的开始位置。
			blockStart = -1,
			
			// 块的结束位置。
			blockEnd;
		
		while((blockStart = tpl.indexOf('{', blockStart + 1)) >= 0) {
			output += '$tpl += "' + this.encodeJs(tpl.substring(blockEnd + 1, blockStart)) + '";';
			
			// 从  blockStart 处搜索 }
			blockEnd = blockStart;
			
			// 找到第一个前面不是 \ 的  } 字符。
			do {
				blockEnd = tpl.indexOf('}', blockEnd + 1);
			} while(tpl.charAt(blockEnd - 1) === '\\');
			
			output += this.processCommand(tpl.substring(blockStart + 1, blockStart = blockEnd).trim());
		}
		
		output += "}return $tpl";

		return new Function("$data", output);
	},
	
	/**
	 * 使用指定的数据解析模板，并返回生成的内容。
	 * @param {String} tpl 表示模板的字符串。
	 * @param {Object} data 数据。
	 * @return {String} 处理后的字符串。 
	 */
	parse: function(tpl, data) {
		return (Tpl.cache[tpl] || (Tpl.cache[tpl] = Tpl.compile(tpl)))(data);
	}
	
});