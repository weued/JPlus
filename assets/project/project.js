var core = {
	'System': '+Object +Navigator +Class +Namespace +Trace',
	'Element': '+Core +Traversing +Manipulation +Style +Attributes +Event +DomReady +Dimension +Offset',
	'Ajax': 'Ajax Json Jsonp',
	'Fx': '+Base +Element +Multifade +Transitions Color',
	'UnitTest': '+Index +Element +Traversing +Manipulation +Style +Attributes +Dimension +Offset',
	'jQuery': '+Core +Offset',
	'Mootools': '+Core',
	'Data': '+Collection',
	'Broswer': '+Cookies',
	'Algorithm': 'Sort Encryption BigNumber',
	'Core': 'Array Check Date DateEx Function Json Number Object RegExp SimpleJson String',
	'Utils': 'Check ChineseCheck ChineseId Tpl',
	'Dom': '+Drag +Drop'
};




var controls = {
	'Themes': 'Control'	
};



var notes = {
	
	'教程': {
		'Javascript 学习方法': 'notes/javascript/studymethod.html',
		'Javascript 基础教程': 'notes/javascript/basic.html',
		'DOM 基础': 'notes/javascript/dom.html',
		'Javascript 高级教程': 'notes/javascript/advance.html',
		'Javascript 学习资源': 'notes/javascript/links.html'
	}, 
	
	'开发工具': {
		'使用 Eclipse下载项目': 'notes/git/guide.html',
		'使用 TortoiseGit下载项目': 'notes/git/tortoisegit.html',
		'如何在 Eclipse 安装  Git 插件': 'notes/git/install.html',
		'如何使用 GIT': 'notes/git/usage.html'
	},
	
	'公约': {
		'测试系统': 'notes/standards/system.html',
		'系统构架': 'notes/standards/architecture.html',
		'项目文件夹结构': 'notes/standards/struct.html',
		'Javascript 编码规范': 'notes/standards/javascript.html',
		'浏览器': 'notes/standards/browser.html'
	},
	
	'前端': {
		'IE6  实现 Fixed': 'notes/frontend/fixed.html'
	},
	
	'库': {
		'J+ 介绍': 'notes/library/introduction.html',
		'J+ 在技术上相对于其它框架的最大不同点': 'notes/library/features.html',
		'为什么 J+': 'notes/library/whyjplus.html',
		'J+ 最快上手': 'notes/library/helloworld.html'
	},
	
	'这不是浪漫': {
		'怎么才是喜欢编程': 'notes/coder/canibeacoder.html',
		'有互联网的今天': 'notes/coder/whenigrowup.html',
		'慢慢老去的90初们': 'notes/coder/the90s.html',
		'有没有这样一个人': 'notes/coder/isthereaperson.html'
	}
};




var members = '+aki +xuld +qingtian';//新增账户第2个加号记得加上空格


var resources = {
	
	'Members': members,
	'俱乐部': {
		'注册': 'resources/club/register.html',
		'新人必读': 'resources/club/parter.html',
		'参与': 'resources/club/division.html',
		'正式开发': 'resources/club/develop.html',
		'文档注释': 'resources/club/doccomment.html',
		'测试': 'resources/club/test.html',
		'用户界面设计': 'resources/club/ui.html'
	},
	'工具': {
		'格式化': 'resources/tools/format/index.html',
		'加密': 'resources/tools/pack/index.html',
		'压缩': 'resources/tools/compact/index.html',
		'速度测试': 'resources/tools/speedmatch/index.html'	
	},
	'技术能力自测': {
		'B 等级 - 语法': 'resources/quiz/javascript-b.html'
	}
};


var navs = {
	//'首页': 'index.html',
	'核心': 'core/index.html',
	'控件': 'controls/index.html',
	'组件': 'components/index.html',
	'文档': 'notes/index.html',
	'项目': 'resources/index.html'
};



initPage(navs);