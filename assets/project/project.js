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



var navs = {
	'首页': 'index.html',
	'核心': 'core/index.html',
	'控件': 'controls/index.html',
	'组件': 'components/index.html',
	'文档': 'notes/index.html',
	'工具': 'tools/index.html',
	'其它': 'resources/index.html'
};



initPage(navs);