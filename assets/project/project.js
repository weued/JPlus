var core = {
	'System': '+Object +Navigator +Class +Namespace +Trace',
	'Element': '#Element Event +DomReady Node Attribute Dimension',
	'Ajax': 'Ajax Json Jsonp',
	'Fx': 'Base Animate Transitions Color'
};





var notes = {
	'俱乐部': {
		'注册': 'notes/club/register.html',
		'新人必读': 'notes/club/parter.html',
		'参与': 'notes/club/division.html',
		'正式开发': 'notes/club/develop.html',
		'文档注释': 'notes/club/doccomment.html',
		'测试': 'notes/club/test.html',
		'用户界面设计': 'notes/club/ui.html'
	},
	
	'库': {
		'J+ 介绍': 'notes/library/introduction.html',
		'J+ 相对于其它库的最大不同点': 'notes/library/features.html',
		'为什么 J+': 'notes/library/whyjplus.html',
		'J+ 最快入门': 'notes/library/helloworld.html'
	},
	
	'教程': {
		'DOM 基础': 'notes/javascript/dom.html',
		'Javascript 高级教程': 'notes/javascript/advance.html',
		'使用 Eclipse下载项目': 'notes/git/guide.html',
		'使用 TortoiseGit下载项目': 'notes/git/tortoisegit.html',
		'如何在 Eclipse 安装  Git 插件': 'notes/git/install.html',
		'如何使用 GIT': 'notes/git/usage.html'
	},
	
	'公约': {
		'测试系统': 'notes/standards/system.html',
		'系统构架': 'notes/standards/architecture.html',
		'项目文件夹结构': 'notes/standards/struct.html',
		'Javascript 编码规范': 'notes/standards/javascript.html'
	}
};




var users = '+aki +xuld +qingtian';//新增账户第2个加号记得加上空格


var resources = {
	
	'users': users,
	'工具': {
		'格式化': 'tools/format/index.html',
		'加密': 'tools/pack/index.html',
		'压缩': 'tools/compact/index.html',
		'速度测试': 'tools/speedmatch/index.html'	
	},
	'javascript 基础能力自测': {
		'B 等级 - 语法': 'resources/javascript/level-B.html'
	}
};

var tools = resources;


var navs = {
	'首页': 'index.html',
	'核心': 'core/index.html',
	'控件': 'controls/index.html',
	'组件': 'components/index.html',
	'文档': 'notes/index.html',
	'项目': 'resources/index.html'
};



initPage(navs);