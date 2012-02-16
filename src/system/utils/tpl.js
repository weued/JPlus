//===========================================
//  模板引擎
//   A: xuld
//===========================================


/**
 * @class Tpl
 * @example Tpl.parse("{if a}OK{end}", {a:1}); //=> OK
 * 模板解析字符串语法:
 * 模板字符串由静态数据和解析单元组成。
 * 普通的内容叫静态的数据，解析前后，静态数据不变。
 * 解析单元由 { 开始， } 结束。解析单元可以是:
 * 1. Javascript 变量名: 这些变量名来自 Tpl.parse 的第2个参数， 比如第二个参数是 {a:[1]} ，那 {a[0]}将返回 1 。
 * 2. if/for/end/else/eval 语句，这5个是内置支持的语法。
 * 2.1 if: {if a} 或  {if(a)} 用来判断一个变量，支持全部Javascript表达式，如 {if a==1} 。语句 {if} 必须使用 {end} 关闭。
 * 2.2 else 等价于 Javascript 的 else， else后可同时有 if语句，比如: {else if a}
 * 2.3 for: {for a in data} for用来遍历对象或数组。  语句 {for} 必须使用 {end} 关闭。
 * 2.4 eval: eval 后可以跟任何 Javascript 代码。 比如 {eval nativeFn(1)}
 * 2.5 其它数据，将被处理为静态数据。
 * 3 如果需要在模板内输出 { 或 }，使用 {\{} 和 {\}} 。
 * 4 特殊变量，模板解析过程中将生成4个特殊变量，这些变量将可以方便操作模板
 * 4.1 $output 模板最后将编译成函数，这个函数返回最后的内容， $output表示这个函数的组成代码。
 * 4.2 $data 表示  Tpl.parse 的第2个参数。
 * 4.3 $index 在 for 循环中，表示当前循环的次号。
 * 4.4 $value 在 for 循环中，表示当前被循环的目标。
 */
var Tpl = {
	
	cache: {},
	
	encodeJs: function(input){
		return input.replace(/[\r\n]/g, '\\n').replace(/"/g, '\\"');
	},
	
	_blockStatck: [],
	
	processCommand: function(command){
		var c = command.match(/^(if|for|end|else|eval|var|\$|\W+)(\b[\s\S]*)?$/);
		if(c) {
			command = c[2];
			switch(c[1]) {
				case "end":
					return this._blockStatck.pop() === "for" ? "});" : "}";
				case 'if':
					this._blockStatck.push('if');
					assert(command, "Tpl.processCommand(command): 无法处理命令{if " + command + " } (if 命名的格式为 {if condition}");
					return "if(" + command + ") {";
				case 'eval':
					return command;
				case 'else':
					return /^\s*if ([\s\S]*)$/.exec(command) ? '} else if(' + RegExp.$1 + ') {' : '} else {';
				case 'for':
					this._blockStatck.push('for');
					command = command.split(/\s*in\s*/);
					assert(command.length === 2 && command[0] && command[1], "Tpl.processCommand(command): 无法处理命令{for " + c[2] + " } (for 命名的格式为 {for var_name in obj}");
					return 'Object.each(' + command[1] + ', function(' + command[0] + ', $index, $value){';
				case 'var':
					return 'var ' + c[0] + ';';
				case '$':
					return '$tpl+="' + c[0] + '";';
				default:
					return '$tpl+="' + this.encodeJs(c[0]) + '";';
			}
		}
			
		return command ? 'try{$tpl += ' + command + ' || "";}catch(e){}' : '';
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
			output += '$tpl+="' + this.encodeJs(tpl.substring(blockEnd + 1, blockStart)) + '";';
			
			// 从  blockStart 处搜索 }
			blockEnd = blockStart;
			
			// 找到第一个前面不是 \ 的  } 字符。
			do {
				blockEnd = tpl.indexOf('}', blockEnd + 1);
			} while(tpl.charAt(blockEnd - 1) === '\\');
			
			output += this.processCommand(tpl.substring(blockStart + 1, blockStart = blockEnd).trim());
		}
		
		output += '$tpl+="' + this.encodeJs(tpl.substring(blockEnd + 1, tpl.length)) + '";}return $tpl';

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
	
};