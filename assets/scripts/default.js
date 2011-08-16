


(function(){
	
	var root = getRoot(),
		moduleName = location.href.replace(root, '') + '/',
		currentCases,
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
			
			window.onload = function(){
				var main = document.getElementById('main'), last, next = document.getElementById('wrap').nextSibling;
				
				while(main.firstChild)
					main.removeChild(main.firstChild);
					
				for(; next; next = last){
					last = next.nextSibling;
					main.appendChild(next);
				}
				
				document.body.style.visibility = '';
				
			};
			
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
				
				result.push('<h2>' + group + '</h2>');
				
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
							default:
								clazz = ' class="disabled"';
								total++;
								break;
						}
						
						result.push('<li><a href="../' + group.toLowerCase() + '/' + value.toLowerCase() +'.html"' + clazz + '>' + value + '</a></li>');
					});
					
					
					result[currenHeader] = '<h2>' + group + ' <span class="small">(' + finished + '/' + total + ')</span></h2>';
					
				} else {
					
					result.push('<ul class="menu break-line">');
					
					for(var menu in menus[group]) {
						result.push('<li><a href="' + root + menus[group][menu] +'">' + menu + '</a></li>');
					}
				}
				
				result.push('</ul>');
				
			}
			
			sidebar.innerHTML = result.join('\r\n');
			
		},

		initTestCases: function (testcases) {
			document.write('<div class="right small"><a href="javascript:;" onclick="doRunAll();">全部测试</a> | <a href="javascript:;" onclick="doTestAll();">恶意测试</a></div>');
			
			document.write('<div id="testcases">');
			
			currentCases = {};
			
			for(var name in testcases){
				var testcase = testcases[name];
				
				if(typeof testcase === 'string') {
					if(testcase === '-'){
						document.write('<h2 class="testcasegroup">' + name + '</h2>');
						continue ;
					}
					
					testcase = {overrides: testcase};
				}
				
				currentCases[name] = new TestCase(testcase, name);
				document.write(currentCases[name].toHTML());
			}
			
			document.write('</div>');
		},
		
		doRun: function (name, showSuccess){

			var info = currentCases[name];
			
			if(info) {
				
				info = new Function(info.toRun())();
				
				document.getElementById('testcase-' + name).className = assert.hasError ? 'testcase error' : showSuccess ? 'testcase success' : 'testcase';
				
				return  info;
			
			}
		},

		doTime: function (name){
			var info = currentCases[name];
			
			if(info) {
				return new Function(info.toTime())();
			
			}
			
		},

		doTest: function (name){
			var info = currentCases[name];
			
			if(info) {
				return new Function(info.toTest())();
			
			}
		},
		
		doRunAll: function(){
			for(var name in currentCases) {
				this.doRun(name, true);
			}
		},
		
		doTestAll: function(){
			for(var name in currentCases) {
				this.doTest(name);
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
			assert.hasError = false;
		},
		
		clearLog: function(){
			assert._log = '';
		},
		
		logged: function(value){
			return assert(areEqual(value1, value2), "断言失败。应该输出 ", value, ", 现在返回", assert._log);
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
			this.method = t[0] + '.' + this.method;
			if(t[1]) {
				this.prefix = 'var ' +  t[0] + ' = ' + t[1] + ';\r\n';
			}
			
			overrides.splice(0, 1);
		}
		
		this.overrides = {};
		
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
			    '<a href="javascript://',
			    this.method, '(', p || '', ')',
			    this.overrides[p] ? ' => ' + this.overrides[p] : '',
			    '" onclick="doRun(\'', 
			    this.id,
			    '\')">', this.name || this.id,
			    '</a>',
			    this.summary ? '&nbsp;&nbsp;&nbsp;&nbsp;' + this.summary : '',
			    '<span><a href="javascript://',
			    this.method,
			    '" onclick="doRun(\'',
			    this.id,
			    '\');">测试</a> | <a href="javascript://测试速度" onclick="doTime(\'',
			    this.id,
			    '\');">执行   ',
			    this.time || 1000,
			    ' 次</a> | <a href="javascript://使用多个不同类型的参数进行测试" onclick="doTest(\'',
			    this.id,
			    '\');">恶意测试</a></span></div>'
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
				r.push(this.method);
				r.push('(');
				r.push(override.replace(/\"/g, "\\\""));
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

			forEach(params, function(param) {
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
				r.push('console.error("');
				r.push(this.method);
				r.push('(');
				r.push(param.replace(/\"/g, "\\\""));
				r.push(') 抛出了异常 ", e.message, " @", e.lineNumber);\r\n');
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
	
	function assert(bValue, msg){
		if(!bValue) {
			assert.hasError = true;
			console.error.apply(console, [].slice.call(arguments, 1));
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
	
	function areEqual(value1, value2) {
		if(value1 == value2) 
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