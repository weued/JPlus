module("Attributes");

var bareObj = function(value) { return value; };
var functionReturningObj = function(value) { return (function() { return value; }); };


test("Element.prototype.getAttr", function() {
	expect(45);

	equals( $("text1").getAttr("type"), "text", "Check for type attribute" );
	equals( $("radio1").getAttr("type"), "radio", "Check for type attribute" );
	equals( $("check1").getAttr("type"), "checkbox", "Check for type attribute" );
	equals( $("simon1").getAttr("rel"), "bookmark", "Check for rel attribute" );
	equals( $("google").getAttr("title"), "Google!", "Check for title attribute" );
	equals( $("mark").getAttr("hreflang"), "en", "Check for hreflang attribute" );
	equals( $("en").getAttr("lang"), "en", "Check for lang attribute" );
	equals( $("simon").getAttr("class"), "blog link", "Check for class attribute" );
	equals( $("name").getAttr("name"), "name", "Check for name attribute" );
	equals( $("text1").getAttr("name"), "action", "Check for name attribute" );
	ok( $("form").getAttr("action").indexOf("formaction") >= 0, "Check for action attribute" );
	equals( $("text1").setAttr("value", "t").getAttr("value"), "t", "Check setting the value attribute" );
	equals( Element.parse("<div value='t'></div>").getAttr("value"), "t", "Check setting custom attr named 'value' on a div" );
	equals( $("form").setAttr("blah", "blah").getAttr("blah"), "blah", "Set non-existant attribute on a form" );
	equals( $("foo").getAttr("height"), undefined, "Non existent height attribute should return undefined" );

	// [7472] & [3113] (form contains an input with name="action" or name="id")
	var extras = Element.parse("<input name='id' name='name' />").appendTo("testForm");
	equals( $("form").setAttr("action","newformaction").getAttr("action"), "newformaction", "Check that action attribute was changed" );
	equals( $("testForm").getAttr("target"), undefined, "Retrieving target does not equal the input with name=target" );
	equals( $("testForm").setAttr("target", "newTarget").getAttr("target"), "newTarget", "Set target successfully on a form" );
	equals( $("testForm").setAttr("id", null).getAttr("id"), undefined, "Retrieving id does not equal the input with name=id after id is removed [#7472]" );
	// Bug #3685 (form contains input with name="name")
	equals( $("testForm").getAttr("name"), undefined, "Retrieving name does not retrieve input with name=name" );
	extras.remove();

	equals( $("text1").getAttr("maxlength"), "30", "Check for maxlength attribute" );
	equals( $("text1").getAttr("maxLength"), "30", "Check for maxLength attribute" );
	equals( $("area1").getAttr("maxLength"), "30", "Check for maxLength attribute" );

	// using innerHTML in IE causes href attribute to be serialized to the full path
	Element.parse("<a/>").set({ "id": "tAnchor5", "href": "#5" }).appendTo("qunit-fixture");
	equals( $("tAnchor5").getAttr("href"), "#5", "Check for non-absolute href (an anchor)" );

	// list attribute is readonly by default in browsers that support it
	$("list-test").setAttr("list", "datalist");
	equals( $("list-test").getAttr("list"), "datalist", "Check setting list attribute" );

	// Related to [5574] and [5683]
	var body = document.body, $body = $(body);

	strictEqual( $body.getAttr("foo"), undefined, "Make sure that a non existent attribute returns undefined" );

	body.setAttribute("foo", "baz");
	equals( $body.getAttr("foo"), "baz", "Make sure the dom attribute is retrieved when no expando is found" );

	$body.setAttr("foo","cool");
	equals( $body.getAttr("foo"), "cool", "Make sure that setting works well when both expando and dom attribute are available" );

	body.removeAttribute("foo"); // Cleanup

	var select = document.createElement("select"), optgroup = document.createElement("optgroup"), option = document.createElement("option");
	optgroup.appendChild( option );
	select.appendChild( optgroup );

	equal( $( option ).getAttr("selected"), "selected", "Make sure that a single option is selected, even when in an optgroup." );

	var $img = Element.parse("<img style='display:none' width='215' height='53' src='http://static.jquery.com/files/rocker/images/logo_jquery_215x53.gif'/>").appendTo("body");
	equals( $img.getAttr("width"), "215", "Retrieve width attribute an an element with display:none." );
	equals( $img.getAttr("height"), "53", "Retrieve height attribute an an element with display:none." );

	// Check for style support
	ok( !!~$("dl").getAttr("style").indexOf("position"), "Check style attribute getter, also normalize css props to lowercase" );
	ok( !!~$("foo").setAttr("style", "position:absolute;").getAttr("style").indexOf("position"), "Check style setter" );

	// Check value on button element (#1954)
	var $button = Element.parse("<button value='foobar'>text</button>").insertAfter("#button");
	equals( $button.getAttr("value"), "foobar", "Value retrieval on a button does not return innerHTML" );
	equals( $button.getAttr("value", "baz").html(), "text", "Setting the value does not change innerHTML" );

	// Attributes with a colon on a table element (#1591)
	equals( $("table").getAttr("test:attrib"), undefined, "Retrieving a non-existent attribute on a table with a colon does not throw an error." );
	equals( $("table").setAttr("test:attrib", "foobar").getAttr("test:attrib"), "foobar", "Setting an attribute on a table with a colon does not throw an error." );

	var $form = Element.parse("<form class='something'></form>").appendTo("#qunit-fixture");
	equal( $form.getAttr("class"), "something", "Retrieve the class attribute on a form." );

	var $a = Element.parse("<a href='#' onclick='something()'>Click</a>").appendTo("#qunit-fixture");
	equal( $a.getAttr("onclick"), "something()", "Retrieve ^on attribute without anonymous function wrapper." );

	ok( Element.parse("<div/>").getAttr("doesntexist") === undefined, "Make sure undefined is returned when no attribute is found." );
	ok( Element.parse("<div/>").getAttr("title") === undefined, "Make sure undefined is returned when no attribute is found." );
	equal( Element.parse("<div/>").setAttr("title", "something").getAttr("title"), "something", "Set the title attribute." );
	equal( Element.parse("<div/>").getAttr("value"), undefined, "An unset value on a div returns undefined." );
	equal( Element.parse("<input/>").getAttr("value"), "", "An unset value on an input returns current value." );
});

test("attr(Hash)", function() {
	expect(3);
	var pass = true;
	document.findAll("div").set({foo: "baz", zoo: "ping"}).each(function(node){
		if ( node.foo != "baz" && node.zoo != "ping" ) pass = false;
	});
	ok( pass, "Set Multiple Attributes" );
	
});

test("Element.prototype.setAttr", function() {
	expect(75);

	var div = document.findAll("div").set("foo", "bar"),
		fail = false;

	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).foo != "bar" ){
			fail = i;
			break;
		}
	}

	equals( fail, false, "Set Attribute, the #" + fail + " element didn't get the attribute 'foo'" );

	ok( $("foo").setAttr("width", null), "Try to set an attribute to nothing" );

	$("name").setAttr("name", "something");
	equals( $("name").getAttr("name"), "something", "Set name attribute" );
	$("name").setAttr("name", null);
	equals( $("name").getAttr("name"), undefined, "Remove name attribute" );
	var $input = Element.parse("<input>").set({ name: "something" });
	equals( $input.getAttr("name"), "something", "Check element creation gets/sets the name attribute." );

	
	$("check2").setAttr("checked", false);
	equals( document.getElementById("check2").checked, false, "Set checked attribute" );
	equals( $("check2").getAttr("checked"), false, "Set checked attribute" );
	$("text1").setAttr("readonly", true);
	equals( document.getElementById("text1").readOnly, true, "Set readonly attribute" );
	equals( $("text1").getAttr("readonly"), "readonly", "Set readonly attribute" );
	$("text1").setAttr("readonly", false);
	equals( document.getElementById("text1").readOnly, false, "Set readonly attribute" );
	equals( $("text1").getAttr("readonly"), undefined, "Set readonly attribute" );

	$("check2").checked = true;
	equals( document.getElementById("check2").checked, true, "Set checked attribute" );
	equals( $("check2").getAttr("checked"), true, "Set checked attribute" );
	$("check2").checked = false;
	equals( document.getElementById("check2").checked, false, "Set checked attribute" );
	equals( $("check2").getAttr("checked"), false, "Set checked attribute" );
	
	$("check2").setAttr("checked", "checked");
	equal( document.getElementById("check2").checked, true, "Set checked attribute with 'checked'" );
	equal( $("check2").getAttr("checked"), true, "Set checked attribute" );
	
	$("text1").readOnly = true;
	equals( document.getElementById("text1").readOnly, true, "Set readonly attribute" );
	equals( $("text1").getAttr("readOnly"), true, "Set readonly attribute" );
	
	$("text1").readOnly = false;
	equals( document.getElementById("text1").readOnly, false, "Set readonly attribute" );
	equals( $("text1").getAttr("readOnly"), false, "Set readonly attribute" );
	
	$("name").setAttr("maxlength", "5");
	equals( document.getElementById("name").maxLength, 5, "Set maxlength attribute" );
	$("name").setAttr("maxLength", "10");
	equals( document.getElementById("name").maxLength, 10, "Set maxlength attribute" );

	// HTML5 boolean attributes
	var $text = $("text1").setAttr("autofocus", true).setAttr("required", true);
	equal( $text.getAttr("autofocus"), "autofocus", "Set boolean attributes to the same name" );
	equal( $text.setAttr("autofocus", false).getAttr("autofocus"), undefined, "Setting autofocus attribute to false removes it" );
	equal( $text.getAttr("required"), "required", "Set boolean attributes to the same name" );
	equal( $text.setAttr("required", false).getAttr("required"), undefined, "Setting required attribute to false removes it" );

	var $details = Element.parse("<details open></details>").appendTo("qunit-fixture");
	equal( $details.getAttr("open"), "open", "open attribute presense indicates true" );
	equal( $details.setAttr("open", false).getAttr("open"), undefined, "Setting open attribute to false removes it" );

	$text.attr("data-something", true);
	equal( $text.getAttr("data-something"), "true", "Set data attributes");
	equal( $text.getAttr("something"), true, "Setting data attributes are not affected by boolean settings");
	$text.attr("data-another", false);
	equal( $text.getAttr("data-another"), "false", "Set data attributes");
	equal( $text.data("another"), false, "Setting data attributes are not affected by boolean settings" );
	equal( $text.setAttr("aria-disabled", false).getAttr("aria-disabled"), "false", "Setting aria attributes are not affected by boolean settings");
	$text.removeData("something").removeData("another").removeAttr("aria-disabled");

	$("foo").setAttr("contenteditable", true);
	equals( $("foo").getAttr("contenteditable"), "true", "Enumerated attributes are set properly" );

	var attributeNode = document.createAttribute("irrelevant"),
		commentNode = document.createComment("some comment"),
		textNode = document.createTextNode("some text"),
		obj = {};

	Object.each( [commentNode, textNode, attributeNode], function( elem, i ) {
		var $elem = new JPlus.Element( elem );
		$elem.setAttr( "nonexisting", "foo" );
		strictEqual( $elem.getAttr("nonexisting"), undefined, "attr(name, value) works correctly on comment and text nodes (bug #7500)." );
	});

	Object.each( [window, document, obj, "firstp"], function(   elem, i ) {
		var $elem = $( elem );
		strictEqual( $elem.getAttr("nonexisting"), undefined, "attr works correctly for non existing attributes (bug #7500)." );
		equal( $elem.setAttr("something", "foo" ).getAttr("something"), "foo", "attr falls back to prop on unsupported arguments" );
	});

	var table = $("table").append("<tr><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr>"),
		td = table.find("td");
	td.setAttr("rowspan", "2");
	equals( td[0].rowSpan, 2, "Check rowspan is correctly set" );
	td.setAttr("colspan", "2");
	equals( td[0].colSpan, 2, "Check colspan is correctly set" );
	table.setAttr("cellspacing", "2");
	equals( table[0].cellSpacing, "2", "Check cellspacing is correctly set" );

	equals( $("area1").getAttr("value"), "foobar", "Value attribute retrieves the property for backwards compatibility." );

	// for #1070
	$("name").setAttr("someAttr", "0");
	equals( $("name").getAttr("someAttr"), "0", "Set attribute to a string of \"0\"" );
	$("name").setAttr("someAttr", 0);
	equals( $("name").getAttr("someAttr"), "0", "Set attribute to the number 0" );
	$("name").setAttr("someAttr", 1);
	equals( $("name").getAttr("someAttr"), "1", "Set attribute to the number 1" );

	// using contents will get comments regular, text, and comment nodes
	var j = $("nonnodes").contentDocument;

	j.setAttr("name", "attrvalue");
	equals( j.getAttr("name"), "attrvalue", "Check node,textnode,comment for attr" );
	j.setAttr("name",  null);

	QUnit.reset();

	// Type
	var type = $("check2").getAttr("type");
	var thrown = false;
	try {
		$("check2").setAttr("type","hidden");
	} catch(e) {
		thrown = true;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( type, $("check2").getAttr("type"), "Verify that you can't change the type of an input element" );

	var check = document.create("input");
	var thrown = true;
	try {
		check.setAttr("type", "checkbox");
	} catch(e) {
		thrown = false;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "checkbox", check.getAttr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

	var check = Element.parse("<input />");
	var thrown = true;
	try {
		check.setAttr("type","checkbox");
	} catch(e) {
		thrown = false;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "checkbox", check.getAttr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

	var button = $("button");
	var thrown = false;
	try {
		button.setAttr("type","submit");
	} catch(e) {
		thrown = true;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "button", button.getAttr("type"), "Verify that you can't change the type of a button element" );

	var $radio = Element.parse("<input value='sup' type='radio'>").appendTo("testForm");
	equals( $radio.getText(), "sup", "Value is not reset when type is set after value on a radio" );

	// Setting attributes on svg elements (bug #3116)
	var $svg = Element.parse("<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' baseProfile='full' width='200' height='200'>"
		+ "<circle cx='200' cy='200' r='150' />"
	+ "</svg>").appendTo();
	equals( $svg.setAttr("cx", 100).getAttr("cx"), "100", "Set attribute on svg element" );
	$svg.remove();
});

test("Element.prototype.set", function(){

	var elem = Element.parse("<div />");

	// one at a time
	elem.set({html: "foo"});
	equals( elem.innerHTML, "foo", "attr(html)");

	elem.set({text: "bar"});
	equals( elem.innerHTML, "bar", "attr(text)");

	elem.set({style: "color: red"});
	ok( /^(#ff0000|red)$/i.test(elem.style.color), "attr(css)");

	elem.set({height: 10}, true);
	equals( elem.style.height, "10px", "attr(height)");

	// Multiple attributes

	elem.set({
		width:10,
		style:"paddingLeft:1px; paddingRight:1px"
	});

	equals( elem.style.width, "10px", "attr({...})");
	equals( elem.style.paddingLeft, "1px", "attr({...})");
	equals( elem.style.paddingRight, "1px", "attr({...})");
});

test("getAttr('tabindex')", function() {
	expect(8);

	// elements not natively tabbable
	equals($("listWithTabIndex").getAttr("tabindex"), 5, "not natively tabbable, with tabindex set to 0");
	equals($("divWithNoTabIndex").getAttr("tabindex"), undefined, "not natively tabbable, no tabindex set");

	// anchor with href
	equals($("linkWithNoTabIndex").getAttr("tabindex"), 0, "anchor with href, no tabindex set");
	equals($("linkWithTabIndex").getAttr("tabindex"), 2, "anchor with href, tabindex set to 2");
	equals($("linkWithNegativeTabIndex").getAttr("tabindex"), -1, "anchor with href, tabindex set to -1");

	// anchor without href
	equals($("linkWithNoHrefWithNoTabIndex").getAttr("tabindex"), undefined, "anchor without href, no tabindex set");
	equals($("linkWithNoHrefWithTabIndex").getAttr("tabindex"), 1, "anchor without href, tabindex set to 2");
	equals($("linkWithNoHrefWithNegativeTabIndex").getAttr("tabindex"), -1, "anchor without href, no tabindex set");
});

test("setAttr('tabindex', value)", function() {
	expect(9);

	var element = $("divWithNoTabIndex");
	equals(element.getAttr("tabindex"), undefined, "start with no tabindex");

	// set a positive string
	element.setAttr("tabindex", "1");
	equals(element.getAttr("tabindex"), 1, "set tabindex to 1 (string)");

	// set a zero string
	element.setAttr("tabindex", "0");
	equals(element.getAttr("tabindex"), 0, "set tabindex to 0 (string)");

	// set a negative string
	element.setAttr("tabindex", "-1");
	equals(element.getAttr("tabindex"), -1, "set tabindex to -1 (string)");

	// set a positive number
	element.setAttr("tabindex", 1);
	equals(element.getAttr("tabindex"), 1, "set tabindex to 1 (number)");

	// set a zero number
	element.setAttr("tabindex", 0);
	equals(element.getAttr("tabindex"), 0, "set tabindex to 0 (number)");

	// set a negative number
	element.setAttr("tabindex", -1);
	equals(element.getAttr("tabindex"), -1, "set tabindex to -1 (number)");

	element = $("linkWithTabIndex");
	equals(element.getAttr("tabindex"), 2, "start with tabindex 2");

	element.setAttr("tabindex", -1);
	equals(element.getAttr("tabindex"), -1, "set negative tabindex");
});

test("setAttr(String, null)", function() {
	expect(8);
	equal( $("mark").setAttr( "class", null ).className, "", "remove class" );
	equal( $("form").setAttr("id", null).attr("id"), undefined, "Remove id" );
	equal( $("foo").setAttr("style", "position:absolute;").setAttr("style", null).style.cssText, "", "Check removing style attribute" );
	equal( $("form").setAttr("style", "position:absolute;").setAttr("style", null).style.cssText, "", "Check removing style attribute on a form" );
	equal( Element.parse("<div style='position: absolute'></div>").appendTo("foo").setAttr("style", null).style.cssText, "", "Check removing style attribute (#9699 Webkit)" );
	equal( $("fx-test-group").attr("height", "3px").setAttr("height",  null).getStyle("height"), "1px", "Removing height attribute has no effect on height set with style attribute" );

	$("check1").setAttr("checked",  null).setAttr("checked", true).setAttr("checked", null);
	equal( document.getElementById("check1").checked, false, "removeAttr sets boolean properties to false" );
	$("text1").setAttr("readOnly", true).setAttr("readonly", null);
	equal( document.getElementById("text1").readOnly, false, "removeAttr sets boolean properties to false" );
});

test("Element.prototype.getText", function() {
	expect(26);

	document.getElementById("text1").value = "bla";
	equals( $("text1").getText(), "bla", "Check for modified value of input element" );

	QUnit.reset();

	equals( $("text1").getText(), "Test", "Check for value of input element" );
	// ticket #1714 this caused a JS error in IE
	equals( $("first").getText(), "", "Check a paragraph element to see if it has a value" );
	
	equals( $("select2").getText(), "3", "Call getText() on a single=\"single\" select" );

	same( $("select3").getText(), ["1", "2"], "Call getText() on a multiple=\"multiple\" select" );

	equals( $("option3c").getText(), "2", "Call getText() on a option element with value" );

	equals( $("option3a").getText(), "", "Call getText() on a option element with empty value" );

	equals( $("option3e").getText(), "no value", "Call getText() on a option element with no value attribute" );

	equals( $("option3a").getText(), "", "Call getText() on a option element with no value attribute" );

	$("select3").val("");
	same( $("select3").getText(), [""], "Call getText() on a multiple=\"multiple\" select" );

	same( $("select4").getText(), [], "Call getText() on multiple=\"multiple\" select with all disabled options" );

	$("select4 optgroup").add("#select4 > [disabled]").attr("disabled", false);
	same( $("select4").getText(), ["2", "3"], "Call getText() on multiple=\"multiple\" select with some disabled options" );

	$("select4").attr("disabled", true);
	same( $("select4").getText(), ["2", "3"], "Call getText() on disabled multiple=\"multiple\" select" );

	equals( $("select5").getText(), "3", "Check value on ambiguous select." );

	$("select5").val(1);
	equals( $("select5").getText(), "1", "Check value on ambiguous select." );

	$("select5").val(3);
	equals( $("select5").getText(), "3", "Check value on ambiguous select." );

	// var checks = Element.parse("<input type='checkbox' name='test' value='1'/><input type='checkbox' name='test' value='2'/><input type='checkbox' name='test' value=''/><input type='checkbox' name='test'/>").appendTo("#form");
// 
	// same( checks.getText(), "", "Get unchecked values." );
// 
	// equals( checks.eq(3).getText(), "on", "Make sure a value of 'on' is provided if none is specified." );
// 
	// checks.setText("2");
	// same( checks.serialize(), "test=2", "Get a single checked value." );
// 
	// checks.setText(",1");
	// same( checks.serialize(), "test=1&test=", "Get multiple checked values." );
// 
	// checks.setText(",2");
	// same( checks.serialize(), "test=2&test=", "Get multiple checked values." );
// 
	// checks.setText("1,on");
	// same( checks.serialize(), "test=1&test=on", "Get multiple checked values." );

	checks.remove();

	var $button = Element.parse("<button value='foobar'>text</button>").insertAfter("#button");
	equals( $button.getText(), "foobar", "Value retrieval on a button does not return innerHTML" );
	equals( $button.setText("baz").getHtml(), "text", "Setting the value does not change innerHTML" );

	equals( jQuery("<option/>").setText("test").getAttr("value"), "test", "Setting value sets the value attribute" );
});

if ( "value" in document.createElement("meter") &&
			"value" in document.createElement("progress") ) {

	test("getText() respects numbers without exception (Bug #9319)", function() {

		expect(4);

		var $meter = jQuery("<meter min='0' max='10' value='5.6'></meter>"),
			$progress = jQuery("<progress max='10' value='1.5'></progress>");

		try {
			equal( typeof $meter.getText(), "number", "meter, returns a number and does not throw exception" );
			equal( $meter.getText(), $meter[0].value, "meter, api matches host and does not throw exception" );

			equal( typeof $progress.getText(), "number", "progress, returns a number and does not throw exception" );
			equal( $progress.getText(), $progress[0].value, "progress, api matches host and does not throw exception" );

		} catch(e) {}

		$meter.remove();
		$progress.remove();
	});
}

var testVal = function(valueObj) {
	expect(8);

	QUnit.reset();
	$("text1").val(valueObj( "test" ));
	equals( document.getElementById("text1").value, "test", "Check for modified (via val(String)) value of input element" );

	$("text1").val(valueObj( undefined ));
	equals( document.getElementById("text1").value, "", "Check for modified (via val(undefined)) value of input element" );

	$("text1").val(valueObj( 67 ));
	equals( document.getElementById("text1").value, "67", "Check for modified (via val(Number)) value of input element" );

	$("text1").val(valueObj( null ));
	equals( document.getElementById("text1").value, "", "Check for modified (via val(null)) value of input element" );

	var $select1 = $("select1");
	$select1.val(valueObj( "3" ));
	equals( $select1.getText(), "3", "Check for modified (via val(String)) value of select element" );

	$select1.val(valueObj( 2 ));
	equals( $select1.getText(), "2", "Check for modified (via val(Number)) value of select element" );

	$select1.append("<option value='4'>four</option>");
	$select1.val(valueObj( 4 ));
	equals( $select1.getText(), "4", "Should be possible to set the getText() to a newly created option" );

	// using contents will get comments regular, text, and comment nodes
	var j = $("nonnodes").contents();
	j.val(valueObj( "asdf" ));
	equals( j.getText(), "asdf", "Check node,textnode,comment with getText()" );
	j.removeAttr("value");
}

test("val(String/Number)", function() {
	testVal(bareObj);
});

test("val(Function)", function() {
	testVal(functionReturningObj);
});

test( "val(Array of Numbers) (Bug #7123)", function() {
	expect(4);
	$("form").append("<input type='checkbox' name='arrayTest' value='1' /><input type='checkbox' name='arrayTest' value='2' /><input type='checkbox' name='arrayTest' value='3' checked='checked' /><input type='checkbox' name='arrayTest' value='4' />");
	var elements = jQuery("input[name=arrayTest]").val([ 1, 2 ]);
	ok( elements[0].checked, "First element was checked" );
	ok( elements[1].checked, "Second element was checked" );
	ok( !elements[2].checked, "Third element was unchecked" );
	ok( !elements[3].checked, "Fourth element remained unchecked" );

	elements.remove();
});

test("val(Function) with incoming value", function() {
	expect(10);

	QUnit.reset();
	var oldVal = $("text1").getText();

	$("text1").val(function(i, val) {
		equals( val, oldVal, "Make sure the incoming value is correct." );
		return "test";
	});

	equals( document.getElementById("text1").value, "test", "Check for modified (via val(String)) value of input element" );

	oldVal = $("text1").getText();

	$("text1").val(function(i, val) {
		equals( val, oldVal, "Make sure the incoming value is correct." );
		return 67;
	});

	equals( document.getElementById("text1").value, "67", "Check for modified (via val(Number)) value of input element" );

	oldVal = $("select1").getText();

	$("select1").val(function(i, val) {
		equals( val, oldVal, "Make sure the incoming value is correct." );
		return "3";
	});

	equals( $("select1").getText(), "3", "Check for modified (via val(String)) value of select element" );

	oldVal = $("select1").getText();

	$("select1").val(function(i, val) {
		equals( val, oldVal, "Make sure the incoming value is correct." );
		return 2;
	});

	equals( $("select1").getText(), "2", "Check for modified (via val(Number)) value of select element" );

	$("select1").append("<option value='4'>four</option>");

	oldVal = $("select1").getText();

	$("select1").val(function(i, val) {
		equals( val, oldVal, "Make sure the incoming value is correct." );
		return 4;
	});

	equals( $("select1").getText(), "4", "Should be possible to set the getText() to a newly created option" );
});

// testing if a form.reset() breaks a subsequent call to a select element's .getText() (in IE only)
test("val(select) after form.reset() (Bug #2551)", function() {
	expect(3);

	jQuery("<form id='kk' name='kk'><select id='kkk'><option value='cf'>cf</option><option 	value='gf'>gf</option></select></form>").appendTo("#qunit-fixture");

	$("kkk").val( "gf" );

	document.kk.reset();

	equal( $("kkk").value, "cf", "Check value of select after form reset." );
	equal( $("kkk").getText(), "cf", "Check value of select after form reset." );

	// re-verify the multi-select is not broken (after form.reset) by our fix for single-select
	same( $("select3").getText().split(','), ["1", "2"], "Call getText() on a multiple=\"multiple\" select" );

	$("kk").remove();
});

test("Element.prototype.addClass", function() {
	expect(9);

	var div = document.findAll("div");
	div.addClass( "test" );
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( !~div.get(i).className.indexOf("test") ) {
			pass = false;
		}
	}
	ok( pass, "Add Class" );

	// using contents will get regular, text, and comment nodes
	var j = $("nonnodes").contentDocument;
	j.addClass( "asdf" );
	ok( j.hasClass("asdf"), "Check node,textnode,comment for addClass" );

	div = Element.parse("<div/>");

	div.addClass( "test" );
	equals( div.getAttr("class"), "test", "Make sure there's no extra whitespace." );

	div.setAttr("class", " foo");
	div.addClass( valueObj("test") );
	equals( div.getAttr("class"), "foo test", "Make sure there's no extra whitespace." );

	div.setAttr("class", "foo");
	div.addClass( valueObj("bar baz") );
	equals( div.getAttr("class"), "foo bar baz", "Make sure there isn't too much trimming." );

	div.removeClass();
	div.addClass( valueObj("foo") ).addClass( valueObj("foo") )
	equal( div.getAttr("class"), "foo", "Do not add the same class twice in separate calls." );

	div.addClass( valueObj("fo") );
	equal( div.attr("class"), "foo fo", "Adding a similar class does not get interrupted." );
	div.removeClass().addClass("wrap2");
	ok( div.addClass("wrap").hasClass("wrap"), "Can add similarly named classes");

	div.removeClass();
	div.addClass( valueObj("bar bar") );
	equal( div.getAttr("class"), "bar", "Do not add the same class twice in the same call." );

});

var testRemoveClass = function(valueObj) {
	expect(7);

	var $divs =  document.findAll("div");

	$divs.addClass("test").removeClass( "test" );

	ok( !$divs.hasClass("test"), "Remove Class" );

	QUnit.reset();
	$divs = document.findAll("div");

	$divs.addClass("test").addClass("foo").addClass("bar");
	$divs.removeClass( "test" ).removeClass( "bar" ).removeClass( "foo" );

	ok( !$divs.hasClass("bar"), "Remove multiple classes" );

	QUnit.reset();
	$divs = document.findAll("div");

	// Make sure that a null value doesn't cause problems
	$divs.doms[0].addClass("test").removeClass( valueObj(null) );
	ok( $divs.eq(0).is(".test"), "Null value passed to removeClass" );

	$divs.eq(0).addClass("test").removeClass( valueObj("") );
	ok( $divs.eq(0).is(".test"), "Empty string passed to removeClass" );

	// using contents will get regular, text, and comment nodes
	var j = $("nonnodes").contents();
	j.removeClass( valueObj("asdf") );
	ok( !j.hasClass("asdf"), "Check node,textnode,comment for removeClass" );

	var div = document.createElement("div");
	div.className = " test foo ";

	jQuery(div).removeClass( valueObj("foo") );
	equals( div.className, "test", "Make sure remaining className is trimmed." );

	div.className = " test ";

	jQuery(div).removeClass( valueObj("test") );
	equals( div.className, "", "Make sure there is nothing left after everything is removed." );
};

test("removeClass(String) - simple", function() {
	testRemoveClass(bareObj);
});

test("removeClass(Function) - simple", function() {
	testRemoveClass(functionReturningObj);
});

test("removeClass(Function) with incoming value", function() {
	expect(48);

	var $divs = jQuery("div").addClass("test"), old = $divs.map(function(){
		return jQuery(this).attr("class");
	});

	$divs.removeClass(function(i, val) {
		if ( this.id !== "_firebugConsole" ) {
			equals( val, old[i], "Make sure the incoming value is correct." );
			return "test";
		}
	});

	ok( !$divs.is(".test"), "Remove Class" );

	QUnit.reset();
});

var testToggleClass = function(valueObj) {
	expect(17);

	var e = $("firstp");
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass( valueObj("test") );
	ok( e.is(".test"), "Assert class present" );
	e.toggleClass( valueObj("test") );
	ok( !e.is(".test"), "Assert class not present" );

	// class name with a boolean
	e.toggleClass( valueObj("test"), false );
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass( valueObj("test"), true );
	ok( e.is(".test"), "Assert class present" );
	e.toggleClass( valueObj("test"), false );
	ok( !e.is(".test"), "Assert class not present" );

	// multiple class names
	e.addClass("testA testB");
	ok( (e.is(".testA.testB")), "Assert 2 different classes present" );
	e.toggleClass( valueObj("testB testC") );
	ok( (e.is(".testA.testC") && !e.is(".testB")), "Assert 1 class added, 1 class removed, and 1 class kept" );
	e.toggleClass( valueObj("testA testC") );
	ok( (!e.is(".testA") && !e.is(".testB") && !e.is(".testC")), "Assert no class present" );

	// toggleClass storage
	e.toggleClass(true);
	ok( e[0].className === "", "Assert class is empty (data was empty)" );
	e.addClass("testD testE");
	ok( e.is(".testD.testE"), "Assert class present" );
	e.toggleClass();
	ok( !e.is(".testD.testE"), "Assert class not present" );
	ok( jQuery._data(e[0], "__className__") === "testD testE", "Assert data was stored" );
	e.toggleClass();
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );
	e.toggleClass(false);
	ok( !e.is(".testD.testE"), "Assert class not present" );
	e.toggleClass(true);
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );
	e.toggleClass();
	e.toggleClass(false);
	e.toggleClass();
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );

	// Cleanup
	e.removeClass("testD");
	jQuery.removeData(e[0], "__className__", true);
};

test("toggleClass(String|boolean|undefined[, boolean])", function() {
	testToggleClass(bareObj);
});

test("toggleClass(Function[, boolean])", function() {
	testToggleClass(functionReturningObj);
});

test("toggleClass(Fucntion[, boolean]) with incoming value", function() {
	expect(14);

	var e = $("firstp"), old = e.attr("class") || "";
	ok( !e.is(".test"), "Assert class not present" );

	e.toggleClass(function(i, val) {
		equal( old, val, "Make sure the incoming value is correct." );
		return "test";
	});
	ok( e.is(".test"), "Assert class present" );

	old = e.attr("class");

	e.toggleClass(function(i, val) {
		equal( old, val, "Make sure the incoming value is correct." );
		return "test";
	});
	ok( !e.is(".test"), "Assert class not present" );

	old = e.attr("class") || "";

	// class name with a boolean
	e.toggleClass(function(i, val, state) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, false, "Make sure that the state is passed in." );
		return "test";
	}, false );
	ok( !e.is(".test"), "Assert class not present" );

	old = e.attr("class") || "";

	e.toggleClass(function(i, val, state) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, true, "Make sure that the state is passed in." );
		return "test";
	}, true );
	ok( e.is(".test"), "Assert class present" );

	old = e.attr("class");

	e.toggleClass(function(i, val, state) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, false, "Make sure that the state is passed in." );
		return "test";
	}, false );
	ok( !e.is(".test"), "Assert class not present" );

	// Cleanup
	e.removeClass("test");
	jQuery.removeData(e[0], "__className__", true);
});

test("addClass, removeClass, hasClass", function() {
	expect(17);

	var jq = jQuery("<p>Hi</p>"), x = jq[0];

	jq.addClass("hi");
	equals( x.className, "hi", "Check single added class" );

	jq.addClass("foo bar");
	equals( x.className, "hi foo bar", "Check more added classes" );

	jq.removeClass();
	equals( x.className, "", "Remove all classes" );

	jq.addClass("hi foo bar");
	jq.removeClass("foo");
	equals( x.className, "hi bar", "Check removal of one class" );

	ok( jq.hasClass("hi"), "Check has1" );
	ok( jq.hasClass("bar"), "Check has2" );

	var jq = jQuery("<p class='class1\nclass2\tcla.ss3\n\rclass4'></p>");
	ok( jq.hasClass("class1"), "Check hasClass with line feed" );
	ok( jq.is(".class1"), "Check is with line feed" );
	ok( jq.hasClass("class2"), "Check hasClass with tab" );
	ok( jq.is(".class2"), "Check is with tab" );
	ok( jq.hasClass("cla.ss3"), "Check hasClass with dot" );
	ok( jq.hasClass("class4"), "Check hasClass with carriage return" );
	ok( jq.is(".class4"), "Check is with carriage return" );

	jq.removeClass("class2");
	ok( jq.hasClass("class2")==false, "Check the class has been properly removed" );
	jq.removeClass("cla");
	ok( jq.hasClass("cla.ss3"), "Check the dotted class has not been removed" );
	jq.removeClass("cla.ss3");
	ok( jq.hasClass("cla.ss3")==false, "Check the dotted class has been removed" );
	jq.removeClass("class4");
	ok( jq.hasClass("class4")==false, "Check the class has been properly removed" );
});

test("contents().hasClass() returns correct values", function() {
	expect(2);

	var $div = Element.parse("<div><span class='foo'></span><!-- comment -->text</div>"),
	$contents = $div.contentDocument;

	ok( $contents.hasClass("foo"), "Found 'foo' in $contents" );
	ok( !$contents.hasClass("undefined"), "Did not find 'undefined' in $contents (correctly)" );
});
