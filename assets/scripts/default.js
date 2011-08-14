


(function(){
	
	var root, moduleName, currentCases;

	selectModule();
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
				
			document.body.style.visibility = 'hidden';
			
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
				
				initMenu(window[moduleName]);
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
						
						result.push('<li><a href="../' + group + '/' + value +'"' + clazz + '>' + value + '</a></li>');
					});
					
					
					result[currenHeader] = '<h2>' + group + ' <span class="small">(' + finished + '/' + total + ')</span></h2>';
					
				} else {
					
					result.push('<ul class="break-line">');
					
					for(var menu in menus[group]) {
						result.push('<li><a href="' + root + menus[group][menu] +'">' + menu + '</a></li>');
					}
				}
				
				result.push('</ul>');
				
			}
			
			sidebar.innerHTML = result.join('\r\n');
			
		},

		initTestCases: function (testcases) {
			document.write('<div id="testcases">');
			
			currentCases = testcases;
			
			for(var name in testcases){
				var testcase = testcases[name];
				
				if(typeof testcase === 'string') {
					if(testcase === '-'){
						document.write('<h2 class="testcasegroup">' + name + '</h2>');
						continue ;
					}
					
					testcase = {overrides: testcase};
				}
				
				
				var displayName = testcase.name || name;
				var runTime = testcase.time || 1000;
				
				document.write('<div class="testcase" onclick="run(\'' + name + '\')" onmouseover="this.className += \' active\'" onmouseout="this.className = this.className.replace(\' active\', \'\');">');
				document.write('<a href="javascript://' + name + '">' + displayName + '</a>');
				
				if(testcase.summary) {
					document.write('&nbsp;&nbsp;&nbsp;&nbsp;' + testcase.summary);
				}
				
				document.write('<span><a href="javascript://' + name + '">执行   ' + runTime + ' 次</a> | <a href="javascript://' + name + '">恶意测试</a></span></div>');
				
			}
			
			document.write('</div>');
		}
	
	
	});
	
	window.initPage = initPage;
	window.initTestCases = initTestCases;
	window.initMenu = initMenu;
	window.run = run;
	window.assert = window.assert || assert;
	
	applyIf(window.assert, {

		/**
		 * 确认 2 个值是一致的。
		 */
		areEqual: function(value1, value2){
			assert(areEqual(value1, value2), "断言失败。应该返回 ", value2, ", 现在返回", value1);
		}
	
	});
	
	function areEqual(value1, values) {
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
	
	function getCurrentFileUrl() {
		var b = document.getElementsByTagName("script");
		b = b[b.length - 1];
		return !-[1, ] ? b.getAttribute('src', 5) : b.src;
	}
	
	function selectModule(){
		root = getCurrentFileUrl().replace(/assets\/scripts\/.*$/, '');
		moduleName = location.href.replace(root, '');
		moduleName = moduleName.substr(0, (moduleName + '/').indexOf('/'));
		
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
		
	function forEach(array, fn, bind){
		for(var i = 0; i < array.length; i++){
			fn.call(bind, array[i], i, array);
		}
	}

	function run(name){
		var info = currentCases[name];

		if(typeof info === 'string') {
			info = {overrides: info};
		}
		
		var r = [];
		
		
		if(info.init) {
			r.push(info.init);
			r.push('\r\n');
		}
		
		r.push('var value;\r\n');
		
		var prefix,
			predef,
			overrides = (info.overrides || "").split(';');
		if(/^\s*@/.test(overrides[0])){
			var pos = name.indexOf('.prototype.');
			
			if(pos !== -1) {
				prefix = name.substr(pos + '.prototype'.length);
			} else {
				prefix = name;
			}
			
			predef = overrides[0].substr(1).split(/\s*=\s*/);
			prefix = predef[0] + '.' + prefix;
			if(predef[1]) {
				predef = 'var ' +  predef[0] + ' = ' + predef[1] + ';\r\n';
			} else {
				predef = '';	
			}
			
			overrides.splice(0, 1);
		} else {
			
			
			prefix = name;
			
		}
		
		forEach(overrides, function(value){
			
			value = value.split('=>');
			r.push(predef);
			r.push('console.log("');
			r.push(prefix);
			r.push('(');
			r.push(value[0].replace(/\"/g, "\\\""));
			r.push(') => ');
			
			r.push('", ');
			r.push('value = ');
			r.push(prefix);
			r.push('(');
			r.push(value[0]);
			r.push(')');
			r.push(');\r\n');
			
			if(value[1]) {
				if(!/assert/.test(value[1]))
					value[1] = 'assert.areEqual(value, ' + value[1] + ');';
				
				r.push(value[1]);
				r.push('\r\n');
			
			}
			
		});
			
		if(info.uninit) {
			r.push(info.uninit);
			r.push('\r\n');
		}
		
		r.push('return value;');
		
		//     alert(r.join(''))    ;     return
		
		r = new Function(r.join(''));
		
		return r();
	}

	function runTime(name){
		var info = currentCases[name];
		var r = [];
		
		// 点击测试速度后，执行代码:
		// var a = 1;
		// var date = Date.now();
		// var i = 1000 / 2;
		// while(i-- > 0) {
		//	   me.sample(1);
		//	   me.sample(2);
		// }
		//
		// print("me.sample 执行 1000 次: " + (Date.now() - date));
		//
		
		if(info.init) {
			r.push(info.init);
			r.push('\r\n');
		}
			
		if(info.uninit) {
			r.push(info.uninit);
			r.push('\r\n');
		}
		
	}

	function test(name){
		var info = currentCases[name];
	}
	
	function assert(bValue, msg){
		if(!bValue) console.error.apply(console, [].slice.call(arguments, 1));
	}
	
	function apply(dest, src) {
		for(var i in src){
			dest[i] = src[i];
		}
		
	}


})();