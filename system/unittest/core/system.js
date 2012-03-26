module("System");

test("System", function() {
	ok( JPlus, "JPlus" );
	ok( $, "$" );
	ok( Dom, "Dom" );
});

test( "execScript", function() {

	expect( 3 );

	execScript( "var globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test variable declarations are global" );

	window.globalEvalTest = false;

	execScript( "globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test variable assignments are global" );

	window.globalEvalTest = false;

	execScript( "this.globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test context (this) is the window object" );

	window.globalEvalTest = undefined;
});

test("Object.type", function() {

	equal( Object.type(null), "null", "null" );
	equal( Object.type(undefined), "undefined", "undefined" );
	equal( Object.type(true), "boolean", "Boolean" );
	equal( Object.type(false), "boolean", "Boolean" );
	equal( Object.type(Boolean(true)), "boolean", "Boolean" );
	equal( Object.type(0), "number", "Number" );
	equal( Object.type(1), "number", "Number" );
	equal( Object.type(Number(1)), "number", "Number" );
	equal( Object.type(""), "string", "String" );
	equal( Object.type("a"), "string", "String" );
	equal( Object.type(String("a")), "string", "String" );
	equal( Object.type({}), "object", "Object" );
	equal( Object.type(/foo/), "regexp", "RegExp" );
	equal( Object.type(new RegExp("asdf")), "regexp", "RegExp" );
	equal( Object.type([1]), "array", "Array" );
	equal( Object.type(new Date()), "date", "Date" );
	equal( Object.type(new Function("return;")), "function", "Function" );
	equal( Object.type(function(){}), "function", "Function" );
	equal( Object.type(window), "object", "Window" );
	equal( Object.type(document), "control", "Document" );
	equal( Object.type(Dom.get(document.body)), "control", "Element" );
	equal( Object.type(document.createTextNode("foo")), "object", "TextNode" );
	
	// !Safari
	//equal( Object.type(document.getElementsByTagName("*")), "object", "DomList" );
});

test("Object.extend", function() {

	var target = { toString: 1 },
		expected ={ toString: 2};

	Object.extend(target, expected);
	deepEqual( target, expected, "内置成员" );

});

test("Object.each", function() {
	expect(13);
	Object.each( [0,1,2], function(n, i){
		equal( i, n, "Check array iteration" );
	});

	Object.each( [5,6,7], function(n, i){
		equal( i, n - 5, "Check array iteration" );
	});

	Object.each( { name: "name", lang: "lang" }, function(n, i){
		equal( i, n, "Check object iteration" );
	});

	var total = 0;
	Object.each([1,2,3], function(v, i){ total += v; });
	equal( total, 6, "Looping over an array" );
	total = 0;
	Object.each([1,2,3], function(v, i){ total += v; if ( i == 1 ) return false; });
	equal( total, 3, "Looping over an array, with break" );
	total = 0;
	Object.each({"a":1,"b":2,"c":3}, function(v, i){ total += v; });
	equal( total, 6, "Looping over an object" );
	total = 0;
	Object.each({"a":3,"b":3,"c":3}, function(v, i){ total += v; return false; });
	equal( total, 3, "Looping over an object, with break" );

	//var f = function(){};
	//f.foo = "bar";
	//Object.each(f, function(v, i){
	//	f[i] = "baz";
	//});
	//equal( "baz", f.foo, "Loop over a function" );

	var stylesheet_count = 0;
	Object.each(document.styleSheets, function(i){
		stylesheet_count++;
	});
	ok(stylesheet_count, "should not throw an error in IE while looping over document.styleSheets and return proper amount");

});

test("Array.isArray", function() {
	expect(17);

	// Make sure that false values return false
	ok( !Array.isArray(), "No Value" );
	ok( !Array.isArray( null ), "null Value" );
	ok( !Array.isArray( undefined ), "undefined Value" );
	ok( !Array.isArray( "" ), "Empty String Value" );
	ok( !Array.isArray( 0 ), "0 Value" );

	// Check built-ins
	// Safari uses "(Internal Function)"
	ok( !Array.isArray(String), "String Function("+String+")" );
	ok( !Array.isArray(Array), "Array Function("+Array+")" );
	ok( !Array.isArray(Object), "Object Function("+Object+")" );
	ok( !Array.isArray(Function), "Function Function("+Function+")" );

	// When stringified, this could be misinterpreted
	var mystr = "function";
	ok( !Array.isArray(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	var myarr = [ "function" ];
	ok( Array.isArray(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	var myArray = { "function": "test", length: 3 };
	ok( !Array.isArray(myArray), "Function Object" );

	// Make sure normal functions still work
	var fn = function(){};
	ok( !Array.isArray(fn), "Normal Function" );

	var obj = document.createElement("object");

	// Firefox says this is a function
	ok( !Array.isArray(obj), "Object Element" );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( Array.isArray(obj.getAttribute), "getAttribute Function" );

	var nodes = document.body.childNodes;

	ok( !Array.isArray(nodes), "childNodes Property" );

	var first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	ok( !Array.isArray(first), "A normal DOM Element" );

	var input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( Array.isArray(input.focus), "A default function property" );

	document.body.removeChild( input );

	var a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !Array.isArray(a), "Anchor Element" );

	document.body.removeChild( a );
});

test("Array.create", function(){

	// equal( Array.create(document.findAll("head").doms)[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a List object" );

	// equal( Array.create(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );

	equal( (function(){ return Array.create(arguments); })(1,2).join(""), "12", "Pass makeArray an arguments array" );

	equal( Array.create([1,2,3]).join(""), "123", "Pass makeArray a real array" );

	equal( Array.create().length, 0, "Pass nothing to makeArray and expect an empty array" );

	equal( Array.create( [0] )[0], 0 , "Pass makeArray a number" );
	
	equal( Array.create( {length:2, 0:"a", 1:"b"} ).join(""), "ab", "Pass makeArray an array like map (with length)" );

	// ok( !!Array.create( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );

	// ok( Array.create(document.getElementById("form")).length >= 13, "Pass makeArray a form (treat as elements)" );

	deepEqual( Array.create({length: "0"}), [], "Make sure object is coerced properly.");
});

test("Function.bind", function(){

	var test = function(){ equal( this, thisObject, "Make sure that scope is set properly." ); };
	var thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	Function.bind( test, thisObject )();
});

test("Function.isFunction", function() {
	expect(19);

	// Make sure that false values return false
	ok( !Function.isFunction(), "No Value" );
	ok( !Function.isFunction( null ), "null Value" );
	ok( !Function.isFunction( undefined ), "undefined Value" );
	ok( !Function.isFunction( "" ), "Empty String Value" );
	ok( !Function.isFunction( 0 ), "0 Value" );

	// Check built-ins
	// Safari uses "(Internal Function)"
	ok( Function.isFunction(String), "String Function("+String+")" );
	ok( Function.isFunction(Array), "Array Function("+Array+")" );
	ok( Function.isFunction(Object), "Object Function("+Object+")" );
	ok( Function.isFunction(Function), "Function Function("+Function+")" );

	// When stringified, this could be misinterpreted
	var mystr = "function";
	ok( !Function.isFunction(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	var myarr = [ "function" ];
	ok( !Function.isFunction(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	var myfunction = { "function": "test" };
	ok( !Function.isFunction(myfunction), "Function Object" );

	// Make sure normal functions still work
	var fn = function(){};
	ok( Function.isFunction(fn), "Normal Function" );

	var obj = document.createElement("object");

	// Firefox says this is a function
	ok( !Function.isFunction(obj), "Object Element" );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( Function.isFunction(obj.getAttribute), "getAttribute Function" );

	var nodes = document.body.childNodes;

	// Safari says this is a function
	ok( !Function.isFunction(nodes), "childNodes Property" );

	var first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	ok( !Function.isFunction(first), "A normal DOM Element" );

	var input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( Function.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	var a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !Function.isFunction(a), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme(callback){
		function fn(response){
			callback(response);
		}

		ok( Function.isFunction(fn), "Recursive Function Call" );

		fn({ some: "data" });
	};

	callme(function(){
		callme(function(){});
	});
});

test("JSON.decode", function(){return
	expect(8);

	equal( JSON.decode(), null, "Nothing in, null out." );
	equal( JSON.decode( null ), null, "Nothing in, null out." );
	equal( JSON.decode( "" ), null, "Nothing in, null out." );

	deepEqual( JSON.decode("{}"), {}, "Plain object parsing." );
	deepEqual( JSON.decode("{\"test\":1}"), {"test":1}, "Plain object parsing." );

	deepEqual( JSON.decode("\n{\"test\":1}"), {"test":1}, "Make sure leading whitespaces are handled." );

	try {
		JSON.decode("{a:1}");
		ok( false, "Test malformed JSON string." );
	} catch( e ) {
		ok( true, "Test malformed JSON string." );
	}

	try {
		JSON.decode("{'a':1}");
		ok( false, "Test malformed JSON string." );
	} catch( e ) {
		ok( true, "Test malformed JSON string." );
	}
});

test("String.format", function() {

	var nbsp = String.fromCharCode(160);

	equal( String.format("{0} {1}  {2}", 1, 2 ,3 ), "1 2  3", "格式化{序号}" );
	equal( String.format("{a} {b}  {c}", {a:1, b:2, c:3} ), "1 2  3", "格式化{字段}" );
	equal( String.format("{2} {2}  {2}", 1, 2 ,3 ), "3 3  3", "重复序号" );
	equal( String.format("{2}" ), "", "不存在的序号" );
	equal( String.format.call(function(){return 3}, "{0}",  1 ), "3", "自定义格式化对象的函数" );
	equal( String.format("{{}} {0}", 1), "{} 1", "格式化的字符串内有 { 和  }" );
});

test("String.prototype.trim", function() {

	var nbsp = String.fromCharCode(160);

	equal( "hello  ".trim(), "hello", "尾部" );
	equal( "  hello".trim(), "hello", "头部" );
	equal( "  hello   ".trim(), "hello", "全部" );
	equal( ("  " + nbsp + "hello  " + nbsp + " ")    .trim(), "hello", "&nbsp;" );

	equal( "".trim(), "", "空字符串" );
});



/*

test("String.prototype.toCamelCase", function() {

	var tests = {
		"foo-bar": "fooBar",
		"foo-bar-baz": "fooBarBaz",
		"girl-u-want": "girlUWant",
		"the-4th-dimension": "the4thDimension",
		"-o-tannenbaum": "OTannenbaum",
		"-moz-illa": "MozIlla"
	};

	expect(6);

	Object.each( tests, function( val, key ) {
		equal( key.toCamelCase(), val, "Converts: " + key + " => " + val );
	});
});

*/



