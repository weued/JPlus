/**
 * @fileOverview J+ 测试系统核心引擎。
 */


(function(){
	
	var root = getRoot(),
		moduleName = location.href.replace(root, '') + '/',
		current = {},
		params = [
		     '', '0', 'null', 'NaN', '""', '"<div />"', '[]', '{a:1}', 'false', 'document.body', 'function(){return false}',
		     '0, 0', 'null, null', '[], []', '{}, {}',
		     '1, "1", true, {}'
		];

	moduleName = moduleName.substr(0, moduleName.indexOf('/'));
	document.write('<link type="text/css" rel="stylesheet" href="' + root + 'assets/styles/default.css" />');
	document.write('<script type="text/javascript" src="' + root + 'assets/project/project.js"></script>');
	document.write('<script type="text/javascript" src="' + root + 'assets/libs/firebug-lite/build/firebug-lite.js"></script>');
	
	apply(window, {
		
		initPage: function (navs) {
			var result = [];
			for(var nav in navs){
				result.push('<a href="' + root + navs[nav] +'">' + nav + '</a>');
			}
			
			result[result.length - 1] = result[result.length - 1].replace('<a href="', '<a class="last" href="');
			navs =  result.join('\r\n');
			
			
			document.write('\
				<div id="wrap" style="visibility: visible">\
					<div id="toolbar"></div>\
					<div id="header">\
						<h1>J+</h1>\
						<em>让 Javascript 成为一门艺术</em>\
						<div id="navbar">' + 
						navs +	
						'</div>\
					</div>\
					<div id="body">\
						<div id="main">\
						正在载入...\
						</div>\
					</div>\
					<div id="footer">\
						Copyright &copy; 2011 JPlus Team\
					</div>\
				</div>');
			
			try{
				document.body.style.visibility = 'hidden';
			}catch(e){
				location.reload();
			}
			
			addEvent(window, 'load', function(){
				var main = document.getElementById('main'), last, next = document.getElementById('wrap').nextSibling;
				
				while(main.firstChild)
					main.removeChild(main.firstChild);
					
				for(; next; next = last){
					last = next.nextSibling;
					main.appendChild(next);
				}
				
				document.body.style.visibility = '';
				
			});
			
			if(window[moduleName]){
				
				this.initMenu(window[moduleName]);
			}
			
			
		},
		
		initMenu: function (menus){
			var sidebar = document.getElementById('sidebar');
			if(!sidebar){
				sidebar = document.getElementById('body').appendChild(document.createElement('div'));
				sidebar.id = 'sidebar';
			}
			var result = [];
			
			for(var group in menus) {
				
				result.push('<h2>' + encodeHTML(group) + '</h2>');
				
				if(typeof menus[group] === 'string') {
					var currenHeader = result.length - 1, total = 0, finished = 0;
					result.push('<ul class="menu">');
					forEach(menus[group].split(' '), function(value){
						var clazz;
						switch(value.charAt(0)) {
							case '+':
								clazz = '';
								value = value.substring(1);
								total++;
								finished++;
								break;
							case '-':
								clazz = ' class="removed"';
								value = value.substring(1);
								break;
							case '#':
								clazz = ' class="strong"';
								value = value.substring(1);
								total++;
								finished++;
								break;
							case '|':
								value = value.substring(1) || "|";
								result.push('<li>' + value + '</li>');
								return;
							default:
								clazz = ' class="disabled"';
								total++;
								break;
						}
						
						result.push('<li><a href="' + root + moduleName  + '/' + group.toLowerCase() + '/' + value.toLowerCase() +'.html"' + clazz + '>' + encodeHTML(value) + '</a></li>');
					});
					
					
					result[currenHeader] = '<h2>' + encodeHTML(group) + ' <span class="small">(' + finished + '/' + total + ')</span></h2>';
					
				} else {
					
					result.push('<ul class="menu break-line">');
					
					for(var menu in menus[group]) {
						var url = menus[group][menu] ? root + menus[group][menu] : 'javascript:;';
						result.push('<li><a href="' + url +'">' + encodeHTML(menu) + '</a></li>');
					}
				}
				
				result.push('</ul>');
				
			}
			
			sidebar.innerHTML = result.join('\r\n');
			
		},

		initTestCases: function (testcases) {
			document.write('<div class="right small"><a href="javascript:;" onclick="doRunAll();">全部测试</a> | <a href="javascript:;" onclick="doTimeAll();">全部时间</a> | <a href="javascript:;" onclick="doTestAll();">恶意测试</a></div>');
			
			document.write('<div id="testcases" class="clear">');
			
			current.testCases = {};
			
			for(var name in testcases){
				var testcase = testcases[name];
				
				if(typeof testcase === 'string') {
					if(testcase === '-'){
						document.write('<h2 class="testcasegroup">' + encodeHTML(name) + '</h2>');
						continue ;
					}
					
					testcase = {overrides: testcase};
				}
				
				current.testCases[name] = new TestCase(testcase, name);
				document.write(current.testCases[name].toHTML());
			}
			
			document.write('</div>');
		},
		
		doRun: function (name, showSuccess){

			var info = current.testCases[name];
			
			if(info) {
				
				info = runFn(new Function(info.toRun()));
				
				document.getElementById('testcase-' + name).className = assert.hasError === true ? 'testcase error' : !showSuccess ? 'testcase' : assert.hasError === false ? 'testcase success' : 'testcase warn';
				
				return  info;
			
			}
		},

		doTime: function (name){
			var info = current.testCases[name];
			
			if(info) {
				return runFn(new Function(info.toTime()));
			
			}
			
		},

		doTest: function (name){
			var info = current.testCases[name];
			
			if(info) {
				return runFn(new Function(info.toTest()));
			
			}
		},
		
		doRunAll: function(){
			for(var name in current.testCases) {
				this.doRun(name, true);
			}
		},
		
		doTimeAll: function(){
			for(var name in current.testCases) {
				this.doTime(name);
			}
		},
		
		doTestAll: function(){
			for(var name in current.testCases) {
				this.doTest(name);
			}
		},
		
		doLog: function(value){
			console.log(typeof value === 'string' ? "'" + value.replace(/'/g, "\\\'") + "'" : value);
		},

		initQuestions: function (questions,  result) {
			
			var i = 1;
			current.result = result;
			current.answers = [''];
			for(var question in questions) {
				var answers = questions[question];
				document.write('<div class="testcase" id="qd');
				document.write(i);
				document.write('">\r\n');
				document.write('<div class="questions">\r\n');
				document.write(i);
				document.write('. ');
				document.write(encodeHTML(question));
				document.write('\r\n</div>\r\n');
				document.write('<div class="note">\r\n');
				
				for(var j = 0; j < answers.length; j++) {
					if(answers[j].charAt(0) === '@') {
						current.answers[i] = j;
						answers[j] = answers[j].substr(1);
					}
					
					document.write('<input type="radio" name="q');
					document.write(i);
					document.write('" id="q');
					document.write(i);
					document.write(j);
					document.write('"><label for="q');
					document.write(i);
					document.write(j);
					document.write('">');
					document.write(encodeHTML(answers[j]));
					document.write('</label><br>\r\n');
				}
				document.write('\r\n</div>\r\n');
				document.write('\r\n</div>\r\n');
				
				i++;
				
				
			}
			
			document.write('<input type="button" onclick="checkAnswers()" value="验证">');
			document.write('<div id="info"></div>');
			
		},
		
		checkAnswers: function (){
			var errorCount  = 0, total = current.answers.length;
			for(var i = 1; i < total; i++){
				if(current.answers[i] === undefined) 
					continue;
				if(!document.getElementById('q' + i + current.answers[i]).checked){
					errorCount++;
					document.getElementById('qd' + i).className = 'error';
				} else {
					document.getElementById('qd' + i).className = 'testcase';
				}
			}
			
			var r = (total - errorCount) * 100 / total;
			for(var key in current.result){
				if(parseFloat(key) <= r){
					document.getElementById('info').innerHTML = '答对 ' + (total - errorCount) + '/' + total + ' &nbsp;' +  current.result[key];
					document.getElementById('info').className = 'success';
					return;
				}
			}
			
			document.getElementById('info').innerHTML = '要认真哦';
			document.getElementById('info').className = 'error';
					
		},
		
		initUserMenu: function(todo,  done){
			initMenu({
				'现在完成': todo,
				'已完成': done
			});
		},
		
		initUser: function(){
			
			var currentUser = location.href.match(/\/([^\/]*).htm/)[1];
			
			document.write('<script src="' + root + 'assets/project/' + currentUser +'.js" type="text/javascript"></' + 'script>');
			
		},
		
		createTestCases: function (obj){
			var r = [], value = eval(obj), tabs = "\t\t\t\t";
			for(var i in value){
				if(value.hasOwnProperty(i) && typeof value[i] == 'function' && value[i].toString().indexOf('[native code]') == -1){
					r.push(format(i));
				}
			}
			
			for(var i in value.prototype){
				if(value.prototype.hasOwnProperty(i) && typeof value.prototype[i] == 'function' && value.prototype[i].toString().indexOf('[native code]') == -1){
					r.push(format("prototype." + i));
				}
			}
			
			r = tabs + r.join(",\n" + tabs);
			
			alert(r);
			
			return r;
			
			function format(name){
				var d = obj+ "." + name;
				return "'" + d +"': ''";
			}
		},
		
		createFunction: function (v) {
		   return function(){
		   		return v;
		   }
		}
	
	});
			
	apply(window.assert = window.assert || assert, {

		/**
		 * 确认 2 个值是一致的。
		 */
		areEqual: function(value1, value2){
			return assert(areEqual(value1, value2), "断言失败。应该返回 ", value2, ", 现在返回", value1);
		},
		
		notEqual: function(value1, value2){
			return assert(!areEqual(value1, value2), "断言失败。不应该返回 ", value2);
		},
		
		isTrue: function(value, msg){
			return assert(value, "断言失败。 ", msg || "");
		},
		
		isFalse: function(value, msg){
			return assert(!value, "断言失败。", msg || "");
		},
		
		inRangeOf: function(value, left, right){
			return assert(value >= left && value < right, "断言失败。应该在值", left, "和", right, "之间，现在返回", value);
		},
		
		log: function(value){
			return assert._log += value;
		},
		
		reset: function(){
			assert.hasError = null;
		},
		
		clearLog: function(){
			assert._log = '';
		},
		
		logged: function(value){
			return assert(areEqual(value, assert._log), "断言失败。应该输出 ", value, ", 现在是", assert._log);
		}
	
	});
	
	// '@me = this; 1 => 2; 2, a => 3'
	
	function TestCase(info, name) {
		this.prefix = ''; 
		this.method = name;
		
		apply(this, info);
		
		this.id = name;
		
		var overrides = (info.overrides || "").split(';');
		if(/^\s*@/.test(overrides[0])){
			var t = name.indexOf('.prototype.');
			
			if(t !== -1) {
				this.method = name.substr(t + '.prototype'.length);
			}
			
			t = overrides[0].substr(1).split(/\s*=\s*/);
			if(t[1]) {
				this.prefix = 'var ' +  t[0] + ' = ' + t[1] + ';\r\n';
				this.methodName = t[1] + this.method;
			}
			
			this.method = t[0] + this.method;
			
			
			overrides.splice(0, 1);
		}
		
		if(this.doCall === false) {
			this.method = 'createFunction(' + this.method + ')';
		}
		
		if(!this.methodName){
			this.methodName =   this.method;
		}
		
		this.overrides = {};
		
		if(!overrides.length) overrides.push('');
		
		forEach(overrides, function(value){
			value = value.split('=>');
			
			if(value[1] && !/assert/.test(value[1])) {
				value[1] = 'assert.areEqual(value, ' + value[1] + ');';
			}
			
			this.overrides[value[0]] = value[1];
			
		}, this);
	}

	TestCase.prototype = {
			
		toHTML: function(){
			for(var p in this.overrides) {
				break;
			}
			
			return [
			    '<div id="testcase-',
			    this.id,
			    '" class="testcase" onmouseover="this.className += \' active\'" onmouseout="this.className = this.className.replace(\' active\', \'\');">',
			     '<span><a href="javascript://',
			    encodeHTML(this.method),
			    '" onclick="doRun(\'',
			    this.id,
			    '\');">测试</a> | <a href="javascript://测试速度" onclick="doTime(\'',
			    this.id,
			    '\');">执行   ',
			    this.time || 1000,
			    ' 次</a> | <a href="javascript://使用多个不同类型的参数进行测试" onclick="doTest(\'',
			    this.id,
			    '\');">恶意测试</a></span>',
			    '<a href="javascript://',
			    encodeHTML(this.method), '(', encodeHTML(p || ''), ')',
			    encodeHTML(this.overrides[p] ? ' => ' + this.overrides[p] : ''),
			    '" onclick="doRun(\'', 
			    this.id,
			    '\')">', encodeHTML(this.name || this.id),
			    '</a>',
			    this.summary ? '&nbsp;&nbsp;&nbsp;&nbsp;' + encodeHTML(this.summary) : '',
			    '</div>'
			].join('');
			
		},
		
		toRun: function(){
			var r = [];
			
			
			if(this.init) {
				r.push(this.init);
				r.push('\r\n');
			}

			r.push('assert.reset();\r\n');
			r.push('var value;\r\n');
			for(var override in this.overrides) {
				r.push(this.prefix);
				r.push('assert.clearLog();\r\n');
				r.push('console.log("');
				r.push(this.methodName.replace(/\\/g, '\\\\').replace(/"/g, '\\\"'));
				r.push('(');
				r.push(override.replace(/\\/g, '\\\\').replace(/"/g, "\\\""));
				r.push(') => ", ');
				r.push('value = ');
				r.push(this.method);
				r.push('(');
				r.push(override);
				r.push(')');
				r.push(');\r\n');
				
				if(this.overrides[override]) {
					
					r.push(this.overrides[override]);
					r.push('\r\n');
					
				}
				
			}
				
			if(this.uninit) {
				r.push(this.uninit);
				r.push('\r\n');
			}
			
			r.push('return value;');
			
			
			return r.join('');  
			
		},
		
		toTime: function(){
			var r = [null];
			
			
			if(this.init) {
				r.push(this.init);
				r.push('\r\n');
			}
			
			var time = this.time || 1000, c = 0;
			r.push(this.prefix);
			r.push('console.time("');
			r.push(this.name || this.id);
			r.push('");\r\n');
			r.push('while(i-- > 0) {\r\n');

			for(var override in this.overrides) {
				c++;
				r.push(this.method);
				r.push('(');
				r.push(override);
				r.push(');\r\n');
				
			}
			
			r.push('}\r\n');
			r.push('console.timeEnd("');
			r.push(this.name || this.id);
			r.push('");\r\n');
			
			r[0] = 'var i = ' + ((time / c) || 0) + ';\r\n';
				
			if(this.uninit) {
				r.push(this.uninit);
				r.push('\r\n');
			}
			
			return r.join('');
		},
		
		toTest: function(){
			var r = [];
			
			if(this.init) {
				r.push(this.init);
				r.push('\r\n');
			}

			forEach('params' in this ? this.params : params, function(param) {
				r.push(this.prefix);
				r.push('try {\r\n');
				r.push('console.log("');
				r.push(this.method);
				r.push('(');
				r.push(param.replace(/\"/g, "\\\""));
				r.push(') => ", ');
				r.push(this.method);
				r.push('(');
				r.push(param);
				r.push(')');
				r.push(');\r\n');
				r.push('} catch(e) {\r\n');
				r.push('assert.hasError = true;\r\n');
				r.push('console.error("');
				r.push(this.method);
				r.push('(');
				r.push(param.replace(/\"/g, "\\\""));
				r.push(') 抛出了异常 ", e.message);\r\n');
				r.push('}\r\n');
				
				
			}, this);
				
			if(this.uninit) {
				r.push(this.uninit);
				r.push('\r\n');
			}
			
			
			return r.join('');  
		}
			
			
	};
	
	
	function getRoot() { 
		var b = document.getElementsByTagName("script");
		b = b[b.length - 1];
		return (!-[1, ] && typeof Element !== 'function' && String(window.Element).indexOf("object Element") === -1 ? b.getAttribute('src', 5) : b.src).replace(/assets\/scripts\/.*$/, '');
	}
		
	function getElementsByClassName(parentNode, className) {
		var r = [], i;
		for(i = parentNode.firstChild; i; i = i.nextSibling) {
			if(i.className === className){
				r.push(i);
			}
		}
		
		return r;
	}
	
	function addEvent(obj, event, fn){
		if(obj.addEventListener)
			obj.addEventListener(event, fn, false);
		else{
			obj.attachEvent('on' + event, fn);
		}
		
	}
	
	function encodeHTML(value){
		return  value
			.replace(/&/g,"&amp;")
			.replace(/</g,"&lt;")
			.replace(/>/g,"&gt;")
         	.replace(/ /g,"&nbsp;")
        	.replace(/\'/g,"&#39;")
         	.replace(/\"/g,"&quot;"); 
		
	}
	
	function assert(bValue, msg){
		if(!bValue) {
			assert.hasError = true;
			console.error.apply(console, [].slice.call(arguments, 1));
		} else {
		   assert.hasError  = false;	
		}
	}
	
	function apply(dest, src) {
		for(var i in src){
			dest[i] = src[i];
		}
		
	}
	
	function forEach(array, fn, bind){
		for(var i = 0; i < array.length; i++){
			fn.call(bind, array[i], i, array);
		}
	}
	
	function runFn(fn){
		try{
			return    fn();
		}catch(e){
			assert.hasError    = true;
			console.error(e.message);
			console.info(fn.toString());
		}
		
	}
	
	function areEqual(value1, value2) {
		if(value1 === value2) 
			return true;
		
		if(value1 && typeof value1 === 'object' && value2 && typeof value2 === 'object') {
			
			if(value1.length === value2.length && typeof value1.length === 'number') {
				for(var i = value1.length; i--; ) {
					if(!areEqual(value1[i], value2[i]))
						return false;
				}
				
				return true;
			}
			
			for(var i in value1) {
				if(!areEqual(value1[i], value2[i]))
					return false;
			}
			
			for(var i in value2) {
				if(!areEqual(value2[i], value1[i]))
					return false;
			}
			
			return true;
			
		}
		
		return  false;
	}
})();