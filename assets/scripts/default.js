/**
 * @fileOverview J+ 测试系统核心引擎
 */

(function(){
			
	var root = getRoot(),
		moduleName = location.href.replace(root, '') + '/',
		current = {},
		defaultTimes = getMinTimesFor1ms (),
		params = [
		     '', '0', 'null', 'NaN', '""', '"<div />"', '[]', '{a:1}', 'false', 'document.body', 'function(){return false}',
		     '0, 0', 'null, null', '[], []', '{}, {}',
		     '1, "1", true, {}'
		];
		
	moduleName = moduleName.substring(0, moduleName.indexOf('/'));
	
	document.write('<link type="text/css" rel="stylesheet" href="' + root + 'assets/styles/default.css" />');
	//document.write('<link type="text/css" rel="stylesheet" href="' + root + 'assets/libs/google-code-prettify/prettify.css" />');
	if(!window.console || !window.console.groupEnd)
		document.write('<script type="text/javascript" src="' + root + 'assets/libs/firebug-lite/build/firebug-lite.js"></script>');
	
	document.write('<script type="text/javascript" src="' + root + 'assets/libs/google-code-prettify/prettify.js"></script>');
	
	
	
	if(moduleName.indexOf('.') == -1)
		document.write('<script type="text/javascript" src="' + root + moduleName + '/project.js"></script>');
	document.write('<script type="text/javascript" src="' + root + 'assets/scripts/project.js"></script>');
	
	document.createElement('section');
	
	window.System = window.System || {};
	
	apply(System, {
		
		title: 'J+ Library',
		
		subtitle: '让 Javascript 成为一门艺术',
		
		copyright: 'Copyright &copy; 2011-2012 JPlus Team',
		
		/**
		 * 初始化整个页面。
		 */
		initPage: function (navs) {
			var result = [];
			for(var nav in navs){
				result.push('<a href="' + root + navs[nav] +'">' + nav + '</a>');
			}
			
			result[result.length - 1] = result[result.length - 1].replace('<a href="', '<a class="system-last" href="');
			navs =  result.join('\r\n');
			
			document.write('\
				<div id="system-main" style="visibility: visible">\
					<div id="system-header" class="system">\
						<h1>' + System.title + '</h1>\
						<em>' + System.subtitle + '</em>\
						<div id="system-navbar">' + 
						navs +	
						'</div>\
					</div>\
					<div id="system-body">\
						<div id="system-container">\
						正在载入...\
						</div>\
					</div>\
					<div id="system-footer" class="system">' + 
						System.copyright + 
					'</div>\
				</div>');
			
			try{
				document.body.style.visibility = 'hidden';
			}catch(e){
				
				// 修正 Chrome 在没刷新时，  无法获取 body
				location.reload();
			}
			
			addEvent(window, 'load', function(){
				var main = document.getElementById('system-container'), last, next = document.getElementById('system-main').nextSibling;
				
				while(main.firstChild)
					main.removeChild(main.firstChild);
					
				for(; next; next = last){
					last = next.nextSibling;
					main.appendChild(next);
				}
				
				document.body.style.visibility = '';
				
				var sections  = document.body.getElementsByTagName('section');
				
				var tmp;
				
				for(var i = 0; sections[i]; i++){
					if(sections[i].className.indexOf('system-control') >= 0) {
						tmp = sections[i];
						var code = document.createElement('pre');
						code.className = "system-code prettyprint linenums lang-html";
						code.innerText = code.textContent = System.formatHTML(tmp.innerHTML || '');
						code.ondblclick = function(){
							System.copyText(code.innerText || code.textContent);
							return false;
						};
						if(tmp.className.indexOf('system-block') >= 0){
							tmp.appendChild(code);
						} else {
							tmp.insertBefore(code, tmp.firstChild);
						}
					}
				}
				
				sections  = document.body.getElementsByTagName('script');
				
				for(var i = 0; sections[i]; i++){
					if(sections[i].className.indexOf('system-control') >= 0) {
						tmp = sections[i];
						var code = document.createElement('pre');
						code.className = "system-code prettyprint linenums lang-js";
						code.innerText = code.textContent = System.formatJS(tmp.innerHTML || '');
						code.ondblclick = function(){
							System.copyText(code.innerText || code.textContent);
							return false;
						};
						tmp.parentNode.insertBefore(code, tmp.nextSibling);
					}
				}
				
				if(tmp){
					
					var label = document.createElement('label');
					label.className = 'system-togglecode';
					label.innerHTML = '<input type="checkbox" style="vertical-align: middle;" onclick="System.toggleSources(!this.checked)">隐藏源码';
					main.insertBefore(label,  main.firstChild);
				    window.prettyPrint && prettyPrint();
				    
				    if(System.getData('toggleSources') === '0') {
				    	label.firstChild.checked = true;
				    	System.toggleSources(false);
				    }
				}
			});

			
			if(window.menus) {
				System.initMenu(window.menus);
			}
			
		},
		
		/**
		 * 初始化右边的菜单。
		 */
		initMenu: function (menus){
			var sidebar = document.getElementById('system-sidebar');
			if(!sidebar){
				sidebar = document.getElementById('system-body').appendChild(document.createElement('div'));
				sidebar.id = 'system-sidebar';
				sidebar.className = 'system';
			}
			var result = [];
			
			var allTotal = 0, allFinished = 0, allSkipped = 0;
			
			for(var group in menus) {
				
				result.push('<h2>' + encodeHTML(group) + '</h2>');
				
				if(typeof menus[group] === 'string') {
					var currenHeader = result.length - 1, total = 0, finished = 0;
					result.push('<ul class="system-menu">');
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
								clazz = ' class="system-removed"';
								value = value.substring(1);
								allSkipped++;
								break;
							case '#':
								clazz = ' class="system-strong"';
								value = value.substring(1);
								total++;
								finished++;
								break;
							case '*':
								clazz = ' class="system-notcomplete"';
								value = value.substring(1);
								total++;
								break;
							default:
								clazz = ' class="system-disabled"';
								total++;
								break;
						}
						
						var mp = value.indexOf('#');
						var at = value.indexOf('@');
						
						if(mp < 0){
							var summary = value.substr(at + 1);
							if(at > 0)
								value = value.substr(0, at);
							result.push('<li><a href="' + root + moduleName  + '/' + group.toLowerCase() + '/' + value.toLowerCase() +'.html"' + clazz + ' title="' + summary +'">' + encodeHTML(value) + '</a></li>');	
							return;
						}
						
						if(mp == value.length - 1){
							value = value.substr(0, mp);
							var summary = value.substr(at + 1);
							if(at > 0)
								value = value.substr(0, at);
							result.push('<li><a target="_blank" href="' + root + moduleName  + '/' + group.toLowerCase() + '/' + value.toLowerCase() +'.html"' + clazz + ' title="' + summary +'">' + encodeHTML(value) + '</a></li>');	
							return;
						}
						
						var target = value.substring(mp + 1);
						value = value.substr(0, mp);
						var summary = value.substr(at + 1);
						if(at > 0)
							value = value.substr(0, at);
						result.push('<li><a target="_blank" href="' +  target +'"' + clazz + ' title="' + summary +'">' + encodeHTML(value) + '</a></li>');

						
					});
					
					
					allTotal += total;
					allFinished += finished;
					
					result[currenHeader] = '<h2>' + encodeHTML(group) + ' <span class="system-small">(' + finished + '/' + total + ')</span></h2>';
					
				} else {
					
					result.push('<ul class="system-menu break-line">');
					
					for(var menu in menus[group]) {
						var url = menus[group][menu] ? root + menus[group][menu] : 'javascript:;';
						result.push('<li><a href="' + url +'">' + encodeHTML(menu) + '</a></li>');
					}
				}
				
				result.push('</ul>');
				
			}
			
			if(allTotal)
				result.push('<div class="system-clear system-right">' + allFinished + '/' + allTotal + '+<del>' + allSkipped + '</del></div>')
			
			sidebar.innerHTML = result.join('\r\n');
			
		},
		
		/**
		 * 初始化测试用例。
		 */
		initTestCases: function (testcases, dftOptions) {
			document.write('<div class="system system-right system-small"><a href="javascript:;" onclick="System.doRunAll();">全部测试</a> | <a href="javascript:;" onclick="System.doTimeAll();">全部时间</a> | <a href="javascript:;" onclick="System.doTestAll();">全部自测</a></div>');
			
			document.write('<div id="system-testcases" class="system system-clear">');
			
			current.testCases = {};
			
			for(var name in testcases){
				var testcase = testcases[name], type = typeof testcase;
				
				if(type === 'string' || type === 'function') {
					if(testcase === '-'){
						document.write('<h2 class="system-testcasegroup">' + encodeHTML(name) + '</h2>');
						continue ;
					}
					
					testcase = {tests: testcase};
				}
				
				if(dftOptions)
					apply(testcase, dftOptions);
				
				current.testCases[name] = new TestCase(testcase, name);
				document.write(current.testCases[name].toHTML());
			}
			
			document.write('</div>');
		},
		
		initTreeView: function (list){
			document.write('<ul>');
			for(var item in list) {
				document.write('<li>');
				if(typeof list[item] === 'string'){
					document.write('<a href="' + list[item] + '" target="_blank">');
					item = item.split(/\s*-\s*/);
					if(item[0].charAt(0) === '#') {
						document.write('<b>');
						document.write(item[0].substring(1));
						document.write('</b>');
					} else {
						document.write(item[0]);
					}
					
					document.write('</a>');
					if(item[1]) {
						document.write('<span> - <i>');
						document.write(item[1]);
						document.write('</i></span>');
					}
				} else {
					document.write(item);
					System.initTreeView(list[item]);
				}
				document.write('</li>');
			}
			document.write('</ul>');
		},
		
		doRun: function (name, showSuccess){

			var info = current.testCases[name];
			
			if(info) {
				
				info = runFn(new Function(info.toRun()));
				
				document.getElementById('system-testcase-' + name).className = assert.hasError === true ? 'system-testcase system-error' : showSuccess === false ? 'system-testcase' : assert.hasError === false ? 'system-testcase system-success' : 'system-testcase system-warn';
				
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
		
		viewSource: function(name){
			var info = current.testCases[name];
			
			if(info) {
				name = eval(info.member).toString();
				if(String.decodeUTF8)
					name = String.decodeUTF8(name);
				return console.info(name);
			
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
			console.log(typeof value === 'string' ? "'" + encodeJs(value) + "'" : value);
		},

		initQuestions: function (questions,  result) {
			
			var i = 1;
			current.result = result;
			current.answers = [''];
			for(var question in questions) {
				var answers = questions[question];
				document.write('<div class="system system-testcase" id="system-qd');
				document.write(i);
				document.write('">\r\n');
				document.write('<div class="system-questions">\r\n');
				document.write(i);
				document.write('. ');
				document.write(encodeHTML(question));
				document.write('\r\n</div>\r\n');
				document.write('<div class="system-note">\r\n');
				
				for(var j = 0; j < answers.length; j++) {
					if(answers[j].charAt(0) === '@') {
						current.answers[i] = j;
						answers[j] = answers[j].substr(1);
					}
					
					document.write('<input type="radio" name="q');
					document.write(i);
					document.write('" id="system-q');
					document.write(i);
					document.write(j);
					document.write('"><label for="system-q');
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
			
			document.write('<input type="button" onclick="System.checkAnswers()" value="验证">');
			document.write('<div id="system-info"></div>');
			
		},
		
		checkAnswers: function (){
			var errorCount  = 0, total = current.answers.length - 1;
			for(var i = 1; i <= total; i++){
				if(current.answers[i] === undefined) 
					continue;
				if(!document.getElementById('system-q' + i + current.answers[i]).checked){
					errorCount++;
					document.getElementById('system-qd' + i).className = 'system system-error';
				} else {
					document.getElementById('system-qd' + i).className = 'system system-testcase';
				}
			}
			
			var r = (total - errorCount) * 100 / total;
			for(var key in current.result){
				if(parseFloat(key) <= r){
					document.getElementById('system-info').innerHTML = '答对 ' + (total - errorCount) + '/' + total + ' &nbsp;' +  current.result[key];
					document.getElementById('system-info').className = 'system system-success';
					return;
				}
			}
			
			document.getElementById('system-info').innerHTML = '要认真哦';
			document.getElementById('system-info').className = 'system system-error';
					
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
			
			return r;
			
			function format(name){
				var d = obj+ "." + name;
				return "'" + d +"': ''";
			}
		},
		
		toggleSources: function (value) {
			var pres = document.getElementsByTagName('pre');
			System.setData('toggleSources', value ? 1 : 0);
			value = value ? '' : 'none';
			for(var i = 0; pres[i]; i++){
				if(pres[i].className.indexOf('system-code') >= 0){
					pres[i].style.display = value;
				}	
			}
		},
			
		/**
		 * 获取 Cookies 。
		 * @param {String} name 名字。
		 * @param {String} 值。
		 */
		getCookie: function(name){
			
			assert.isString(name, "Cookies.get(name): 参数 name ~。");
			
			name = encodeURIComponent(name);
			
			var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^;]*)"));
			return matches ? decodeURIComponent(matches[1]) : undefined;
		},
		
		/**
		 * 设置 Cookies 。
		 * @param {String} name 名字。
		 * @param {String} value 值。
		 * @param {Number} expires 有效天数。天。-1表示无限。
		 * @param {Object} props 其它属性。如 domain, path, secure    。
		 */
		setCookie: function(name, value, expires, props){
			var e = encodeURIComponent,
			    updatedCookie = e(name) + "=" + e(value),
			    t;
			    
			    assert(updatedCookie.length < 4096, "Cookies.set(name, value, expires, props): 参数  value 内容过长，无法存储。");
			
			if(expires == undefined)
				expires = value === null ? -1 : 1000;
			   
			if(expires) {
				t = new Date();
				t.setHours(t.getHours() + expires * 24);
				updatedCookie += '; expires=' + t.toGMTString();
			}
			    
			for(t in props){
				updatedCookie = String.concat(updatedCookie, "; " + t, "=",  e(props[t])) ;
			}
			
			document.cookie = updatedCookie;
		},
		
		getData: function(dataName){
			if(window.localStorage){
				return localStorage[dataName];
			}
			
			return System.getCookie(dataName);
		},
		
		setData: function(dataName, value){
			if(window.localStorage){
				localStorage[dataName] = value;
				return ;
			}
			
			System.setCookie(dataName, value);
		},
		
		copyText: (function(){
		    if (window.clipboardData) {
				return function(content){
					window.clipboardData.clearData();
					window.clipboardData.setData("Text", content);
					return true;
				};
			} else if (navigator.isOpera) {
				return function(content){
					window.location = content;
					return true;
				}
			} else if (window.netscape) {
				// try {
					// netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				// } catch (e) {
					// return function(){
						// return false;
					// };
				// }
				
				
				return function(content){
					var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
					if (!clip) return false;
					var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
					if (!trans) return false;
					trans.addDataFlavor('text/unicode');
					var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
					str.data = content;
					trans.setTransferData("text/unicode", str, content.length * 2);
					var clipid = Components.interfaces.nsIClipboard;
					if (!clipid) return false;
					clip.setData(trans, null, clipid.kGlobalClipboard);
					return true;
				}
			}
		
		})(),
		
		formatHTML: function (html) {
			return new HtmlFormater().parse(html); //wrapping functions HtmlFormater
		},
		
		formatJS: js_beautify,
		
		getValueOf: function (v) {
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
		this.member = name;
		
		apply(this, info);
		
		this.id = name;
		
		if(typeof this.tests === 'function') {
			window.TestCases = window.TestCases || {};
			window.TestCases[name] = this.tests;
			this.member = 'TestCases["' + encodeJs(name) + '"]';
			this.tests = null;
		}
		
		var tests = (this.tests || "").split(';');
		if(/^\s*@/.test(tests[0])){
			var t = name.indexOf('.prototype.');
			
			if(t !== -1) {
				this.member = name.substr(t + '.prototype.'.length);
			}
			
			t = tests[0].substr(1).split(/\s*=\s*/);
			if(t[1]) {
				this.prefix = 'var ' +  t[0] + ' = ' + t[1] + ';\r\n';
				this.memberName = t[1] + this.member;
			}
			
			this.member = t[0] + '.' + this.member;
			
			
			tests.splice(0, 1);
		}
		
		if(this.method === false) {
			this.member = 'System.getValueOf(' + this.member + ')';
		}
		
		if(!this.memberName){
			this.memberName =   this.member;
		}
		
		this.tests = {};
		
		if(!tests.length) tests.push('');
		
		forEach(tests, function(value){
			value = value.split('=>');
			
			if(value[1] && !/assert/.test(value[1])) {
				value[1] = 'assert.areEqual(value, ' + value[1] + ');';
			}
			
			this.tests[value[0].replace(/^\s+|\s+$/g, "")] = value[1];
			
		}, this);
	}

	TestCase.prototype = {
			
		toHTML: function(){
			for(var p in this.tests) {
				break;
			}
			
			return [
			    '<div id="system-testcase-',
			    this.id,
			    '" class="system-testcase" onmouseover="this.className += \' system-testcase-actived\'" onmouseout="this.className = this.className.replace(\' system-testcase-actived\', \'\');">',
			     '<span><a href="javascript://',
			    encodeHTML(this.member),
			    '" onclick="System.doRun(\'',
			    this.id,
			    '\');">测试</a> | <a href="javascript://测试速度" onclick="System.doTime(\'',
			    this.id,
			    '\');">执行   ',
			    this.times || defaultTimes,
			    ' 次</a> | <a href="javascript://使用多个不同类型的参数进行测试" onclick="System.doTest(\'',
			    this.id,
			    '\');">自测</a> | <a href="javascript://查看函数源码" onclick="System.viewSource(\'',
			    this.id,
			    '\');">查看源码</a></span>',
			    '<a href="javascript://',
			    encodeHTML(this.member), '(', encodeHTML(p || ''), ')',
			    encodeHTML(this.tests[p] ? ' => ' + this.tests[p] : ''),
			    '" onclick="System.doRun(\'', 
			    this.id,
			    '\', false)">', encodeHTML(this.name || this.id),
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
			for(var override in this.tests) {
				r.push(this.prefix);
				r.push('assert.clearLog();\r\n');
				r.push('console.log("');
				r.push(this.memberName.replace(/\\/g, '\\\\').replace(/"/g, '\\\"'));
				r.push('(');
				r.push(override.replace(/\\/g, '\\\\').replace(/"/g, "\\\""));
				r.push(') => ", ');
				r.push('value = ');
				r.push(this.member);
				r.push('(');
				r.push(override);
				r.push(')');
				r.push(');\r\n');
				
				if(this.tests[override]) {
					
					r.push(this.tests[override]);
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
			
			var times = this.times || defaultTimes, c = 0;
			r.push(this.prefix);
			r.push('console.time("');
			r.push(this.name || this.id);
			r.push('");\r\n');
			r.push('while(i-- > 0) {\r\n');

			for(var override in this.tests) {
				c++;
				r.push(this.member);
				r.push('(');
				r.push(override);
				r.push(');\r\n');
				
			}
			
			r.push('}\r\n');
			r.push('console.timeEnd("');
			r.push(this.name || this.id);
			r.push('");\r\n');
			
			r[0] = 'var i = ' + ((times / c) || 0) + ';\r\n';
				
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
				r.push(this.member);
				r.push('(');
				r.push(param.replace(/\"/g, "\\\""));
				r.push(') => ", ');
				r.push(this.member);
				r.push('(');
				r.push(param);
				r.push(')');
				r.push(');\r\n');
				r.push('} catch(e) {\r\n');
				r.push('assert.hasError = true;\r\n');
				r.push('console.error("');
				r.push(this.member);
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
	
	function HtmlFormater() {

		this.tags = { //An object to hold tags, their position, and their parent-tags, initiated with default values
			parent: 'parent1',
			parentcount: 1,
			parent1: ''
		};

	};
	
	
	HtmlFormater.prototype = {

		//HtmlFormater position
		pos: 0,
		token: '',
		currentMode: 'CONTENT',
		tagType: '',
		tokenText: '',
		lastToken: '',
		lastText: '',
		tokenType: '',
		
		Utils: { //Uilities made available to the various functions
			whitespace: "\n\r\t ".split(''),
			singleToken: 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed'.split(','),
			//all the single tags for HTML
			extra_liners: 'head,body,/html'.split(','),
			//for tags that need a line of whitespace before them
			in_array: function(what, arr) {
				for (var i = 0; i < arr.length; i++) {
					if (what === arr[i]) {
						return true;
					}
				}
				return false;
			}
		},

		getContent: function() { //function to capture regular content between tags
			var chart = '';
			var content = [];
			var space = false;
			//if a space is needed
			while (this.input.charAt(this.pos) !== '<') {
				if (this.pos >= this.input.length) {
					return content.length ? content.join('') : ['', 'TK_EOF'];
				}
				chart = this.input.charAt(this.pos);
				this.pos++;
				this.lineCharCount++;

				if (this.Utils.in_array(chart, this.Utils.whitespace)) {
					if (content.length) {
						space = true;
					}
					this.lineCharCount--;
					continue;
					//don't want to insert unnecessary space
				} else if (space) {
					if (this.lineCharCount >= this.maxChar) { //insert a line when the maxChar is reached
						content.push('\n');
						for (var i = 0; i < this.indent_level; i++) {
							content.push(this.indentString);
						}
						this.lineCharCount = 0;
					} else {
						content.push(' ');
						this.lineCharCount++;
					}
					space = false;
				}
				content.push(chart);
				//letter at-a-time (or string) inserted to an array
			}
			return content.length ? content.join('') : '';
		},

		getScript: function() { //get the full content of a script to pass to js_beautify
			var chart = '';
			var content = [];
			var reg_match = new RegExp('\<\/script' + '\>', 'igm');
			reg_match.lastIndex = this.pos;
			var reg_array = reg_match.exec(this.input);
			var endScript = reg_array ? reg_array.index: this.input.length; //absolute end of script
			while (this.pos < endScript) { //get everything in between the script tags
				if (this.pos >= this.input.length) {
					return content.length ? content.join('') : ['', 'TK_EOF'];
				}

				chart = this.input.charAt(this.pos);
				this.pos++;

				content.push(chart);
			}
			return content.length ? content.join('') : ''; //we might not have any content at all
		},

		recordTag: function(tag) { //function to record a tag and its parent in this.tags Object
			if (this.tags[tag + 'count']) { //check for the existence of this tag type
				this.tags[tag + 'count']++;
				this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
			} else { //otherwise initialize this tag type
				this.tags[tag + 'count'] = 1;
				this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
			}
			this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
			this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
		},

		retrieveTag: function(tag) { //function to retrieve the opening tag to the corresponding closer
			if (this.tags[tag + 'count']) { //if the openener is not in the Object we ignore it
				var temp_parent = this.tags.parent; //check to see if it's a closable tag.
				while (temp_parent) { //till we reach '' (the initial value);
					if (tag + this.tags[tag + 'count'] === temp_parent) { //if this is it use it
						break;
					}
					temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
				}
				if (temp_parent) { //if we caught something
					this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly
					this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
				}
				delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...
				delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself
				if (this.tags[tag + 'count'] == 1) {
					delete this.tags[tag + 'count'];
				} else {
					this.tags[tag + 'count']--;
				}
			}
		},
		getTag: function() { //function to get a full tag and parse its type
			var chart = '';
			var content = [];
			var space = false;

			do {
				if (this.pos >= this.input.length) {
					return content.length ? content.join('') : ['', 'TK_EOF'];
				}
				chart = this.input.charAt(this.pos);
				this.pos++;
				this.lineCharCount++;

				if (this.Utils.in_array(chart, this.Utils.whitespace)) { //don't want to insert unnecessary space
					space = true;
					this.lineCharCount--;
					continue;
				}

				if (chart === "'" || chart === '"') {
					if (!content[1] || content[1] !== '!') { //if we're in a comment strings don't get treated specially
						chart += this.getUnformatted(chart);
						space = true;
					}
				}

				if (chart === '=') { //no space before =
					space = false;
				}

				if (content.length && content[content.length - 1] !== '=' && chart !== '>' && space) { //no space after = or before >
					if (this.lineCharCount >= this.maxChar) {
						this.printNewline(false, content);
						this.lineCharCount = 0;
					} else {
						content.push(' ');
						this.lineCharCount++;
					}
					space = false;
				}
				content.push(chart);
				//inserts character at-a-time (or string)
			} while ( chart !== '>');

			var tagComplete = content.join('');
			var tagIndex;
			if (tagComplete.indexOf(' ') != -1) { //if there's whitespace, thats where the tag name ends
				tagIndex = tagComplete.indexOf(' ');
			} else { //otherwise go with the tag ending
				tagIndex = tagComplete.indexOf('>');
			}
			var tagCheck = tagComplete.substring(1, tagIndex).toLowerCase();
			if (tagComplete.charAt(tagComplete.length - 2) === '/' || this.Utils.in_array(tagCheck, this.Utils.singleToken)) { //if this tag name is a single tag type (either in the list or has a closing /)
				this.tagType = 'SINGLE';
			} else if (tagCheck === 'script') { //for later script handling
				this.recordTag(tagCheck);
				this.tagType = 'SCRIPT';
			} else if (tagCheck === 'style') { //for future style handling (for now it justs uses getContent)
				this.recordTag(tagCheck);
				this.tagType = 'STYLE';
			} else if (tagCheck.charAt(0) === '!') { //peek for <!-- comment
				if (tagCheck.indexOf('[if') != -1) { //peek for <!--[if conditional comment
					if (tagComplete.indexOf('!IE') != -1) { //this type needs a closing --> so...
						var comment = this.getUnformatted('-->', tagComplete);
						//...delegate to getUnformatted
						content.push(comment);
					}
					this.tagType = 'START';
				} else if (tagCheck.indexOf('[endif') != -1) { //peek for <!--[endif end conditional comment
					this.tagType = 'END';
					this.unindent();
				} else if (tagCheck.indexOf('[cdata[') != -1) { //if it's a <[cdata[ comment...
					var comment = this.getUnformatted(']]>', tagComplete);
					//...delegate to getUnformatted function
					content.push(comment);
					this.tagType = 'SINGLE';
					//<![CDATA[ comments are treated like single tags
				} else {
					var comment = this.getUnformatted('-->', tagComplete);
					content.push(comment);
					this.tagType = 'SINGLE';
				}
			} else {
				if (tagCheck.charAt(0) === '/') { //this tag is a double tag so check for tag-ending
					this.retrieveTag(tagCheck.substring(1));
					//remove it and all ancestors
					this.tagType = 'END';
				} else { //otherwise it's a start-tag
					this.recordTag(tagCheck);
					//push it on the tag stack
					this.tagType = 'START';
				}
				if (this.Utils.in_array(tagCheck, this.Utils.extra_liners)) { //check if this double needs an extra line
					this.printNewline(true, this.output);
				}
			}
			return content.join('');
			//returns fully formatted tag
		},
		getUnformatted: function(delimiter, origTag) { //function to return unformatted content in its entirety
			if (origTag && origTag.indexOf(delimiter) != -1) {
				return '';
			}
			var chart = '';
			var content = '';
			var space = true;
			do {
				chart = this.input.charAt(this.pos);
				this.pos++

				if (this.Utils.in_array(chart, this.Utils.whitespace)) {
					if (!space) {
						this.lineCharCount--;
						continue;
					}
					if (chart === '\n' || chart === '\r') {
						content += '\n';
						for (var i = 0; i < this.indent_level; i++) {
							content += this.indentString;
						}
						space = false;
						//...and make sure other indentation is erased
						this.lineCharCount = 0;
						continue;
					}
				}
				content += chart;
				this.lineCharCount++;
				space = true;

			} while ( content . indexOf ( delimiter ) == -1);
			return content;
		},
		getToken: function() { //initial handler for token-retrieval
			var token;

			if (this.lastToken === 'TK_TAG_SCRIPT') { //check if we need to format javascript
				var tempToken = this.getScript();
				if (typeof tempToken !== 'string') {
					return tempToken;
				}
				token = js_beautify(tempToken, this.indentSize, this.indentCharacter, this.indent_level);
				//call the JS Beautifier
				return [token, 'TK_CONTENT'];
			}
			if (this.currentMode === 'CONTENT') {
				token = this.getContent();
				if (typeof token !== 'string') {
					return token;
				} else {
					return [token, 'TK_CONTENT'];
				}
			}

			if (this.currentMode === 'TAG') {
				token = this.getTag();
				if (typeof token !== 'string') {
					return token;
				} else {
					var tagNameType = 'TK_TAG_' + this.tagType;
					return [token, tagNameType];
				}
			}
		},

		printer: function(jsSource, indentCharacter, indentSize, maxChar) { //handles input/output and some other printing functions
			this.input = jsSource || '';
			//gets the input for the HtmlFormater
			this.output = [];
			this.indentCharacter = indentCharacter || ' ';
			this.indentString = '';
			this.indentSize = indentSize || 2;
			this.indent_level = 0;
			this.maxChar = maxChar || 70;
			//maximum amount of characters per line
			this.lineCharCount = 0;
			//count to see if maxChar was exceeded
			for (var i = 0; i < this.indentSize; i++) {
				this.indentString += this.indentCharacter;
			}

			return this;
		},
		
		printNewline: function(ignore, arr) {
			this.lineCharCount = 0;
			if (!arr || !arr.length) {
				return;
			}
			if (!ignore) { //we might want the extra line
				while (this.Utils.in_array(arr[arr.length - 1], this.Utils.whitespace)) {
					arr.pop();
				}
			}
			arr.push('\n');
			for (var i = 0; i < this.indent_level; i++) {
				arr.push(this.indentString);
			}
		},
		
		printToken: function(text) {
			this.output.push(text);
		},
		
		indent: function() {
			this.indent_level++;
		},
		
		unindent: function() {
			if (this.indent_level > 0) {
				this.indent_level--;
			}
		},
		
		parse: function (htmlSource, indentCharacter, indentSize) {
			var me = this;
			me.printer(htmlSource, indentCharacter, indentSize); //initialize starting values
			while (true) {
				var t = me.getToken();
				me.tokenText = t[0];
				me.tokenType = t[1];
		
				if (me.tokenType === 'TK_EOF') {
					break;
				}
		
				switch (me.tokenType) {
					case 'TK_TAG_START':
					case 'TK_TAG_SCRIPT':
					case 'TK_TAG_STYLE':
						me.printNewline(false, me.output);
						me.printToken(me.tokenText);
						me.indent();
						me.currentMode = 'CONTENT';
						break;
					case 'TK_TAG_END':
						me.printNewline(true, me.output);
						me.printToken(me.tokenText);
						me.currentMode = 'CONTENT';
						break;
					case 'TK_TAG_SINGLE':
						me.printNewline(false, me.output);
						me.printToken(me.tokenText);
						me.currentMode = 'CONTENT';
						break;
					case 'TK_CONTENT':
						if (me.tokenText !== '') {
							me.printNewline(false, me.output);
							me.printToken(me.tokenText);
						}
						me.currentMode = 'TAG';
						break;
				}
				me.lastToken = me.tokenType;
				me.lastText = me.tokenText;
			}
			return me.output.join('');
		}
	};
	
	
	function getRoot() { 
		var b = document.getElementsByTagName("script");
		b = b[b.length - 1];
		return (!-[1, ] && !document.createTextNode('').constructor ? b.getAttribute('src', 5) : b.src).replace(/assets\/scripts\/.*$/, '');
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
	
	function encodeJs(value){
		return  value
			.replace(/\\/g, "\\\\")
			.replace(/'/g, "\\\'")
			.replace(/"/g, "\\\"")
			.replace(/\r/g, "\\r'")
			.replace(/\n/g, "\\n'"); 
		
	}
	
	function assert(bValue, msg){
		if(!bValue) {
			assert.hasError = true;
			if(console.error.apply) {
				console.error.apply(console, [].slice.call(arguments, 1));
			} else {
				console.error([].slice.call(arguments, 1).join('     '));
			}
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
	
	function getMinTimesFor1ms () {
		var date = new Date(), i = 1;
		while(new Date() - date < 4) {
			areEqual([[[[[]]]]], [[[[[]]]]]);
			i++;	
		}
		
		if(i > 1000) return 100000;
		if(i > 100) return 10000;
		if(i > 10) return 1000;
		return 100;
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
	
	function js_beautify(js_source_text, indent_size, indent_character, indent_level) {
	
		var input, output, token_text, last_type, last_text, last_word, current_mode, modes, indent_string;
		var whitespace, wordchar, punct, parser_pos, line_starters, in_case;
		var prefix, token_type, do_block_just_closed, var_line, var_line_tainted;
	
		function trim_output() {
			while (output.length && (output[output.length - 1] === ' ' || output[output.length - 1] === indent_string)) {
				output.pop();
			}
		}
	
		function print_newline(ignore_repeated) {
			ignore_repeated = typeof ignore_repeated === 'undefined' ? true: ignore_repeated;
	
			trim_output();
	
			if (!output.length) {
				return; // no newline on start of file
			}
	
			if (output[output.length - 1] !== "\n" || !ignore_repeated) {
				output.push("\n");
			}
			for (var i = 0; i < indent_level; i++) {
				output.push(indent_string);
			}
		}
	
		function print_space() {
			var last_output = output.length ? output[output.length - 1] : ' ';
			if (last_output !== ' ' && last_output !== '\n' && last_output !== indent_string) { // prevent occassional duplicate space
				output.push(' ');
			}
		}
	
		function print_token() {
			output.push(token_text);
		}
	
		function indent() {
			indent_level++;
		}
	
		function unindent() {
			if (indent_level) {
				indent_level--;
			}
		}
	
		function remove_indent() {
			if (output.length && output[output.length - 1] === indent_string) {
				output.pop();
			}
		}
	
		function set_mode(mode) {
			modes.push(current_mode);
			current_mode = mode;
		}
	
		function restore_mode() {
			do_block_just_closed = current_mode === 'DO_BLOCK';
			current_mode = modes.pop();
		}
	
		function in_array(what, arr) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === what) {
					return true;
				}
			}
			return false;
		}
	
		function get_next_token() {
			var n_newlines = 0;
			var c = '';
	
			do {
				if (parser_pos >= input.length) {
					return ['', 'TK_EOF'];
				}
				c = input.charAt(parser_pos);
	
				parser_pos += 1;
				if (c === "\n") {
					n_newlines += 1;
				}
			} while ( in_array ( c , whitespace ));
	
			if (n_newlines > 1) {
				for (var i = 0; i < 2; i++) {
					print_newline(i === 0);
				}
			}
			var wanted_newline = (n_newlines === 1);
	
			if (in_array(c, wordchar)) {
				if (parser_pos < input.length) {
					while (in_array(input.charAt(parser_pos), wordchar)) {
						c += input.charAt(parser_pos);
						parser_pos += 1;
						if (parser_pos === input.length) {
							break;
						}
					}
				}
	
				// small and surprisingly unugly hack for 1E-10 representation
				if (parser_pos !== input.length && c.match(/^[0-9]+[Ee]$/) && input.charAt(parser_pos) === '-') {
					parser_pos += 1;
	
					var t = get_next_token(parser_pos);
					c += '-' + t[0];
					return [c, 'TK_WORD'];
				}
	
				if (c === 'in') { // hack for 'in' operator
					return [c, 'TK_OPERATOR'];
				}
				return [c, 'TK_WORD'];
			}
	
			if (c === '(' || c === '[') {
				return [c, 'TK_START_EXPR'];
			}
	
			if (c === ')' || c === ']') {
				return [c, 'TK_END_EXPR'];
			}
	
			if (c === '{') {
				return [c, 'TK_START_BLOCK'];
			}
	
			if (c === '}') {
				return [c, 'TK_END_BLOCK'];
			}
	
			if (c === ';') {
				return [c, 'TK_END_COMMAND'];
			}
	
			if (c === '/') {
				var comment = '';
				// peek for comment /* ... */
				if (input.charAt(parser_pos) === '*') {
					parser_pos += 1;
					if (parser_pos < input.length) {
						while (! (input.charAt(parser_pos) === '*' && input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === '/') && parser_pos < input.length) {
							comment += input.charAt(parser_pos);
							parser_pos += 1;
							if (parser_pos >= input.length) {
								break;
							}
						}
					}
					parser_pos += 2;
					return ['/*' + comment + '*/', 'TK_BLOCK_COMMENT'];
				}
				// peek for comment // ...
				if (input.charAt(parser_pos) === '/') {
					comment = c;
					while (input.charAt(parser_pos) !== "\x0d" && input.charAt(parser_pos) !== "\x0a") {
						comment += input.charAt(parser_pos);
						parser_pos += 1;
						if (parser_pos >= input.length) {
							break;
						}
					}
					parser_pos += 1;
					if (wanted_newline) {
						print_newline();
					}
					return [comment, 'TK_COMMENT'];
				}
	
			}
	
			if (c === "'" || // string
			c === '"' || // string
			(c === '/' && ((last_type === 'TK_WORD' && last_text === 'return') || (last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || last_type === 'TK_OPERATOR' || last_type === 'TK_EOF' || last_type === 'TK_END_COMMAND')))) { // regexp
				var sep = c;
				var esc = false;
				c = '';
	
				if (parser_pos < input.length) {
	
					while (esc || input.charAt(parser_pos) !== sep) {
						c += input.charAt(parser_pos);
						if (!esc) {
							esc = input.charAt(parser_pos) === '\\';
						} else {
							esc = false;
						}
						parser_pos += 1;
						if (parser_pos >= input.length) {
							break;
						}
					}
	
				}
	
				parser_pos += 1;
				if (last_type === 'TK_END_COMMAND') {
					print_newline();
				}
				return [sep + c + sep, 'TK_STRING'];
			}
	
			if (in_array(c, punct)) {
				while (parser_pos < input.length && in_array(c + input.charAt(parser_pos), punct)) {
					c += input.charAt(parser_pos);
					parser_pos += 1;
					if (parser_pos >= input.length) {
						break;
					}
				}
				return [c, 'TK_OPERATOR'];
			}
	
			return [c, 'TK_UNKNOWN'];
		}
	
		//----------------------------------
		indent_character = indent_character || ' ';
		indent_size = indent_size || 4;
	
		indent_string = '';
		while (indent_size--) {
			indent_string += indent_character;
		}
	
		input = js_source_text;
	
		last_word = ''; // last 'TK_WORD' passed
		last_type = 'TK_START_EXPR'; // last token type
		last_text = ''; // last token text
		output = [];
	
		do_block_just_closed = false;
		var_line = false;
		var_line_tainted = false;
	
		whitespace = "\n\r\t ".split('');
		wordchar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'.split('');
		punct = '+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |='.split(' ');
	
		// words which should always start on new line.
		line_starters = 'continue,try,throw,return,var,if,switch,case,default,for,while,break,function'.split(',');
	
		// states showing if we are currently in expression (i.e. "if" case) - 'EXPRESSION', or in usual block (like, procedure), 'BLOCK'.
		// some formatting depends on that.
		current_mode = 'BLOCK';
		modes = [current_mode];
	
		indent_level = indent_level || 0;
		parser_pos = 0; // parser position
		in_case = false; // flag for parser that case/default has been processed, and next colon needs special attention
		while (true) {
			var t = get_next_token(parser_pos);
			token_text = t[0];
			token_type = t[1];
			if (token_type === 'TK_EOF') {
				break;
			}
	
			switch (token_type) {
	
			case 'TK_START_EXPR':
				var_line = false;
				set_mode('EXPRESSION');
				if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR') {
					// do nothing on (( and )( and ][ and ]( ..
				} else if (last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
					print_space();
				} else if (in_array(last_word, line_starters) && last_word !== 'function') {
					print_space();
				}
				print_token();
				break;
	
			case 'TK_END_EXPR':
				print_token();
				restore_mode();
				break;
	
			case 'TK_START_BLOCK':
	
				if (last_word === 'do') {
					set_mode('DO_BLOCK');
				} else {
					set_mode('BLOCK');
				}
				if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
					if (last_type === 'TK_START_BLOCK') {
						print_newline();
					} else {
						print_space();
					}
				}
				print_token();
				indent();
				break;
	
			case 'TK_END_BLOCK':
				if (last_type === 'TK_START_BLOCK') {
					// nothing
					trim_output();
					unindent();
				} else {
					unindent();
					print_newline();
				}
				print_token();
				restore_mode();
				break;
	
			case 'TK_WORD':
	
				if (do_block_just_closed) {
					print_space();
					print_token();
					print_space();
					break;
				}
	
				if (token_text === 'case' || token_text === 'default') {
					if (last_text === ':') {
						// switch cases following one another
						remove_indent();
					} else {
						// case statement starts in the same line where switch
						unindent();
						print_newline();
						indent();
					}
					print_token();
					in_case = true;
					break;
				}
	
				prefix = 'NONE';
				if (last_type === 'TK_END_BLOCK') {
					if (!in_array(token_text.toLowerCase(), ['else', 'catch', 'finally'])) {
						prefix = 'NEWLINE';
					} else {
						prefix = 'SPACE';
						print_space();
					}
				} else if (last_type === 'TK_END_COMMAND' && (current_mode === 'BLOCK' || current_mode === 'DO_BLOCK')) {
					prefix = 'NEWLINE';
				} else if (last_type === 'TK_END_COMMAND' && current_mode === 'EXPRESSION') {
					prefix = 'SPACE';
				} else if (last_type === 'TK_WORD') {
					prefix = 'SPACE';
				} else if (last_type === 'TK_START_BLOCK') {
					prefix = 'NEWLINE';
				} else if (last_type === 'TK_END_EXPR') {
					print_space();
					prefix = 'NEWLINE';
				}
	
				if (last_type !== 'TK_END_BLOCK' && in_array(token_text.toLowerCase(), ['else', 'catch', 'finally'])) {
					print_newline();
				} else if (in_array(token_text, line_starters) || prefix === 'NEWLINE') {
					if (last_text === 'else') {
						// no need to force newline on else break
						print_space();
					} else if ((last_type === 'TK_START_EXPR' || last_text === '=') && token_text === 'function') {
						// no need to force newline on 'function': (function
						// DONOTHING
					} else if (last_type === 'TK_WORD' && (last_text === 'return' || last_text === 'throw')) {
						// no newline between 'return nnn'
						print_space();
					} else if (last_type !== 'TK_END_EXPR') {
						if ((last_type !== 'TK_START_EXPR' || token_text !== 'var') && last_text !== ':') {
							// no need to force newline on 'var': for (var x = 0...)
							if (token_text === 'if' && last_type === 'TK_WORD' && last_word === 'else') {
								// no newline for } else if {
								print_space();
							} else {
								print_newline();
							}
						}
					} else {
						if (in_array(token_text, line_starters) && last_text !== ')') {
							print_newline();
						}
					}
				} else if (prefix === 'SPACE') {
					print_space();
				}
				print_token();
				last_word = token_text;
	
				if (token_text === 'var') {
					var_line = true;
					var_line_tainted = false;
				}
	
				break;
	
			case 'TK_END_COMMAND':
	
				print_token();
				var_line = false;
				break;
	
			case 'TK_STRING':
	
				if (last_type === 'TK_START_BLOCK' || last_type === 'TK_END_BLOCK') {
					print_newline();
				} else if (last_type === 'TK_WORD') {
					print_space();
				}
				print_token();
				break;
	
			case 'TK_OPERATOR':
	
				var start_delim = true;
				var end_delim = true;
				if (var_line && token_text !== ',') {
					var_line_tainted = true;
					if (token_text === ':') {
						var_line = false;
					}
				}
	
				if (token_text === ':' && in_case) {
					print_token(); // colon really asks for separate treatment
					print_newline();
					break;
				}
	
				in_case = false;
	
				if (token_text === ',') {
					if (var_line) {
						if (var_line_tainted) {
							print_token();
							print_newline();
							var_line_tainted = false;
						} else {
							print_token();
							print_space();
						}
					} else if (last_type === 'TK_END_BLOCK') {
						print_token();
						print_newline();
					} else {
						if (current_mode === 'BLOCK') {
							print_token();
							print_newline();
						} else {
							// EXPR od DO_BLOCK
							print_token();
							print_space();
						}
					}
					break;
				} else if (token_text === '--' || token_text === '++') { // unary operators special case
					if (last_text === ';') {
						// space for (;; ++i)
						start_delim = true;
						end_delim = false;
					} else {
						start_delim = false;
						end_delim = false;
					}
				} else if (token_text === '!' && last_type === 'TK_START_EXPR') {
					// special case handling: if (!a)
					start_delim = false;
					end_delim = false;
				} else if (last_type === 'TK_OPERATOR') {
					start_delim = false;
					end_delim = false;
				} else if (last_type === 'TK_END_EXPR') {
					start_delim = true;
					end_delim = true;
				} else if (token_text === '.') {
					// decimal digits or object.property
					start_delim = false;
					end_delim = false;
	
				} else if (token_text === ':') {
					// zz: xx
					// can't differentiate ternary op, so for now it's a ? b: c; without space before colon
					if (last_text.match(/^\d+$/)) {
						// a little help for ternary a ? 1 : 0;
						start_delim = true;
					} else {
						start_delim = false;
					}
				}
				if (start_delim) {
					print_space();
				}
	
				print_token();
	
				if (end_delim) {
					print_space();
				}
				break;
	
			case 'TK_BLOCK_COMMENT':
	
				print_newline();
				print_token();
				print_newline();
				break;
	
			case 'TK_COMMENT':
	
				// print_newline();
				print_space();
				print_token();
				print_newline();
				break;
	
			case 'TK_UNKNOWN':
				print_token();
				break;
			}
	
			last_type = token_type;
			last_text = token_text;
		}
	
		return output.join('');
	
	}
	
})();


