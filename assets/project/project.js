var core = {
	'Core': 'System',
	'Dom': 'Element',
	'Ajax': 'Ajax Json Jsonp',
	'Fx': 'Base Animate Transitions Color'
};




var todos = {
	'前期初始化': {
		'为项目命名、创建项目。': 1,
		'定义项目结构、文件夹的结构': 2,
		'制作测试页，包括单元测试、速度测试。': 3
	},
	'核心部分': {
		'System': 1,
		'Dom/Element': 1,
		'Ajax/Ajax': 1,
		'Fx/Base、Fx/Animate': 2,
		'Fx/Transitions、Fx/Colors': 2,
		'Ajax/Json、Ajax/Jsonp': 2
	},
	'工具部分': {
		'Broswer':4,
		'Core/': 5
	}
};



var notes = {
	'俱乐部': {
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
		'J+ 最快入门': 'notes/library/helloworld.html'
	},
	
	'Git 操作': {
		'使用 Eclipse下载项目': 'notes/git/guide.html',
		'使用 TortoiseGit下载项目': 'notes/git/tortoisegit.html',
		'如何在 Eclipse 安装  Git 插件': 'notes/git/install.html',
		'使用 GIT': 'notes/git/usage.html'
	},
	
	'公约': {
		'测试系统': 'notes/standards/system.html',
		'系统构架': 'notes/standards/architecture.html',
		'项目文件夹结构': 'notes/standards/struct.html',
		'Javascript 编码规范': 'notes/standards/javascript.html'
	}
};



var tools = {
	'Javascript': {
		'格式化': 'tools/format/index.html',
		'加密': 'tools/pack/index.html',
		'压缩': 'tools/compact/index.html'	
	}
	
};

var navs = {
	'首页': 'index.html',
	'核心': 'core/index.html',
	'控件': 'controls/index.html',
	'组件': 'components/index.html',
	'文档': 'notes/index.html',
	'工具': 'tools/index.html',
	'共享': 'resources/index.html'
};



initPage(navs);