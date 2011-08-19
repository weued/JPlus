

// this a sample testcase.



var options = {
	defaultHtml: 'demo.html',
	time: 1000
};

var framewroks = {
	'demo': {
		js: '../libs/demo.js',
		html: '',
		init:  function(document){
	
		}
	}
};

var cases = {
	'test':{
		time: 1000,
		demo: 'test()'
	}

};





initSpeedMatch(framewroks, cases, options   );