module("System");

test("System", function() {
	ok( JPlus, "JPlus" );
	ok( $, "$" );
	ok( Element, "Element" );
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
	expect(23);

	equals( Object.type(null), "null", "null" );
	equals( Object.type(undefined), "undefined", "undefined" );
	equals( Object.type(true), "boolean", "Boolean" );
	equals( Object.type(false), "boolean", "Boolean" );
	equals( Object.type(Boolean(true)), "boolean", "Boolean" );
	equals( Object.type(0), "number", "Number" );
	equals( Object.type(1), "number", "Number" );
	equals( Object.type(Number(1)), "number", "Number" );
	equals( Object.type(""), "string", "String" );
	equals( Object.type("a"), "string", "String" );
	equals( Object.type(String("a")), "string", "String" );
	equals( Object.type({}), "object", "Object" );
	equals( Object.type(/foo/), "regexp", "RegExp" );
	equals( Object.type(new RegExp("asdf")), "regexp", "RegExp" );
	equals( Object.type([1]), "array", "Array" );
	equals( Object.type(new Date()), "date", "Date" );
	equals( Object.type(new Function("return;")), "function", "Function" );
	equals( Object.type(function(){}), "function", "Function" );
	equals( Object.type(window), "object", "Window" );
	equals( Object.type(document), "element", "Document" );
	equals( Object.type($(document.body)), "element", "Element" );
	equals( Object.type(document.createTextNode("foo")), "object", "TextNode" );
	equals( Object.type(document.getElementsByTagName("*")), "object", "NodeList" );
});

test("Object.extend", function() {

	var target = { toString: 1 },
		expected ={ toString: 2};

	Object.extend(target, expected);
	same( target, expected, "内置成员" );

});

test("Object.each", function() {
	expect(13);
	Object.each( [0,1,2], function(n, i){
		equals( i, n, "Check array iteration" );
	});

	Object.each( [5,6,7], function(n, i){
		equals( i, n - 5, "Check array iteration" );
	});

	Object.each( { name: "name", lang: "lang" }, function(n, i){
		equals( i, n, "Check object iteration" );
	});

	var total = 0;
	Object.each([1,2,3], function(v, i){ total += v; });
	equals( total, 6, "Looping over an array" );
	total = 0;
	Object.each([1,2,3], function(v, i){ total += v; if ( i == 1 ) return false; });
	equals( total, 3, "Looping over an array, with break" );
	total = 0;
	Object.each({"a":1,"b":2,"c":3}, function(v, i){ total += v; });
	equals( total, 6, "Looping over an object" );
	total = 0;
	Object.each({"a":3,"b":3,"c":3}, function(v, i){ total += v; return false; });
	equals( total, 3, "Looping over an object, with break" );

	//var f = function(){};
	//f.foo = "bar";
	//Object.each(f, function(v, i){
	//	f[i] = "baz";
	//});
	//equals( "baz", f.foo, "Loop over a function" );

	var stylesheet_count = 0;
	Object.each(document.styleSheets, function(i){
		stylesheet_count++;
	});
	ok(stylesheet_count, "should not throw an error in IE while looping over document.styleSheets and return proper amount");

});

test("Array.create", function(){

	equals( Array.create(document.findAll("head").doms)[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a List object" );

	equals( Array.create(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );

	equals( (function(){ return Array.create(arguments); })(1,2).join(""), "12", "Pass makeArray an arguments array" );

	equals( Array.create([1,2,3]).join(""), "123", "Pass makeArray a real array" );

	equals( Array.create().length, 0, "Pass nothing to makeArray and expect an empty array" );

	equals( Array.create( [0] )[0], 0 , "Pass makeArray a number" );
	
	equals( Array.create( {length:2, 0:"a", 1:"b"} ).join(""), "ab", "Pass makeArray an array like map (with length)" );

	ok( !!Array.create( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );

	ok( Array.create(document.getElementById("form")).length >= 13, "Pass makeArray a form (treat as elements)" );

	same( Array.create({length: "0"}), [], "Make sure object is coerced properly.");
});

test("Function.bind", function(){

	var test = function(){ equals( this, thisObject, "Make sure that scope is set properly." ); };
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

	equals( JSON.decode(), null, "Nothing in, null out." );
	equals( JSON.decode( null ), null, "Nothing in, null out." );
	equals( JSON.decode( "" ), null, "Nothing in, null out." );

	same( JSON.decode("{}"), {}, "Plain object parsing." );
	same( JSON.decode("{\"test\":1}"), {"test":1}, "Plain object parsing." );

	same( JSON.decode("\n{\"test\":1}"), {"test":1}, "Make sure leading whitespaces are handled." );

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

test("String.prototype.trim", function() {

	var nbsp = String.fromCharCode(160);

	equals( "hello  ".trim(), "hello", "尾部" );
	equals( "  hello".trim(), "hello", "头部" );
	equals( "  hello   ".trim(), "hello", "全部" );
	equals( ("  " + nbsp + "hello  " + nbsp + " ")    .trim(), "hello", "&nbsp;" );

	equals( "".trim(), "", "空字符串" );
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



