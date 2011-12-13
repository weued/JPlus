module("Manipulation");

var bareObj = function(value) { return value; };
var functionReturningObj = function(value) { return (function() { return value; }); };

test("Element.prototype.getText", function() {
	
	var expected = "This link has class=\"blog\": Simon Willison's Weblog";
	equals( $("sap").getText().replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for merged text of more then one element." );

	// Check serialization of text values
	equals( new Control(document.createTextNode("foo")).getText(), "foo", "Text node was retreived from .getText()." );

	var val = "<div><b>Hello</b> cruel world!</div>";
	equals( $("foo").setText(val).innerHTML.replace(/>/g, "&gt;"), "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );

	document.getElementById("text1").value = "bla";
	equals( $("text1").getText(), "bla", "Check for modified value of input element" );

	QUnit.reset();

	equals( $("text1").getText(), "Test", "Check for value of input element" );
	// ticket #1714 this caused a JS error in IE
	equals( $("first").getText(), "Try them out:", "Check a paragraph element to see if it has a value" );
	
	equals( $("select2").getText(), "3", "Call getText() on a single=\"single\" select" );

	same( $("select3").getText(), "1,2", "Call getText() on a multiple=\"multiple\" select" );

	equals( $("option3c").getText(), "2", "Call getText() on a option element with value" );

	equals( $("option3a").getText(), "Nothing", "Call getText() on a option element with empty value" );

	equals( $("option3e").getText(), "no value", "Call getText() on a option element with no value attribute" );

	equals( $("option3a").getText(), "Nothing", "Call getText() on a option element with no value attribute" );

	$("select3").setText("");
	same( $("select3").getText(), "", "Call getText() on a multiple=\"multiple\" select" );

	same( $("select4").getText(), "1,2,3", "Call getText() on multiple=\"multiple\" select with all disabled options" );

	$("select4").setAttr("disabled", true);
	same( $("select4").getText(), "1,2,3", "Call getText() on disabled multiple=\"multiple\" select" );

	equals( $("select5").getText(), "3", "Check value on ambiguous select." );

	$("select5").setText(1);
	equals( $("select5").getText(), "1", "Check value on ambiguous select." );

	$("select5").setText(3);
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

	//   checks.remove();

	var $button = $("button").insert("<button value='foobar'>text</button>", "afterEnd");
	equals( $button.getText(), "text", "Value retrieval on a button does not return innerHTML" );
	equals( $button.setText("baz").getHtml(), "baz", "Setting the value does not change innerHTML" );

	//   equals( Element.parse("<option/>").setText("test").getAttr("value"), "test", "Setting value sets the value attribute" );
});


/*  


test("Element.prototype.wrap", function() {
	var defaultText = "Try them out:"
	var result = $("first").wrap( "<div class='red'><span></span></div>").getText();
	equals( defaultText, result, "Check for wrapping of on-the-fly html" );
	ok( $("first").get('parent').get('parent').hasClass("red"), "Check if wrapper has class 'red'" );

	QUnit.reset();
	var defaultText = "Try them out:";
	$("first").wrap(document.getElementById("empty"));
	var result = $("first").get('parent');
	equals( result.tagName, "OL", "Check for element wrapping" );
	equals( result.getText(), defaultText, "Check for element wrapping" );

	QUnit.reset();
	$("check1").on('click', function() {
		var checkbox = this;
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action" );
		$(checkbox).wrap( "<div id='c1' style='display:none;'></div>");
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action" );
	}).trigger('click')     ;

	var j = Element.parse("<label/>");
	j.wrap( "<li/>");
	equals( j.nodeName.toUpperCase(), "LABEL", "Element is a label" );
	equals( j.parentNode.nodeName.toUpperCase(), "LI", "Element has been wrapped" );
	
	// wrap an element containing a text node
	j = Element.parse("<span/>");
	j.wrap("<div>test</div>");
	equals( j.previousSibling.nodeType, 3, "Make sure the previous node is a text element" );
	equals( j.parentNode.nodeName.toUpperCase(), "DIV", "And that we're in the div element." );

	// Try to wrap an element with multiple elements (should fail)
	//j = Element.parse("<div><span></span></div>").get('children');
	//j.wrap("<p></p><div></div>");
	//equals( j[0].parentNode.parentNode.childNodes.length, 1, "There should only be one element wrapping." );
	//equals( j[0].parentNode.nodeName.toUpperCase(), "P", "The span should be in the paragraph." );

	j = Element.parse("<span/>");
	j.wrap("<div></div>");
	
	equals( j.parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	// wrap an element with a Element.parse set and event
	result = Element.parse("<div></div>").on('click', function(){
		ok(true, "Event triggered.");

		// Remove handlers on detached elements
		this.un();
	});

	j = Element.parse("<span/>");
	j.wrap(result);
	equals( j.parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	j.get('parent').trigger("click");

	// clean up attached elements
	QUnit.reset();
});


test("wrapAll(String|Element)", function() {
	expect(8);
	var prev = $("firstp")[0].previousSibling;
	var p = $("firstp,#first")[0].parentNode;

	var result = $("firstp,#first").wrapAll( "<div class='red'><div class='tmp'></div></div>" );
	equals( result.get('parent').length, 1, "Check for wrapping of on-the-fly html" );
	ok( $("first").get('parent').get('parent').is(".red"), "Check if wrapper has class 'red'" );
	ok( $("firstp").get('parent').get('parent').is(".red"), "Check if wrapper has class 'red'" );
	equals( $("first").get('parent').get('parent')[0].previousSibling, prev, "Correct Previous Sibling" );
	equals( $("first").get('parent').get('parent')[0].parentNode, p, "Correct Parent" );

	QUnit.reset();
	var prev = $("firstp")[0].previousSibling;
	var p = $("first")[0].parentNode;
	var result = $("firstp,#first").wrapAll( document.getElementById("empty") );
	equals( $("first").get('parent')[0], $("firstp").get('parent')[0], "Same Parent" );
	equals( $("first").get('parent')[0].previousSibling, prev, "Correct Previous Sibling" );
	equals( $("first").get('parent')[0].parentNode, p, "Correct Parent" );
});


test("wrapInner(String|Element)", function() {
	expect(11);
	var num = $("first").get('children').length;
	var result = $("first").wrapInner(val("<div class='red'><div id='tmp'></div></div>"));
	equals( $("first").get('children').length, 1, "Only one child" );
	ok( $("first").get('children').is(".red"), "Verify Right Element" );
	equals( $("first").get('children').get('children').get('children').length, num, "Verify Elements Intact" );

	QUnit.reset();
	var num = $("first").setHtml("foo<div>test</div><div>test2</div>").get('children').length;
	var result = $("first").wrapInner(val("<div class='red'><div id='tmp'></div></div>"));
	equals( $("first").get('children').length, 1, "Only one child" );
	ok( $("first").get('children').is(".red"), "Verify Right Element" );
	equals( $("first").get('children').get('children').get('children').length, num, "Verify Elements Intact" );

	QUnit.reset();
	var num = $("first").get('children').length;
	var result = $("first").wrapInner(val(document.getElementById("empty")));
	equals( $("first").get('children').length, 1, "Only one child" );
	ok( $("first").get('children').is("#empty"), "Verify Right Element" );
	equals( $("first").get('children').get('children').length, num, "Verify Elements Intact" );

	var div = Element.parse("<div/>");
	div.wrapInner(val("<span></span>"));
	equals(div.get('children').length, 1, "The contents were wrapped.");
	equals(div.get('children')[0].nodeName.toLowerCase(), "span", "A span was inserted.");
});

test("unwrap()", function() {
	expect(9);

	Element.parse("body").append("  <div id='unwrap' style='display: none;'> <div id='unwrap1'> <span class='unwrap'>a</span> <span class='unwrap'>b</span> </div> <div id='unwrap2'> <span class='unwrap'>c</span> <span class='unwrap'>d</span> </div> <div id='unwrap3'> <b><span class='unwrap unwrap3'>e</span></b> <b><span class='unwrap unwrap3'>f</span></b> </div> </div>");

	var abcd = $("unwrap1 > span, #unwrap2 > span").get(),
		abcdef = $("unwrap span").get();

	equals( $("unwrap1 span").add("#unwrap2 span:first").unwrap().length, 3, "make #unwrap1 and #unwrap2 go away" );
	same( $("unwrap > span").get(), abcd, "all four spans should still exist" );

	same( $("unwrap3 span").unwrap().get(), $("unwrap3 > span").get(), "make all b in #unwrap3 go away" );

	same( $("unwrap3 span").unwrap().get(), $("unwrap > span.unwrap3").get(), "make #unwrap3 go away" );

	same( $("unwrap").get('children').get(), abcdef, "#unwrap only contains 6 child spans" );

	same( $("unwrap > span").unwrap().get(), Element.parse("body > span.unwrap").get(), "make the 6 spans become children of body" );

	same( Element.parse("body > span.unwrap").unwrap().get(), Element.parse("body > span.unwrap").get(), "can't unwrap children of body" );
	same( Element.parse("body > span.unwrap").unwrap().get(), abcdef, "can't unwrap children of body" );

	same( Element.parse("body > span.unwrap").get(), abcdef, "body contains 6 .unwrap child spans" );

	Element.parse("body > span.unwrap").remove();
});

*/

test("Element.prototype.append", function() {
	var defaultText = "Try them out:"
	equals( $("first").getText(), defaultText, "Check defaultText" );
	var result = $("first");
	result.append("<b>buga</b>");
	equals( result.getText(), defaultText + "buga", "Check if text appending works" );
	equals( $("select3").append("<option value='appendTest'>Append Test</option>").getAttr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	$("sap").append(document.getElementById("first"));
	equals( $("sap").getText().replace(/[\r\n]/g, '').replace("hasclass", "has class"), expected, "Check for appending of element" );

	QUnit.reset();
	$("sap").append( 5 );
	ok( $("sap").innerHTML.match( /5$/ ), "Check for appending a number" );

	QUnit.reset();
	$("sap").append(  " text with spaces " );
	ok( $("sap").innerHTML.match(/ text with spaces $/), "Check for appending text with spaces" );

	QUnit.reset();
	ok( $("sap").append("" ), "Check for appending an empty string." );
	//  ok( $("sap").append( document.getElementsByTagName("foo") ), "Check for appending an empty nodelist." );

	QUnit.reset();
	var form =  document.findAll("form");
	form.append("<input name='radiotest' type='radio' checked='checked' />");
	
	form.findAll("input[name=radiotest]").each(function(node){
		ok( node.checked, "Append checked radio");
	});
	form.remove();

	QUnit.reset();
	var form =  document.findAll("form");
	form.append("<input name='radiotest' type='radio' checked    =   'checked' />");
	form.findAll("input[name=radiotest]").each(function(node){
		ok( node.checked, "Append alternately formated checked radio");
	});
	
	form.remove();

	QUnit.reset();
	var form =  document.findAll("form");
	form.append("<input name='radiotest' type='radio' checked />");
	form.findAll("input[name=radiotest]").each(function(node){
		ok( node.checked, "Append HTML5-formated checked radio");
	});
	
	form.remove();

	QUnit.reset();
	$("sap").append( document.getElementById("form") );
	equals( !$("sap").find('form'), false, "Check for appending a form" ); // Bug #910

	QUnit.reset();
	var pass = true;
	try {
		var body = $("iframe").contentWindow.document.body;
	
		if(body !== null) {
			pass = false;
			new Control( body ).append( "<div>test</div>"   );
		}
		
		
		
		
		pass = true;
	} catch(e) {}

	ok( pass, "Test for appending a DOM node to the contents of an IFrame" );

	QUnit.reset();
	$("select1").append( "<OPTION>Test</OPTION>" );
	equals( $("select1").get('last', 'option').getText(), "Test", "Appending &lt;OPTION&gt; (all caps)" );

	var colgroup = $("table").append( "<colgroup></colgroup>" );
	colgroup = colgroup[0] || colgroup;
	// equals( $("table").get("last").tagName.toLowerCase(), "colgroup", "Append colgroup" );

	colgroup.append( "<col/>" );
	equals( colgroup.get("last").tagName, "COL", "Append col" );

	// QUnit.reset();
	// $("table").append( "<caption></caption>" );
	// equals( $("table").get("first").tagName.toLowerCase(), "caption", "Append caption" );

	//  QUnit.reset();
	// var $input = Element.parse("<input />").set({ "type": "checkbox", "checked": true }).appendTo('testForm');
	//  equals( $input.checked, true, "A checked checkbox that is appended stays checked" );

	QUnit.reset();
	var $radio = document.find("input[type='radio'][name='R1']"),
		$radioNot = Element.parse("<input type='radio' name='R1' checked='checked'/>").appendTo($radio.parentNode).insert( $radio, "afterEnd" );
	$radio.trigger('click');
	$radioNot.checked = false;
	$radio.get('parent').replaceWith("<div></div>").append($radio);
	//   equals( $radio.checked, true, "Reappending radios uphold which radio is checked" );
	equals( $radioNot.checked, false, "Reappending radios uphold not being checked" );
	$radioNot.remove();
	QUnit.reset();

	var prev = $("sap").get('children').length;

	$("sap").append(
		"<span></span>" +
		"<span></span>" +
		"<span></span>"
	);

	equals( $("sap").get('children').length, prev + 3, "Make sure that multiple arguments works." );
	QUnit.reset();
});


/*

test("append the same fragment with events (Bug #6997, 5566)", function () {
	var doExtra = !Element.parse.support.noCloneEvent && document.fireEvent;
	expect(2 + (doExtra ? 1 : 0));
	stop(1000);

	var element;

	// This patch modified the way that cloning occurs in IE; we need to make sure that
	// native event handlers on the original object don't get disturbed when they are
	// modified on the clone
	if ( doExtra ) {
		element = Element.parse("div:first").on('click' ,function () {
			ok(true, "Event exists on original after being unbound on clone");
			Element.parse(this).unbind("click");
		});
		var clone = element.clone(true).unbind("click");
		clone[0].fireEvent("onclick");
		element[0].fireEvent("onclick");

		// manually clean up detached elements
		clone.remove();
	}

	element = Element.parse("<a class='test6997'></a>").on('click' ,function () {
		ok(true, "Append second element events work");
	});

	$("listWithTabIndex li").append(element)
		.find("a.test6997").eq(1).trigger('click');

	element = Element.parse("<li class='test6997'></li>").on('click' ,function () {
		ok(true, "Before second element events work");
		start();
	});

	$("listWithTabIndex li").before(element);
	$("listWithTabIndex li.test6997").eq(1).trigger('click');
});


*/


/*

test("Element.prototype.append(xml)", function() {
	expect( 1 );

	function createXMLDoc() {
		// Initialize DOM based upon latest installed MSXML or Netscape
		var elem,
			aActiveX =
				[ "MSXML6.DomDocument",
				"MSXML3.DomDocument",
				"MSXML2.DomDocument",
				"MSXML.DomDocument",
				"Microsoft.XmlDom" ];

		if ( document.implementation && "createDocument" in document.implementation ) {
			return document.implementation.createDocument( "", "", null );
		} else {
			// IE
			for ( var n = 0, len = aActiveX.length; n < len; n++ ) {
				try {
					elem = new ActiveXObject( aActiveX[ n ] );
					return elem;
				} catch(_){};
			}
		}
	}

	var xmlDoc = createXMLDoc(),
		xml1 = xmlDoc.createElement("head"),
		xml2 = xmlDoc.createElement("test");

	ok( new Control( xml1 ).append( xml2 ), "Append an xml element to another without raising an exception." );

});


*/

test("Element.prototype.appendTo", function() {

	var defaultText = "Try them out:"
	Element.parse("<b>buga</b>").appendTo("first");
	equals( $("first").getText(), defaultText + "buga", "Check if text appending works" );
	equals( Element.parse("<option value='appendTest'>Append Test</option>").appendTo("select3").get('parent').get("last", "option").getAttr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var l = $("first").get('children').length + 2;
	new ElementList([ Element.parse("<strong>test</strong>"), Element.parse("<strong>test</strong>") ])
		.appendTo("first");
	equals( $("first").get('children').length, l, "Make sure the elements were inserted." );
	equals( $("first").get('children')[$("first").get('children').length - 1].nodeName.toLowerCase(), "strong", "Verify the last element." );

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	$("first").appendTo("sap");
	equals( $("sap").getText().replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	new ElementList([document.getElementById("first"), document.getElementById("yahoo")]).appendTo("sap");
	equals( $("sap").getText().replace(/[\r\n]/g, "").replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for appending of array of elements" );

	QUnit.reset();
	ok( document.create("script").appendTo(), "Make sure a disconnected script can be appended." );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	$("yahoo").appendTo("sap");
	$("first").appendTo("sap");
	equals( $("sap").getText().replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for appending of Element.parse object" );

	QUnit.reset();
	$("select1").appendTo("foo");

	QUnit.reset();
	var div = Element.parse("<div/>").on('click', function(){
		ok(true, "Running a cloned click.");
	});
	div.appendTo("moretests");

	$("qunit-fixture").findAll("div").item(-1).trigger('click');
	$("moretests").findAll("div").item(-1).trigger('click');

	QUnit.reset();
	var div = Element.parse("<div/>").appendTo("moretests");

	div.addClass("test");

	ok( $("moretests").get('last', 'div').hasClass("test"), "appendTo element was modified after the insertion" );

	QUnit.reset();

	div = Element.parse("<div/>");
	Element.parse("<span>a</span><b>b</b>")[0].appendTo( div );

	equals( div.get('children').length, 1, "Make sure the right number of children were inserted." );

	div = $("moretests").findAll('div');

	var num = $("qunit-fixture").findAll('div').length;
	div.remove().appendTo("qunit-fixture");

	equals( $("qunit-fixture").findAll('div').length, num, "Make sure all the removed divs were inserted." );

	QUnit.reset();
});

test("Element.prototype.insert(html, 'afterBegin')", function() {
	var defaultText = "Try them out:"
	var result = $("first");
	result.insert( "<b>buga</b>" , 'afterBegin');
	equals( result.getText(), "buga" + defaultText, "Check if text prepending works" );
	equals( $("select3").insert( "<option value='prependTest'>Prepend Test</option>", 'afterBegin' ).getAttr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	$("sap").insert( document.getElementById("first") , 'afterBegin');
	equals( $("sap").getText().replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$("sap").insert( $("yahoo"), 'afterBegin' );
	equals( $("sap").getText().replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for prepending of Element.parse object" );
});

test("Element.prototype.insert(html, 'beforeBegin')", function() {
	var expected = "This is a normal link: bugaYahoo";
	$("yahoo").insert( "<b>buga</b>", 'beforeBegin' );
	equals( $("en").getText().replace(/[\r\n]/g, ""), expected, "Insert String before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:Yahoo";
	$("yahoo").insert( document.getElementById("first"), 'beforeBegin' );
	
	// !Safari
	equals( $("en").getText().replace(/[\r\n]/g, "").replace("link:T", "link: T"), expected, "Insert element before" );

	QUnit.reset();
	expected = "This is a normal link: diveintomarkYahoo";
	$("yahoo").insert( $("mark"), 'beforeBegin' );
	equals( $("en").getText().replace(/[\r\n]/g, ""), expected, "Insert Element.parse before" );

	// var set = Element.parse("<div/>").insert("<span>test</span>", 'beforeBegin');
	// equals( set.nodeName.toLowerCase(), "span", "Insert the element before the disconnected node." );
});

test("Element.prototype.insert(html, 'afterEnd')", function() {
	var expected = "This is a normal link: Yahoobuga";
	$("yahoo").insert( "<b>buga</b>" );
	equals( $("en").getText().replace(/[\r\n]/g, ""), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	$("yahoo").insert(   document.getElementById("first") , 'afterEnd'   );
	equals( $("en").getText().replace(/[\r\n]/g, ""), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: Yahoodiveintomark";
	$("yahoo").insert($("mark"), 'afterEnd');
	equals( $("en").getText().replace(/[\r\n]/g, ""), expected, "Insert Element.parse after" );

	// var set = Element.parse("<div/>").insert("<span>test</span>"   , 'afterEnd');
	// equals( set.nodeName.toLowerCase(), "span", "Insert the element after the disconnected node." );
});

test("Element.prototype.insert(html, 'beforeEnd')", function() {
	var expected = "This is a normal link: Yahoobuga";
	$("yahoo").insert( "<b>buga</b>" );
	equals( $("en").getText().replace(/[\r\n]/g, ""), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	$("yahoo").insert(   document.getElementById("first") , 'beforeEnd'   );
	equals( $("en").getText().replace(/[\r\n]/g, ""), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: Yahoodiveintomark";
	$("yahoo").insert($("mark"), 'beforeEnd');
	equals( $("en").getText().replace(/[\r\n]/g, ""), expected, "Insert Element.parse after" );

	var set = Element.parse("<div/>").insert("<span>test</span>"   , 'beforeEnd');
	equals( set.nodeName.toLowerCase(), "span", "Insert the element after the disconnected node." );
});

test("Element.prototype.replaceWith", function() {

	$("yahoo").replaceWith( "<b id='replace'>buga</b>" );
	ok( $("replace"), "Replace element with string" );
	ok( !$("yahoo"), "Verify that original element is gone, after string" );

	QUnit.reset();
	$("yahoo").replaceWith( document.getElementById("first") );
	ok( $("first"), "Replace element with element" );
	ok( !$("yahoo"), "Verify that original element is gone, after element" );

	QUnit.reset();
	$("qunit-fixture").append("<div id='bar'><div id='baz'></div></div>");
	$("baz").replaceWith("Baz");
	equals( $("bar").getText().replace(/[\r\n]/g, ""),"Baz", "Replace element with text" );
	ok( !$("baz"), "Verify that original element is gone, after element" );

	QUnit.reset();
	$("yahoo").replaceWith( $("mark") );
	ok( $("first"), "Replace element with set of elements" );
	ok( $("mark"), "Replace element with set of elements" );
	ok( !$("yahoo"), "Verify that original element is gone, after set of elements" );

	QUnit.reset();
	var tmp = Element.parse("<div/>").appendTo().on('click', function(){ ok(true, "Newly bound click run." ); });
	var y = Element.parse("<div/>").appendTo().on('click',function(){ ok(true, "Previously bound click run." ); });
	var child = y.append("<b>test</b>").on('click',function(){ ok(true, "Child bound click run." ); return false; });

	y.replaceWith( tmp );

	tmp.trigger('click');
	y.trigger('click'); // Shouldn't be run
	child.trigger('click'); // Shouldn't be run

	tmp.remove();
	y.remove();
	child.remove();

	QUnit.reset();

	y = Element.parse("<div/>").appendTo().on('click' ,function(){ ok(true, "Previously bound click run." ); });
	var child2 = y.append("<u>test</u>").on('click' ,function(){ ok(true, "Child 2 bound click run." ); return false; });

	y.replaceWith( child2 );

	child2.trigger('click');

	y.remove();
	child2.remove();

	QUnit.reset();

	var set = Element.parse("<div/>").replaceWith( "<span>test</span>" );
	equals( set.nodeName.toLowerCase(), "span", "Replace the disconnected node." );

	var $div = Element.parse("<div class='replacewith'></div>").appendTo();
	// TODO: Work on Element.parse(...) inline script execution
	//$div.replaceWith("<div class='replacewith'></div><script>" +
		//"equals(Element.parse('.replacewith').length, 1, 'Check number of elements in page.');" +
		//"</script>");
	equals(document.findAll(".replacewith").length, 1, "Check number of elements in page.");
	document.findAll(".replacewith").remove();

	QUnit.reset();

	$("qunit-fixture").append("<div id='replaceWith'></div>");
	equals( $("qunit-fixture").findAll("div[id=replaceWith]").length, 1, "Make sure only one div exists." );

	$("replaceWith").replaceWith( "<div id='replaceWith'></div>" );
	equals( $("qunit-fixture").findAll("div[id=replaceWith]").length, 1, "Make sure only one div exists." );

	$("replaceWith").replaceWith(  "<div id='replaceWith'></div>" );
	equals( $("qunit-fixture").findAll("div[id=replaceWith]").length, 1, "Make sure only one div exists." );
});

test("Element.prototype.replaceWith(string) for more than one element", function(){
	expect(3);

	equals(document.findAll("#foo p").length, 3, "ensuring that test data has not changed");

	document.findAll("#foo p").replaceWith("<span>bar</span>");
	equals(document.findAll("#foo span").length, 3, "verify that all the three original element have been replaced");
	equals(document.findAll("#foo p").length, 0, "verify that all the three original element have been replaced");
});

test("Element.parse.clone() (#8017)", function() {

	var main = $("qunit-fixture"),
			clone = main.clone();

	equals( main.childNodes.length, clone.childNodes.length, "Simple child length to ensure a large dom tree copies correctly" );

	
	$("qunit-fixture").append("<select class='test8070'></select><select class='test8070'></select>");
	var selects = document.findAll(".test8070");
	
	selects.append("<OPTION>1</OPTION><OPTION>2</OPTION>");

	equals( selects.item(0).childNodes.length, 2, "First select got two nodes" );
	equals( selects.item(1).childNodes.length, 2, "Second select got two nodes" );

	selects.dispose();
	
});

test("Element.prototype.clone", function() {
	equals( "This is a normal link: Yahoo", $("en").getText(), "Assert text for #en" );
	var clone = $("yahoo").clone();
	$("first").append(clone);
	equals( "Try them out:Yahoo", $("first").getText(), "Check for clone" );
	equals( "This is a normal link: Yahoo", $("en").getText(), "Reassert text for #en" );

	var cloneTags = [
		"<table/>", "<tr/>", "<td/>", "<div/>",
		"<button/>", "<ul/>", "<ol/>", "<li/>",
		"<input type='checkbox' />", "<select/>", "<option/>", "<textarea/>",
		"<tbody/>", "<thead/>", "<tfoot/>", "<iframe/>"
	];
	for (var i = 0; i < cloneTags.length; i++) {
		var j = Element.parse(cloneTags[i]);
		equals( j.tagName, j.clone().tagName, "Clone a " + cloneTags[i]);
	}
	
	var div = Element.parse("<div><ul><li>test</li></ul></div>").on('click' ,function(){
		ok( true, "Bound event still exists." );
	});

	clone = div.clone(true);

	// manually clean up detached elements
	div.remove();

	div = clone.clone(true);

	// manually clean up detached elements
	clone.remove();

	equals( div.nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div.trigger("click");

	// manually clean up detached elements
	div.remove();

	div = Element.parse("<div/>");
	 div.append(document.createElement("table"));
	div.find("table").on('click' ,function(){
		ok( true, "Bound event still exists." );
	});

	clone = div.clone(true);
	equals( clone.nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	clone.find("table").trigger("click");

	// manually clean up detached elements
	div.remove();
	clone.remove();

	var divEvt = Element.parse("<div><ul><li>test</li></ul></div>").on('click' ,function(){
		ok( false, "Bound event still exists after .clone()." );
	}),
		cloneEvt = divEvt.clone(false);

	// Make sure that doing .clone() doesn't clone events
	cloneEvt.trigger("click");

	cloneEvt.remove();
	divEvt.remove();

	// this is technically an invalid object, but because of the special
	// classid instantiation it is the only kind that IE has trouble with,
	// so let's test with it too.
	div = Element.parse("<div/>").setHtml("<object height='355' width='425' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	// !IE9
	//clone = div.clone(true);
	//equals( clone.getHtml(), div.getHtml(), "Element contents cloned" );
	//equals( clone.nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// and here's a valid one.
	div = Element.parse("<div/>").setHtml("<object height='355' width='425' type='application/x-shockwave-flash' data='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone(true);
	equals( clone.getHtml(), div.getHtml(), "Element contents cloned" );
	equals( clone.nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// manually clean up detached elements
	div.remove();
	clone.remove();

	var form = document.createElement("form");
	form.action = "/test/";
	var div = document.createElement("div");
	div.appendChild( document.createTextNode("test") );
	form.appendChild( div );

	equals( $(form).clone().get('children').length, 1, "Make sure we just get the form back." );

	equal( document.find("body").clone().tagName, "BODY", "Make sure cloning body works" );
});

test("clone(form element) (Bug #3879, #6655)", function() {
	var element = Element.parse("<select><option>Foo</option><option selected>Bar</option></select>");

	equals( element.clone().get("selected")[0].getText(), element.get("selected")[0].getText(), "Selected option cloned correctly" );

	element = Element.parse("<input type='checkbox' value='foo'>").setAttr("checked", "checked");
	clone = element.clone();

	equals( clone.defaultValue, "foo", "Checked input defaultValue cloned correctly" );

	// defaultChecked also gets set now due to setAttribute in attr, is this check still valid?
	// equals( clone[0].defaultChecked, !Element.parse.support.noCloneChecked, "Checked input defaultChecked cloned correctly" );

	// element = Element.parse("<input type='text' value='foo'>");
	// clone = element.clone();
	// equals( clone.defaultValue, "foo", "Text input defaultValue cloned correctly" );

	// element = Element.parse("<textarea>foo</textarea>");
	// clone = element.clone();
	// equals( clone.defaultValue, "foo", "Textarea defaultValue cloned correctly" );
});

test("clone(multiple selected options) (Bug #8129)", function() {
	expect(1);
	var element = Element.parse("<select><option>Foo</option><option selected>Bar</option><option selected>Baz</option></select>");

	equals( element.clone().get("selected").length, element.get("selected").length, "Multiple selected options cloned correctly" );

});

test("Element.prototype.setHtml", function() {

	Element.parse.scriptorder = 0;

	var div = document.findAll("#qunit-fixture > div");
	div.setHtml( "<b>test</b>");
	var pass = true;
	for ( var i = 0; i < div.length; i++ ) {
		if ( div.item(i).childNodes.length != 1 ) pass = false;
	}
	ok( pass, "Set HTML" );

	div = Element.parse("<div/>").setHtml( "<div id='parent_1'><div id='child_1'/></div><div id='parent_2'/>"  );

	equals( div.get('children').length, 2, "Make sure two child nodes exist." );
	equals( div.get('children').get('children').length, 1, "Make sure that a grandchild exists." );

	var space = Element.parse("<div/>").setHtml( "&#160;" ).innerHTML;
	ok( /^\xA0$|^&nbsp;$/.test( space ), "Make sure entities are passed through correctly." );
	equals( Element.parse("<div/>").setHtml( "&amp;" ).innerHTML, "&amp;", "Make sure entities are passed through correctly." );

	$("qunit-fixture").setHtml( "<style>.foobar{color:green;}</style>" );

	  equals( $("qunit-fixture").get('children').length, 1, "Make sure there is a child element." );
	    equals( $("qunit-fixture").get('children')[0].nodeName.toUpperCase(), "STYLE", "And that a style element was inserted." );

	//QUnit.reset();
	//$("qunit-fixture").setHtml( "<select/>" );
	//document.find("#qunit-fixture select").setHtml( "<option>O1</option><option selected='selected'>O2</option><option>O3</option>" );
	//equals( document.find("#qunit-fixture select").getText(), "O2", "Selected option correct" );

	var $div = Element.parse("<div />");
	equals( $div.setHtml( 5 ).getHtml(), "5", "Setting a number as html" );
	equals( $div.setHtml( 0 ).getHtml(), "0", "Setting a zero as html" );

	var $div2 = Element.parse("<div/>"), insert = "&lt;div&gt;hello1&lt;/div&gt;";
	equals( $div2.setHtml(insert).getHtml().replace(/>/g, "&gt;"), insert, "Verify escaped insertion." );
	equals( $div2.setHtml("x" + insert).getHtml().replace(/>/g, "&gt;"), "x" + insert, "Verify escaped insertion." );
	// equals( $div2.setHtml(" " + insert).getHtml().replace(/>/g, "&gt;"), " " + insert, "Verify escaped insertion." );

	var map = Element.parse("<map/>").setHtml("<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.jquery.com/' alt='Element.parse'>");

	equals( map.childNodes.length, 1, "The area was inserted." );
	equals( map.firstChild.nodeName.toLowerCase(), "area", "The area was inserted." );

	QUnit.reset();

	$("qunit-fixture").setHtml("<script type='something/else'>ok( false, 'Non-script evaluated.' );</script><script type='text/javascript'>ok( true, 'text/javascript is evaluated.' );</script><script>ok( true, 'No type is evaluated.' );</script><div><script type='text/javascript'>ok( true, 'Inner text/javascript is evaluated.' );</script><script>ok( true, 'Inner No type is evaluated.' );</script><script type='something/else'>ok( false, 'Non-script evaluated.' );</script></div>");

	var child = $("qunit-fixture").findAll("script");

	equals( child.length, 6, "Make sure that two non-JavaScript script tags are left." );
	equals( child.item(0).type, "something/else", "Verify type of script tag." );
	equals( child.item(-1).type, "something/else", "Verify type of script tag." );

	$("qunit-fixture").setHtml("<script>ok( true, 'Test repeated injection of script.' );</script>");
	$("qunit-fixture").setHtml("<script>ok( true, 'Test repeated injection of script.' );</script>");
	$("qunit-fixture").setHtml("<script>ok( true, 'Test repeated injection of script.' );</script>");

	$("qunit-fixture").setHtml("<script type='text/javascript'>ok( true, 'Element.parse().getHtml().evalScripts() Evals Scripts Twice in Firefox, see #975 (1)' );</script>");

	$("qunit-fixture").setHtml("foo <form><script type='text/javascript'>ok( true, 'Element.parse().getHtml().evalScripts() Evals Scripts Twice in Firefox, see #975 (2)' );</script></form>");

	$("qunit-fixture").setHtml("<script>equals(Element.parse.scriptorder++, 0, 'Script is executed in order');equals(Element.parse('#scriptorder').length, 1,'Execute after html (even though appears before)')<\/script><span id='scriptorder'><script>equals(Element.parse.scriptorder++, 1, 'Script (nested) is executed in order');equals(Element.parse('#scriptorder').length, 1,'Execute after html')<\/script></span><script>equals(Element.parse.scriptorder++, 2, 'Script (unnested) is executed in order');equals(Element.parse('#scriptorder').length, 1,'Execute after html')<\/script>");
});

test("Element.prototype.remove", function() {

	var first = $("ap");

	$("ap").get('children').remove();
	ok( $("ap").getText().length > 10, "Check text is not removed" );
	equals( $("ap").get('children').length, 0, "Check remove" );

	QUnit.reset();

	var count = 0;
	var first = $("ap").get("first");
	var cleanUp = first.on('click' ,function() { count++ }).remove().appendTo("qunit-fixture");
	cleanUp.trigger('click');
	// manually clean up detached elements
	cleanUp.remove();
});

test("Element.prototype.empty", function() {
	equals( $("ap").get('children').empty().getText().join('').length, 0, "Check text is removed" );
	equals( $("ap").get('children').length, 4, "Check elements are not removed" );

});

test( "Element.parse - execute scripts escaped with html comment or CDATA (#9221)", function() {
	Element.parse( [
	         '<script type="text/javascript">',
	         '<!--',
	         'ok( true, "<!-- handled" );',
	         '//-->',
	         '</script>'
	     ].join ( "\n" ) ).appendTo( "qunit-fixture" );
	// Element.parse( [
	 //        '<script type="text/javascript">',
	 //        '<![CDATA[',
	 //        'ok( true, "<![CDATA[ handled" );',
	 //        '//]]>',
	 //        '</script>'
	  //    ].join ( "\n" ) ).appendTo( "qunit-fixture" );
	Element.parse( [
	         '<script type="text/javascript">',
	         '<!--//--><![CDATA[//><!--',
	         'ok( true, "<!--//--><![CDATA[//><!-- (Drupal case) handled" );',
	         '//--><!]]>',
	         '</script>'
	     ].join ( "\n" ) ).appendTo( "qunit-fixture" );
});

test("clone - no exceptions for object elements #9587", function() {
	expect(1);

	try {
		$("no-clone-exception").clone();
		ok( true, "cloned with no exceptions" );
	} catch( e ) {
		ok( false, e.message );
	}
});
