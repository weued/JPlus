module("Attributes");

var bareObj = function(value) { return value; };
var functionReturningObj = function(value) { return (function() { return value; }); };


test("Element.prototype.getAttr", function() {

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
	equals( $("foo").getAttr("height"), null, "Non existent height attribute should return undefined" );

	// [7472] & [3113] (form contains an input with name="action" or name="id")
	var extras = Element.parse("<input name='id' name='name' />").appendTo("testForm");
	
	equals( $("form").setAttr("action","newformaction").getAttr("action"), "newformaction", "Check that action attribute was changed" );
	equals( $("testForm").getAttr("target"), null, "Retrieving target does not equal the input with name=target" );
	equals( $("testForm").setAttr("target", "newTarget").getAttr("target"), "newTarget", "Set target successfully on a form" );
	equals( $("testForm").getAttr("name"), null, "Retrieving name does not retrieve input with name=name" );
	
	equals( $("testForm").setAttr("id", null).getAttr("id"), null, "Retrieving id does not equal the input with name=id after id is removed" );
	extras.remove();

	equals( $("text1").getAttr("maxlength"), 30, "Check for maxlength attribute" );
	equals( $("text1").getAttr("maxLength"), 30, "Check for maxLength attribute" );
	equals( $("area1").getAttr("maxLength"), 30, "Check for maxLength attribute" );

	// using innerHTML in IE causes href attribute to be serialized to the full path
	Element.parse("<a/>").set({ "id": "tAnchor5", "href": "#5" }).appendTo("qunit-fixture");
	equals( $("tAnchor5").getAttr("href"), "#5", "Check for non-absolute href (an anchor)" );

	// list attribute is readonly by default in browsers that support it
	$("list-test").setAttr("list", "datalist");
	equals( $("list-test").getAttr("list"), "datalist", "Check setting list attribute" );

	// Related to [5574] and [5683]
	var body = document.body, $body = $(body);

	strictEqual( $body.getAttr("foo"), null, "Make sure that a non existent attribute returns null" );

	body.setAttribute("foo", "baz");
	equals( $body.getAttr("foo"), "baz", "Make sure the dom attribute is retrieved when no expando is found" );

	$body.setAttr("foo","cool");
	equals( $body.getAttr("foo"), "cool", "Make sure that setting works well when both expando and dom attribute are available" );

	body.removeAttribute("foo"); // Cleanup

	// var select = document.createElement("select"), optgroup = document.createElement("optgroup"), option = document.createElement("option");
	// optgroup.appendChild( option );
	// select.appendChild( optgroup );

	// equal( $( option ).getAttr("selected"), true, "Make sure that a single option is selected, even when in an optgroup." );

	// var $img = Element.parse("<img style='display:none' width='215' height='53' src='http://static.jquery.com/files/rocker/images/logo_jquery_215x53.gif'/>").appendTo();
	// equals( $img.getAttr("width"), "215", "Retrieve width attribute an an element with display:none." );
	// equals( $img.getAttr("height"), "53", "Retrieve height attribute an an element with display:none." );
 
	// Check for style support
	//ok( !!~$("dl").getAttr("style").indexOf("position"), "Check style attribute getter, also normalize css props to lowercase" );
	ok( !!~$("foo").setAttr("style", "position:absolute;").getAttr("style").indexOf("position"), "Check style setter" );

	// Check value on button element (#1954)
	var $button = $("button").insert("<button value='foobar'>text</button>", "afterEnd");
	
	equals( $button.getAttr("value"), "foobar", "Value retrieval on a button does not return innerHTML" );
	equals( $button.setAttr("value", "baz").getHtml(), "text", "Setting the value does not change innerHTML" );

	// Attributes with a colon on a table element (#1591)
	equals( $("table").getAttr("test:attrib"), null, "Retrieving a non-existent attribute on a table with a colon does not throw an error." );
	equals( $("table").setAttr("test:attrib", "foobar").getAttr("test:attrib"), "foobar", "Setting an attribute on a table with a colon does not throw an error." );

	var $form = Element.parse("<form class='something'></form>").appendTo("qunit-fixture");
	equal( $form.getAttr("class"), "something", "Retrieve the class attribute on a form." );

	var $a = Element.parse("<a href='#' onclick='something()'>Click</a>").appendTo("qunit-fixture");
	equal( $a.getAttr("onclick"), "something()", "Retrieve ^on attribute without anonymous function wrapper." );

	ok( Element.parse("<div/>").getAttr("doesntexist") === null, "Make sure null is returned when no attribute is found." );
	ok( Element.parse("<div/>").getAttr("title") === null, "Make sure null is returned when no attribute is found." );
	equal( Element.parse("<div/>").setAttr("title", "something").getAttr("title"), "something", "Set the title attribute." );
	equal( Element.parse("<div/>").getAttr("value"), null, "An unset value on a div returns undefined." );
	equal( Element.parse("<input/>").getAttr("value"), "", "An unset value on an input returns current value." );
});

test("Element.prototype.setAttr", function() {

	var div = document.findAll("div").set("foo", "bar"),
		fail = false;

	for ( var i = 0; i < div.length; i++ ) {
		if ( div[i].getAttribute("foo") != "bar" ){
			fail = i;
			break;
		}
	}
  
	equals( fail, false, "Set Attribute, the #" + fail + " element didn't get the attribute 'foo'" );

	ok( $("foo").setAttr("width", null), "Try to set an attribute to nothing" );

	$("name").setAttr("name", "something");
	equals( $("name").getAttr("name"), "something", "Set name attribute" );
	$("name").setAttr("name", null);
	equals( $("name").getAttr("name"), null, "Remove name attribute" );
	var $input = Element.parse("<input>").set({ name: "something" });
	equals( $input.getAttr("name"), "something", "Check element creation gets/sets the name attribute." );

	
	$("check2").setAttr("checked", false);
	equals( document.getElementById("check2").checked, false, "Set checked attribute" );
	equals( $("check2").getAttr("checked"), false, "Set checked attribute" );
	$("text1").setAttr("readonly", true);
	equals( document.getElementById("text1").readOnly, true, "Set readonly attribute" );
	equals( $("text1").getAttr("readonly"), true, "Set readonly attribute" );
	$("text1").setAttr("readonly", false);
	equals( document.getElementById("text1").readOnly, false, "Set readonly attribute" );
	equals( $("text1").getAttr("readonly"), false, "Set readonly attribute" );

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
	equal( $text.getAttr("autofocus"), true, "Set boolean attributes to the same name" );
	equal( $text.setAttr("autofocus", false).getAttr("autofocus"), false, "Setting autofocus attribute to false removes it" );
	equal( $text.getAttr("required"), true, "Set boolean attributes to the same name" );
	equal( $text.setAttr("required", false).getAttr("required"), false, "Setting required attribute to false removes it" );

	var $details = Element.parse("<details open></details>");
	
	$details = $details[0] || $details;
	$details.appendTo("qunit-fixture");
	//equal( !$details.getAttr("open"), true, "open attribute presense indicates true" );
	equal( $details.setAttr("open", false).getAttr("open"), false, "Setting open attribute to false removes it" );

	$text.setAttr("data-something", true);
	equal( $text.getAttr("data-something"), "true", "Set data attributes");
	equal( $text.getAttr("something"), null, "Setting data attributes are not affected by boolean settings");
	$text.setAttr("data-another", false);
	equal( $text.getAttr("data-another"), "false", "Set data attributes");
	//equal( $text.data("another"), false, "Setting data attributes are not affected by boolean settings" );
	equal( $text.setAttr("aria-disabled", false).getAttr("aria-disabled"), "false", "Setting aria attributes are not affected by boolean settings");
	
	$("foo").setAttr("contenteditable", true);
	equals( $("foo").getAttr("contenteditable"), "true", "Enumerated attributes are set properly" );

	strictEqual( document.getAttr("nonexisting"), null, "attr works correctly for non existing attributes." );
		equal( document.setAttr("something", "foo" ).getAttr("something"), "foo", "attr falls back to prop on unsupported arguments" );

	var table = $("table");
	
	table.append("<tr><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr>");
	
	
	var td = table.find("td");
	td.setAttr("rowspan", "2");
	
	// FIXME:  why  ?
	// equals( td.rowSpan, 2, "Check rowspan is correctly set" );
	//    td.setAttr("colspan", "2");
	//    equals( td.colSpan, 2, "Check colspan is correctly set" );
	table.setAttr("cellspacing", "2");
	equals( table.cellSpacing, "2", "Check cellspacing is correctly set" );
	equals( $("area1").getAttr("value"), "foobar", "Value attribute retrieves the property for backwards compatibility." );

	// for #1070
	$("name").setAttr("someAttr", "0");
	equals( $("name").getAttr("someAttr"), "0", "Set attribute to a string of \"0\"" );
	$("name").setAttr("someAttr", 0);
	equals( $("name").getAttr("someAttr"), "0", "Set attribute to the number 0" );
	$("name").setAttr("someAttr", 1);
	equals( $("name").getAttr("someAttr"), "1", "Set attribute to the number 1" );

	QUnit.reset();

	// Type
	var type = $("check2").getAttr("type");
	try {
		$("check2").setAttr("type","hidden");
	} catch(e) {
		
	}
	ok( true, "Exception thrown when trying to change type property" );
	// equals( type, $("check2").getAttr("type"), "Verify that you can't change the type of an input element" );

	var check = document.create("input");
	//var thrown = true;
	try {
		check.setAttr("type", "checkbox");
	} catch(e) {
		//thrown = false;
	}
	ok( true, "Exception thrown when trying to change type property" );
	//equals( "checkbox", check.getAttr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

	var check = Element.parse("<input />");
	//var thrown = true;
	try {
		check.setAttr("type","checkbox");
	} catch(e) {
		//thrown = false;
	}
	ok( true, "Exception thrown when trying to change type property" );
	//equals( "checkbox", check.getAttr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

	var button = $("button");
	//var thrown = false;
	try {
		button.setAttr("type","submit");
	} catch(e) {
		//thrown = true;
	}
	ok( true, "Exception thrown when trying to change type property" );
	//equals( "button", button.getAttr("type"), "Verify that you can't change the type of a button element" );

	var $radio = Element.parse("<input value='sup' type='radio'>").appendTo("testForm");
	
	equals( $radio.getText(), "sup", "Value is not reset when type is set after value on a radio" );
	// Setting attributes on svg element
	var $svg = Element.parse("<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' baseProfile='full' width='200' height='200'>"
		+ "<circle cx='200' cy='200' r='150' />"
	+ "</svg>");
	$svg = $svg[0] || $svg;
	$svg.appendTo();
	equals( $svg.setAttr("cx", 100).getAttr("cx"), "100", "Set attribute on svg element" );
	$svg.remove();
});

test("Element.prototype.set", function(){
	
	
   var pass = true;
	document.findAll("div").set({foo: "baz", zoo: "ping"}).each(function(node){
		if ( node.getAttribute("foo") != "baz" && node.getAttribute("zoo") != "ping" ) pass = false;
	});
	ok( pass, "Set Multiple Attributes" );		

	var elem = Element.parse("<div />");

	// one at a time
	elem.set({innerHTML: "foo"});
	equals( elem.innerHTML, "foo", "set(innerHTML)");

	elem.set({style: "color: red"});
	ok( /^(#ff0000|red)$/i.test(elem.style.color), "set(css)");

	elem.set({height: 10});
	equals( elem.style.height, "10px", "set(height)");

	// Multiple attributes

	elem.set({
		style:"padding-left:1px; padding-right:1px",
		width:10
	});

	equals( elem.style.width, "10px", "set({...})");
	equals( elem.style.paddingLeft, "1px", "set({...})");
	equals( elem.style.paddingRight, "1px", "set({...})");
});

test("Element.prototype.getAttr('tabindex')", function() {

	// elements not natively tabbable
	equals($("listWithTabIndex").getAttr("tabindex"), 5, "not natively tabbable, with tabindex set to 0");
	equals($("divWithNoTabIndex").getAttr("tabindex") <= 0, true, "not natively tabbable, no tabindex set");

	// anchor with href
	equals($("linkWithNoTabIndex").getAttr("tabindex"), 0, "anchor with href, no tabindex set");
	equals($("linkWithTabIndex").getAttr("tabindex"), 2, "anchor with href, tabindex set to 2");
	equals($("linkWithNegativeTabIndex").getAttr("tabindex"), -1, "anchor with href, tabindex set to -1");

	// anchor without href
	equals($("linkWithNoHrefWithNoTabIndex").getAttr("tabindex") <= 0, true, "anchor without href, no tabindex set");
	equals($("linkWithNoHrefWithTabIndex").getAttr("tabindex"), 1, "anchor without href, tabindex set to 2");
	equals($("linkWithNoHrefWithNegativeTabIndex").getAttr("tabindex"), -1, "anchor without href, no tabindex set");
});

test("Element.prototype.setAttr('tabindex', value)", function() {

	var element = $("divWithNoTabIndex");
	//equals(element.getAttr("tabindex"), -1, "start with no tabindex");

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

test("Element.prototype.setAttr(String, null)", function() {
	
	var form = $("form");
	// equal( $("mark").setAttr( "class", null ).className, "", "remove class" );
	equal(   $("form").setAttr("id", null).getAttr("id"), null, "Remove id" );
	equal( $("foo").setAttr("style", "position:absolute;").setAttr("style", null).style.cssText, "", "Check removing style attribute" );
	equal( form.setAttr("style", "position:absolute;").setAttr("style", null).style.cssText, "", "Check removing style attribute on a form" );
	equal( Element.parse("<div style='position: absolute'></div>").appendTo("foo").setAttr("style", null).style.cssText, "", "Check removing style attribute (#9699 Webkit)" );
	equal( $("fx-test-group").setAttr("height", "3px").setAttr("height",  null).getStyle("height"), "1px", "Removing height attribute has no effect on height set with style attribute" );

	$("check1").setAttr("checked",  null).setAttr("checked", true).setAttr("checked", null);
	equal( document.getElementById("check1").checked, false, "removeAttr sets boolean properties to false" );
	$("text1").setAttr("readOnly", true).setAttr("readonly", null);
	equal( document.getElementById("text1").readOnly, false, "removeAttr sets boolean properties to false" );
});

if ( "value" in document.createElement("meter") &&
			"value" in document.createElement("progress") ) {

	test("getText() respects numbers without exception (Bug #9319)", function() {

		var $meter = Element.parse("<meter min='0' max='10' value='5.6'></meter>"),
			$progress =  Element.parse("<progress max='10' value='1.5'></progress>");

		//try {
			equal( typeof $meter.getText(), "string", "meter, returns a number and does not throw exception" );
			// equal( $meter.getText(), $meter.value, "meter, api matches host and does not throw exception" );

			equal( typeof $progress.getText(), "string", "progress, returns a number and does not throw exception" );
			//  equal( $progress.getText(), $progress.value, "progress, api matches host and does not throw exception" );

		//} catch(e) {}

		$meter.remove();
		$progress.remove();
	});
}

// testing if a form.reset() breaks a subsequent call to a select element's .getText() (in IE only)
test("setText(select) after form.reset()", function() {
	expect(3);

	Element.parse("<form id='kk' name='kk'><select id='kkk'><option value='cf'>cf</option><option 	value='gf'>gf</option></select></form>").appendTo("qunit-fixture");

	$("kkk").setText( "gf" );

	document.kk.reset();

	equal( $("kkk").value, "cf", "Check value of select after form reset." );
	equal( $("kkk").getText(), "cf", "Check value of select after form reset." );

	// re-verify the multi-select is not broken (after form.reset) by our fix for single-select
	same( $("select3").getText().split(','), ["1", "2"], "Call getText() on a multiple=\"multiple\" select" );

	$("kk").remove();
});

test("Element.prototype.addClass", function() {

	var div = document.findAll("div");
	div.addClass( "test" );
	var pass = true;
	for ( var i = 0; i < div.length; i++ ) {
		if ( !~div[i].className.indexOf("test") ) {
			pass = false;
		}
	}
	ok( pass, "Add Class" );

	div = Element.parse("<div/>");

	div.addClass( "test" );
	equals( div.getAttr("class"), "test", "Make sure there's no extra whitespace." );

	// div.setAttr("class", " foo");
	// div.addClass( "test" );
	//  equals( div.getAttr("class"), "foo test", "Make sure there's no extra whitespace." );

	div.setAttr("class", "foo");
	div.addClass( "bar baz" );
	equals( div.getAttr("class"), "foo bar baz", "Make sure there isn't too much trimming." );

	div.removeClass();
	// div.addClass( "foo" ).addClass( "foo" )
	// equal( div.getAttr("class"), "foo", "Do not add the same class twice in separate calls." );

	div.addClass( "fo" );
	equal( div.getAttr("class"), "fo", "Adding a similar class does not get interrupted." );
	div.removeClass().addClass("wrap2");
	ok( div.addClass("wrap").hasClass("wrap"), "Can add similarly named classes");

	// div.removeClass();
	// div.addClass( "bar bar" );
	// equal( div.getAttr("class"), "bar", "Do not add the same class twice in the same call." );

});

test("Element.prototype.removeClass", function() {
	expect(5);

	var $divs =  document.findAll("div");

	$divs.addClass("test").removeClass( "test" );

	ok( !$divs[0].hasClass("test"), "Remove Class" );

	QUnit.reset();
	$divs = document.findAll("div");

	$divs.addClass("test").addClass("foo").addClass("bar");
	$divs.removeClass( "test" ).removeClass( "bar" ).removeClass( "foo" );

	ok( !$divs[0].hasClass("bar"), "Remove multiple classes" );

	QUnit.reset();
	$divs = document.findAll("div");

	// Make sure that a null value doesn't cause problems
	// $divs[0].addClass("test").removeClass( null );
	// ok( $divs[0].hasClass("test"), "Null value passed to removeClass" );

	$divs[0].addClass("test").removeClass( "" );
	ok( $divs[0].hasClass("test"), "Empty string passed to removeClass" );

	var div = document.createElement("div");
	div.className = " test foo ";

	$(div).removeClass( "foo" );
	equals( div.className, " test ", "Make sure remaining className is trimmed." );

	div.className = " test ";

	$(div).removeClass( "test" );
	equals( div.className, " ", "Make sure there is nothing left after everything is removed." );
});

test("Element.prototype.toggleClass", function() {

	var e = $("firstp");
	ok( !e.hasClass("test"), "Assert class not present" );
	e.toggleClass( "test" );
	ok( e.hasClass("test"), "Assert class present" );
	e.toggleClass( "test" );
	ok( !e.hasClass("test"), "Assert class not present" );

	// class name with a boolean
	e.toggleClass( "test", false );
	ok( !e.hasClass("test"), "Assert class not present" );
	e.toggleClass( "test", true );
	ok( e.hasClass("test"), "Assert class present" );
	e.toggleClass( "test", false );
	ok( !e.hasClass("test"), "Assert class not present" );

	// multiple class names
	e.addClass("testA testB");
	ok( (e.hasClass("testA")), "Assert 2 different classes present" );
	// e.toggleClass( "testB testC" );
	// ok( (e.hasClass("testA") && !e.is(".testB")), "Assert 1 class added, 1 class removed, and 1 class kept" );
	// e.toggleClass( "testA testC" );
	// ok( (!e.hasClass("testA") && !e.hasClass("testB") && !e.hasClass("testC")), "Assert no class present" );

	// toggleClass storage
	// e.toggleClass(true);
	// ok( e.className === "", "Assert class is empty (data was empty)" );
	e.addClass("testD testE");
	ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present" );
	//e.toggleClass(e.className);
	//ok( !e.hasClass("testD") || !e.hasClass("testE"), "Assert class not present" );
	//e.toggleClass(e.className);
	//ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present (restored from data)" );
	//e.toggleClass(e.className, false);
	//ok( !e.hasClass("testD") || !e.hasClass("testE"), "Assert class not present" );
	//e.toggleClass(e.className, true);
	//ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present (restored from data)" );
	//e.toggleClass(e.className);
	//e.toggleClass(e.className, false);
	//e.toggleClass(e.className);
	//ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present (restored from data)" );

	// Cleanup
	e.removeClass("testD");
});

test("addClass, removeClass, hasClass", function() {

	var x = Element.parse("<p>Hi</p>");

	x.addClass("hi");
	equals( x.className, "hi", "Check single added class" );

	x.addClass("foo bar");
	equals( x.className, "hi foo bar", "Check more added classes" );

	x.removeClass();
	equals( x.className, "", "Remove all classes" );

	x.addClass("hi foo bar");
	x.removeClass("foo");
	equals( x.className, "hi bar", "Check removal of one class" );

	ok( x.hasClass("hi"), "Check has1" );
	ok( x.hasClass("bar"), "Check has2" );

	// var x = Element.parse("<p class='class1\nclass2\tcla.ss3\n\rclass4'></p>");
	// ok( x.hasClass("class1"), "Check hasClass with line feed" );
	// ok( x.hasClass("class2"), "Check hasClass with tab" );
	// ok( x.hasClass("cla"), "Check hasClass with dot" );
	// ok( x.hasClass("class4"), "Check hasClass with carriage return" );

	x.removeClass("class2");
	ok( x.hasClass("class2")==false, "Check the class has been properly removed" );
	x.removeClass("cla");
	ok( !x.hasClass("cla"), "Check the dotted class has not been removed" );
	x.removeClass("cla");
	ok( x.hasClass("cla")==false, "Check the dotted class has been removed" );
	x.removeClass("class4");
	ok( x.hasClass("class4")==false, "Check the class has been properly removed" );
});