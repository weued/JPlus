/**
 * @fileOverview J+ 测试系统核心引擎
 */
// 测试系统核心部分
(function () {

    window.Demo = window.Demo || {};

    apply(Demo, {

        // trim: ''.trim ? function(value){
        // return value.trim();
        // } : function(value){
        // return value.replace(/^\s+|\s+$/g, "");
        // },
        /**
         * 获取 Cookies 。
         * @param {String} name 名字。
         * @param {String} 值。
         */
        getCookie: function (name) {

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
        setCookie: function (name, value, expires, props) {
            var e = encodeURIComponent,
                updatedCookie = e(name) + "=" + e(value),
                t;

            assert(updatedCookie.length < 4096, "Cookies.set(name, value, expires, props): 参数  value 内容过长，无法存储。");

            if (expires == undefined) expires = value === null ? -1 : 1000;

            if (expires) {
                t = new Date();
                t.setHours(t.getHours() + expires * 24);
                updatedCookie += '; expires=' + t.toGMTString();
            }

            for (t in props) {
                updatedCookie = String.concat(updatedCookie, "; " + t, "=", e(props[t]));
            }

            document.cookie = updatedCookie;
        },

        getData: function (dataName) {
            if (window.localStorage) {
                return localStorage[dataName];
            }

            return Demo.getCookie(dataName);
        },

        setData: function (dataName, value) {
            if (window.localStorage) {
                localStorage[dataName] = value;
                return;
            }

            Demo.setCookie(dataName, value);
        },

        copyCode: (function () {
            if (window.clipboardData) {
                return function (content, type) {
                    content = type === 'html' ? Demo.formatHTML(content) : type === 'js' ? Demo.formatJS(content) : content;
                    window.clipboardData.clearData();
                    window.clipboardData.setData("Text", content);
                    return true;
                };
            } else {


                return function (content) {
                    var textarea = document.createElement('textarea');
                    textarea.value = content;
                    textarea.title = '双击关闭';
                    textarea.style.cssText = 'width: 800px; height: 400px; position:fixed; left: 50%; top: 50%; margin-left: -400px; margin-top: -200px;';
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    textarea.onfocus = textarea.select;
                    textarea.ondblclick = function () {
                        document.body.removeChild(textarea);
                    };
                }
            }

        })(),

        formatHTML: function (html) {
            return new HtmlFormater().parse(html); //wrapping functions HtmlFormater
        },

        formatJS: js_beautify,

        encodeHTML: function (value) {
            return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;");

        },

        encodeJs: function (value) {
            return value.replace(/\\/g, "\\\\").replace(/'/g, "\\\'").replace(/"/g, "\\\"").replace(/\r/g, "\\r'").replace(/\n/g, "\\n'");

        },

        getPreviousElement: function (node) {
            do {
                node = node.previousSibling;
            } while (node && node.nodeType !== 1);

            return node;
        },

        getNextElement: function (node) {
            do {
                node = node.nextSibling;
            } while (node && node.nodeType !== 1);

            return node;
        },

        getFirstElement: function (node) {
            node = node.firstChild;
            while (node && node.nodeType !== 1) {
                node = node.nextSibling;
            }

            return node;
        },

        getLastElement: function (node) {
            node = node.lastChild;
            while (node && node.nodeType !== 1) {
                node = node.priviousSibling;
            }

            return node;
        },

        getElementsByClassName: document.getElementsByClassName ?
        function (className) {
            return document.getElementsByClassName(className);
        } : function (className) {
            var elems = document.getElementsByTagName("*"),
                r = [];
            for (var i = 0; elems[i]; i++) {
                if (elems[i].className === className) {
                    r.push(elems[i]);
                }
            }


            return r;
        },

        toggleViewSourceHTML: '<a id="demo-toggleviewsource" onclick="Demo.toggleViewSource()" class="demo" href="javascript://切换显示页面上的全部显示源码的功能">♦ 隐藏源码</a>',

        createViewSource: function () {
            var viewSource = document.createElement('div');
            viewSource.className = 'demo-control-viewsource';
            viewSource.innerHTML = '<a class="demo" href="javascript://查看用于创建上文组件的所有源码;" onclick="Demo.toggleSource(this)"><span class="demo-control-arrow">▸</span>查看源码</a>';
            return viewSource;
        },

        initViewSource: function (parentNode) {
            var nodes = parentNode.getElementsByTagName('aside');
            for (var i = 0, len = nodes.length; i < len; i++) {
                var aside = nodes[i];
                if (aside.className === 'demo') {
                    var n = Demo.getNextElement(aside);
                    if (n && n.tagName === 'SCRIPT' && n.type === 'text/html') {
                        n.className = 'demo';
                        n.processed = true;
                        aside = n;
                    }
                    aside.parentNode.insertBefore(Demo.createViewSource(), aside.nextSibling);
                }
            }

            nodes = parentNode.getElementsByTagName('SCRIPT');
            for (var i = 0, len = nodes.length; i < len; i++) {
                var script = nodes[i];
                if (script.className === 'demo' && !script.processed) {
                    script.parentNode.insertBefore(Demo.getCode(script.innerHTML, script.type), script.nextSibling);
                }
            }

        },

        toggleViewSource: function (targetNode) {
            if (Demo.viewSourceState === undefined) {
                Demo.initViewSource(document);
                Demo.viewSourceState = false;
            }

            var newValue = Demo.viewSourceState = !Demo.viewSourceState,
                elems = Demo.getElementsByClassName('demo-control-viewsource');
            document.getElementById('demo-toggleviewsource').innerHTML = newValue ? '♦ 隐藏源码' : '♢ 显示源码';
            Demo.setData('demo_source', newValue ? 'true' : 'false');
            newValue = newValue ? '' : 'none';
            for (var i = 0; elems[i]; i++) {
                elems[i].style.display = newValue;
            }


        },

        getCode: function (sourceCode, type) {
        	sourceCode = sourceCode.replace(/<\\\/script>/g, "</script>");
            if (type === 'text/html') {
                sourceCode = Demo.formatHTML(sourceCode);
                type = 'html';
            } else if (!type || type === 'text/javascript') {
                sourceCode = Demo.formatJS(sourceCode);
                type = 'js';
            } else if (type === 'text/css') {
                type = 'css';
            } else {
                type = '';
            }

            var code = document.createElement('pre');
            code.className = 'demo';
            code.innerText = code.textContent = sourceCode;
            code.ondblclick = function () {
                Demo.copyCode(code.innerText || code.textContent, type);
                return false;
            };
            code.innerHTML = window.prettyPrintOne && prettyPrintOne(code.innerHTML, type, 1);

            return code;
        },

        initSource: function (targetNode) {
            targetNode = targetNode.parentNode;
            var sourceNode = Demo.getPreviousElement(targetNode);
            if (sourceNode.className === 'demo') {
                targetNode.appendChild(Demo.getCode(sourceNode.innerHTML || '', sourceNode.type || 'text/html'));
            }

        },

        toggleSource: function (targetNode) {
            var nextNode = Demo.getNextElement(targetNode),
                newValue;

            if (nextNode) {
                newValue = nextNode.style.display === 'none';
                nextNode.style.display = newValue ? '' : 'none';
            } else {
                newValue = true;
                this.initSource(targetNode);
            }

            targetNode.firstChild.innerHTML = newValue ? '▾' : '▸';
        },

        toggleAllSource: function (targetNode) {
            var nodes = Demo.getElementsByClassName('demo-control-viewsource'),
                state = [],
                allClosed = true;

            for (var i = 0, len = nodes.length; i < len; i++) {
                var pre = Demo.getLastElement(nodes[i]);
                if (state[i] = pre.tagName !== 'A' && pre.style.display !== 'none') {
                    allClosed = false;
                }

            }

            for (i = 0; i < len; i++) {

                if (allClosed !== state[i]) {
                    Demo.toggleSource(Demo.getFirstElement(nodes[i]));
                }

            }

        },

        /**
         * 初始化测试用例。
         */
        writeTestCases: function (testcases, dftOptions) {
            document.write('<div id="demo-testcases" class="demo-clear">');

            document.write('<div class="demo-right demo-small"><a class="demo" href="javascript://按顺序执行全部函数;" onclick="Demo.runTestAll();">全部测试</a> | <a class="demo" href="javascript:;" onclick="Demo.speedTestAll();">全部效率</a></div>');

            apply.testCases = testcases;

            for (var name in testcases) {
                var testcase = testcases[name];

                if (testcase === '-') {
                    delete testcases[name];
                    document.write('<h2>' + Demo.encodeHTML(name) + '</h2>');
                    continue;
                }

                var encodedName = Demo.encodeHTML(name);

                document.write(['<div title="', encodedName, '" id="demo-testcases-', name, '" class="demo-tip" onmouseover="this.className += \' demo-tip-selected\'" onmouseout="this.className = this.className.replace(\' demo-tip-selected\', \'\');">\
					<span class="demo-control-toolbar">\
						<a class="demo" href="javascript://执行函数" onclick="Demo.runTestCase(\'', name, '\');">测试</a> | \
						<a class="demo" href="javascript://测试函数执行的速度" onclick="Demo.speedTest(\'', name, '\');">效率</a> | \
						<a class="demo" href="javascript://查看函数源码" onclick="Demo.viewSource(\'', name, '\');">查看源码</a>\
					</span>\
				    <a class="demo" href="javascript://', typeof testcase === 'object' ? '单元测试: ' + encodedName : Demo.encodeHTML(testcase.toString()), '" onclick="Demo.runTestCase(\'', name, '\')">', encodedName, '</a>\
				    </div>'].join(''));

            }

            document.write('</div>');
        },

        /**
         * 执行一个单元测试。
         */
        runTestCase: function (name) {

            var info = apply.testCases[name];

            if (info) {

                assert.reset();

                var ret, displayName, isTestCase;

                switch (typeof info) {

                    // 字符串: 转函数。
                case 'string':
                    displayName = info.replace(/~/g, name);
                    info = function () {
                        return eval(displayName);
                    };

                    // fall through
                    // 函数: 直接执行。
                case 'function':
                    try {
                        ret = info();
                    } catch (e) {
                        if (info) reportError(name, e.message, displayName || info.toString());
                        break;
                    }

                    console.info('[' + name + '] ', displayName || info.toString(), ' =>', ret);
                    break;

                    // 测试用例: 先处理。
                case 'object':
                    isTestCase = true;
                    runTestCase(info, name);
                }

                document.getElementById('demo-testcases-' + name).className = assert.hasError === true ? 'demo-tip demo-tip-error' : !isTestCase ? 'demo-tip' : assert.hasError === false ? 'demo-tip demo-tip-success' : 'demo-tip demo-tip-warning';

            }
        },

        speedTest: function (name) {
            var info = apply.testCases[name];

            if (info) {

                switch (typeof info) {

                    // 字符串: 转函数。
                case 'string':
                    info = new Function(info.replace(/~/g, name));
                    break;

                    // 测试用例: 先处理。
                case 'object':
                    info = complieTestCase(info, name);
                    break;
                }

                var time = 0,
                    maxTime = 0,
                    base = 100,
                    start = +new Date(),
                    past;

                do {

                    maxTime += base;

                    while (time++ < maxTime) {
                        info();
                    }

                    past = +new Date() - start;

                    base *= 2;

                } while (past < 200);

                start = past * 1000 / time;
                console.log('[' + name + '] ', start, 'ms/k');
            }

        },

        viewSource: function (name) {
            var info = apply.testCases[name];

            if (info) {

                switch (typeof info) {

                    // 字符串: 转函数。
                case 'string':
                    info = info.replace(/~/g, name);
                    break;

                case 'object':
                    info = complieTestCase(info, name);

                    // fall through
                    // 函数: 直接执行。
                case 'function':
                    info = info.toString();
                    if (String.decodeUTF8) info = String.decodeUTF8(info);
                    break;

                }
                return console.info('[' + name + ']', info);

            }
        },

        runTestAll: function () {
            for (var name in apply.testCases) {
                this.runTestCase(name);
            }
        },

        speedTestAll: function () {
            for (var name in apply.testCases) {
                this.speedTest(name);
            }
        },

        writeTreeView: function (list) {
            document.write('<ul class="demo">');
            for (var item in list) {
                document.write('<li>');
                if (typeof list[item] === 'string') {
                    document.write('<a class="demo" href="' + list[item] + '" target="_blank">');
                    item = item.split(/\s*-\s*/);
                    if (item[0].charAt(0) === '#') {
                        document.write('<strong>');
                        document.write(item[0].substring(1));
                        document.write('</strong>');
                    } else {
                        document.write(item[0]);
                    }

                    document.write('</a>');
                    if (item[1]) {
                        document.write('<span> - <span class="demo-hint">');
                        document.write(item[1]);
                        document.write('</span></span>');
                    }
                } else {
                    document.write(item);
                    Demo.writeTreeView(list[item]);
                }
                document.write('</li>');
            }
            document.write('</ul>');
        },

        writeQuestions: function (questions) {

            var i = 1;
            apply.answers = [''];
            document.write('<article id="demo-questions">');
            for (var question in questions) {
                var answers = questions[question];
                document.write('<section class="demo demo-tip" id="demo-questions-qd');
                document.write(i);
                document.write('">\r\n');
                document.write('<h4 class="demo-plain">\r\n');
                document.write(i);
                document.write('. ');
                document.write(Demo.encodeHTML(question));
                document.write('\r\n</h4>\r\n');
                document.write('<menu>\r\n');

                for (var j = 0; j < answers.length; j++) {
                    if (answers[j].charAt(0) === '@') {
                        apply.answers[i] = j;
                        answers[j] = answers[j].substr(1);
                    }

                    document.write('<input type="radio" name="demo-questions-q');
                    document.write(i);
                    document.write('" id="demo-questions-q');
                    document.write(i);
                    document.write(j);
                    document.write('"><label for="demo-questions-q');
                    document.write(i);
                    document.write(j);
                    document.write('">');
                    document.write(Demo.encodeHTML(answers[j]));
                    document.write('</label><br>\r\n');
                }
                document.write('\r\n</menu>\r\n');
                document.write('\r\n</section>\r\n');

                i++;


            }

            document.write('<input type="button" onclick="Demo.checkAnswers()" value="验证">');
            document.write('<div id="demo-questions-info"></div>');
            document.write('</article>');
        },

        checkAnswers: function () {
            var errorCount = 0,
                total = apply.answers.length - 1;
            for (var i = 1; i <= total; i++) {
                if (apply.answers[i] === undefined) continue;
                var qd = document.getElementById('demo-questions-qd' + i);
                if (!document.getElementById('demo-questions-q' + i + apply.answers[i]).checked) {
                    var allButtons = document.getElementsByName('demo-questions-q' + i);
                    errorCount++;
                    qd.className = 'demo demo-tip demo-tip-warning';
                    for (var j = 0; allButtons[j]; j++) {
                        if (allButtons[j].checked) {
                            qd.className = 'demo demo-tip demo-tip-error';
                            break;
                        }
                    }
                } else {
                    qd.className = 'demo demo-tip';
                }
            }

            var r = (total - errorCount) * 100 / total,
                className;

            if (r == 100) {
                innerHTML = '全对了!';
                className = 'demo-tip demo-tip-success';
            } else if (r > 60) {
                innerHTML = '';
                className = 'demo-tip demo-tip-warning';
            } else {
                innerHTML = r == 0 ? '没有一题是正确的...你在干吗?' : '不及格哦亲';
                className = 'demo-tip demo-tip-error';
            }

            var t = document.getElementById('demo-questions-info');

            t.innerHTML = '答对' + (total - errorCount) + '/' + total + '题(' + r + '%) ' + innerHTML;
            t.className = className;

        },

        assert: assert,

        addEvent: function (obj, event, fn) {
            if (obj.addEventListener) obj.addEventListener(event, fn, false);
            else {
                obj.attachEvent('on' + event, fn);
            }

        },

        forEach: function (array, fn, bind) {
            for (var i = 0; i < array.length; i++) {
                fn.call(bind, array[i], i, array);
            }
        }

    });

    if (Demo.getData('demo_source') !== 'false') {
        Demo.addEvent(window, 'load', Demo.toggleViewSource);
    } else {
        Demo.toggleViewSourceHTML = Demo.toggleViewSourceHTML.replace('♦ 隐藏', '♢ 显示');
    }

    Demo.addEvent(window, 'load', function () {
        Demo.forEach(Demo.getElementsByClassName('demo-doc'), function (node) {
            Demo.forEach(node.getElementsByTagName('*'), function (node) {
                node.className += ' demo';
            });
        });
    });

    if (eval("!-[1,]")) Demo.forEach('article section header footer nav aside details summary menu'.split(' '), function (tagName) {
        document.createElement(tagName);
    });

    apply(assert, {

        /**
         * 确认 2 个值是一致的。
         */
        areEqual: function (value1, value2) {
            return assert(areEqual(value1, value2), "断言失败。应该返回 ", value2, ", 现在返回", value1);
        },

        notEqual: function (value1, value2) {
            return assert(!areEqual(value1, value2), "断言失败。不应该返回 ", value2);
        },

        isTrue: function (value, msg) {
            return assert(value, "断言失败。 ", msg || "");
        },

        isFalse: function (value, msg) {
            return assert(!value, "断言失败。", msg || "");
        },

        inRangeOf: function (value, left, right) {
            return assert(value >= left && value < right, "断言失败。应该在值", left, "和", right, "之间，现在返回", value);
        },

        log: function (value) {
            return assert._log += value;
        },

        reset: function () {
            assert.hasError = null;
        },

        clearLog: function () {
            assert._log = '';
        },

        logged: function (value) {
            return assert(areEqual(value, assert._log), "断言失败。应该输出 ", value, ", 现在是", assert._log);
        }

    });

    function assert(bValue, msg) {
        if (!bValue) {
            assert.hasError = true;
            if (console.error.apply) {
                console.error.apply(console, [].slice.call(arguments, 1));
            } else {
                console.error([].slice.call(arguments, 1).join('     '));
            }
        } else {
            assert.hasError = false;
        }
    }

    function areEqual(value1, value2) {
        if (value1 === value2) return true;

        if (value1 && typeof value1 === 'object' && value2 && typeof value2 === 'object') {

            if (value1.length === value2.length && typeof value1.length === 'number') {
                for (var i = value1.length; i--;) {
                    if (!areEqual(value1[i], value2[i])) return false;
                }

                return true;
            }

            for (var i in value1) {
                if (!areEqual(value1[i], value2[i])) return false;
            }

            for (var i in value2) {
                if (!areEqual(value2[i], value1[i])) return false;
            }

            return true;

        }

        return false;
    }

    function complieTestCase(info, name) {
        var ret = [];

        for (var test in info) {
            ret.push(test.replace(/~/g, name));
        }

        return new Function(ret.join(';'));
    }

    function runTestCase(info, name) {
        var fn, ret;

        for (var test in info) {
            assert.clearLog();

            test = test.replace(/~/g, name);

            try {
                ret = eval(test);
            } catch (e) {
                reportError(name, e.message, test);
                continue;
            }

            console.info('[' + name + '] ', test, ' =>', ret);

            if (info[test] !== '-') {
                if (typeof info[test] !== 'function') {
                    assert.areEqual(ret, info[test]);
                } else if (info[test].call(ret, ret) === false) {
                    assert.hasError = true;
                }
            }

        }
    }

    function reportError(name, message, debugInfo) {
        assert.hasError = true;

        console.error('[' + name + '] ', debugInfo, '=>', message);
    }

    function apply(dest, src) {
        for (var i in src) {
            dest[i] = src[i];
        }

    }

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
            in_array: function (what, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (what === arr[i]) {
                        return true;
                    }
                }
                return false;
            }
        },

        getContent: function () { //function to capture regular content between tags
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

        getScript: function () { //get the full content of a script to pass to js_beautify
            var chart = '';
            var content = [];
            var reg_match = new RegExp('\<\/script' + '\>', 'igm');
            reg_match.lastIndex = this.pos;
            var reg_array = reg_match.exec(this.input);
            var endScript = reg_array ? reg_array.index : this.input.length; //absolute end of script
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

        recordTag: function (tag) { //function to record a tag and its parent in this.tags Object
            if (this.tags[tag + 'count']) { //check for the existence of this tag type
                this.tags[tag + 'count']++;
                this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
            } else { //otherwise initialize this tag type
                this.tags[tag + 'count'] = 1;
                this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
            }
            this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
            this.tags.parent = tag + this.tags[tag + 'count']; //and make this the forEach parent (i.e. in the case of a div 'div1')
        },

        retrieveTag: function (tag) { //function to retrieve the opening tag to the corresponding closer
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
                    this.tags.parent = this.tags[temp_parent + 'parent']; //and set the forEach parent
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
        getTag: function () { //function to get a full tag and parse its type
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
            } while (chart !== '>');

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
        getUnformatted: function (delimiter, origTag) { //function to return unformatted content in its entirety
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

            } while (content.indexOf(delimiter) == -1);
            return content;
        },
        getToken: function () { //initial handler for token-retrieval
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

        printer: function (jsSource, indentCharacter, indentSize, maxChar) { //handles input/output and some other printing functions
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

        printNewline: function (ignore, arr) {
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

        printToken: function (text) {
            this.output.push(text);
        },

        indent: function () {
            this.indent_level++;
        },

        unindent: function () {
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

    /*jslint onevar: false, plusplus: false */
    /*

 JS Beautifier
---------------


  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>

  You are free to use this in any way you want, in case you find this useful or working for you.

  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          — indentation size,
    indent_char (default space)      — character to indent with,
    preserve_newlines (default true) — whether existing line breaks should be preserved,
    preserve_max_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) — if true, then jslint-stricter mode is enforced.

            jslint_happy   !jslint_happy
            ---------------------------------
             function ()      function()

    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "expand-strict"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.

            expand-strict: put brace on own line even in such cases:

                var a =
                {
                    a: 5,
                    b: 6
                }
            This mode may break your scripts - e.g "return { a: 1 }" will be broken into two lines, so beware.

    space_before_conditional: should the space before conditional statement be added, "if(true)" vs "if (true)"

    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });


*/



    function js_beautify(js_source_text, options) {

        var input, output, token_text, last_type, last_text, last_last_text, last_word, flags, flag_store, indent_string;
        var whitespace, wordchar, punct, parser_pos, line_starters, digits;
        var prefix, token_type, do_block_just_closed;
        var wanted_newline, just_added_newline, n_newlines;
        var preindent_string = '';


        // Some interpreters have unexpected results with foo = baz || bar;
        options = options ? options : {};

        var opt_brace_style;

        // compatibility
        if (options.space_after_anon_function !== undefined && options.jslint_happy === undefined) {
            options.jslint_happy = options.space_after_anon_function;
        }
        if (options.braces_on_own_line !== undefined) { //graceful handling of deprecated option
            opt_brace_style = options.braces_on_own_line ? "expand" : "collapse";
        }
        opt_brace_style = options.brace_style ? options.brace_style : (opt_brace_style ? opt_brace_style : "collapse");


        var opt_indent_size = options.indent_size ? options.indent_size : 4;
        var opt_indent_char = options.indent_char ? options.indent_char : ' ';
        var opt_preserve_newlines = typeof options.preserve_newlines === 'undefined' ? true : options.preserve_newlines;
        var opt_max_preserve_newlines = typeof options.max_preserve_newlines === 'undefined' ? false : options.max_preserve_newlines;
        var opt_jslint_happy = options.jslint_happy === 'undefined' ? false : options.jslint_happy;
        var opt_keep_array_indentation = typeof options.keep_array_indentation === 'undefined' ? false : options.keep_array_indentation;
        var opt_space_before_conditional = typeof options.space_before_conditional === 'undefined' ? true : options.space_before_conditional;
        var opt_indent_case = typeof options.indent_case === 'undefined' ? false : options.indent_case;

        just_added_newline = false;

        // cache the source's length.
        var input_length = js_source_text.length;

        function trim_output(eat_newlines) {
            eat_newlines = typeof eat_newlines === 'undefined' ? false : eat_newlines;
            while (output.length && (output[output.length - 1] === ' ' || output[output.length - 1] === indent_string || output[output.length - 1] === preindent_string || (eat_newlines && (output[output.length - 1] === '\n' || output[output.length - 1] === '\r')))) {
                output.pop();
            }
        }

        function trim(s) {
            return s.replace(/^\s\s*|\s\s*$/, '');
        }

        function force_newline() {
            var old_keep_array_indentation = opt_keep_array_indentation;
            opt_keep_array_indentation = false;
            print_newline()
            opt_keep_array_indentation = old_keep_array_indentation;
        }

        function print_newline(ignore_repeated) {

            flags.eat_next_space = false;
            if (opt_keep_array_indentation && is_array(flags.mode)) {
                return;
            }

            ignore_repeated = typeof ignore_repeated === 'undefined' ? true : ignore_repeated;

            flags.if_line = false;
            trim_output();

            if (!output.length) {
                return; // no newline on start of file
            }

            if (output[output.length - 1] !== "\n" || !ignore_repeated) {
                just_added_newline = true;
                output.push("\n");
            }
            if (preindent_string) {
                output.push(preindent_string);
            }
            for (var i = 0; i < flags.indentation_level; i += 1) {
                output.push(indent_string);
            }
            if (flags.var_line && flags.var_line_reindented) {
                output.push(indent_string); // skip space-stuffing, if indenting with a tab
            }
            if (flags.case_body) {
                output.push(indent_string);
            }
        }



        function print_single_space() {

            if (last_type === 'TK_COMMENT') {
                // no you will not print just a space after a comment
                return print_newline(true);
            }

            if (flags.eat_next_space) {
                flags.eat_next_space = false;
                return;
            }
            var last_output = ' ';
            if (output.length) {
                last_output = output[output.length - 1];
            }
            if (last_output !== ' ' && last_output !== '\n' && last_output !== indent_string) { // prevent occassional duplicate space
                output.push(' ');
            }
        }


        function print_token() {
            just_added_newline = false;
            flags.eat_next_space = false;
            output.push(token_text);
        }

        function indent() {
            flags.indentation_level += 1;
        }


        function remove_indent() {
            if (output.length && output[output.length - 1] === indent_string) {
                output.pop();
            }
        }

        function set_mode(mode) {
            if (flags) {
                flag_store.push(flags);
            }
            flags = {
                previous_mode: flags ? flags.mode : 'BLOCK',
                mode: mode,
                var_line: false,
                var_line_tainted: false,
                var_line_reindented: false,
                in_html_comment: false,
                if_line: false,
                in_case: false,
                case_body: false,
                eat_next_space: false,
                indentation_baseline: -1,
                indentation_level: (flags ? flags.indentation_level + (flags.case_body ? 1 : 0) + ((flags.var_line && flags.var_line_reindented) ? 1 : 0) : 0),
                ternary_depth: 0
            };
        }

        function is_array(mode) {
            return mode === '[EXPRESSION]' || mode === '[INDENTED-EXPRESSION]';
        }

        function is_expression(mode) {
            return in_array(mode, ['[EXPRESSION]', '(EXPRESSION)', '(FOR-EXPRESSION)', '(COND-EXPRESSION)']);
        }

        function restore_mode() {
            do_block_just_closed = flags.mode === 'DO_BLOCK';
            if (flag_store.length > 0) {
                var mode = flags.mode;
                flags = flag_store.pop();
                flags.previous_mode = mode;
            }
        }

        function all_lines_start_with(lines, c) {
            for (var i = 0; i < lines.length; i++) {
                if (trim(lines[i])[0] != c) {
                    return false;
                }
            }
            return true;
        }

        function is_special_word(word) {
            return in_array(word, ['case', 'return', 'do', 'if', 'throw', 'else']);
        }

        function in_array(what, arr) {
            for (var i = 0; i < arr.length; i += 1) {
                if (arr[i] === what) {
                    return true;
                }
            }
            return false;
        }

        function look_up(exclude) {
            var local_pos = parser_pos;
            var c = input.charAt(local_pos);
            while (in_array(c, whitespace) && c != exclude) {
                local_pos++;
                if (local_pos >= input_length) return 0;
                c = input.charAt(local_pos);
            }
            return c;
        }

        function get_next_token() {
            n_newlines = 0;

            if (parser_pos >= input_length) {
                return ['', 'TK_EOF'];
            }

            wanted_newline = false;

            var c = input.charAt(parser_pos);
            parser_pos += 1;


            var keep_whitespace = opt_keep_array_indentation && is_array(flags.mode);

            if (keep_whitespace) {

                //
                // slight mess to allow nice preservation of array indentation and reindent that correctly
                // first time when we get to the arrays:
                // var a = [
                // ....'something'
                // we make note of whitespace_count = 4 into flags.indentation_baseline
                // so we know that 4 whitespaces in original source match indent_level of reindented source
                //
                // and afterwards, when we get to
                //    'something,
                // .......'something else'
                // we know that this should be indented to indent_level + (7 - indentation_baseline) spaces
                //
                var whitespace_count = 0;

                while (in_array(c, whitespace)) {

                    if (c === "\n") {
                        trim_output();
                        output.push("\n");
                        just_added_newline = true;
                        whitespace_count = 0;
                    } else {
                        if (c === '\t') {
                            whitespace_count += 4;
                        } else if (c === '\r') {
                            // nothing
                        } else {
                            whitespace_count += 1;
                        }
                    }

                    if (parser_pos >= input_length) {
                        return ['', 'TK_EOF'];
                    }

                    c = input.charAt(parser_pos);
                    parser_pos += 1;

                }
                if (flags.indentation_baseline === -1) {
                    flags.indentation_baseline = whitespace_count;
                }

                if (just_added_newline) {
                    var i;
                    for (i = 0; i < flags.indentation_level + 1; i += 1) {
                        output.push(indent_string);
                    }
                    if (flags.indentation_baseline !== -1) {
                        for (i = 0; i < whitespace_count - flags.indentation_baseline; i++) {
                            output.push(' ');
                        }
                    }
                }

            } else {
                while (in_array(c, whitespace)) {

                    if (c === "\n") {
                        n_newlines += ((opt_max_preserve_newlines) ? (n_newlines <= opt_max_preserve_newlines) ? 1 : 0 : 1);
                    }


                    if (parser_pos >= input_length) {
                        return ['', 'TK_EOF'];
                    }

                    c = input.charAt(parser_pos);
                    parser_pos += 1;

                }

                if (opt_preserve_newlines) {
                    if (n_newlines > 1) {
                        for (i = 0; i < n_newlines; i += 1) {
                            print_newline(i === 0);
                            just_added_newline = true;
                        }
                    }
                }
                wanted_newline = n_newlines > 0;
            }


            if (in_array(c, wordchar)) {
                if (parser_pos < input_length) {
                    while (in_array(input.charAt(parser_pos), wordchar)) {
                        c += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos === input_length) {
                            break;
                        }
                    }
                }

                // small and surprisingly unugly hack for 1E-10 representation
                if (parser_pos !== input_length && c.match(/^[0-9]+[Ee]$/) && (input.charAt(parser_pos) === '-' || input.charAt(parser_pos) === '+')) {

                    var sign = input.charAt(parser_pos);
                    parser_pos += 1;

                    var t = get_next_token(parser_pos);
                    c += sign + t[0];
                    return [c, 'TK_WORD'];
                }

                if (c === 'in') { // hack for 'in' operator
                    return [c, 'TK_OPERATOR'];
                }
                if (wanted_newline && last_type !== 'TK_OPERATOR' && last_type !== 'TK_EQUALS' && !flags.if_line && (opt_preserve_newlines || last_text !== 'var')) {
                    print_newline();
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
                return [c, 'TK_SEMICOLON'];
            }

            if (c === '/') {
                var comment = '';
                // peek for comment /* ... */
                var inline_comment = true;
                if (input.charAt(parser_pos) === '*') {
                    parser_pos += 1;
                    if (parser_pos < input_length) {
                        while (!(input.charAt(parser_pos) === '*' && input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === '/') && parser_pos < input_length) {
                            c = input.charAt(parser_pos);
                            comment += c;
                            if (c === '\x0d' || c === '\x0a') {
                                inline_comment = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                break;
                            }
                        }
                    }
                    parser_pos += 2;
                    if (inline_comment && n_newlines == 0) {
                        return ['/*' + comment + '*/', 'TK_INLINE_COMMENT'];
                    } else {
                        return ['/*' + comment + '*/', 'TK_BLOCK_COMMENT'];
                    }
                }
                // peek for comment // ...
                if (input.charAt(parser_pos) === '/') {
                    comment = c;
                    while (input.charAt(parser_pos) !== '\r' && input.charAt(parser_pos) !== '\n') {
                        comment += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
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
            (c === '/' && ((last_type === 'TK_WORD' && is_special_word(last_text)) || (last_text === ')' && in_array(flags.previous_mode, ['(COND-EXPRESSION)', '(FOR-EXPRESSION)'])) || (last_type === 'TK_COMMENT' || last_type === 'TK_START_EXPR' || last_type === 'TK_START_BLOCK' || last_type === 'TK_END_BLOCK' || last_type === 'TK_OPERATOR' || last_type === 'TK_EQUALS' || last_type === 'TK_EOF' || last_type === 'TK_SEMICOLON')))) { // regexp
                var sep = c;
                var esc = false;
                var resulting_string = c;

                if (parser_pos < input_length) {
                    if (sep === '/') {
                        //
                        // handle regexp separately...
                        //
                        var in_char_class = false;
                        while (esc || in_char_class || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (!esc) {
                                esc = input.charAt(parser_pos) === '\\';
                                if (input.charAt(parser_pos) === '[') {
                                    in_char_class = true;
                                } else if (input.charAt(parser_pos) === ']') {
                                    in_char_class = false;
                                }
                            } else {
                                esc = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }

                    } else {
                        //
                        // and handle string also separately
                        //
                        while (esc || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (!esc) {
                                esc = input.charAt(parser_pos) === '\\';
                            } else {
                                esc = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }
                    }



                }

                parser_pos += 1;

                resulting_string += sep;

                if (sep === '/') {
                    // regexps may have modifiers /regexp/MOD , so fetch those, too
                    while (parser_pos < input_length && in_array(input.charAt(parser_pos), wordchar)) {
                        resulting_string += input.charAt(parser_pos);
                        parser_pos += 1;
                    }
                }
                return [resulting_string, 'TK_STRING'];
            }

            if (c === '#') {


                if (output.length === 0 && input.charAt(parser_pos) === '!') {
                    // shebang
                    resulting_string = c;
                    while (parser_pos < input_length && c != '\n') {
                        c = input.charAt(parser_pos);
                        resulting_string += c;
                        parser_pos += 1;
                    }
                    output.push(trim(resulting_string) + '\n');
                    print_newline();
                    return get_next_token();
                }



                // Spidermonkey-specific sharp variables for circular references
                // https://developer.mozilla.org/En/Sharp_variables_in_JavaScript
                // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
                var sharp = '#';
                if (parser_pos < input_length && in_array(input.charAt(parser_pos), digits)) {
                    do {
                        c = input.charAt(parser_pos);
                        sharp += c;
                        parser_pos += 1;
                    } while (parser_pos < input_length && c !== '#' && c !== '=');
                    if (c === '#') {
                        //
                    } else if (input.charAt(parser_pos) === '[' && input.charAt(parser_pos + 1) === ']') {
                        sharp += '[]';
                        parser_pos += 2;
                    } else if (input.charAt(parser_pos) === '{' && input.charAt(parser_pos + 1) === '}') {
                        sharp += '{}';
                        parser_pos += 2;
                    }
                    return [sharp, 'TK_WORD'];
                }
            }

            if (c === '<' && input.substring(parser_pos - 1, parser_pos + 3) === '<!--') {
                parser_pos += 3;
                c = '<!--';
                while (input[parser_pos] != '\n' && parser_pos < input_length) {
                    c += input[parser_pos];
                    parser_pos++;
                }
                flags.in_html_comment = true;
                return [c, 'TK_COMMENT'];
            }

            if (c === '-' && flags.in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === '-->') {
                flags.in_html_comment = false;
                parser_pos += 2;
                if (wanted_newline) {
                    print_newline();
                }
                return ['-->', 'TK_COMMENT'];
            }

            if (in_array(c, punct)) {
                while (parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct)) {
                    c += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos >= input_length) {
                        break;
                    }
                }

                if (c === '=') {
                    return [c, 'TK_EQUALS'];
                } else {
                    return [c, 'TK_OPERATOR'];
                }
            }

            return [c, 'TK_UNKNOWN'];
        }

        //----------------------------------
        indent_string = '';
        while (opt_indent_size > 0) {
            indent_string += opt_indent_char;
            opt_indent_size -= 1;
        }

        while (js_source_text && (js_source_text[0] === ' ' || js_source_text[0] === '\t')) {
            preindent_string += js_source_text[0];
            js_source_text = js_source_text.substring(1);
        }
        input = js_source_text;

        last_word = ''; // last 'TK_WORD' passed
        last_type = 'TK_START_EXPR'; // last token type
        last_text = ''; // last token text
        last_last_text = ''; // pre-last token text
        output = [];

        do_block_just_closed = false;

        whitespace = "\n\r\t ".split('');
        wordchar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'.split('');
        digits = '0123456789'.split('');

        punct = '+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |= ::';
        punct += ' <%= <% %> <?= <? ?>'; // try to be a good boy and try not to break the markup language identifiers
        punct = punct.split(' ');

        // words which should always start on new line.
        line_starters = 'continue,try,throw,return,var,if,switch,case,default,for,while,break,function'.split(',');

        // states showing if we are currently in expression (i.e. "if" case) - 'EXPRESSION', or in usual block (like, procedure), 'BLOCK'.
        // some formatting depends on that.
        flag_store = [];
        set_mode('BLOCK');

        parser_pos = 0;
        while (true) {
            var t = get_next_token(parser_pos);
            token_text = t[0];
            token_type = t[1];
            if (token_type === 'TK_EOF') {
                break;
            }

            switch (token_type) {

            case 'TK_START_EXPR':

                if (token_text === '[') {

                    if (last_type === 'TK_WORD' || last_text === ')') {
                        // this is array index specifier, break immediately
                        // a[x], fn()[x]
                        if (in_array(last_text, line_starters)) {
                            print_single_space();
                        }
                        set_mode('(EXPRESSION)');
                        print_token();
                        break;
                    }

                    if (flags.mode === '[EXPRESSION]' || flags.mode === '[INDENTED-EXPRESSION]') {
                        if (last_last_text === ']' && last_text === ',') {
                            // ], [ goes to new line
                            if (flags.mode === '[EXPRESSION]') {
                                flags.mode = '[INDENTED-EXPRESSION]';
                                if (!opt_keep_array_indentation) {
                                    indent();
                                }
                            }
                            set_mode('[EXPRESSION]');
                            if (!opt_keep_array_indentation) {
                                print_newline();
                            }
                        } else if (last_text === '[') {
                            if (flags.mode === '[EXPRESSION]') {
                                flags.mode = '[INDENTED-EXPRESSION]';
                                if (!opt_keep_array_indentation) {
                                    indent();
                                }
                            }
                            set_mode('[EXPRESSION]');

                            if (!opt_keep_array_indentation) {
                                print_newline();
                            }
                        } else {
                            set_mode('[EXPRESSION]');
                        }
                    } else {
                        set_mode('[EXPRESSION]');
                    }



                } else {
                    if (last_word === 'for') {
                        set_mode('(FOR-EXPRESSION)');
                    } else if (in_array(last_word, ['if', 'while'])) {
                        set_mode('(COND-EXPRESSION)');
                    } else {
                        set_mode('(EXPRESSION)');
                    }
                }

                if (last_text === ';' || last_type === 'TK_START_BLOCK') {
                    print_newline();
                } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || last_text === '.') {
                    if (wanted_newline) {
                        print_newline();
                    }
                    // do nothing on (( and )( and ][ and ]( and .(
                } else if (last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
                    print_single_space();
                } else if (last_word === 'function' || last_word === 'typeof') {
                    // function() vs function ()
                    if (opt_jslint_happy) {
                        print_single_space();
                    }
                } else if (in_array(last_text, line_starters) || last_text === 'catch') {
                    if (opt_space_before_conditional) {
                        print_single_space();
                    }
                }
                print_token();

                break;

            case 'TK_END_EXPR':
                if (token_text === ']') {
                    if (opt_keep_array_indentation) {
                        if (last_text === '}') {
                            // trim_output();
                            // print_newline(true);
                            remove_indent();
                            print_token();
                            restore_mode();
                            break;
                        }
                    } else {
                        if (flags.mode === '[INDENTED-EXPRESSION]') {
                            if (last_text === ']') {
                                restore_mode();
                                print_newline();
                                print_token();
                                break;
                            }
                        }
                    }
                }
                restore_mode();
                print_token();
                break;

            case 'TK_START_BLOCK':

                if (last_word === 'do') {
                    set_mode('DO_BLOCK');
                } else {
                    set_mode('BLOCK');
                }
                if (opt_brace_style == "expand" || opt_brace_style == "expand-strict") {
                    var empty_braces = false;
                    if (opt_brace_style == "expand-strict") {
                        empty_braces = (look_up() == '}');
                        if (!empty_braces) {
                            print_newline(true);
                        }
                    } else {
                        if (last_type !== 'TK_OPERATOR') {
                            if (last_text === '=' || (is_special_word(last_text) && last_text !== 'else')) {
                                print_single_space();
                            } else {
                                print_newline(true);
                            }
                        }
                    }
                    print_token();
                    if (!empty_braces) indent();
                } else {
                    if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
                        if (last_type === 'TK_START_BLOCK') {
                            print_newline();
                        } else {
                            print_single_space();
                        }
                    } else {
                        // if TK_OPERATOR or TK_START_EXPR
                        if (is_array(flags.previous_mode) && last_text === ',') {
                            if (last_last_text === '}') {
                                // }, { in array context
                                print_single_space();
                            } else {
                                print_newline(); // [a, b, c, {
                            }
                        }
                    }
                    indent();
                    print_token();
                }

                break;

            case 'TK_END_BLOCK':
                restore_mode();
                if (opt_brace_style == "expand" || opt_brace_style == "expand-strict") {
                    if (last_text !== '{') {
                        print_newline();
                    }
                    print_token();
                } else {
                    if (last_type === 'TK_START_BLOCK') {
                        // nothing
                        if (just_added_newline) {
                            remove_indent();
                        } else {
                            // {}
                            trim_output();
                        }
                    } else {
                        if (is_array(flags.mode) && opt_keep_array_indentation) {
                            // we REALLY need a newline here, but newliner would skip that
                            opt_keep_array_indentation = false;
                            print_newline();
                            opt_keep_array_indentation = true;

                        } else {
                            print_newline();
                        }
                    }
                    print_token();
                }
                break;

            case 'TK_WORD':

                // no, it's not you. even I have problems understanding how this works
                // and what does what.
                if (do_block_just_closed) {
                    // do {} ## while ()
                    print_single_space();
                    print_token();
                    print_single_space();
                    do_block_just_closed = false;
                    break;
                }

                if (token_text === 'function') {
                    if (flags.var_line) {
                        flags.var_line_reindented = true;
                    }
                    if ((just_added_newline || last_text === ';') && last_text !== '{' && last_type != 'TK_BLOCK_COMMENT' && last_type != 'TK_COMMENT') {
                        // make sure there is a nice clean space of at least one blank line
                        // before a new function definition
                        n_newlines = just_added_newline ? n_newlines : 0;
                        if (!opt_preserve_newlines) {
                            n_newlines = 1;
                        }

                        for (var i = 0; i < 2 - n_newlines; i++) {
                            print_newline(false);
                        }
                    }
                }

                if (token_text === 'case' || token_text === 'default') {
                    if (last_text === ':' || flags.case_body) {
                        // switch cases following one another
                        remove_indent();
                    } else {
                        // case statement starts in the same line where switch
                        if (!opt_indent_case) flags.indentation_level--;
                        print_newline();
                        if (!opt_indent_case) flags.indentation_level++;
                    }
                    print_token();
                    flags.in_case = true;
                    flags.case_body = false;
                    break;
                }

                prefix = 'NONE';

                if (last_type === 'TK_END_BLOCK') {

                    if (!in_array(token_text.toLowerCase(), ['else', 'catch', 'finally'])) {
                        prefix = 'NEWLINE';
                    } else {
                        if (opt_brace_style == "expand" || opt_brace_style == "end-expand" || opt_brace_style == "expand-strict") {
                            prefix = 'NEWLINE';
                        } else {
                            prefix = 'SPACE';
                            print_single_space();
                        }
                    }
                } else if (last_type === 'TK_SEMICOLON' && (flags.mode === 'BLOCK' || flags.mode === 'DO_BLOCK')) {
                    prefix = 'NEWLINE';
                } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
                    prefix = 'SPACE';
                } else if (last_type === 'TK_STRING') {
                    prefix = 'NEWLINE';
                } else if (last_type === 'TK_WORD') {
                    if (last_text === 'else') {
                        // eat newlines between ...else *** some_op...
                        // won't preserve extra newlines in this place (if any), but don't care that much
                        trim_output(true);
                    }
                    prefix = 'SPACE';
                } else if (last_type === 'TK_START_BLOCK') {
                    prefix = 'NEWLINE';
                } else if (last_type === 'TK_END_EXPR') {
                    print_single_space();
                    prefix = 'NEWLINE';
                }

                if (in_array(token_text, line_starters) && last_text !== ')') {
                    if (last_text == 'else') {
                        prefix = 'SPACE';
                    } else {
                        prefix = 'NEWLINE';
                    }

                    if (token_text === 'function' && (last_text === 'get' || last_text === 'set')) {
                        prefix = 'SPACE';
                    }
                }

                if (flags.if_line && last_type === 'TK_END_EXPR') {
                    flags.if_line = false;
                }
                if (in_array(token_text.toLowerCase(), ['else', 'catch', 'finally'])) {
                    if (last_type !== 'TK_END_BLOCK' || opt_brace_style == "expand" || opt_brace_style == "end-expand" || opt_brace_style == "expand-strict") {
                        print_newline();
                    } else {
                        trim_output(true);
                        print_single_space();
                    }
                } else if (prefix === 'NEWLINE') {
                    if ((last_type === 'TK_START_EXPR' || last_text === '=' || last_text === ',') && token_text === 'function') {
                        // no need to force newline on 'function': (function
                        // DONOTHING
                    } else if (token_text === 'function' && last_text == 'new') {
                        print_single_space();
                    } else if (is_special_word(last_text)) {
                        // no newline between 'return nnn'
                        print_single_space();
                    } else if (last_type !== 'TK_END_EXPR') {
                        if ((last_type !== 'TK_START_EXPR' || token_text !== 'var') && last_text !== ':') {
                            // no need to force newline on 'var': for (var x = 0...)
                            if (token_text === 'if' && last_word === 'else' && last_text !== '{') {
                                // no newline for } else if {
                                print_single_space();
                            } else {
                                flags.var_line = false;
                                flags.var_line_reindented = false;
                                print_newline();
                            }
                        }
                    } else if (in_array(token_text, line_starters) && last_text != ')') {
                        flags.var_line = false;
                        flags.var_line_reindented = false;
                        print_newline();
                    }
                } else if (is_array(flags.mode) && last_text === ',' && last_last_text === '}') {
                    print_newline(); // }, in lists get a newline treatment
                } else if (prefix === 'SPACE') {
                    print_single_space();
                }
                print_token();
                last_word = token_text;

                if (token_text === 'var') {
                    flags.var_line = true;
                    flags.var_line_reindented = false;
                    flags.var_line_tainted = false;
                }

                if (token_text === 'if') {
                    flags.if_line = true;
                }
                if (token_text === 'else') {
                    flags.if_line = false;
                }

                break;

            case 'TK_SEMICOLON':

                print_token();
                flags.var_line = false;
                flags.var_line_reindented = false;
                if (flags.mode == 'OBJECT') {
                    // OBJECT mode is weird and doesn't get reset too well.
                    flags.mode = 'BLOCK';
                }
                break;

            case 'TK_STRING':

                if (last_type === 'TK_END_EXPR' && in_array(flags.previous_mode, ['(COND-EXPRESSION)', '(FOR-EXPRESSION)'])) {
                    print_single_space();
                } else if (last_type == 'TK_STRING' || last_type === 'TK_START_BLOCK' || last_type === 'TK_END_BLOCK' || last_type === 'TK_SEMICOLON') {
                    print_newline();
                } else if (last_type === 'TK_WORD') {
                    print_single_space();
                }
                print_token();
                break;

            case 'TK_EQUALS':
                if (flags.var_line) {
                    // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
                    flags.var_line_tainted = true;
                }
                print_single_space();
                print_token();
                print_single_space();
                break;

            case 'TK_OPERATOR':

                var space_before = true;
                var space_after = true;

                if (flags.var_line && token_text === ',' && (is_expression(flags.mode))) {
                    // do not break on comma, for(var a = 1, b = 2)
                    flags.var_line_tainted = false;
                }

                if (flags.var_line) {
                    if (token_text === ',') {
                        if (flags.var_line_tainted) {
                            print_token();
                            flags.var_line_reindented = true;
                            flags.var_line_tainted = false;
                            print_newline();
                            break;
                        } else {
                            flags.var_line_tainted = false;
                        }
                        // } else if (token_text === ':') {
                        // hmm, when does this happen? tests don't catch this
                        // flags.var_line = false;
                    }
                }

                if (is_special_word(last_text)) {
                    // "return" had a special handling in TK_WORD. Now we need to return the favor
                    print_single_space();
                    print_token();
                    break;
                }

                if (token_text === ':' && flags.in_case) {
                    if (opt_indent_case) flags.case_body = true;
                    print_token(); // colon really asks for separate treatment
                    print_newline();
                    flags.in_case = false;
                    break;
                }

                if (token_text === '::') {
                    // no spaces around exotic namespacing syntax operator
                    print_token();
                    break;
                }

                if (token_text === ',') {
                    if (flags.var_line) {
                        if (flags.var_line_tainted) {
                            print_token();
                            print_newline();
                            flags.var_line_tainted = false;
                        } else {
                            print_token();
                            print_single_space();
                        }
                    } else if (last_type === 'TK_END_BLOCK' && flags.mode !== "(EXPRESSION)") {
                        print_token();
                        if (flags.mode === 'OBJECT' && last_text === '}') {
                            print_newline();
                        } else {
                            print_single_space();
                        }
                    } else {
                        if (flags.mode === 'OBJECT') {
                            print_token();
                            print_newline();
                        } else {
                            // EXPR or DO_BLOCK
                            print_token();
                            print_single_space();
                        }
                    }
                    break;
                    // } else if (in_array(token_text, ['--', '++', '!']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS']) || in_array(last_text, line_starters) || in_array(last_text, ['==', '!=', '+=', '-=', '*=', '/=', '+', '-'])))) {
                } else if (in_array(token_text, ['--', '++', '!']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(last_text, line_starters)))) {
                    // unary operators (and binary +/- pretending to be unary) special cases
                    space_before = false;
                    space_after = false;

                    if (last_text === ';' && is_expression(flags.mode)) {
                        // for (;; ++i)
                        //        ^^^
                        space_before = true;
                    }
                    if (last_type === 'TK_WORD' && in_array(last_text, line_starters)) {
                        space_before = true;
                    }

                    if (flags.mode === 'BLOCK' && (last_text === '{' || last_text === ';')) {
                        // { foo; --i }
                        // foo(); --bar;
                        print_newline();
                    }
                } else if (token_text === '.') {
                    // decimal digits or object.property
                    space_before = false;

                } else if (token_text === ':') {
                    if (flags.ternary_depth == 0) {
                        flags.mode = 'OBJECT';
                        space_before = false;
                    } else {
                        flags.ternary_depth -= 1;
                    }
                } else if (token_text === '?') {
                    flags.ternary_depth += 1;
                }
                if (space_before) {
                    print_single_space();
                }

                print_token();

                if (space_after) {
                    print_single_space();
                }

                if (token_text === '!') {
                    // flags.eat_next_space = true;
                }

                break;

            case 'TK_BLOCK_COMMENT':

                var lines = token_text.split(/\x0a|\x0d\x0a/);

                if (all_lines_start_with(lines.slice(1), '*')) {
                    // javadoc: reformat and reindent
                    print_newline();
                    output.push(lines[0]);
                    for (i = 1; i < lines.length; i++) {
                        print_newline();
                        output.push(' ');
                        output.push(trim(lines[i]));
                    }

                } else {

                    // simple block comment: leave intact
                    if (lines.length > 1) {
                        // multiline comment block starts with a new line
                        print_newline();
                    } else {
                        // single-line /* comment */ stays where it is
                        if (last_type === 'TK_END_BLOCK') {
                            print_newline();
                        } else {
                            print_single_space();
                        }

                    }

                    for (i = 0; i < lines.length; i++) {
                        output.push(lines[i]);
                        output.push('\n');
                    }

                }
                if (look_up('\n') != '\n') print_newline();
                break;

            case 'TK_INLINE_COMMENT':
                print_single_space();
                print_token();
                if (is_expression(flags.mode)) {
                    print_single_space();
                } else {
                    force_newline();
                }
                break;

            case 'TK_COMMENT':

                // print_newline();
                if (wanted_newline) {
                    print_newline();
                } else {
                    print_single_space();
                }
                print_token();
                if (look_up('\n') != '\n') force_newline();
                break;

            case 'TK_UNKNOWN':
                if (is_special_word(last_text)) {
                    print_single_space();
                }
                print_token();
                break;
            }

            last_last_text = last_text;
            last_type = token_type;
            last_text = token_text;
        }

        var sweet_code = preindent_string + output.join('').replace(/[\n ]+$/, '');
        return sweet_code;

    }


    // Google Code Pretty
    // Copyright (C) 2006 Google Inc.
    //
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    //
    //      http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.

    /**
     * @fileoverview
     * some functions for browser-side pretty printing of code contained in html.
     *
     * <p>
     * For a fairly comprehensive set of languages see the
     * <a href="http://google-code-prettify.googlecode.com/svn/trunk/README.html#langs">README</a>
     * file that came with this source.  At a minimum, the lexer should work on a
     * number of languages including C and friends, Java, Python, Bash, SQL, HTML,
     * XML, CSS, Javascript, and Makefiles.  It works passably on Ruby, PHP and Awk
     * and a subset of Perl, but, because of commenting conventions, doesn't work on
     * Smalltalk, Lisp-like, or CAML-like languages without an explicit lang class.
     * <p>
     * Usage: <ol>
     * <li> include this source file in an html page via
     *   {@code <script type="text/javascript" src="/path/to/prettify.js"></script>}
     * <li> define style rules.  See the example page for examples.
     * <li> mark the {@code <pre>} and {@code <code>} tags in your source with
     *    {@code class=prettyprint.}
     *    You can also use the (html deprecated) {@code <xmp>} tag, but the pretty
     *    printer needs to do more substantial DOM manipulations to support that, so
     *    some css styles may not be preserved.
     * </ol>
     * That's it.  I wanted to keep the API as simple as possible, so there's no
     * need to specify which language the code is in, but if you wish, you can add
     * another class to the {@code <pre>} or {@code <code>} element to specify the
     * language, as in {@code <pre class="prettyprint lang-java">}.  Any class that
     * starts with "lang-" followed by a file extension, specifies the file type.
     * See the "lang-*.js" files in this directory for code that implements
     * per-language file handlers.
     * <p>
     * Change log:<br>
     * cbeust, 2006/08/22
     * <blockquote>
     *   Java annotations (start with "@") are now captured as literals ("lit")
     * </blockquote>
     * @requires console
     */

    // JSLint declarations
    /*global console, document, navigator, setTimeout, window */

    /**
     * Split {@code prettyPrint} into multiple timeouts so as not to interfere with
     * UI events.
     * If set to {@code false}, {@code prettyPrint()} is synchronous.
     */
    window['PR_SHOULD_USE_CONTINUATION'] = true;

    (function () {
        // Keyword lists for various languages.
        // We use things that coerce to strings to make them compact when minified
        // and to defeat aggressive optimizers that fold large string constants.
        var FLOW_CONTROL_KEYWORDS = ["break,continue,do,else,for,if,return,while"];
        var C_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "auto,case,char,const,default," + "double,enum,extern,float,goto,int,long,register,short,signed,sizeof," + "static,struct,switch,typedef,union,unsigned,void,volatile"];
        var COMMON_KEYWORDS = [C_KEYWORDS, "catch,class,delete,false,import," + "new,operator,private,protected,public,this,throw,true,try,typeof"];
        var CPP_KEYWORDS = [COMMON_KEYWORDS, "alignof,align_union,asm,axiom,bool," + "concept,concept_map,const_cast,constexpr,decltype," + "dynamic_cast,explicit,export,friend,inline,late_check," + "mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast," + "template,typeid,typename,using,virtual,where"];
        var JAVA_KEYWORDS = [COMMON_KEYWORDS, "abstract,boolean,byte,extends,final,finally,implements,import," + "instanceof,null,native,package,strictfp,super,synchronized,throws," + "transient"];
        var CSHARP_KEYWORDS = [JAVA_KEYWORDS, "as,base,by,checked,decimal,delegate,descending,dynamic,event," + "fixed,foreach,from,group,implicit,in,interface,internal,into,is,lock," + "object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed," + "stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var"];
        var COFFEE_KEYWORDS = "all,and,by,catch,class,else,extends,false,finally," + "for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then," + "true,try,unless,until,when,while,yes";
        var JSCRIPT_KEYWORDS = [COMMON_KEYWORDS, "debugger,eval,export,function,get,null,set,undefined,var,with," + "Infinity,NaN"];
        var PERL_KEYWORDS = "caller,delete,die,do,dump,elsif,eval,exit,foreach,for," + "goto,if,import,last,local,my,next,no,our,print,package,redo,require," + "sub,undef,unless,until,use,wantarray,while,BEGIN,END";
        var PYTHON_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "and,as,assert,class,def,del," + "elif,except,exec,finally,from,global,import,in,is,lambda," + "nonlocal,not,or,pass,print,raise,try,with,yield," + "False,True,None"];
        var RUBY_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "alias,and,begin,case,class," + "def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo," + "rescue,retry,self,super,then,true,undef,unless,until,when,yield," + "BEGIN,END"];
        var SH_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "case,done,elif,esac,eval,fi," + "function,in,local,set,then,until"];
        var ALL_KEYWORDS = [
        CPP_KEYWORDS, CSHARP_KEYWORDS, JSCRIPT_KEYWORDS, PERL_KEYWORDS + PYTHON_KEYWORDS, RUBY_KEYWORDS, SH_KEYWORDS];
        var C_TYPES = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/;

        // token style names.  correspond to css classes
        /**
         * token style for a string literal
         * @const
         */
        var PR_STRING = 'str';
        /**
         * token style for a keyword
         * @const
         */
        var PR_KEYWORD = 'kwd';
        /**
         * token style for a comment
         * @const
         */
        var PR_COMMENT = 'com';
        /**
         * token style for a type
         * @const
         */
        var PR_TYPE = 'typ';
        /**
         * token style for a literal value.  e.g. 1, null, true.
         * @const
         */
        var PR_LITERAL = 'lit';
        /**
         * token style for a punctuation string.
         * @const
         */
        var PR_PUNCTUATION = 'pun';
        /**
         * token style for a punctuation string.
         * @const
         */
        var PR_PLAIN = 'pln';

        /**
         * token style for an sgml tag.
         * @const
         */
        var PR_TAG = 'tag';
        /**
         * token style for a markup declaration such as a DOCTYPE.
         * @const
         */
        var PR_DECLARATION = 'dec';
        /**
         * token style for embedded source.
         * @const
         */
        var PR_SOURCE = 'src';
        /**
         * token style for an sgml attribute name.
         * @const
         */
        var PR_ATTRIB_NAME = 'atn';
        /**
         * token style for an sgml attribute value.
         * @const
         */
        var PR_ATTRIB_VALUE = 'atv';

        /**
         * A class that indicates a section of markup that is not code, e.g. to allow
         * embedding of line numbers within code listings.
         * @const
         */
        var PR_NOCODE = 'nocode';



        /**
         * A set of tokens that can precede a regular expression literal in
         * javascript
         * http://web.archive.org/web/20070717142515/http://www.mozilla.org/js/language/js20/rationale/syntax.html
         * has the full list, but I've removed ones that might be problematic when
         * seen in languages that don't support regular expression literals.
         *
         * <p>Specifically, I've removed any keywords that can't precede a regexp
         * literal in a syntactically legal javascript program, and I've removed the
         * "in" keyword since it's not a keyword in many languages, and might be used
         * as a count of inches.
         *
         * <p>The link a above does not accurately describe EcmaScript rules since
         * it fails to distinguish between (a=++/b/i) and (a++/b/i) but it works
         * very well in practice.
         *
         * @private
         * @const
         */
        var REGEXP_PRECEDER_PATTERN = '(?:^^\\.?|[+-]|\\!|\\!=|\\!==|\\#|\\%|\\%=|&|&&|&&=|&=|\\(|\\*|\\*=|\\+=|\\,|\\-=|\\->|\\/|\\/=|:|::|\\;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\@|\\[|\\^|\\^=|\\^\\^|\\^\\^=|\\{|\\||\\|=|\\|\\||\\|\\|=|\\~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*';

        // CAVEAT: this does not properly handle the case where a regular
        // expression immediately follows another since a regular expression may
        // have flags for case-sensitivity and the like.  Having regexp tokens
        // adjacent is not valid in any language I'm aware of, so I'm punting.
        // TODO: maybe style special characters inside a regexp as punctuation.

        /**
         * Given a group of {@link RegExp}s, returns a {@code RegExp} that globally
         * matches the union of the sets of strings matched by the input RegExp.
         * Since it matches globally, if the input strings have a start-of-input
         * anchor (/^.../), it is ignored for the purposes of unioning.
         * @param {Array.<RegExp>} regexs non multiline, non-global regexs.
         * @return {RegExp} a global regex.
         */
        function combinePrefixPatterns(regexs) {
            var capturedGroupIndex = 0;

            var needToFoldCase = false;
            var ignoreCase = false;
            for (var i = 0, n = regexs.length; i < n; ++i) {
                var regex = regexs[i];
                if (regex.ignoreCase) {
                    ignoreCase = true;
                } else if (/[a-z]/i.test(regex.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ''))) {
                    needToFoldCase = true;
                    ignoreCase = false;
                    break;
                }
            }

            var escapeCharToCodeUnit = {
                'b': 8,
                't': 9,
                'n': 0xa,
                'v': 0xb,
                'f': 0xc,
                'r': 0xd
            };

            function decodeEscape(charsetPart) {
                var cc0 = charsetPart.charCodeAt(0);
                if (cc0 !== 92 /* \\ */ ) {
                    return cc0;
                }
                var c1 = charsetPart.charAt(1);
                cc0 = escapeCharToCodeUnit[c1];
                if (cc0) {
                    return cc0;
                } else if ('0' <= c1 && c1 <= '7') {
                    return parseInt(charsetPart.substring(1), 8);
                } else if (c1 === 'u' || c1 === 'x') {
                    return parseInt(charsetPart.substring(2), 16);
                } else {
                    return charsetPart.charCodeAt(1);
                }
            }

            function encodeEscape(charCode) {
                if (charCode < 0x20) {
                    return (charCode < 0x10 ? '\\x0' : '\\x') + charCode.toString(16);
                }
                var ch = String.fromCharCode(charCode);
                if (ch === '\\' || ch === '-' || ch === '[' || ch === ']') {
                    ch = '\\' + ch;
                }
                return ch;
            }

            function caseFoldCharset(charSet) {
                var charsetParts = charSet.substring(1, charSet.length - 1).match(
                new RegExp('\\\\u[0-9A-Fa-f]{4}' + '|\\\\x[0-9A-Fa-f]{2}' + '|\\\\[0-3][0-7]{0,2}' + '|\\\\[0-7]{1,2}' + '|\\\\[\\s\\S]' + '|-' + '|[^-\\\\]', 'g'));
                var groups = [];
                var ranges = [];
                var inverse = charsetParts[0] === '^';
                for (var i = inverse ? 1 : 0, n = charsetParts.length; i < n; ++i) {
                    var p = charsetParts[i];
                    if (/\\[bdsw]/i.test(p)) { // Don't muck with named groups.
                        groups.push(p);
                    } else {
                        var start = decodeEscape(p);
                        var end;
                        if (i + 2 < n && '-' === charsetParts[i + 1]) {
                            end = decodeEscape(charsetParts[i + 2]);
                            i += 2;
                        } else {
                            end = start;
                        }
                        ranges.push([start, end]);
                        // If the range might intersect letters, then expand it.
                        // This case handling is too simplistic.
                        // It does not deal with non-latin case folding.
                        // It works for latin source code identifiers though.
                        if (!(end < 65 || start > 122)) {
                            if (!(end < 65 || start > 90)) {
                                ranges.push([Math.max(65, start) | 32, Math.min(end, 90) | 32]);
                            }
                            if (!(end < 97 || start > 122)) {
                                ranges.push([Math.max(97, start) & ~32, Math.min(end, 122) & ~32]);
                            }
                        }
                    }
                }

                // [[1, 10], [3, 4], [8, 12], [14, 14], [16, 16], [17, 17]]
                // -> [[1, 12], [14, 14], [16, 17]]
                ranges.sort(function (a, b) {
                    return (a[0] - b[0]) || (b[1] - a[1]);
                });
                var consolidatedRanges = [];
                var lastRange = [NaN, NaN];
                for (var i = 0; i < ranges.length; ++i) {
                    var range = ranges[i];
                    if (range[0] <= lastRange[1] + 1) {
                        lastRange[1] = Math.max(lastRange[1], range[1]);
                    } else {
                        consolidatedRanges.push(lastRange = range);
                    }
                }

                var out = ['['];
                if (inverse) {
                    out.push('^');
                }
                out.push.apply(out, groups);
                for (var i = 0; i < consolidatedRanges.length; ++i) {
                    var range = consolidatedRanges[i];
                    out.push(encodeEscape(range[0]));
                    if (range[1] > range[0]) {
                        if (range[1] + 1 > range[0]) {
                            out.push('-');
                        }
                        out.push(encodeEscape(range[1]));
                    }
                }
                out.push(']');
                return out.join('');
            }

            function allowAnywhereFoldCaseAndRenumberGroups(regex) {
                // Split into character sets, escape sequences, punctuation strings
                // like ('(', '(?:', ')', '^'), and runs of characters that do not
                // include any of the above.
                var parts = regex.source.match(
                new RegExp('(?:' + '\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]' // a character set
                +
                '|\\\\u[A-Fa-f0-9]{4}' // a unicode escape
                +
                '|\\\\x[A-Fa-f0-9]{2}' // a hex escape
                +
                '|\\\\[0-9]+' // a back-reference or octal escape
                +
                '|\\\\[^ux0-9]' // other escape sequence
                +
                '|\\(\\?[:!=]' // start of a non-capturing group
                +
                '|[\\(\\)\\^]' // start/emd of a group, or line start
                +
                '|[^\\x5B\\x5C\\(\\)\\^]+' // run of other characters
                +
                ')', 'g'));
                var n = parts.length;

                // Maps captured group numbers to the number they will occupy in
                // the output or to -1 if that has not been determined, or to
                // undefined if they need not be capturing in the output.
                var capturedGroups = [];

                // Walk over and identify back references to build the capturedGroups
                // mapping.
                for (var i = 0, groupIndex = 0; i < n; ++i) {
                    var p = parts[i];
                    if (p === '(') {
                        // groups are 1-indexed, so max group index is count of '('
                        ++groupIndex;
                    } else if ('\\' === p.charAt(0)) {
                        var decimalValue = +p.substring(1);
                        if (decimalValue && decimalValue <= groupIndex) {
                            capturedGroups[decimalValue] = -1;
                        }
                    }
                }

                // Renumber groups and reduce capturing groups to non-capturing groups
                // where possible.
                for (var i = 1; i < capturedGroups.length; ++i) {
                    if (-1 === capturedGroups[i]) {
                        capturedGroups[i] = ++capturedGroupIndex;
                    }
                }
                for (var i = 0, groupIndex = 0; i < n; ++i) {
                    var p = parts[i];
                    if (p === '(') {
                        ++groupIndex;
                        if (capturedGroups[groupIndex] === undefined) {
                            parts[i] = '(?:';
                        }
                    } else if ('\\' === p.charAt(0)) {
                        var decimalValue = +p.substring(1);
                        if (decimalValue && decimalValue <= groupIndex) {
                            parts[i] = '\\' + capturedGroups[groupIndex];
                        }
                    }
                }

                // Remove any prefix anchors so that the output will match anywhere.
                // ^^ really does mean an anchored match though.
                for (var i = 0, groupIndex = 0; i < n; ++i) {
                    if ('^' === parts[i] && '^' !== parts[i + 1]) {
                        parts[i] = '';
                    }
                }

                // Expand letters to groups to handle mixing of case-sensitive and
                // case-insensitive patterns if necessary.
                if (regex.ignoreCase && needToFoldCase) {
                    for (var i = 0; i < n; ++i) {
                        var p = parts[i];
                        var ch0 = p.charAt(0);
                        if (p.length >= 2 && ch0 === '[') {
                            parts[i] = caseFoldCharset(p);
                        } else if (ch0 !== '\\') {
                            // TODO: handle letters in numeric escapes.
                            parts[i] = p.replace(/[a-zA-Z]/g, function (ch) {
                                var cc = ch.charCodeAt(0);
                                return '[' + String.fromCharCode(cc & ~32, cc | 32) + ']';
                            });
                        }
                    }
                }

                return parts.join('');
            }

            var rewritten = [];
            for (var i = 0, n = regexs.length; i < n; ++i) {
                var regex = regexs[i];
                if (regex.global || regex.multiline) {
                    throw new Error('' + regex);
                }
                rewritten.push('(?:' + allowAnywhereFoldCaseAndRenumberGroups(regex) + ')');
            }

            return new RegExp(rewritten.join('|'), ignoreCase ? 'gi' : 'g');
        }


        /**
         * Split markup into a string of source code and an array mapping ranges in
         * that string to the text nodes in which they appear.
         *
         * <p>
         * The HTML DOM structure:</p>
         * <pre>
         * (Element   "p"
         *   (Element "b"
         *     (Text  "print "))       ; #1
         *   (Text    "'Hello '")      ; #2
         *   (Element "br")            ; #3
         *   (Text    "  + 'World';")) ; #4
         * </pre>
         * <p>
         * corresponds to the HTML
         * {@code <p><b>print </b>'Hello '<br>  + 'World';</p>}.</p>
         *
         * <p>
         * It will produce the output:</p>
         * <pre>
         * {
         *   sourceCode: "print 'Hello '\n  + 'World';",
         *   //                 1         2
         *   //       012345678901234 5678901234567
         *   spans: [0, #1, 6, #2, 14, #3, 15, #4]
         * }
         * </pre>
         * <p>
         * where #1 is a reference to the {@code "print "} text node above, and so
         * on for the other text nodes.
         * </p>
         *
         * <p>
         * The {@code} spans array is an array of pairs.  Even elements are the start
         * indices of substrings, and odd elements are the text nodes (or BR elements)
         * that contain the text for those substrings.
         * Substrings continue until the next index or the end of the source.
         * </p>
         *
         * @param {Node} node an HTML DOM subtree containing source-code.
         * @return {Object} source code and the text nodes in which they occur.
         */
        function extractSourceSpans(node) {
            var nocode = /(?:^|\s)nocode(?:\s|$)/;

            var chunks = [];
            var length = 0;
            var spans = [];
            var k = 0;

            var whitespace;
            if (node.currentStyle) {
                whitespace = node.currentStyle.whiteSpace;
            } else if (window.getComputedStyle) {
                whitespace = document.defaultView.getComputedStyle(node, null).getPropertyValue('white-space');
            }
            var isPreformatted = whitespace && 'pre' === whitespace.substring(0, 3);

            function walk(node) {
                switch (node.nodeType) {
                case 1:
                    // Element
                    if (nocode.test(node.className)) {
                        return;
                    }
                    for (var child = node.firstChild; child; child = child.nextSibling) {
                        walk(child);
                    }
                    var nodeName = node.nodeName;
                    if ('BR' === nodeName || 'LI' === nodeName) {
                        chunks[k] = '\n';
                        spans[k << 1] = length++;
                        spans[(k++ << 1) | 1] = node;
                    }
                    break;
                case 3:
                case 4:
                    // Text
                    var text = node.nodeValue;
                    if (text.length) {
                        if (!isPreformatted) {
                            text = text.replace(/[ \t\r\n]+/g, ' ');
                        } else {
                            text = text.replace(/\r\n?/g, '\n'); // Normalize newlines.
                        }
                        // TODO: handle tabs here?
                        chunks[k] = text;
                        spans[k << 1] = length;
                        length += text.length;
                        spans[(k++ << 1) | 1] = node;
                    }
                    break;
                }
            }

            walk(node);

            return {
                sourceCode: chunks.join('').replace(/\n$/, ''),
                spans: spans
            };
        }


        /**
         * Apply the given language handler to sourceCode and add the resulting
         * decorations to out.
         * @param {number} basePos the index of sourceCode within the chunk of source
         *    whose decorations are already present on out.
         */
        function appendDecorations(basePos, sourceCode, langHandler, out) {
            if (!sourceCode) {
                return;
            }
            var job = {
                sourceCode: sourceCode,
                basePos: basePos
            };
            langHandler(job);
            out.push.apply(out, job.decorations);
        }

        var notWs = /\S/;

        /**
         * Given an element, if it contains only one child element and any text nodes
         * it contains contain only space characters, return the sole child element.
         * Otherwise returns undefined.
         * <p>
         * This is meant to return the CODE element in {@code <pre><code ...>} when
         * there is a single child element that contains all the non-space textual
         * content, but not to return anything where there are multiple child elements
         * as in {@code <pre><code>...</code><code>...</code></pre>} or when there
         * is textual content.
         */
        function childContentWrapper(element) {
            var wrapper = undefined;
            for (var c = element.firstChild; c; c = c.nextSibling) {
                var type = c.nodeType;
                wrapper = (type === 1) // Element Node
                ?
                (wrapper ? element : c) : (type === 3) // Text Node
                ?
                (notWs.test(c.nodeValue) ? element : wrapper) : wrapper;
            }
            return wrapper === element ? undefined : wrapper;
        }

        /** Given triples of [style, pattern, context] returns a lexing function,
         * The lexing function interprets the patterns to find token boundaries and
         * returns a decoration list of the form
         * [index_0, style_0, index_1, style_1, ..., index_n, style_n]
         * where index_n is an index into the sourceCode, and style_n is a style
         * constant like PR_PLAIN.  index_n-1 <= index_n, and style_n-1 applies to
         * all characters in sourceCode[index_n-1:index_n].
         *
         * The stylePatterns is a list whose elements have the form
         * [style : string, pattern : RegExp, DEPRECATED, shortcut : string].
         *
         * Style is a style constant like PR_PLAIN, or can be a string of the
         * form 'lang-FOO', where FOO is a language extension describing the
         * language of the portion of the token in $1 after pattern executes.
         * E.g., if style is 'lang-lisp', and group 1 contains the text
         * '(hello (world))', then that portion of the token will be passed to the
         * registered lisp handler for formatting.
         * The text before and after group 1 will be restyled using this decorator
         * so decorators should take care that this doesn't result in infinite
         * recursion.  For example, the HTML lexer rule for SCRIPT elements looks
         * something like ['lang-js', /<[s]cript>(.+?)<\/script>/].  This may match
         * '<script>foo()<\/script>', which would cause the current decorator to
         * be called with '<script>' which would not match the same rule since
         * group 1 must not be empty, so it would be instead styled as PR_TAG by
         * the generic tag rule.  The handler registered for the 'js' extension would
         * then be called with 'foo()', and finally, the current decorator would
         * be called with '<\/script>' which would not match the original rule and
         * so the generic tag rule would identify it as a tag.
         *
         * Pattern must only match prefixes, and if it matches a prefix, then that
         * match is considered a token with the same style.
         *
         * Context is applied to the last non-whitespace, non-comment token
         * recognized.
         *
         * Shortcut is an optional string of characters, any of which, if the first
         * character, gurantee that this pattern and only this pattern matches.
         *
         * @param {Array} shortcutStylePatterns patterns that always start with
         *   a known character.  Must have a shortcut string.
         * @param {Array} fallthroughStylePatterns patterns that will be tried in
         *   order if the shortcut ones fail.  May have shortcuts.
         *
         * @return {function (Object)} a
         *   function that takes source code and returns a list of decorations.
         */
        function createSimpleLexer(shortcutStylePatterns, fallthroughStylePatterns) {
            var shortcuts = {};
            var tokenizer;
            (function () {
                var allPatterns = shortcutStylePatterns.concat(fallthroughStylePatterns);
                var allRegexs = [];
                var regexKeys = {};
                for (var i = 0, n = allPatterns.length; i < n; ++i) {
                    var patternParts = allPatterns[i];
                    var shortcutChars = patternParts[3];
                    if (shortcutChars) {
                        for (var c = shortcutChars.length; --c >= 0;) {
                            shortcuts[shortcutChars.charAt(c)] = patternParts;
                        }
                    }
                    var regex = patternParts[1];
                    var k = '' + regex;
                    if (!regexKeys.hasOwnProperty(k)) {
                        allRegexs.push(regex);
                        regexKeys[k] = null;
                    }
                }
                allRegexs.push(/[\0-\uffff]/);
                tokenizer = combinePrefixPatterns(allRegexs);
            })();

            var nPatterns = fallthroughStylePatterns.length;

            /**
             * Lexes job.sourceCode and produces an output array job.decorations of
             * style classes preceded by the position at which they start in
             * job.sourceCode in order.
             *
             * @param {Object} job an object like <pre>{
             *    sourceCode: {string} sourceText plain text,
             *    basePos: {int} position of job.sourceCode in the larger chunk of
             *        sourceCode.
             * }</pre>
             */
            var decorate = function (job) {
                    var sourceCode = job.sourceCode,
                        basePos = job.basePos;
                    /** Even entries are positions in source in ascending order.  Odd enties
                     * are style markers (e.g., PR_COMMENT) that run from that position until
                     * the end.
                     * @type {Array.<number|string>}
                     */
                    var decorations = [basePos, PR_PLAIN];
                    var pos = 0; // index into sourceCode
                    var tokens = sourceCode.match(tokenizer) || [];
                    var styleCache = {};

                    for (var ti = 0, nTokens = tokens.length; ti < nTokens; ++ti) {
                        var token = tokens[ti];
                        var style = styleCache[token];
                        var match = void 0;

                        var isEmbedded;
                        if (typeof style === 'string') {
                            isEmbedded = false;
                        } else {
                            var patternParts = shortcuts[token.charAt(0)];
                            if (patternParts) {
                                match = token.match(patternParts[1]);
                                style = patternParts[0];
                            } else {
                                for (var i = 0; i < nPatterns; ++i) {
                                    patternParts = fallthroughStylePatterns[i];
                                    match = token.match(patternParts[1]);
                                    if (match) {
                                        style = patternParts[0];
                                        break;
                                    }
                                }

                                if (!match) { // make sure that we make progress
                                    style = PR_PLAIN;
                                }
                            }

                            isEmbedded = style.length >= 5 && 'lang-' === style.substring(0, 5);
                            if (isEmbedded && !(match && typeof match[1] === 'string')) {
                                isEmbedded = false;
                                style = PR_SOURCE;
                            }

                            if (!isEmbedded) {
                                styleCache[token] = style;
                            }
                        }

                        var tokenStart = pos;
                        pos += token.length;

                        if (!isEmbedded) {
                            decorations.push(basePos + tokenStart, style);
                        } else { // Treat group 1 as an embedded block of source code.
                            var embeddedSource = match[1];
                            var embeddedSourceStart = token.indexOf(embeddedSource);
                            var embeddedSourceEnd = embeddedSourceStart + embeddedSource.length;
                            if (match[2]) {
                                // If embeddedSource can be blank, then it would match at the
                                // beginning which would cause us to infinitely recurse on the
                                // entire token, so we catch the right context in match[2].
                                embeddedSourceEnd = token.length - match[2].length;
                                embeddedSourceStart = embeddedSourceEnd - embeddedSource.length;
                            }
                            var lang = style.substring(5);
                            // Decorate the left of the embedded source
                            appendDecorations(
                            basePos + tokenStart, token.substring(0, embeddedSourceStart), decorate, decorations);
                            // Decorate the embedded source
                            appendDecorations(
                            basePos + tokenStart + embeddedSourceStart, embeddedSource, langHandlerForExtension(lang, embeddedSource), decorations);
                            // Decorate the right of the embedded section
                            appendDecorations(
                            basePos + tokenStart + embeddedSourceEnd, token.substring(embeddedSourceEnd), decorate, decorations);
                        }
                    }
                    job.decorations = decorations;
                };
            return decorate;
        }

        /** returns a function that produces a list of decorations from source text.
         *
         * This code treats ", ', and ` as string delimiters, and \ as a string
         * escape.  It does not recognize perl's qq() style strings.
         * It has no special handling for double delimiter escapes as in basic, or
         * the tripled delimiters used in python, but should work on those regardless
         * although in those cases a single string literal may be broken up into
         * multiple adjacent string literals.
         *
         * It recognizes C, C++, and shell style comments.
         *
         * @param {Object} options a set of optional parameters.
         * @return {function (Object)} a function that examines the source code
         *     in the input job and builds the decoration list.
         */
        function sourceDecorator(options) {
            var shortcutStylePatterns = [],
                fallthroughStylePatterns = [];
            if (options['tripleQuotedStrings']) {
                // '''multi-line-string''', 'single-line-string', and double-quoted
                shortcutStylePatterns.push(
                [PR_STRING, /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/, null, '\'"']);
            } else if (options['multiLineStrings']) {
                // 'multi-line-string', "multi-line-string"
                shortcutStylePatterns.push(
                [PR_STRING, /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/, null, '\'"`']);
            } else {
                // 'single-line-string', "single-line-string"
                shortcutStylePatterns.push(
                [PR_STRING, /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/, null, '"\'']);
            }
            if (options['verbatimStrings']) {
                // verbatim-string-literal production from the C# grammar.  See issue 93.
                fallthroughStylePatterns.push(
                [PR_STRING, /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]);
            }
            var hc = options['hashComments'];
            if (hc) {
                if (options['cStyleComments']) {
                    if (hc > 1) { // multiline hash comments
                        shortcutStylePatterns.push(
                        [PR_COMMENT, /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, null, '#']);
                    } else {
                        // Stop C preprocessor declarations at an unclosed open comment
                        shortcutStylePatterns.push(
                        [PR_COMMENT, /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\r\n]*)/, null, '#']);
                    }
                    fallthroughStylePatterns.push(
                    [PR_STRING, /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/, null]);
                } else {
                    shortcutStylePatterns.push([PR_COMMENT, /^#[^\r\n]*/, null, '#']);
                }
            }
            if (options['cStyleComments']) {
                fallthroughStylePatterns.push([PR_COMMENT, /^\/\/[^\r\n]*/, null]);
                fallthroughStylePatterns.push(
                [PR_COMMENT, /^\/\*[\s\S]*?(?:\*\/|$)/, null]);
            }
            if (options['regexLiterals']) {
                /**
                 * @const
                 */
                var REGEX_LITERAL = (
                // A regular expression literal starts with a slash that is
                // not followed by * or / so that it is not confused with
                // comments.
                '/(?=[^/*])'
                // and then contains any number of raw characters,
                +
                '(?:[^/\\x5B\\x5C]'
                // escape sequences (\x5C),
                +
                '|\\x5C[\\s\\S]'
                // or non-nesting character sets (\x5B\x5D);
                +
                '|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+'
                // finally closed by a /.
                +
                '/');
                fallthroughStylePatterns.push(
                ['lang-regex', new RegExp('^' + REGEXP_PRECEDER_PATTERN + '(' + REGEX_LITERAL + ')')]);
            }

            var types = options['types'];
            if (types) {
                fallthroughStylePatterns.push([PR_TYPE, types]);
            }

            var keywords = ("" + options['keywords']).replace(/^ | $/g, '');
            if (keywords.length) {
                fallthroughStylePatterns.push(
                [PR_KEYWORD, new RegExp('^(?:' + keywords.replace(/[\s,]+/g, '|') + ')\\b'), null]);
            }

            shortcutStylePatterns.push([PR_PLAIN, /^\s+/, null, ' \r\n\t\xA0']);
            fallthroughStylePatterns.push(
            // TODO(mikesamuel): recognize non-latin letters and numerals in idents
            [PR_LITERAL, /^@[a-z_$][a-z_$@0-9]*/i, null], [PR_TYPE, /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null], [PR_PLAIN, /^[a-z_$][a-z_$@0-9]*/i, null], [PR_LITERAL, new RegExp('^(?:'
            // A hex number
            +
            '0x[a-f0-9]+'
            // or an octal or decimal number,
            +
            '|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)'
            // possibly in scientific notation
            +
            '(?:e[+\\-]?\\d+)?' + ')'
            // with an optional modifier like UL for unsigned long
            +
            '[a-z]*', 'i'), null, '0123456789'],
            // Don't treat escaped quotes in bash as starting strings.  See issue 144.
            [PR_PLAIN, /^\\[\s\S]?/, null], [PR_PUNCTUATION, /^.[^\s\w\.$@\'\"\`\/\#\\]*/, null]);

            return createSimpleLexer(shortcutStylePatterns, fallthroughStylePatterns);
        }

        var decorateSource = sourceDecorator({
            'keywords': ALL_KEYWORDS,
            'hashComments': true,
            'cStyleComments': true,
            'multiLineStrings': true,
            'regexLiterals': true
        });

        /**
         * Given a DOM subtree, wraps it in a list, and puts each line into its own
         * list item.
         *
         * @param {Node} node modified in place.  Its content is pulled into an
         *     HTMLOListElement, and each line is moved into a separate list item.
         *     This requires cloning elements, so the input might not have unique
         *     IDs after numbering.
         */
        function numberLines(node, opt_startLineNum) {
            var nocode = /(?:^|\s)nocode(?:\s|$)/;
            var lineBreak = /\r\n?|\n/;

            var document = node.ownerDocument;

            var whitespace;
            if (node.currentStyle) {
                whitespace = node.currentStyle.whiteSpace;
            } else if (window.getComputedStyle) {
                whitespace = document.defaultView.getComputedStyle(node, null).getPropertyValue('white-space');
            }
            // If it's preformatted, then we need to split lines on line breaks
            // in addition to <BR>s.
            var isPreformatted = whitespace && 'pre' === whitespace.substring(0, 3);

            var li = document.createElement('LI');
            while (node.firstChild) {
                li.appendChild(node.firstChild);
            }
            // An array of lines.  We split below, so this is initialized to one
            // un-split line.
            var listItems = [li];

            function walk(node) {
                switch (node.nodeType) {
                case 1:
                    // Element
                    if (nocode.test(node.className)) {
                        break;
                    }
                    if ('BR' === node.nodeName) {
                        breakAfter(node);
                        // Discard the <BR> since it is now flush against a </LI>.
                        if (node.parentNode) {
                            node.parentNode.removeChild(node);
                        }
                    } else {
                        for (var child = node.firstChild; child; child = child.nextSibling) {
                            walk(child);
                        }
                    }
                    break;
                case 3:
                case 4:
                    // Text
                    if (isPreformatted) {
                        var text = node.nodeValue;
                        var match = text.match(lineBreak);
                        if (match) {
                            var firstLine = text.substring(0, match.index);
                            node.nodeValue = firstLine;
                            var tail = text.substring(match.index + match[0].length);
                            if (tail) {
                                var parent = node.parentNode;
                                parent.insertBefore(
                                document.createTextNode(tail), node.nextSibling);
                            }
                            breakAfter(node);
                            if (!firstLine) {
                                // Don't leave blank text nodes in the DOM.
                                node.parentNode.removeChild(node);
                            }
                        }
                    }
                    break;
                }
            }

            // Split a line after the given node.
            function breakAfter(lineEndNode) {
                // If there's nothing to the right, then we can skip ending the line
                // here, and move root-wards since splitting just before an end-tag
                // would require us to create a bunch of empty copies.
                while (!lineEndNode.nextSibling) {
                    lineEndNode = lineEndNode.parentNode;
                    if (!lineEndNode) {
                        return;
                    }
                }

                function breakLeftOf(limit, copy) {
                    // Clone shallowly if this node needs to be on both sides of the break.
                    var rightSide = copy ? limit.cloneNode(false) : limit;
                    var parent = limit.parentNode;
                    if (parent) {
                        // We clone the parent chain.
                        // This helps us resurrect important styling elements that cross lines.
                        // E.g. in <i>Foo<br>Bar</i>
                        // should be rewritten to <li><i>Foo</i></li><li><i>Bar</i></li>.
                        var parentClone = breakLeftOf(parent, 1);
                        // Move the clone and everything to the right of the original
                        // onto the cloned parent.
                        var next = limit.nextSibling;
                        parentClone.appendChild(rightSide);
                        for (var sibling = next; sibling; sibling = next) {
                            next = sibling.nextSibling;
                            parentClone.appendChild(sibling);
                        }
                    }
                    return rightSide;
                }

                var copiedListItem = breakLeftOf(lineEndNode.nextSibling, 0);

                // Walk the parent chain until we reach an unattached LI.
                for (var parent;
                // Check nodeType since IE invents document fragments.
                (parent = copiedListItem.parentNode) && parent.nodeType === 1;) {
                    copiedListItem = parent;
                }
                // Put it on the list of lines for later processing.
                listItems.push(copiedListItem);
            }

            // Split lines while there are lines left to split.
            for (var i = 0; // Number of lines that have been split so far.
            i < listItems.length; // length updated by breakAfter calls.
            ++i) {
                walk(listItems[i]);
            }

            // Make sure numeric indices show correctly.
            if (opt_startLineNum === (opt_startLineNum | 0)) {
                listItems[0].setAttribute('value', opt_startLineNum);
            }

            var ol = document.createElement('OL');
            ol.className = 'linenums';
            var offset = Math.max(0, ((opt_startLineNum - 1 /* zero index */ )) | 0) || 0;
            for (var i = 0, n = listItems.length; i < n; ++i) {
                li = listItems[i];
                // Stick a class on the LIs so that stylesheets can
                // color odd/even rows, or any other row pattern that
                // is co-prime with 10.
                li.className = 'L' + ((i + offset) % 10);
                if (!li.firstChild) {
                    li.appendChild(document.createTextNode('\xA0'));
                }
                ol.appendChild(li);
            }

            node.appendChild(ol);
        }

        /**
         * Breaks {@code job.sourceCode} around style boundaries in
         * {@code job.decorations} and modifies {@code job.sourceNode} in place.
         * @param {Object} job like <pre>{
         *    sourceCode: {string} source as plain text,
         *    spans: {Array.<number|Node>} alternating span start indices into source
         *       and the text node or element (e.g. {@code <BR>}) corresponding to that
         *       span.
         *    decorations: {Array.<number|string} an array of style classes preceded
         *       by the position at which they start in job.sourceCode in order
         * }</pre>
         * @private
         */
        function recombineTagsAndDecorations(job) {
            var isIE = /\bMSIE\b/.test(navigator.userAgent);
            var newlineRe = /\n/g;

            var source = job.sourceCode;
            var sourceLength = source.length;
            // Index into source after the last code-unit recombined.
            var sourceIndex = 0;

            var spans = job.spans;
            var nSpans = spans.length;
            // Index into spans after the last span which ends at or before sourceIndex.
            var spanIndex = 0;

            var decorations = job.decorations;
            var nDecorations = decorations.length;
            // Index into decorations after the last decoration which ends at or before
            // sourceIndex.
            var decorationIndex = 0;

            // Remove all zero-length decorations.
            decorations[nDecorations] = sourceLength;
            var decPos, i;
            for (i = decPos = 0; i < nDecorations;) {
                if (decorations[i] !== decorations[i + 2]) {
                    decorations[decPos++] = decorations[i++];
                    decorations[decPos++] = decorations[i++];
                } else {
                    i += 2;
                }
            }
            nDecorations = decPos;

            // Simplify decorations.
            for (i = decPos = 0; i < nDecorations;) {
                var startPos = decorations[i];
                // Conflate all adjacent decorations that use the same style.
                var startDec = decorations[i + 1];
                var end = i + 2;
                while (end + 2 <= nDecorations && decorations[end + 1] === startDec) {
                    end += 2;
                }
                decorations[decPos++] = startPos;
                decorations[decPos++] = startDec;
                i = end;
            }

            nDecorations = decorations.length = decPos;

            var decoration = null;
            while (spanIndex < nSpans) {
                var spanStart = spans[spanIndex];
                var spanEnd = spans[spanIndex + 2] || sourceLength;

                var decStart = decorations[decorationIndex];
                var decEnd = decorations[decorationIndex + 2] || sourceLength;

                var end = Math.min(spanEnd, decEnd);

                var textNode = spans[spanIndex + 1];
                var styledText;
                if (textNode.nodeType !== 1 // Don't muck with <BR>s or <LI>s
                // Don't introduce spans around empty text nodes.
                &&
                (styledText = source.substring(sourceIndex, end))) {
                    // This may seem bizarre, and it is.  Emitting LF on IE causes the
                    // code to display with spaces instead of line breaks.
                    // Emitting Windows standard issue linebreaks (CRLF) causes a blank
                    // space to appear at the beginning of every line but the first.
                    // Emitting an old Mac OS 9 line separator makes everything spiffy.
                    if (isIE) {
                        styledText = styledText.replace(newlineRe, '\r');
                    }
                    textNode.nodeValue = styledText;
                    var document = textNode.ownerDocument;
                    var span = document.createElement('SPAN');
                    span.className = decorations[decorationIndex + 1];
                    var parentNode = textNode.parentNode;
                    parentNode.replaceChild(span, textNode);
                    span.appendChild(textNode);
                    if (sourceIndex < spanEnd) { // Split off a text node.
                        spans[spanIndex + 1] = textNode
                        // TODO: Possibly optimize by using '' if there's no flicker.
                        =
                        document.createTextNode(source.substring(end, spanEnd));
                        parentNode.insertBefore(textNode, span.nextSibling);
                    }
                }

                sourceIndex = end;

                if (sourceIndex >= spanEnd) {
                    spanIndex += 2;
                }
                if (sourceIndex >= decEnd) {
                    decorationIndex += 2;
                }
            }
        }


        /** Maps language-specific file extensions to handlers. */
        var langHandlerRegistry = {};
        /** Register a language handler for the given file extensions.
         * @param {function (Object)} handler a function from source code to a list
         *      of decorations.  Takes a single argument job which describes the
         *      state of the computation.   The single parameter has the form
         *      {@code {
         *        sourceCode: {string} as plain text.
         *        decorations: {Array.<number|string>} an array of style classes
         *                     preceded by the position at which they start in
         *                     job.sourceCode in order.
         *                     The language handler should assigned this field.
         *        basePos: {int} the position of source in the larger source chunk.
         *                 All positions in the output decorations array are relative
         *                 to the larger source chunk.
         *      } }
         * @param {Array.<string>} fileExtensions
         */
        function registerLangHandler(handler, fileExtensions) {
            for (var i = fileExtensions.length; --i >= 0;) {
                var ext = fileExtensions[i];
                if (!langHandlerRegistry.hasOwnProperty(ext)) {
                    langHandlerRegistry[ext] = handler;
                } else if (window['console']) {
                    console['warn']('cannot override language handler %s', ext);
                }
            }
        }

        function langHandlerForExtension(extension, source) {
            if (!(extension && langHandlerRegistry.hasOwnProperty(extension))) {
                // Treat it as markup if the first non whitespace character is a < and
                // the last non-whitespace character is a >.
                extension = /^\s*</.test(source) ? 'default-markup' : 'default-code';
            }
            return langHandlerRegistry[extension];
        }
        registerLangHandler(decorateSource, ['default-code']);
        registerLangHandler(
        createSimpleLexer(
        [], [
            [PR_PLAIN, /^[^<?]+/],
            [PR_DECLARATION, /^<!\w[^>]*(?:>|$)/],
            [PR_COMMENT, /^<\!--[\s\S]*?(?:-\->|$)/],
            // Unescaped content in an unknown language
            ['lang-', /^<\?([\s\S]+?)(?:\?>|$)/],
            ['lang-', /^<%([\s\S]+?)(?:%>|$)/],
            [PR_PUNCTUATION, /^(?:<[%?]|[%?]>)/],
            ['lang-', /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],
            // Unescaped content in javascript.  (Or possibly vbscript).
            ['lang-js', /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],
            // Contains unescaped stylesheet content
            ['lang-css', /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],
            ['lang-in.tag', /^(<\/?[a-z][^<>]*>)/i]
        ]), ['default-markup', 'htm', 'html', 'mxml', 'xhtml', 'xml', 'xsl']);
        registerLangHandler(
        createSimpleLexer(
        [
            [PR_PLAIN, /^[\s]+/, null, ' \t\r\n'],
            [PR_ATTRIB_VALUE, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, '\"\'']
        ], [
            [PR_TAG, /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],
            [PR_ATTRIB_NAME, /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
            ['lang-uq.val', /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],
            [PR_PUNCTUATION, /^[=<>\/]+/],
            ['lang-js', /^on\w+\s*=\s*\"([^\"]+)\"/i],
            ['lang-js', /^on\w+\s*=\s*\'([^\']+)\'/i],
            ['lang-js', /^on\w+\s*=\s*([^\"\'>\s]+)/i],
            ['lang-css', /^style\s*=\s*\"([^\"]+)\"/i],
            ['lang-css', /^style\s*=\s*\'([^\']+)\'/i],
            ['lang-css', /^style\s*=\s*([^\"\'>\s]+)/i]
        ]), ['in.tag']);
        registerLangHandler(
        createSimpleLexer([], [
            [PR_ATTRIB_VALUE, /^[\s\S]+/]
        ]), ['uq.val']);
        registerLangHandler(sourceDecorator({
            'keywords': CPP_KEYWORDS,
            'hashComments': true,
            'cStyleComments': true,
            'types': C_TYPES
        }), ['c', 'cc', 'cpp', 'cxx', 'cyc', 'm']);
        registerLangHandler(sourceDecorator({
            'keywords': 'null,true,false'
        }), ['json']);
        registerLangHandler(sourceDecorator({
            'keywords': CSHARP_KEYWORDS,
            'hashComments': true,
            'cStyleComments': true,
            'verbatimStrings': true,
            'types': C_TYPES
        }), ['cs']);
        registerLangHandler(sourceDecorator({
            'keywords': JAVA_KEYWORDS,
            'cStyleComments': true
        }), ['java']);
        registerLangHandler(sourceDecorator({
            'keywords': SH_KEYWORDS,
            'hashComments': true,
            'multiLineStrings': true
        }), ['bsh', 'csh', 'sh']);
        registerLangHandler(sourceDecorator({
            'keywords': PYTHON_KEYWORDS,
            'hashComments': true,
            'multiLineStrings': true,
            'tripleQuotedStrings': true
        }), ['cv', 'py']);
        registerLangHandler(sourceDecorator({
            'keywords': PERL_KEYWORDS,
            'hashComments': true,
            'multiLineStrings': true,
            'regexLiterals': true
        }), ['perl', 'pl', 'pm']);
        registerLangHandler(sourceDecorator({
            'keywords': RUBY_KEYWORDS,
            'hashComments': true,
            'multiLineStrings': true,
            'regexLiterals': true
        }), ['rb']);
        registerLangHandler(sourceDecorator({
            'keywords': JSCRIPT_KEYWORDS,
            'cStyleComments': true,
            'regexLiterals': true
        }), ['js']);
        registerLangHandler(sourceDecorator({
            'keywords': COFFEE_KEYWORDS,
            'hashComments': 3,
            // ### style block comments
            'cStyleComments': true,
            'multilineStrings': true,
            'tripleQuotedStrings': true,
            'regexLiterals': true
        }), ['coffee']);
        registerLangHandler(createSimpleLexer([], [
            [PR_STRING, /^[\s\S]+/]
        ]), ['regex']);

        function applyDecorator(job) {
            var opt_langExtension = job.langExtension;

            try {
                // Extract tags, and convert the source code to plain text.
                var sourceAndSpans = extractSourceSpans(job.sourceNode);
                /** Plain text. @type {string} */
                var source = sourceAndSpans.sourceCode;
                job.sourceCode = source;
                job.spans = sourceAndSpans.spans;
                job.basePos = 0;

                // Apply the appropriate language handler
                langHandlerForExtension(opt_langExtension, source)(job);

                // Integrate the decorations and tags back into the source code,
                // modifying the sourceNode in place.
                recombineTagsAndDecorations(job);
            } catch (e) {
                if ('console' in window) {
                    console['log'](e && e['stack'] ? e['stack'] : e);
                }
            }
        }

        /**
         * @param sourceCodeHtml {string} The HTML to pretty print.
         * @param opt_langExtension {string} The language name to use.
         *     Typically, a filename extension like 'cpp' or 'java'.
         * @param opt_numberLines {number|boolean} True to number lines,
         *     or the 1-indexed number of the first line in sourceCodeHtml.
         */
        function prettyPrintOne(sourceCodeHtml, opt_langExtension, opt_numberLines) {
            var container = document.createElement('PRE');
            // This could cause images to load and onload listeners to fire.
            // E.g. <img onerror="alert(1337)" src="nosuchimage.png">.
            // We assume that the inner HTML is from a trusted source.
            container.innerHTML = sourceCodeHtml;
            if (opt_numberLines) {
                numberLines(container, opt_numberLines);
            }

            var job = {
                langExtension: opt_langExtension,
                numberLines: opt_numberLines,
                sourceNode: container
            };
            applyDecorator(job);
            return container.innerHTML;
        }

        function prettyPrint(opt_whenDone) {
            function byTagName(tn) {
                return document.getElementsByTagName(tn);
            }
            // fetch a list of nodes to rewrite
            var codeSegments = [byTagName('pre'), byTagName('code'), byTagName('xmp')];
            var elements = [];
            for (var i = 0; i < codeSegments.length; ++i) {
                for (var j = 0, n = codeSegments[i].length; j < n; ++j) {
                    elements.push(codeSegments[i][j]);
                }
            }
            codeSegments = null;

            var clock = Date;
            if (!clock['now']) {
                clock = {
                    'now': function () {
                        return +(new Date);
                    }
                };
            }

            // The loop is broken into a series of continuations to make sure that we
            // don't make the browser unresponsive when rewriting a large page.
            var k = 0;
            var prettyPrintingJob;

            var langExtensionRe = /\blang(?:uage)?-([\w.]+)(?!\S)/;
            var prettyPrintRe = /\bprettyprint\b/;

            function doWork() {
                var endTime = (window['PR_SHOULD_USE_CONTINUATION'] ? clock['now']() + 250 /* ms */ : Infinity);
                for (; k < elements.length && clock['now']() < endTime; k++) {
                    var cs = elements[k];
                    var className = cs.className;
                    if (className.indexOf('prettyprint') >= 0) {
                        // If the classes includes a language extensions, use it.
                        // Language extensions can be specified like
                        //     <pre class="prettyprint lang-cpp">
                        // the language extension "cpp" is used to find a language handler as
                        // passed to PR.registerLangHandler.
                        // HTML5 recommends that a language be specified using "language-"
                        // as the prefix instead.  Google Code Prettify supports both.
                        // http://dev.w3.org/html5/spec-author-view/the-code-element.html
                        var langExtension = className.match(langExtensionRe);
                        // Support <pre class="prettyprint"><code class="language-c">
                        var wrapper;
                        if (!langExtension && (wrapper = childContentWrapper(cs)) && "CODE" === wrapper.tagName) {
                            langExtension = wrapper.className.match(langExtensionRe);
                        }

                        if (langExtension) {
                            langExtension = langExtension[1];
                        }

                        // make sure this is not nested in an already prettified element
                        var nested = false;
                        for (var p = cs.parentNode; p; p = p.parentNode) {
                            if ((p.tagName === 'pre' || p.tagName === 'code' || p.tagName === 'xmp') && p.className && p.className.indexOf('prettyprint') >= 0) {
                                nested = true;
                                break;
                            }
                        }
                        if (!nested) {
                            // Look for a class like linenums or linenums:<n> where <n> is the
                            // 1-indexed number of the first line.
                            var lineNums = cs.className.match(/\blinenums\b(?::(\d+))?/);
                            lineNums = lineNums ? lineNums[1] && lineNums[1].length ? +lineNums[1] : true : false;
                            if (lineNums) {
                                numberLines(cs, lineNums);
                            }

                            // do the pretty printing
                            prettyPrintingJob = {
                                langExtension: langExtension,
                                sourceNode: cs,
                                numberLines: lineNums
                            };
                            applyDecorator(prettyPrintingJob);
                        }
                    }
                }
                if (k < elements.length) {
                    // finish up in a continuation
                    setTimeout(doWork, 250);
                } else if (opt_whenDone) {
                    opt_whenDone();
                }
            }

            doWork();
        }

        /**
         * Find all the {@code <pre>} and {@code <code>} tags in the DOM with
         * {@code class=prettyprint} and prettify them.
         *
         * @param {Function?} opt_whenDone if specified, called when the last entry
         *     has been finished.
         */
        window['prettyPrintOne'] = prettyPrintOne;
        /**
         * Pretty print a chunk of code.
         *
         * @param {string} sourceCodeHtml code as html
         * @return {string} code as html, but prettier
         */
        window['prettyPrint'] = prettyPrint;
        /**
         * Contains functions for creating and registering new language handlers.
         * @type {Object}
         */
        window['PR'] = {
            'createSimpleLexer': createSimpleLexer,
            'registerLangHandler': registerLangHandler,
            'sourceDecorator': sourceDecorator,
            'PR_ATTRIB_NAME': PR_ATTRIB_NAME,
            'PR_ATTRIB_VALUE': PR_ATTRIB_VALUE,
            'PR_COMMENT': PR_COMMENT,
            'PR_DECLARATION': PR_DECLARATION,
            'PR_KEYWORD': PR_KEYWORD,
            'PR_LITERAL': PR_LITERAL,
            'PR_NOCODE': PR_NOCODE,
            'PR_PLAIN': PR_PLAIN,
            'PR_PUNCTUATION': PR_PUNCTUATION,
            'PR_SOURCE': PR_SOURCE,
            'PR_STRING': PR_STRING,
            'PR_TAG': PR_TAG,
            'PR_TYPE': PR_TYPE
        };
    })();

    // Copyright (C) 2009 Google Inc.
    //
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    //
    //      http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.


    /**
     * @fileoverview
     * Registers a language handler for CSS.
     *
     *
     * To use, include prettify.js and this file in your HTML page.
     * Then put your code in an HTML tag like
     *      <pre class="prettyprint lang-css"></pre>
     *
     *
     * http://www.w3.org/TR/CSS21/grammar.html Section G2 defines the lexical
     * grammar.  This scheme does not recognize keywords containing escapes.
     *
     * @author mikesamuel@gmail.com
     */

    PR['registerLangHandler'](
    PR['createSimpleLexer'](
    [
    // The space production <s>
    [PR['PR_PLAIN'], /^[ \t\r\n\f]+/, null, ' \t\r\n\f']], [
    // Quoted strings.  <string1> and <string2>
    [PR['PR_STRING'], /^\"(?:[^\n\r\f\\\"]|\\(?:\r\n?|\n|\f)|\\[\s\S])*\"/, null],
        [PR['PR_STRING'], /^\'(?:[^\n\r\f\\\']|\\(?:\r\n?|\n|\f)|\\[\s\S])*\'/, null],
        ['lang-css-str', /^url\(([^\)\"\']*)\)/i],
        [PR['PR_KEYWORD'], /^(?:url|rgb|\!important|@import|@page|@media|@charset|inherit)(?=[^\-\w]|$)/i, null],
        // A property name -- an identifier followed by a colon.
        ['lang-css-kw', /^(-?(?:[_a-z]|(?:\\[0-9a-f]+ ?))(?:[_a-z0-9\-]|\\(?:\\[0-9a-f]+ ?))*)\s*:/i],
        // A C style block comment.  The <comment> production.
        [PR['PR_COMMENT'], /^\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\//],
        // Escaping text spans
        [PR['PR_COMMENT'], /^(?:<!--|-->)/],
        // A number possibly containing a suffix.
        [PR['PR_LITERAL'], /^(?:\d+|\d*\.\d+)(?:%|[a-z]+)?/i],
        // A hex color
        [PR['PR_LITERAL'], /^#(?:[0-9a-f]{3}){1,2}/i],
        // An identifier
        [PR['PR_PLAIN'], /^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i],
        // A run of punctuation
        [PR['PR_PUNCTUATION'], /^[^\s\w\'\"]+/]
    ]), ['css']);
    PR['registerLangHandler'](
    PR['createSimpleLexer']([], [
        [PR['PR_KEYWORD'], /^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i]
    ]), ['css-kw']);
    PR['registerLangHandler'](
    PR['createSimpleLexer']([], [
        [PR['PR_STRING'], /^[^\)\"\']+/]
    ]), ['css-str']);

})();

// 测试系统页面部分
Demo.toggleView = function () {
    var main = document.getElementById('demo-main'),
        newValue = main.className === 'demo-page-clean';
    main.className = newValue ? '' : 'demo-page-clean';

    document.getElementById('demo-toggleview').innerHTML = newValue ? '❒ 全屏视图' : '❑ 标准视图';
    Demo.setData('demo_view', newValue ? 'false' : 'true');
};

Demo.showPage = function (options) {

    // 初始化路径
    var root = Demo.rootPath = getRoot(),
        tmp = location.href.replace(root, '').split('/');

    Demo.moduleName = tmp[0];

    // Demo.categoryName = tmp[1];
    //  Demo.pageName = tmp[2] && tmp[2].match(/(.*)\./)[1];
    // 载入文件。
    document.write('<link type="text/css" rel="stylesheet" href="' + root + 'assets/styles/demo.css" />');
    //document.write('<link type="text/css" rel="stylesheet" href="' + root + 'assets/libs/google-code-prettify/prettify.css" />');
    if (!window.console || !window.console.groupEnd) document.write('<script type="text/javascript" src="' + root + 'assets/libs/firebug-lite/build/firebug-lite.js"></script>');

    //document.write('<script type="text/javascript" src="' + root + 'assets/libs/google-code-prettify/prettify.js"></script>');
    if (Demo.moduleName) document.write('<script type="text/javascript" src="' + root + Demo.moduleName + '/project.js"></script>');
    //document.write('<script type="text/javascript" src="' + root + 'assets/scripts/project.js"></script>');
    var result = [];
    for (var nav in options.projects) {
        result.push('<a class="demo' + (nav === Demo.moduleName ? " demo-page-current" : "") + '" href="' + Demo.rootPath + nav + '/index.html">' + options.projects[nav] + '</a>');
    }

    result[result.length - 1] = result[result.length - 1].replace(' class="demo', ' class="demo demo-page-last');

    if (eval("-[1,]")) {

        document.write('<div id="demo-main" class="demo-page-loading demo-page-nosidebar">\
			<header id="demo-header">\
				<nav id="demo-navbar">' + result.join('\r\n') + '</nav>\
				<h1>' + options.title + '</h1>\
				<h2>' + options.subtitle + '</h2>\
			</header>\
			<article id="demo-body">\
				<header id="demo-title">\
					<div class="demo-control-toolbar">' + Demo.toggleViewSourceHTML + '&nbsp;&nbsp;&nbsp;<a id="demo-togglesource" onclick="Demo.toggleAllSource()" class="demo" href="javascript://切换所有查看源码按钮的状态">✦ 切换折叠</a>&nbsp;&nbsp;&nbsp;<a id="demo-toggleview" onclick="Demo.toggleView()" class="demo" href="javascript://切换显示外围框架">❒ 全屏视图</a>\
					</div>\
				</header>\
				<div id="demo-loading">正在载入...</div>\
			</article>\
			<footer id="demo-footer">' + options.copyright + '</footer>\
		</div>');

    } else {


        document.write('<div id="demo-main" class="demo-page-loading demo-page-nosidebar">\
			<div id="demo-header">\
				<div id="demo-navbar">' + result.join('\r\n') + '</div>\
				<h1>' + options.title + '</h1>\
				<h2>' + options.subtitle + '</h2>\
			</div>\
			<div id="demo-body">\
				<div id="demo-title">\
					<div class="demo-control-toolbar">' + Demo.toggleViewSourceHTML + '&nbsp;&nbsp;&nbsp;<a id="demo-togglesource" onclick="Demo.toggleAllSource()" class="demo" href="javascript://切换所有查看源码按钮的状态">✦ 切换折叠</a>&nbsp;&nbsp;&nbsp;<a id="demo-toggleview" onclick="Demo.toggleView()" class="demo" href="javascript://切换显示外围框架">❒ 全屏视图</a>\
					</div>\
				</div>\
				<div id="demo-loading">正在载入...</div>\
			</div>\
			<div id="demo-footer">' + options.copyright + '</div>\
		</div>');
    }

    // try {
       // document.body.style.visibility = 'hidden';
    // } catch (e) {
       // // 修正 Chrome 在没刷新时，  无法获取 body
       // location.reload();
    // }
    
    Demo.addEvent(window, 'load', function () {
        var main = document.getElementById('demo-main'),
        	body = document.getElementById('demo-body'),
            last, next = main.nextSibling;

        // 移除 正在载入... 节点

        if (Demo.items) {
            Demo.showMenu(Demo.items);
            main.className = '';
        } else {
            main.className = 'demo-page-nosidebar';
        }
        
        body.removeChild(document.getElementById('demo-loading'));

        // 将原有的 body 的节点拷贝到 demo-body
        for (; next; next = last) {
            last = next.nextSibling;
            body.appendChild(next);
        }
        
        if (Demo.getData('demo_view') === 'true') {
            document.getElementById('demo-main').className = 'demo-page-clean';
            document.getElementById('demo-toggleview').innerHTML = '❑ 标准视图';
        }

        prettyPrint();

    });

    function getRoot() {
        var b = document.getElementsByTagName("script");
        b = b[b.length - 1];
        return (!-[1, ] && !document.createTextNode('').constructor ? b.getAttribute('src', 5) : b.src).replace(/assets\/scripts\/.*$/, '');
    }

};

Demo.showMenu = function (menus) {
    var sidebar = document.getElementById('demo-sidebar');
    if (!sidebar) {
        sidebar = document.createElement('nav');
        sidebar.id = 'demo-sidebar';
        document.getElementById('demo-main').insertBefore(sidebar, document.getElementById('demo-footer'));
    }
    var result = [], url = location.href;
    
    if(url.indexOf('#') > -1){
    	url = url.substring(0, url.indexOf('#'));
    }

    var allTotal = 0,
        allFinished = 0,
        allSkipped = 0,
        currentInfo;

    for (var group in menus) {

        result.push('<h2>' + Demo.encodeHTML(group) + '</h2>');

        if (typeof menus[group] === 'string') {
            var currenHeader = result.length - 1,
                total = 0,
                finished = 0;
            result.push('<ul class="demo-menu demo-page-float">');
            Demo.forEach(menus[group].split(' '), function (value) {
                if (!value) return;
                var name, src, target = '',
                    clazz;

                // 处理前缀
                switch (value.charAt(0)) {
	                case '+':
	                    clazz = '';
	                    value = value.substring(1);
	                    total++;
	                    finished++;
	                    break;
	                case '-':
	                    clazz = ' demo-removed';
	                    value = value.substring(1);
	                    allSkipped++;
	                    break;
	                case '#':
	                    clazz = ' demo-strong';
	                    value = value.substring(1);
	                    total++;
	                    finished++;
	                    break;
	                case '*':
	                    clazz = ' demo-italic';
	                    value = value.substring(1);
	                    total++;
	                    break;
	                default:
	                    clazz = ' demo-disabled';
	                    total++;
	                    break;
                }

                // 处理后缀
                var at = value.indexOf(':');

                if (at !== -1) {
                    name = value.substring(at + 1);
                    value = value.substring(0, at);
                } else {
                    name = value;
                }

                if (value.charAt(value.length - 1) === '^') {
                    value = value.substr(0, value.length - 1);
                    if (at === -1) {
                        name = value;
                    }
                    target = ' target="_blank"';
                }

                src = Demo.rootPath + Demo.moduleName + '/' + group.toLowerCase() + '/' + value.toLowerCase() + '.html';
                name = Demo.encodeHTML(name);

                if (url === src) {
                    currentInfo = [group, value, name];
                    result.push('<li class="demo-page-current">');
                } else {
                    result.push('<li>');
                }

                result.push('<a class="demo' + clazz + '"' + target + ' href="' + src + '" title="' + value + '">' + name + '</a></li>');


            });


            allTotal += total;
            allFinished += finished;

            result[currenHeader] = '<h2>' + Demo.encodeHTML(group) + ' <small>(' + finished + '/' + total + ')</small></h2>';

        } else {

            result.push('<ul class="demo-menu">');

            for (var menu in menus[group]) {
                var src = menus[group][menu] ? Demo.rootPath + menus[group][menu] : 'javascript:;';
                if (location.href === src) {
                    result.push('<li class="demo-page-current">');
                } else {
                    result.push('<li>');
                }
                result.push('<a class="demo" href="' + src + '">' + Demo.encodeHTML(menu) + '</a></li>');
            }
        }

        result.push('</ul>');

    }

    if (allTotal) {
        result.push('<h6>' + allFinished + '/' + allTotal + (allSkipped ? '+<del>' + allSkipped + '</del>' : '') + '</h6>');
    }

    sidebar.innerHTML = result.join('\r\n');

    if (currentInfo) {
        var header = document.createElement('h1');
        header.className = 'demo';
        header.innerHTML = currentInfo[2] + '<small>' + currentInfo[0] + '</small>';
        document.getElementById('demo-title').appendChild(header);

        header = document.createElement('hr');
        header.className = 'demo';
        document.getElementById('demo-title').appendChild(header);
    }

};

Demo.showPage({
    title: 'J+ Library',
    subtitle: '让 Javascript 成为一门艺术',
    copyright: 'Copyright &copy; 2011-2012 JPlus Team',
    projects: {
        'system': '核心',
        'aqua': 'Aqua',
        'blue knight': '蓝色骑士',
        'milk': 'Milk',
        'hust': 'hust',
        'wplus': 'wplus',
        'codebase': 'CodeBase',
        'resources': '资源'
    }
});