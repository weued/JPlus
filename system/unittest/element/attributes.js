module("Attributes");

var bareObj = function(value) { return value; };
var functionReturningObj = function(value) { return (function() { return value; }); };


test("Control.prototype.getAttr", function() {

	equal( Dom.get("text1").getAttr("type"), "text", "Check for type attribute" );
	equal( Dom.get("radio1").getAttr("type"), "radio", "Check for type attribute" );
	equal( Dom.get("check1").getAttr("type"), "checkbox", "Check for type attribute" );
	equal( Dom.get("simon1").getAttr("rel"), "bookmark", "Check for rel attribute" );
	equal( Dom.get("google").getAttr("title"), "Google!", "Check for title attribute" );
	equal( Dom.get("mark").getAttr("hreflang"), "en", "Check for hreflang attribute" );
	equal( Dom.get("en").getAttr("lang"), "en", "Check for lang attribute" );
	equal( Dom.get("simon").getAttr("class"), "blog link", "Check for class attribute" );
	equal( Dom.get("name").getAttr("name"), "name", "Check for name attribute" );
	equal( Dom.get("text1").getAttr("name"), "action", "Check for name attribute" );
	ok( Dom.get("form").getAttr("action").indexOf("formaction") >= 0, "Check for action attribute" );
	equal( Dom.get("text1").setAttr("value", "t").getAttr("value"), "t", "Check setting the value attribute" );
	equal( Dom.parse("<div value='t'></div>").getAttr("value"), "t", "Check setting custom attr named 'value' on a div" );
	equal( Dom.get("form").setAttr("blah", "blah").getAttr("blah"), "blah", "Set non-existant attribute on a form" );
	equal( Dom.get("foo").getAttr("height"), null, "Non existent height attribute should return undefined" );

	// [7472] & [3113] (form contains an input with name="action" or name="id")
	var extras = Dom.parse("<input name='id' name='name' />").appendTo("testForm");
	
	equal( Dom.get("form").setAttr("action","newformaction").getAttr("action"), "newformaction", "Check that action attribute was changed" );
	equal( Dom.get("testForm").getAttr("target"), null, "Retrieving target does not equal the input with name=target" );
	equal( Dom.get("testForm").setAttr("target", "newTarget").getAttr("target"), "newTarget", "Set target successfully on a form" );
	equal( Dom.get("testForm").getAttr("name"), null, "Retrieving name does not retrieve input with name=name" );
	
	equal( Dom.get("testForm").setAttr("id", null).getAttr("id"), null, "Retrieving id does not equal the input with name=id after id is removed" );
	extras.remove();

	equal( Dom.get("text1").getAttr("maxlength"), 30, "Check for maxlength attribute" );
	equal( Dom.get("text1").getAttr("maxLength"), 30, "Check for maxLength attribute" );
	equal( Dom.get("area1").getAttr("maxLength"), '30', "Check for maxLength attribute" );

	// using innerHTML in IE causes href attribute to be serialized to the full path
	Dom.parse("<a/>").set({ "id": "tAnchor5", "href": "#5" }).appendTo("qunit-fixture");
	equal( Dom.get("tAnchor5").getAttr("href"), "#5", "Check for non-absolute href (an anchor)" );

	// list attribute is readonly by default in browsers that support it
	Dom.get("list-test").setAttr("list", "datalist");
	equal( Dom.get("list-test").getAttr("list"), "datalist", "Check setting list attribute" );

	// Related to [5574] and [5683]
	var body = document.body, $body = Dom.get(body);

	strictEqual( $body.getAttr("foo"), null, "Make sure that a non existent attribute returns null" );

	body.setAttribute("foo", "baz");
	equal( $body.getAttr("foo"), "baz", "Make sure the dom attribute is retrieved when no expando is found" );

	$body.setAttr("foo","cool");
	equal( $body.getAttr("foo"), "cool", "Make sure that setting works well when both expando and dom attribute are available" );

	body.removeAttribute("foo"); // Cleanup

	// var select = document.createElement("select"), optgroup = document.createElement("optgroup"), option = document.createElement("option");
	// optgroup.appendChild( option );
	// select.appendChild( optgroup );

	// equal( Dom.get( option ).getAttr("selected"), true, "Make sure that a single option is selected, even when in an optgroup." );

	// var Dom.getimg = Dom.parse("<img style='display:none' width='215' height='53' src='http://static.jquery.com/files/rocker/images/logo_jquery_215x53.gif'/>").appendTo();
	// equal( Dom.getimg.getAttr("width"), "215", "Retrieve width attribute an an element with display:none." );
	// equal( Dom.getimg.getAttr("height"), "53", "Retrieve height attribute an an element with display:none." );
 
	// Check for style support
	//ok( !!~Dom.get("dl").getAttr("style").indexOf("position"), "Check style attribute getter, also normalize css props to lowercase" );
	ok( !!~Dom.get("foo").setAttr("style", "position:absolute;").getAttr("style").indexOf("position"), "Check style setter" );

	// Check value on button element (#1954)
	var $button = Dom.get("button").insert( "afterEnd", "<button value='foobar'>text</button>");
	
	equal( $button.getAttr("value"), "foobar", "Value retrieval on a button does not return innerHTML" );
	equal( $button.setAttr("value", "baz").getHtml(), "text", "Setting the value does not change innerHTML" );

	// Attributes with a colon on a table element (#1591)
	equal( Dom.get("table").getAttr("test:attrib"), null, "Retrieving a non-existent attribute on a table with a colon does not throw an error." );
	equal( Dom.get("table").setAttr("test:attrib", "foobar").getAttr("test:attrib"), "foobar", "Setting an attribute on a table with a colon does not throw an error." );

	var $form = Dom.parse("<form class='something'></form>").appendTo("qunit-fixture");
	equal( $form.getAttr("class"), "something", "Retrieve the class attribute on a form." );

	var $a = Dom.parse("<a href='#' onclick='something()'>Click</a>").appendTo("qunit-fixture");
	equal( $a.getAttr("onclick"), "something()", "Retrieve ^on attribute without anonymous function wrapper." );

	ok( Dom.parse("<div/>").getAttr("doesntexist") === null, "Make sure null is returned when no attribute is found." );
	ok( Dom.parse("<div/>").getAttr("title") === null, "Make sure null is returned when no attribute is found." );
	equal( Dom.parse("<div/>").setAttr("title", "something").getAttr("title"), "something", "Set the title attribute." );
	equal( Dom.parse("<div/>").getAttr("value"), null, "An unset value on a div returns undefined." );
	equal( Dom.parse("<input/>").getAttr("value"), "", "An unset value on an input returns current value." );
});

test("Control.prototype.setAttr", function() {

	var div = document.query("div").set("foo", "bar"),
		fail = false;

	for ( var i = 0; i < div.length; i++ ) {
		if ( div[i].getAttribute("foo") != "bar" ){
			fail = i;
			break;
		}
	}
  
	equal( fail, false, "Set Attribute, the #" + fail + " element didn't get the attribute 'foo'" );

	ok( Dom.get("foo").setAttr("width", null), "Try to set an attribute to nothing" );

	Dom.get("name").setAttr("name", "something");
	equal( Dom.get("name").getAttr("name"), "something", "Set name attribute" );
	Dom.get("name").setAttr("name", null);
	equal( Dom.get("name").getAttr("name"), null, "Remove name attribute" );
	var $input = Dom.parse("<input>").set({ name: "something" });
	equal( $input.getAttr("name"), "something", "Check element creation gets/sets the name attribute." );

	
	Dom.get("check2").setAttr("checked", false);
	equal( document.getElementById("check2").checked, false, "Set checked attribute" );
	equal( Dom.get("check2").getAttr("checked"), false, "Set checked attribute" );
	Dom.get("text1").setAttr("readonly", true);
	equal( document.getElementById("text1").readOnly, true, "Set readonly attribute" );
	equal( Dom.get("text1").getAttr("readonly"), true, "Set readonly attribute" );
	Dom.get("text1").setAttr("readonly", false);
	equal( document.getElementById("text1").readOnly, false, "Set readonly attribute" );
	equal( Dom.get("text1").getAttr("readonly"), false, "Set readonly attribute" );

	Dom.get("check2").dom.checked = true;
	equal( document.getElementById("check2").checked, true, "Set checked attribute" );
	equal( Dom.get("check2").getAttr("checked"), true, "Set checked attribute" );
	Dom.get("check2").dom.checked = false;
	equal( document.getElementById("check2").checked, false, "Set checked attribute" );
	equal( Dom.get("check2").getAttr("checked"), false, "Set checked attribute" );
	
	Dom.get("check2").setAttr("checked", "checked");
	equal( document.getElementById("check2").checked, true, "Set checked attribute with 'checked'" );
	equal( Dom.get("check2").getAttr("checked"), true, "Set checked attribute" );
	
	Dom.get("text1").dom.readOnly = true;
	equal( document.getElementById("text1").readOnly, true, "Set readonly attribute" );
	equal( Dom.get("text1").getAttr("readOnly"), true, "Set readonly attribute" );
	
	Dom.get("text1").dom.readOnly = false;
	equal( document.getElementById("text1").readOnly, false, "Set readonly attribute" );
	equal( Dom.get("text1").getAttr("readOnly"), false, "Set readonly attribute" );
	
	Dom.get("name").setAttr("maxlength", "5");
	equal( document.getElementById("name").maxLength, 5, "Set maxlength attribute" );
	Dom.get("name").setAttr("maxLength", "10");
	equal( document.getElementById("name").maxLength, 10, "Set maxlength attribute" );

	// HTML5 boolean attributes
	var $text = Dom.get("text1").setAttr("autofocus", true).setAttr("required", true);
	equal( $text.getAttr("autofocus"), true, "Set boolean attributes to the same name" );
	equal( $text.setAttr("autofocus", false).getAttr("autofocus"), false, "Setting autofocus attribute to false removes it" );
	equal( $text.getAttr("required"), true, "Set boolean attributes to the same name" );
	equal( $text.setAttr("required", false).getAttr("required"), false, "Setting required attribute to false removes it" );

	var $details = Dom.parse("<details open></details>");
	
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
	
	Dom.get("foo").setAttr("contenteditable", true);
	equal( Dom.get("foo").getAttr("contenteditable"), "true", "Enumerated attributes are set properly" );

	strictEqual( document.getAttr("nonexisting"), null, "attr works correctly for non existing attributes." );
		equal( document.setAttr("something", "foo" ).getAttr("something"), "foo", "attr falls back to prop on unsupported arguments" );

	var table = Dom.get("table");
	
	table.append("<tr><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr>");
	
	
	var td = table.find("td");
	td.setAttr("rowspan", "2");
	
	// FIXME:  why  ?
	// equal( td.rowSpan, 2, "Check rowspan is correctly set" );
	//    td.setAttr("colspan", "2");
	//    equal( td.colSpan, 2, "Check colspan is correctly set" );
	table.setAttr("cellspacing", "2");
	equal( table.dom.cellSpacing, "2", "Check cellspacing is correctly set" );
	equal( Dom.get("area1").getAttr("value"), "foobar", "Value attribute retrieves the property for backwards compatibility." );

	// for #1070
	Dom.get("name").setAttr("someAttr", "0");
	equal( Dom.get("name").getAttr("someAttr"), "0", "Set attribute to a string of \"0\"" );
	Dom.get("name").setAttr("someAttr", 0);
	equal( Dom.get("name").getAttr("someAttr"), "0", "Set attribute to the number 0" );
	Dom.get("name").setAttr("someAttr", 1);
	equal( Dom.get("name").getAttr("someAttr"), "1", "Set attribute to the number 1" );

	QUnit.reset();

	// Type
	var type = Dom.get("check2").getAttr("type");
	try {
		Dom.get("check2").setAttr("type","hidden");
	} catch(e) {
		
	}
	ok( true, "Exception thrown when trying to change type property" );
	// equal( type, Dom.get("check2").getAttr("type"), "Verify that you can't change the type of an input element" );

	var check = Dom.create("input");
	//var thrown = true;
	try {
		check.setAttr("type", "checkbox");
	} catch(e) {
		//thrown = false;
	}
	ok( true, "Exception thrown when trying to change type property" );
	//equal( "checkbox", check.getAttr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

	var check = Dom.parse("<input />");
	//var thrown = true;
	try {
		check.setAttr("type","checkbox");
	} catch(e) {
		//thrown = false;
	}
	ok( true, "Exception thrown when trying to change type property" );
	//equal( "checkbox", check.getAttr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

	var button = Dom.get("button");
	//var thrown = false;
	try {
		button.setAttr("type","submit");
	} catch(e) {
		//thrown = true;
	}
	ok( true, "Exception thrown when trying to change type property" );
	//equal( "button", button.getAttr("type"), "Verify that you can't change the type of a button element" );

	var $radio = Dom.parse("<input value='sup' type='radio'>").appendTo("testForm");
	
	equal( $radio.getText(), "sup", "Value is not reset when type is set after value on a radio" );
	// Setting attributes on svg element
	var $svg = Dom.parse("<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' baseProfile='full' width='200' height='200'>"
		+ "<circle cx='200' cy='200' r='150' />"
	+ "</svg>");
	
	if($svg.getFirst().dom.tagName == "SVG"){
		$svg = $svg.getFirst(); 	
	}
	
	
	
	
	$svg.appendTo();
	equal( $svg.setAttr("cx", 100).getAttr("cx"), "100", "Set attribute on svg element" );
	$svg.remove();
});

test("Control.prototype.set", function(){
	
	
   var pass = true;
	document.query("div").set({foo: "baz", zoo: "ping"}).each(function(node){
		if ( node.getAttribute("foo") != "baz" && node.getAttribute("zoo") != "ping" ) pass = false;
	});
	ok( pass, "Set Multiple Attributes" );		

	var elem = Dom.parse("<div />");

	// one at a time
	elem.set({innerHTML: "foo"});
	equal( elem.dom.innerHTML, "foo", "set(innerHTML)");

	elem.set({style: "color: red"});
	ok( /^(#ff0000|red)$/i.test(elem.dom.style.color), "set(css)");

	elem.set({height: 10});
	equal( elem.dom.style.height, "10px", "set(height)");

	// Multiple attributes

	elem.set({
		style:"padding-left:1px; padding-right:1px",
		width:10
	});

	equal( elem.dom.style.width, "10px", "set({...})");
	equal( elem.dom.style.paddingLeft, "1px", "set({...})");
	equal( elem.dom.style.paddingRight, "1px", "set({...})");
});

test("Control.prototype.getAttr('tabindex')", function() {

	// elements not natively tabbable
	equal(Dom.get("listWithTabIndex").getAttr("tabindex"), 5, "not natively tabbable, with tabindex set to 0");
	equal(Dom.get("divWithNoTabIndex").getAttr("tabindex") <= 0, true, "not natively tabbable, no tabindex set");

	// anchor with href
	equal(Dom.get("linkWithNoTabIndex").getAttr("tabindex"), 0, "anchor with href, no tabindex set");
	equal(Dom.get("linkWithTabIndex").getAttr("tabindex"), 2, "anchor with href, tabindex set to 2");
	equal(Dom.get("linkWithNegativeTabIndex").getAttr("tabindex"), -1, "anchor with href, tabindex set to -1");

	// anchor without href
	equal(Dom.get("linkWithNoHrefWithNoTabIndex").getAttr("tabindex") <= 0, true, "anchor without href, no tabindex set");
	equal(Dom.get("linkWithNoHrefWithTabIndex").getAttr("tabindex"), 1, "anchor without href, tabindex set to 2");
	equal(Dom.get("linkWithNoHrefWithNegativeTabIndex").getAttr("tabindex"), -1, "anchor without href, no tabindex set");
});

test("Control.prototype.setAttr('tabindex', value)", function() {

	var element = Dom.get("divWithNoTabIndex");
	//equal(element.getAttr("tabindex"), -1, "start with no tabindex");

	// set a positive string
	element.setAttr("tabindex", "1");
	equal(element.getAttr("tabindex"), 1, "set tabindex to 1 (string)");

	// set a zero string
	element.setAttr("tabindex", "0");
	equal(element.getAttr("tabindex"), 0, "set tabindex to 0 (string)");

	// set a negative string
	element.setAttr("tabindex", "-1");
	equal(element.getAttr("tabindex"), -1, "set tabindex to -1 (string)");

	// set a positive number
	element.setAttr("tabindex", 1);
	equal(element.getAttr("tabindex"), 1, "set tabindex to 1 (number)");

	// set a zero number
	element.setAttr("tabindex", 0);
	equal(element.getAttr("tabindex"), 0, "set tabindex to 0 (number)");

	// set a negative number
	element.setAttr("tabindex", -1);
	equal(element.getAttr("tabindex"), -1, "set tabindex to -1 (number)");

	element = Dom.get("linkWithTabIndex");
	equal(element.getAttr("tabindex"), 2, "start with tabindex 2");

	element.setAttr("tabindex", -1);
	equal(element.getAttr("tabindex"), -1, "set negative tabindex");
});

test("Control.prototype.setAttr(String, null)", function() {
	
	var form = Dom.get("form");
	// equal( Dom.get("mark").setAttr( "class", null ).dom.className, "", "remove class" );
	equal(   Dom.get("form").setAttr("id", null).getAttr("id"), null, "Remove id" );
	equal( Dom.get("foo").setAttr("style", "position:absolute;").setAttr("style", null).dom.style.cssText, "", "Check removing style attribute" );
	equal( form.setAttr("style", "position:absolute;").setAttr("style", null).dom.style.cssText, "", "Check removing style attribute on a form" );
	equal( Dom.parse("<div style='position: absolute'></div>").appendTo("foo").setAttr("style", null).dom.style.cssText, "", "Check removing style attribute (#9699 Webkit)" );
	equal( Dom.get("fx-test-group").setAttr("height", "3px").setAttr("height",  null).getStyle("height"), "1px", "Removing height attribute has no effect on height set with style attribute" );

	Dom.get("check1").setAttr("checked",  null).setAttr("checked", true).setAttr("checked", null);
	equal( document.getElementById("check1").checked, false, "removeAttr sets boolean properties to false" );
	Dom.get("text1").setAttr("readOnly", true).setAttr("readonly", null);
	equal( document.getElementById("text1").readOnly, false, "removeAttr sets boolean properties to false" );
});

if ( "value" in document.createElement("meter") &&
			"value" in document.createElement("progress") ) {

	test("getText() respects numbers without exception (Bug #9319)", function() {

		var $meter = Dom.parse("<meter min='0' max='10' value='5.6'></meter>"),
			$progress =  Dom.parse("<progress max='10' value='1.5'></progress>");

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
	
	Dom.parse("<form id='kk' name='kk'><select id='kkk'><option value='cf'>cf</option><option 	value='gf'>gf</option></select></form>").appendTo("qunit-fixture");

	Dom.get("kkk").setText( "gf" );

	document.kk.reset();

	equal( Dom.get("kkk").dom.value, "cf", "Check value of select after form reset." );
	equal( Dom.get("kkk").getText(), "cf", "Check value of select after form reset." );

	// re-verify the multi-select is not broken (after form.reset) by our fix for single-select
	//deepEqual( Dom.get("select3").getText().split(','), ["1", "2"], "Call getText() on a multiple=\"multiple\" select" );

	Dom.get("kk").remove();
});

test("Control.prototype.addClass", function() {

	var div = document.query("div");
	div.addClass( "test" );
	var pass = true;
	for ( var i = 0; i < div.length; i++ ) {
		if ( !~div[i].className.indexOf("test") ) {
			pass = false;
		}
	}
	ok( pass, "Add Class" );

	div = Dom.parse("<div/>");

	div.addClass( "test" );
	equal( div.getAttr("class"), "test", "Make sure there's no extra whitespace." );

	// div.setAttr("class", " foo");
	// div.addClass( "test" );
	// equal( div.getAttr("class"), "foo test", "Make sure there's no extra whitespace." );

	div.setAttr("class", "foo");
	div.addClass( "bar baz" );
	equal( div.getAttr("class"), "foo bar baz", "Make sure there isn't too much trimming." );

	div.removeClass();
	div.addClass( "foo" ).addClass( "foo" )
	equal( div.getAttr("class"), "foo", "Do not add the same class twice in separate calls." );

	div.addClass( "fo" );
	equal( div.getAttr("class"), "foo fo", "Adding a similar class does not get interrupted." );
	div.removeClass().addClass("wrap2");
	ok( div.addClass("wrap").hasClass("wrap"), "Can add similarly named classes");

	div.removeClass();
	div.addClass( "bar bar" );
	equal( div.getAttr("class"), "bar", "Do not add the same class twice in the same call." );

});

test("Control.prototype.removeClass", function() {

	var $divs =  document.query("div");

	$divs.addClass("test").removeClass( "test" );

	ok( !$divs.item(0).hasClass("test"), "Remove Class" );

	QUnit.reset();
	$divs = document.query("div");

	$divs.addClass("test").addClass("foo").addClass("bar");
	$divs.removeClass( "test" ).removeClass( "bar" ).removeClass( "foo" );

	ok( !$divs.item(0).hasClass("bar"), "Remove multiple classes" );

	QUnit.reset();
	$divs = document.query("div");

	// Make sure that a null value doesn't cause problems
	// $divs[0].addClass("test").removeClass( null );
	// ok( $divs[0].hasClass("test"), "Null value passed to removeClass" );

	//$divs[0].addClass("test").removeClass( "" );
	//ok( $divs[0].hasClass("test"), "Empty string passed to removeClass" );

	var div = document.createElement("div");
	div.className = " test foo ";

	Dom.get(div).removeClass( "foo" );
	equal( div.className, "test", "Make sure remaining className is trimmed." );

	div.className = " test ";

	Dom.get(div).removeClass( "test" );
	equal( div.className, "", "Make sure there is nothing left after everything is removed." );
});

test("Control.prototype.toggleClass", function() {

	var e = Dom.get("firstp");
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
	// ok( e.dom.className === "", "Assert class is empty (data was empty)" );
	e.addClass("testD testE");
	ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present" );
	//e.toggleClass(e.dom.className);
	//ok( !e.hasClass("testD") || !e.hasClass("testE"), "Assert class not present" );
	//e.toggleClass(e.dom.className);
	//ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present (restored from data)" );
	//e.toggleClass(e.dom.className, false);
	//ok( !e.hasClass("testD") || !e.hasClass("testE"), "Assert class not present" );
	//e.toggleClass(e.dom.className, true);
	//ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present (restored from data)" );
	//e.toggleClass(e.dom.className);
	//e.toggleClass(e.dom.className, false);
	//e.toggleClass(e.dom.className);
	//ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present (restored from data)" );

	// Cleanup
	e.removeClass("testD");
});

test("addClass, removeClass, hasClass", function() {

	var x = Dom.parse("<p>Hi</p>");

	x.addClass("hi");
	equal( x.dom.className, "hi", "Check single added class" );

	x.addClass("foo bar");
	equal( x.dom.className, "hi foo bar", "Check more added classes" );

	x.removeClass();
	equal( x.dom.className, "", "Remove all classes" );

	x.addClass("hi foo bar");
	x.removeClass("foo");
	equal( x.dom.className, "hi bar", "Check removal of one class" );

	ok( x.hasClass("hi"), "Check has1" );
	ok( x.hasClass("bar"), "Check has2" );

	// var x = Dom.parse("<p class='class1\nclass2\tcla.ss3\n\rclass4'></p>");
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