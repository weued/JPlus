module("Manipulation");

var bareObj = function(value) { return value; };
var functionReturningObj = function(value) { return (function() { return value; }); };

test("Element.prototype.getText", function() {
	
	var expected = "This link has class=\"blog\": Simon Willison's Weblog";
	equals( $("sap").getText(), expected, "Check for merged text of more then one element." );

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

test("Element.prototype.wrapWith", function() {
	expect(19);
	var defaultText = "Try them out:"
	var result = $("first").wrapWith( "<div class='red'><span></span></div>").getText();
	equals( defaultText, result, "Check for wrapping of on-the-fly html" );
	ok( $("first").get('parent').get('parent').hasClass("red"), "Check if wrapper has class 'red'" );

	QUnit.reset();
	var defaultText = "Try them out:";
	$("first").wrapWith(document.getElementById("empty"));
	var result = $("first").get('parent');
	equals( result.tagName, "OL", "Check for element wrapping" );
	equals( result.getText(), defaultText, "Check for element wrapping" );

	QUnit.reset();
	$("check1").on('click', function() {
		var checkbox = this;
		ok( checkbox.checked, "Checkbox's state is erased after wrapWith() action" );
		$(checkbox).wrapWith( "<div id='c1' style='display:none;'></div>");
		ok( checkbox.checked, "Checkbox's state is erased after wrapWith() action" );
	}).trigger('click')     ;

	var j = Element.parse("<label/>");
	j.wrapWith( "<li/>");
	equals( j.nodeName.toUpperCase(), "LABEL", "Element is a label" );
	equals( j.parentNode.nodeName.toUpperCase(), "LI", "Element has been wrapped" );
	
	// wrapWith an element containing a text node
	j = Element.parse("<span/>");
	j.wrapWith("<div>test</div>");
	equals( j.previousSibling.nodeType, 3, "Make sure the previous node is a text element" );
	equals( j.parentNode.nodeName.toUpperCase(), "DIV", "And that we're in the div element." );

	// Try to wrapWith an element with multiple elements (should fail)
	j = Element.parse("<div><span></span></div>").get('children');
	j.wrapWith("<p></p><div></div>");
	equals( j[0].parentNode.parentNode.childNodes.length, 1, "There should only be one element wrapping." );
	equals( j[0].parentNode.nodeName.toUpperCase(), "P", "The span should be in the paragraph." );

	j = Element.parse("<span/>");
	j.wrapWith("<div></div>");
	equals( j.parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	// wrapWith an element with a jQuery set and event
	result = Element.parse("<div></div>").on('click', function(){
		ok(true, "Event triggered.");

		// Remove handlers on detached elements
		result.unbind();
		this.un();
	});

	j = Element.parse("<span/>");
	j.wrapWith(result);
	equals( j.parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	j.get('parent').trigger("click");

	// clean up attached elements
	QUnit.reset();
});

var testWrapAll = function(val) {
	expect(8);
	var prev = $("firstp")[0].previousSibling;
	var p = $("firstp,#first")[0].parentNode;

	var result = $("firstp,#first").wrapAll(val( "<div class='red'><div class='tmp'></div></div>" ));
	equals( result.get('parent').length, 1, "Check for wrapping of on-the-fly html" );
	ok( $("first").get('parent').get('parent').is(".red"), "Check if wrapper has class 'red'" );
	ok( $("firstp").get('parent').get('parent').is(".red"), "Check if wrapper has class 'red'" );
	equals( $("first").get('parent').get('parent')[0].previousSibling, prev, "Correct Previous Sibling" );
	equals( $("first").get('parent').get('parent')[0].parentNode, p, "Correct Parent" );

	QUnit.reset();
	var prev = $("firstp")[0].previousSibling;
	var p = $("first")[0].parentNode;
	var result = $("firstp,#first").wrapAll(val( document.getElementById("empty") ));
	equals( $("first").get('parent')[0], $("firstp").get('parent')[0], "Same Parent" );
	equals( $("first").get('parent')[0].previousSibling, prev, "Correct Previous Sibling" );
	equals( $("first").get('parent')[0].parentNode, p, "Correct Parent" );
}

test("wrapAll(String|Element)", function() {
	testWrapAll(bareObj);
});

var testWrapInner = function(val) {
	expect(11);
	var num = $("first").children().length;
	var result = $("first").wrapInner(val("<div class='red'><div id='tmp'></div></div>"));
	equals( $("first").children().length, 1, "Only one child" );
	ok( $("first").children().is(".red"), "Verify Right Element" );
	equals( $("first").children().children().children().length, num, "Verify Elements Intact" );

	QUnit.reset();
	var num = $("first").html("foo<div>test</div><div>test2</div>").children().length;
	var result = $("first").wrapInner(val("<div class='red'><div id='tmp'></div></div>"));
	equals( $("first").children().length, 1, "Only one child" );
	ok( $("first").children().is(".red"), "Verify Right Element" );
	equals( $("first").children().children().children().length, num, "Verify Elements Intact" );

	QUnit.reset();
	var num = $("first").children().length;
	var result = $("first").wrapInner(val(document.getElementById("empty")));
	equals( $("first").children().length, 1, "Only one child" );
	ok( $("first").children().is("#empty"), "Verify Right Element" );
	equals( $("first").children().children().length, num, "Verify Elements Intact" );

	var div = jQuery("<div/>");
	div.wrapInner(val("<span></span>"));
	equals(div.children().length, 1, "The contents were wrapped.");
	equals(div.children()[0].nodeName.toLowerCase(), "span", "A span was inserted.");
}

test("wrapInner(String|Element)", function() {
	testWrapInner(bareObj);
});

test("wrapInner(Function)", function() {
	testWrapInner(functionReturningObj)
});

test("unwrap()", function() {
	expect(9);

	jQuery("body").append("  <div id='unwrap' style='display: none;'> <div id='unwrap1'> <span class='unwrap'>a</span> <span class='unwrap'>b</span> </div> <div id='unwrap2'> <span class='unwrap'>c</span> <span class='unwrap'>d</span> </div> <div id='unwrap3'> <b><span class='unwrap unwrap3'>e</span></b> <b><span class='unwrap unwrap3'>f</span></b> </div> </div>");

	var abcd = $("unwrap1 > span, #unwrap2 > span").get(),
		abcdef = $("unwrap span").get();

	equals( $("unwrap1 span").add("#unwrap2 span:first").unwrap().length, 3, "make #unwrap1 and #unwrap2 go away" );
	same( $("unwrap > span").get(), abcd, "all four spans should still exist" );

	same( $("unwrap3 span").unwrap().get(), $("unwrap3 > span").get(), "make all b in #unwrap3 go away" );

	same( $("unwrap3 span").unwrap().get(), $("unwrap > span.unwrap3").get(), "make #unwrap3 go away" );

	same( $("unwrap").children().get(), abcdef, "#unwrap only contains 6 child spans" );

	same( $("unwrap > span").unwrap().get(), jQuery("body > span.unwrap").get(), "make the 6 spans become children of body" );

	same( jQuery("body > span.unwrap").unwrap().get(), jQuery("body > span.unwrap").get(), "can't unwrap children of body" );
	same( jQuery("body > span.unwrap").unwrap().get(), abcdef, "can't unwrap children of body" );

	same( jQuery("body > span.unwrap").get(), abcdef, "body contains 6 .unwrap child spans" );

	jQuery("body > span.unwrap").remove();
});

var testAppend = function(valueObj) {
	expect(41);
	var defaultText = "Try them out:"
	var result = $("first").append(valueObj("<b>buga</b>"));
	equals( result.getText(), defaultText + "buga", "Check if text appending works" );
	equals( $("select3").append(valueObj("<option value='appendTest'>Append Test</option>")).find("option:last-child").attr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	$("sap").append(valueObj(document.getElementById("first")));
	equals( $("sap").getText(), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$("sap").append(valueObj([document.getElementById("first"), document.getElementById("yahoo")]));
	equals( $("sap").getText(), expected, "Check for appending of array of elements" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	$("sap").append(valueObj($("yahoo, #first")));
	equals( $("sap").getText(), expected, "Check for appending of jQuery object" );

	QUnit.reset();
	$("sap").append(valueObj( 5 ));
	ok( $("sap")[0].innerHTML.match( /5$/ ), "Check for appending a number" );

	QUnit.reset();
	$("sap").append(valueObj( " text with spaces " ));
	ok( $("sap")[0].innerHTML.match(/ text with spaces $/), "Check for appending text with spaces" );

	QUnit.reset();
	ok( $("sap").append(valueObj( [] )), "Check for appending an empty array." );
	ok( $("sap").append(valueObj( "" )), "Check for appending an empty string." );
	ok( $("sap").append(valueObj( document.getElementsByTagName("foo") )), "Check for appending an empty nodelist." );

	QUnit.reset();
	jQuery("form").append(valueObj("<input name='radiotest' type='radio' checked='checked' />"));
	jQuery("form input[name=radiotest]").each(function(){
		ok( jQuery(this).is(":checked"), "Append checked radio");
	}).remove();

	QUnit.reset();
	jQuery("form").append(valueObj("<input name='radiotest' type='radio' checked    =   'checked' />"));
	jQuery("form input[name=radiotest]").each(function(){
		ok( jQuery(this).is(":checked"), "Append alternately formated checked radio");
	}).remove();

	QUnit.reset();
	jQuery("form").append(valueObj("<input name='radiotest' type='radio' checked />"));
	jQuery("form input[name=radiotest]").each(function(){
		ok( jQuery(this).is(":checked"), "Append HTML5-formated checked radio");
	}).remove();

	QUnit.reset();
	$("sap").append(valueObj( document.getElementById("form") ));
	equals( $("sap>form").size(), 1, "Check for appending a form" ); // Bug #910

	QUnit.reset();
	var pass = true;
	try {
		var body = $("iframe")[0].contentWindow.document.body;

		pass = false;
		jQuery( body ).append(valueObj( "<div>test</div>" ));
		pass = true;
	} catch(e) {}

	ok( pass, "Test for appending a DOM node to the contents of an IFrame" );

	QUnit.reset();
	jQuery("<fieldset/>").appendTo("#form").append(valueObj( "<legend id='legend'>test</legend>" ));
	t( "Append legend", "#legend", ["legend"] );

	QUnit.reset();
	$("select1").append(valueObj( "<OPTION>Test</OPTION>" ));
	equals( $("select1 option:last").getText(), "Test", "Appending &lt;OPTION&gt; (all caps)" );

	$("table").append(valueObj( "<colgroup></colgroup>" ));
	ok( $("table colgroup").length, "Append colgroup" );

	$("table colgroup").append(valueObj( "<col/>" ));
	ok( $("table colgroup col").length, "Append col" );

	QUnit.reset();
	$("table").append(valueObj( "<caption></caption>" ));
	ok( $("table caption").length, "Append caption" );

	QUnit.reset();
	jQuery("form:last")
		.append(valueObj( "<select id='appendSelect1'></select>" ))
		.append(valueObj( "<select id='appendSelect2'><option>Test</option></select>" ));

	t( "Append Select", "#appendSelect1, #appendSelect2", ["appendSelect1", "appendSelect2"] );

	equals( "Two nodes", jQuery("<div />").append("Two", " nodes").getText(), "Appending two text nodes (#4011)" );

	// using contents will get comments regular, text, and comment nodes
	var j = $("nonnodes").contents();
	var d = jQuery("<div/>").appendTo("#nonnodes").append(j);
	equals( $("nonnodes").length, 1, "Check node,textnode,comment append moved leaving just the div" );
	ok( d.contents().length >= 2, "Check node,textnode,comment append works" );
	d.contents().appendTo("#nonnodes");
	d.remove();
	ok( $("nonnodes").contents().length >= 2, "Check node,textnode,comment append cleanup worked" );

	QUnit.reset();
	var $input = jQuery("<input />").attr({ "type": "checkbox", "checked": true }).appendTo('#testForm');
	equals( $input[0].checked, true, "A checked checkbox that is appended stays checked" );

	QUnit.reset();
	var $radios = jQuery("input:radio[name='R1']"),
		$radioNot = jQuery("<input type='radio' name='R1' checked='checked'/>").insertAfter( $radios ),
		$radio = $radios.eq(1).click();
	$radioNot[0].checked = false;
	$radios.get('parent').wrapWith("<div></div>");
	equals( $radio[0].checked, true, "Reappending radios uphold which radio is checked" );
	equals( $radioNot[0].checked, false, "Reappending radios uphold not being checked" );
	QUnit.reset();

	var prev = $("sap").children().length;

	$("sap").append(
		"<span></span>",
		"<span></span>",
		"<span></span>"
	);

	equals( $("sap").children().length, prev + 3, "Make sure that multiple arguments works." );
	QUnit.reset();
}

test("append(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	testAppend(bareObj);
});

test("append(Function)", function() {
	testAppend(functionReturningObj);
});

test("append(Function) with incoming value", function() {
	expect(12);

	var defaultText = "Try them out:", old = $("first").html();

	var result = $("first").append(function(i, val){
		equals( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	});
	equals( result.getText(), defaultText + "buga", "Check if text appending works" );

	var select = $("select3");
	old = select.html();

	equals( select.append(function(i, val){
		equals( val, old, "Make sure the incoming value is correct." );
		return "<option value='appendTest'>Append Test</option>";
	}).find("option:last-child").attr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	old = $("sap").html();

	$("sap").append(function(i, val){
		equals( val, old, "Make sure the incoming value is correct." );
		return document.getElementById("first");
	});
	equals( $("sap").getText(), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	old = $("sap").html();

	$("sap").append(function(i, val){
		equals( val, old, "Make sure the incoming value is correct." );
		return [document.getElementById("first"), document.getElementById("yahoo")];
	});
	equals( $("sap").getText(), expected, "Check for appending of array of elements" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	old = $("sap").html();

	$("sap").append(function(i, val){
		equals( val, old, "Make sure the incoming value is correct." );
		return $("yahoo, #first");
	});
	equals( $("sap").getText(), expected, "Check for appending of jQuery object" );

	QUnit.reset();
	old = $("sap").html();

	$("sap").append(function(i, val){
		equals( val, old, "Make sure the incoming value is correct." );
		return 5;
	});
	ok( $("sap")[0].innerHTML.match( /5$/ ), "Check for appending a number" );

	QUnit.reset();
});

test("append the same fragment with events (Bug #6997, 5566)", function () {
	var doExtra = !jQuery.support.noCloneEvent && document.fireEvent;
	expect(2 + (doExtra ? 1 : 0));
	stop(1000);

	var element;

	// This patch modified the way that cloning occurs in IE; we need to make sure that
	// native event handlers on the original object don't get disturbed when they are
	// modified on the clone
	if ( doExtra ) {
		element = jQuery("div:first").click(function () {
			ok(true, "Event exists on original after being unbound on clone");
			jQuery(this).unbind("click");
		});
		var clone = element.clone(true).unbind("click");
		clone[0].fireEvent("onclick");
		element[0].fireEvent("onclick");

		// manually clean up detached elements
		clone.remove();
	}

	element = jQuery("<a class='test6997'></a>").click(function () {
		ok(true, "Append second element events work");
	});

	$("listWithTabIndex li").append(element)
		.find("a.test6997").eq(1).click();

	element = jQuery("<li class='test6997'></li>").click(function () {
		ok(true, "Before second element events work");
		start();
	});

	$("listWithTabIndex li").before(element);
	$("listWithTabIndex li.test6997").eq(1).click();
});

test("append(xml)", function() {
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

	ok( jQuery( xml1 ).append( xml2 ), "Append an xml element to another without raising an exception." );

});

test("appendTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(16);

	var defaultText = "Try them out:"
	jQuery("<b>buga</b>").appendTo("#first");
	equals( $("first").getText(), defaultText + "buga", "Check if text appending works" );
	equals( jQuery("<option value='appendTest'>Append Test</option>").appendTo("#select3").get('parent').find("option:last-child").attr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var l = $("first").children().length + 2;
	jQuery("<strong>test</strong>");
	jQuery("<strong>test</strong>");
	jQuery([ jQuery("<strong>test</strong>")[0], jQuery("<strong>test</strong>")[0] ])
		.appendTo("#first");
	equals( $("first").children().length, l, "Make sure the elements were inserted." );
	equals( $("first").children().last()[0].nodeName.toLowerCase(), "strong", "Verify the last element." );

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	jQuery(document.getElementById("first")).appendTo("#sap");
	equals( $("sap").getText(), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	jQuery([document.getElementById("first"), document.getElementById("yahoo")]).appendTo("#sap");
	equals( $("sap").getText(), expected, "Check for appending of array of elements" );

	QUnit.reset();
	ok( jQuery(document.createElement("script")).appendTo("body").length, "Make sure a disconnected script can be appended." );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	$("yahoo, #first").appendTo("#sap");
	equals( $("sap").getText(), expected, "Check for appending of jQuery object" );

	QUnit.reset();
	$("select1").appendTo("#foo");
	t( "Append select", "#foo select", ["select1"] );

	QUnit.reset();
	var div = jQuery("<div/>").click(function(){
		ok(true, "Running a cloned click.");
	});
	div.appendTo("#qunit-fixture, #moretests");

	$("qunit-fixture div:last").click();
	$("moretests div:last").click();

	QUnit.reset();
	var div = jQuery("<div/>").appendTo("#qunit-fixture, #moretests");

	equals( div.length, 2, "appendTo returns the inserted elements" );

	div.addClass("test");

	ok( $("qunit-fixture div:last").hasClass("test"), "appendTo element was modified after the insertion" );
	ok( $("moretests div:last").hasClass("test"), "appendTo element was modified after the insertion" );

	QUnit.reset();

	div = jQuery("<div/>");
	jQuery("<span>a</span><b>b</b>").filter("span").appendTo( div );

	equals( div.children().length, 1, "Make sure the right number of children were inserted." );

	div = $("moretests div");

	var num = $("qunit-fixture div").length;
	div.remove().appendTo("#qunit-fixture");

	equals( $("qunit-fixture div").length, num, "Make sure all the removed divs were inserted." );

	QUnit.reset();
});

var testPrepend = function(val) {
	expect(5);
	var defaultText = "Try them out:"
	var result = $("first").prepend(val( "<b>buga</b>" ));
	equals( result.getText(), "buga" + defaultText, "Check if text prepending works" );
	equals( $("select3").prepend(val( "<option value='prependTest'>Prepend Test</option>" )).find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	$("sap").prepend(val( document.getElementById("first") ));
	equals( $("sap").getText(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$("sap").prepend(val( [document.getElementById("first"), document.getElementById("yahoo")] ));
	equals( $("sap").getText(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	$("sap").prepend(val( $("yahoo, #first") ));
	equals( $("sap").getText(), expected, "Check for prepending of jQuery object" );
};

test("prepend(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	testPrepend(bareObj);
});

test("prepend(Function)", function() {
	testPrepend(functionReturningObj);
});

test("prepend(Function) with incoming value", function() {
	expect(10);

	var defaultText = "Try them out:", old = $("first").html();
	var result = $("first").prepend(function(i, val) {
		equals( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	});
	equals( result.getText(), "buga" + defaultText, "Check if text prepending works" );

	old = $("select3").html();

	equals( $("select3").prepend(function(i, val) {
		equals( val, old, "Make sure the incoming value is correct." );
		return "<option value='prependTest'>Prepend Test</option>";
	}).find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = $("sap").html();

	$("sap").prepend(function(i, val) {
		equals( val, old, "Make sure the incoming value is correct." );
		return document.getElementById("first");
	});

	equals( $("sap").getText(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	old = $("sap").html();

	$("sap").prepend(function(i, val) {
		equals( val, old, "Make sure the incoming value is correct." );
		return [document.getElementById("first"), document.getElementById("yahoo")];
	});

	equals( $("sap").getText(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = $("sap").html();

	$("sap").prepend(function(i, val) {
		equals( val, old, "Make sure the incoming value is correct." );
		return $("yahoo, #first");
	});

	equals( $("sap").getText(), expected, "Check for prepending of jQuery object" );
});

test("prependTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(6);
	var defaultText = "Try them out:"
	jQuery("<b>buga</b>").prependTo("#first");
	equals( $("first").getText(), "buga" + defaultText, "Check if text prepending works" );
	equals( jQuery("<option value='prependTest'>Prepend Test</option>").prependTo("#select3").get('parent').find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery(document.getElementById("first")).prependTo("#sap");
	equals( $("sap").getText(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery([document.getElementById("first"), document.getElementById("yahoo")]).prependTo("#sap");
	equals( $("sap").getText(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	$("yahoo, #first").prependTo("#sap");
	equals( $("sap").getText(), expected, "Check for prepending of jQuery object" );

	QUnit.reset();
	jQuery("<select id='prependSelect1'></select>").prependTo("form:last");
	jQuery("<select id='prependSelect2'><option>Test</option></select>").prependTo("form:last");

	t( "Prepend Select", "#prependSelect2, #prependSelect1", ["prependSelect2", "prependSelect1"] );
});

var testBefore = function(val) {
	expect(6);
	var expected = "This is a normal link: bugaYahoo";
	$("yahoo").before(val( "<b>buga</b>" ));
	equals( $("en").getText(), expected, "Insert String before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:Yahoo";
	$("yahoo").before(val( document.getElementById("first") ));
	equals( $("en").getText(), expected, "Insert element before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$("yahoo").before(val( [document.getElementById("first"), document.getElementById("mark")] ));
	equals( $("en").getText(), expected, "Insert array of elements before" );

	QUnit.reset();
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	$("yahoo").before(val( $("mark, #first") ));
	equals( $("en").getText(), expected, "Insert jQuery before" );

	var set = jQuery("<div/>").before("<span>test</span>");
	equals( set[0].nodeName.toLowerCase(), "span", "Insert the element before the disconnected node." );
	equals( set.length, 2, "Insert the element before the disconnected node." );
}

test("before(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	testBefore(bareObj);
});

test("before(Function)", function() {
	testBefore(functionReturningObj);
})

test("insertBefore(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = "This is a normal link: bugaYahoo";
	jQuery("<b>buga</b>").insertBefore("#yahoo");
	equals( $("en").getText(), expected, "Insert String before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:Yahoo";
	jQuery(document.getElementById("first")).insertBefore("#yahoo");
	equals( $("en").getText(), expected, "Insert element before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery([document.getElementById("first"), document.getElementById("mark")]).insertBefore("#yahoo");
	equals( $("en").getText(), expected, "Insert array of elements before" );

	QUnit.reset();
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	$("mark, #first").insertBefore("#yahoo");
	equals( $("en").getText(), expected, "Insert jQuery before" );
});

var testAfter = function(val) {
	expect(6);
	var expected = "This is a normal link: Yahoobuga";
	$("yahoo").after(val( "<b>buga</b>" ));
	equals( $("en").getText(), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	$("yahoo").after(val( document.getElementById("first") ));
	equals( $("en").getText(), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$("yahoo").after(val( [document.getElementById("first"), document.getElementById("mark")] ));
	equals( $("en").getText(), expected, "Insert array of elements after" );

	QUnit.reset();
	expected = "This is a normal link: YahoodiveintomarkTry them out:";
	$("yahoo").after(val( $("mark, #first") ));
	equals( $("en").getText(), expected, "Insert jQuery after" );

	var set = jQuery("<div/>").after("<span>test</span>");
	equals( set[1].nodeName.toLowerCase(), "span", "Insert the element after the disconnected node." );
	equals( set.length, 2, "Insert the element after the disconnected node." );
};

test("after(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	testAfter(bareObj);
});

test("after(Function)", function() {
	testAfter(functionReturningObj);
})

test("insertAfter(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = "This is a normal link: Yahoobuga";
	jQuery("<b>buga</b>").insertAfter("#yahoo");
	equals( $("en").getText(), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	jQuery(document.getElementById("first")).insertAfter("#yahoo");
	equals( $("en").getText(), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery([document.getElementById("first"), document.getElementById("mark")]).insertAfter("#yahoo");
	equals( $("en").getText(), expected, "Insert array of elements after" );

	QUnit.reset();
	expected = "This is a normal link: YahoodiveintomarkTry them out:";
	$("mark, #first").insertAfter("#yahoo");
	equals( $("en").getText(), expected, "Insert jQuery after" );
});

var testReplaceWith = function(val) {
	expect(21);
	$("yahoo").replaceWith(val( "<b id='replace'>buga</b>" ));
	ok( $("replace")[0], "Replace element with string" );
	ok( !$("yahoo")[0], "Verify that original element is gone, after string" );

	QUnit.reset();
	$("yahoo").replaceWith(val( document.getElementById("first") ));
	ok( $("first")[0], "Replace element with element" );
	ok( !$("yahoo")[0], "Verify that original element is gone, after element" );

	QUnit.reset();
	$("qunit-fixture").append("<div id='bar'><div id='baz'</div></div>");
	$("baz").replaceWith("Baz");
	equals( $("bar").getText(),"Baz", "Replace element with text" );
	ok( !$("baz")[0], "Verify that original element is gone, after element" );

	QUnit.reset();
	$("yahoo").replaceWith(val( [document.getElementById("first"), document.getElementById("mark")] ));
	ok( $("first")[0], "Replace element with array of elements" );
	ok( $("mark")[0], "Replace element with array of elements" );
	ok( !$("yahoo")[0], "Verify that original element is gone, after array of elements" );

	QUnit.reset();
	$("yahoo").replaceWith(val( $("mark, #first") ));
	ok( $("first")[0], "Replace element with set of elements" );
	ok( $("mark")[0], "Replace element with set of elements" );
	ok( !$("yahoo")[0], "Verify that original element is gone, after set of elements" );

	QUnit.reset();
	var tmp = jQuery("<div/>").appendTo("body").click(function(){ ok(true, "Newly bound click run." ); });
	var y = jQuery("<div/>").appendTo("body").click(function(){ ok(true, "Previously bound click run." ); });
	var child = y.append("<b>test</b>").find("b").click(function(){ ok(true, "Child bound click run." ); return false; });

	y.replaceWith( tmp );

	tmp.click();
	y.click(); // Shouldn't be run
	child.click(); // Shouldn't be run

	tmp.remove();
	y.remove();
	child.remove();

	QUnit.reset();

	y = jQuery("<div/>").appendTo("body").click(function(){ ok(true, "Previously bound click run." ); });
	var child2 = y.append("<u>test</u>").find("u").click(function(){ ok(true, "Child 2 bound click run." ); return false; });

	y.replaceWith( child2 );

	child2.click();

	y.remove();
	child2.remove();

	QUnit.reset();

	var set = jQuery("<div/>").replaceWith(val("<span>test</span>"));
	equals( set[0].nodeName.toLowerCase(), "span", "Replace the disconnected node." );
	equals( set.length, 1, "Replace the disconnected node." );

	var non_existant = $("does-not-exist").replaceWith( val("<b>should not throw an error</b>") );
	equals( non_existant.length, 0, "Length of non existant element." );

	var $div = jQuery("<div class='replacewith'></div>").appendTo("body");
	// TODO: Work on jQuery(...) inline script execution
	//$div.replaceWith("<div class='replacewith'></div><script>" +
		//"equals(jQuery('.replacewith').length, 1, 'Check number of elements in page.');" +
		//"</script>");
	equals(jQuery(".replacewith").length, 1, "Check number of elements in page.");
	jQuery(".replacewith").remove();

	QUnit.reset();

	$("qunit-fixture").append("<div id='replaceWith'></div>");
	equals( $("qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );

	$("replaceWith").replaceWith( val("<div id='replaceWith'></div>") );
	equals( $("qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );

	$("replaceWith").replaceWith( val("<div id='replaceWith'></div>") );
	equals( $("qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );
}

test("replaceWith(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	testReplaceWith(bareObj);
});

test("replaceWith(Function)", function() {
	testReplaceWith(functionReturningObj);

	expect(22);

	var y = $("yahoo")[0];

	jQuery(y).replaceWith(function(){
		equals( this, y, "Make sure the context is coming in correctly." );
	});

	QUnit.reset();
});

test("replaceWith(string) for more than one element", function(){
	expect(3);

	equals($("foo p").length, 3, "ensuring that test data has not changed");

	$("foo p").replaceWith("<span>bar</span>");
	equals($("foo span").length, 3, "verify that all the three original element have been replaced");
	equals($("foo p").length, 0, "verify that all the three original element have been replaced");
});

test("replaceAll(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(10);
	jQuery("<b id='replace'>buga</b>").replaceAll("#yahoo");
	ok( $("replace")[0], "Replace element with string" );
	ok( !$("yahoo")[0], "Verify that original element is gone, after string" );

	QUnit.reset();
	jQuery(document.getElementById("first")).replaceAll("#yahoo");
	ok( $("first")[0], "Replace element with element" );
	ok( !$("yahoo")[0], "Verify that original element is gone, after element" );

	QUnit.reset();
	jQuery([document.getElementById("first"), document.getElementById("mark")]).replaceAll("#yahoo");
	ok( $("first")[0], "Replace element with array of elements" );
	ok( $("mark")[0], "Replace element with array of elements" );
	ok( !$("yahoo")[0], "Verify that original element is gone, after array of elements" );

	QUnit.reset();
	$("mark, #first").replaceAll("#yahoo");
	ok( $("first")[0], "Replace element with set of elements" );
	ok( $("mark")[0], "Replace element with set of elements" );
	ok( !$("yahoo")[0], "Verify that original element is gone, after set of elements" );
});

test("jQuery.clone() (#8017)", function() {

	expect(2);

	ok( jQuery.clone && jQuery.isFunction( jQuery.clone ) , "jQuery.clone() utility exists and is a function.");

	var main = $("qunit-fixture")[0],
			clone = jQuery.clone( main );

	equals( main.childNodes.length, clone.childNodes.length, "Simple child length to ensure a large dom tree copies correctly" );
});

test("clone() (#8070)", function () {
	expect(2);

	jQuery("<select class='test8070'></select><select class='test8070'></select>").appendTo("#qunit-fixture");
	var selects = jQuery(".test8070");
	selects.append("<OPTION>1</OPTION><OPTION>2</OPTION>");

	equals( selects[0].childNodes.length, 2, "First select got two nodes" );
	equals( selects[1].childNodes.length, 2, "Second select got two nodes" );

	selects.remove();
});

test("clone()", function() {
	expect(37);
	equals( "This is a normal link: Yahoo", $("en").getText(), "Assert text for #en" );
	var clone = $("yahoo").clone();
	equals( "Try them out:Yahoo", $("first").append(clone).getText(), "Check for clone" );
	equals( "This is a normal link: Yahoo", $("en").getText(), "Reassert text for #en" );

	var cloneTags = [
		"<table/>", "<tr/>", "<td/>", "<div/>",
		"<button/>", "<ul/>", "<ol/>", "<li/>",
		"<input type='checkbox' />", "<select/>", "<option/>", "<textarea/>",
		"<tbody/>", "<thead/>", "<tfoot/>", "<iframe/>"
	];
	for (var i = 0; i < cloneTags.length; i++) {
		var j = jQuery(cloneTags[i]);
		equals( j[0].tagName, j.clone()[0].tagName, "Clone a " + cloneTags[i]);
	}

	// using contents will get comments regular, text, and comment nodes
	var cl = $("nonnodes").contents().clone();
	ok( cl.length >= 2, "Check node,textnode,comment clone works (some browsers delete comments on clone)" );

	var div = jQuery("<div><ul><li>test</li></ul></div>").click(function(){
		ok( true, "Bound event still exists." );
	});

	clone = div.clone(true);

	// manually clean up detached elements
	div.remove();

	div = clone.clone(true);

	// manually clean up detached elements
	clone.remove();

	equals( div.length, 1, "One element cloned" );
	equals( div[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div.trigger("click");

	// manually clean up detached elements
	div.remove();

	div = jQuery("<div/>").append([ document.createElement("table"), document.createElement("table") ]);
	div.find("table").click(function(){
		ok( true, "Bound event still exists." );
	});

	clone = div.clone(true);
	equals( clone.length, 1, "One element cloned" );
	equals( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	clone.find("table:last").trigger("click");

	// manually clean up detached elements
	div.remove();
	clone.remove();

	var divEvt = jQuery("<div><ul><li>test</li></ul></div>").click(function(){
		ok( false, "Bound event still exists after .clone()." );
	}),
		cloneEvt = divEvt.clone();

	// Make sure that doing .clone() doesn't clone events
	cloneEvt.trigger("click");

	cloneEvt.remove();
	divEvt.remove();

	// this is technically an invalid object, but because of the special
	// classid instantiation it is the only kind that IE has trouble with,
	// so let's test with it too.
	div = jQuery("<div/>").html("<object height='355' width='425' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone(true);
	equals( clone.length, 1, "One element cloned" );
	equals( clone.html(), div.html(), "Element contents cloned" );
	equals( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// and here's a valid one.
	div = jQuery("<div/>").html("<object height='355' width='425' type='application/x-shockwave-flash' data='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone(true);
	equals( clone.length, 1, "One element cloned" );
	equals( clone.html(), div.html(), "Element contents cloned" );
	equals( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	div = jQuery("<div/>").data({ a: true });
	clone = div.clone(true);
	equals( clone.data("a"), true, "Data cloned." );
	clone.data("a", false);
	equals( clone.data("a"), false, "Ensure cloned element data object was correctly modified" );
	equals( div.data("a"), true, "Ensure cloned element data object is copied, not referenced" );

	// manually clean up detached elements
	div.remove();
	clone.remove();

	var form = document.createElement("form");
	form.action = "/test/";
	var div = document.createElement("div");
	div.appendChild( document.createTextNode("test") );
	form.appendChild( div );

	equals( jQuery(form).clone().children().length, 1, "Make sure we just get the form back." );

	equal( jQuery("body").clone().children()[0].id, "qunit-header", "Make sure cloning body works" );
});

test("clone(form element) (Bug #3879, #6655)", function() {
	expect(5);
	var element = jQuery("<select><option>Foo</option><option selected>Bar</option></select>");

	equals( element.clone().find("option:selected").val(), element.find("option:selected").val(), "Selected option cloned correctly" );

	element = jQuery("<input type='checkbox' value='foo'>").attr("checked", "checked");
	clone = element.clone();

	equals( clone.is(":checked"), element.is(":checked"), "Checked input cloned correctly" );
	equals( clone[0].defaultValue, "foo", "Checked input defaultValue cloned correctly" );

	// defaultChecked also gets set now due to setAttribute in attr, is this check still valid?
	// equals( clone[0].defaultChecked, !jQuery.support.noCloneChecked, "Checked input defaultChecked cloned correctly" );

	element = jQuery("<input type='text' value='foo'>");
	clone = element.clone();
	equals( clone[0].defaultValue, "foo", "Text input defaultValue cloned correctly" );

	element = jQuery("<textarea>foo</textarea>");
	clone = element.clone();
	equals( clone[0].defaultValue, "foo", "Textarea defaultValue cloned correctly" );
});

test("clone(multiple selected options) (Bug #8129)", function() {
	expect(1);
	var element = jQuery("<select><option>Foo</option><option selected>Bar</option><option selected>Baz</option></select>");

	equals( element.clone().find("option:selected").length, element.find("option:selected").length, "Multiple selected options cloned correctly" );

});

if (!isLocal) {
test("clone() on XML nodes", function() {
	expect(2);
	stop();
	jQuery.get("data/dashboard.xml", function (xml) {
		var root = jQuery(xml.documentElement).clone();
		var origTab = jQuery("tab", xml).eq(0);
		var cloneTab = jQuery("tab", root).eq(0);
		origTab.text("origval");
		cloneTab.text("cloneval");
		equals(origTab.getText(), "origval", "Check original XML node was correctly set");
		equals(cloneTab.getText(), "cloneval", "Check cloned XML node was correctly set");
		start();
	});
});
}

var testHtml = function(valueObj) {
	expect(34);

	jQuery.scriptorder = 0;

	var div = $("qunit-fixture > div");
	div.html(valueObj("<b>test</b>"));
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).childNodes.length != 1 ) pass = false;
	}
	ok( pass, "Set HTML" );

	div = jQuery("<div/>").html( valueObj("<div id='parent_1'><div id='child_1'/></div><div id='parent_2'/>") );

	equals( div.children().length, 2, "Make sure two child nodes exist." );
	equals( div.children().children().length, 1, "Make sure that a grandchild exists." );

	var space = jQuery("<div/>").html(valueObj("&#160;"))[0].innerHTML;
	ok( /^\xA0$|^&nbsp;$/.test( space ), "Make sure entities are passed through correctly." );
	equals( jQuery("<div/>").html(valueObj("&amp;"))[0].innerHTML, "&amp;", "Make sure entities are passed through correctly." );

	$("qunit-fixture").html(valueObj("<style>.foobar{color:green;}</style>"));

	equals( $("qunit-fixture").children().length, 1, "Make sure there is a child element." );
	equals( $("qunit-fixture").children()[0].nodeName.toUpperCase(), "STYLE", "And that a style element was inserted." );

	QUnit.reset();
	// using contents will get comments regular, text, and comment nodes
	var j = $("nonnodes").contents();
	j.html(valueObj("<b>bold</b>"));

	// this is needed, or the expando added by jQuery unique will yield a different html
	j.find("b").removeData();
	equals( j.html().replace(/ xmlns="[^"]+"/g, "").toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	$("qunit-fixture").html(valueObj("<select/>"));
	$("qunit-fixture select").html(valueObj("<option>O1</option><option selected='selected'>O2</option><option>O3</option>"));
	equals( $("qunit-fixture select").val(), "O2", "Selected option correct" );

	var $div = jQuery("<div />");
	equals( $div.html(valueObj( 5 )).html(), "5", "Setting a number as html" );
	equals( $div.html(valueObj( 0 )).html(), "0", "Setting a zero as html" );

	var $div2 = jQuery("<div/>"), insert = "&lt;div&gt;hello1&lt;/div&gt;";
	equals( $div2.html(insert).html().replace(/>/g, "&gt;"), insert, "Verify escaped insertion." );
	equals( $div2.html("x" + insert).html().replace(/>/g, "&gt;"), "x" + insert, "Verify escaped insertion." );
	equals( $div2.html(" " + insert).html().replace(/>/g, "&gt;"), " " + insert, "Verify escaped insertion." );

	var map = jQuery("<map/>").html(valueObj("<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.jquery.com/' alt='jQuery'>"));

	equals( map[0].childNodes.length, 1, "The area was inserted." );
	equals( map[0].firstChild.nodeName.toLowerCase(), "area", "The area was inserted." );

	QUnit.reset();

	$("qunit-fixture").html(valueObj("<script type='something/else'>ok( false, 'Non-script evaluated.' );</script><script type='text/javascript'>ok( true, 'text/javascript is evaluated.' );</script><script>ok( true, 'No type is evaluated.' );</script><div><script type='text/javascript'>ok( true, 'Inner text/javascript is evaluated.' );</script><script>ok( true, 'Inner No type is evaluated.' );</script><script type='something/else'>ok( false, 'Non-script evaluated.' );</script></div>"));

	var child = $("qunit-fixture").find("script");

	equals( child.length, 2, "Make sure that two non-JavaScript script tags are left." );
	equals( child[0].type, "something/else", "Verify type of script tag." );
	equals( child[1].type, "something/else", "Verify type of script tag." );

	$("qunit-fixture").html(valueObj("<script>ok( true, 'Test repeated injection of script.' );</script>"));
	$("qunit-fixture").html(valueObj("<script>ok( true, 'Test repeated injection of script.' );</script>"));
	$("qunit-fixture").html(valueObj("<script>ok( true, 'Test repeated injection of script.' );</script>"));

	$("qunit-fixture").html(valueObj("<script type='text/javascript'>ok( true, 'jQuery().html().evalScripts() Evals Scripts Twice in Firefox, see #975 (1)' );</script>"));

	$("qunit-fixture").html(valueObj("foo <form><script type='text/javascript'>ok( true, 'jQuery().html().evalScripts() Evals Scripts Twice in Firefox, see #975 (2)' );</script></form>"));

	$("qunit-fixture").html(valueObj("<script>equals(jQuery.scriptorder++, 0, 'Script is executed in order');equals(jQuery('#scriptorder').length, 1,'Execute after html (even though appears before)')<\/script><span id='scriptorder'><script>equals(jQuery.scriptorder++, 1, 'Script (nested) is executed in order');equals(jQuery('#scriptorder').length, 1,'Execute after html')<\/script></span><script>equals(jQuery.scriptorder++, 2, 'Script (unnested) is executed in order');equals(jQuery('#scriptorder').length, 1,'Execute after html')<\/script>"));
}

test("html(String)", function() {
	testHtml(bareObj);
});

test("html(Function)", function() {
	testHtml(functionReturningObj);

	expect(36);

	QUnit.reset();

	$("qunit-fixture").html(function(){
		return jQuery(this).getText();
	});

	ok( !/</.test( $("qunit-fixture").html() ), "Replace html with text." );
	ok( $("qunit-fixture").html().length > 0, "Make sure text exists." );
});

test("html(Function) with incoming value", function() {
	expect(20);

	var div = $("qunit-fixture > div"), old = div.map(function(){ return jQuery(this).html() });

	div.html(function(i, val) {
		equals( val, old[i], "Make sure the incoming value is correct." );
		return "<b>test</b>";
	});

	var pass = true;
	div.each(function(){
		if ( this.childNodes.length !== 1 ) {
			pass = false;
		}
	})
	ok( pass, "Set HTML" );

	QUnit.reset();
	// using contents will get comments regular, text, and comment nodes
	var j = $("nonnodes").contents();
	old = j.map(function(){ return jQuery(this).html(); });

	j.html(function(i, val) {
		equals( val, old[i], "Make sure the incoming value is correct." );
		return "<b>bold</b>";
	});

	// Handle the case where no comment is in the document
	if ( j.length === 2 ) {
		equals( null, null, "Make sure the incoming value is correct." );
	}

	j.find("b").removeData();
	equals( j.html().replace(/ xmlns="[^"]+"/g, "").toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	var $div = jQuery("<div />");

	equals( $div.html(function(i, val) {
		equals( val, "", "Make sure the incoming value is correct." );
		return 5;
	}).html(), "5", "Setting a number as html" );

	equals( $div.html(function(i, val) {
		equals( val, "5", "Make sure the incoming value is correct." );
		return 0;
	}).html(), "0", "Setting a zero as html" );

	var $div2 = jQuery("<div/>"), insert = "&lt;div&gt;hello1&lt;/div&gt;";
	equals( $div2.html(function(i, val) {
		equals( val, "", "Make sure the incoming value is correct." );
		return insert;
	}).html().replace(/>/g, "&gt;"), insert, "Verify escaped insertion." );

	equals( $div2.html(function(i, val) {
		equals( val.replace(/>/g, "&gt;"), insert, "Make sure the incoming value is correct." );
		return "x" + insert;
	}).html().replace(/>/g, "&gt;"), "x" + insert, "Verify escaped insertion." );

	equals( $div2.html(function(i, val) {
		equals( val.replace(/>/g, "&gt;"), "x" + insert, "Make sure the incoming value is correct." );
		return " " + insert;
	}).html().replace(/>/g, "&gt;"), " " + insert, "Verify escaped insertion." );
});

var testRemove = function(method) {
	expect(9);

	var first = $("ap").children(":first");
	first.data("foo", "bar");

	$("ap").children()[method]();
	ok( $("ap").getText().length > 10, "Check text is not removed" );
	equals( $("ap").children().length, 0, "Check remove" );

	equals( first.data("foo"), method == "remove" ? null : "bar" );

	QUnit.reset();
	$("ap").children()[method]("a");
	ok( $("ap").getText().length > 10, "Check text is not removed" );
	equals( $("ap").children().length, 1, "Check filtered remove" );

	$("ap").children()[method]("a, code");
	equals( $("ap").children().length, 0, "Check multi-filtered remove" );

	// using contents will get comments regular, text, and comment nodes
	// Handle the case where no comment is in the document
	ok( $("nonnodes").contents().length >= 2, "Check node,textnode,comment remove works" );
	$("nonnodes").contents()[method]();
	equals( $("nonnodes").contents().length, 0, "Check node,textnode,comment remove works" );

	// manually clean up detached elements
	if (method === "detach") {
		first.remove();
	}

	QUnit.reset();

	var count = 0;
	var first = $("ap").children(":first");
	var cleanUp = first.click(function() { count++ })[method]().appendTo("#qunit-fixture").click();

	equals( method == "remove" ? 0 : 1, count );

	// manually clean up detached elements
	cleanUp.remove();
};

test("remove()", function() {
	testRemove("remove");
});

test("detach()", function() {
	testRemove("detach");
});

test("empty()", function() {
	expect(3);
	equals( $("ap").children().empty().getText().length, 0, "Check text is removed" );
	equals( $("ap").children().length, 4, "Check elements are not removed" );

	// using contents will get comments regular, text, and comment nodes
	var j = $("nonnodes").contents();
	j.empty();
	equals( j.html(), "", "Check node,textnode,comment empty works" );
});

test("jQuery.cleanData", function() {
	expect(14);

	var type, pos, div, child;

	type = "remove";

	// Should trigger 4 remove event
	div = getDiv().remove();

	// Should both do nothing
	pos = "Outer";
	div.trigger("click");

	pos = "Inner";
	div.children().trigger("click");

	type = "empty";
	div = getDiv();
	child = div.children();

	// Should trigger 2 remove event
	div.empty();

	// Should trigger 1
	pos = "Outer";
	div.trigger("click");

	// Should do nothing
	pos = "Inner";
	child.trigger("click");

	// Should trigger 2
	div.remove();

	type = "html";

	div = getDiv();
	child = div.children();

	// Should trigger 2 remove event
	div.html("<div></div>");

	// Should trigger 1
	pos = "Outer";
	div.trigger("click");

	// Should do nothing
	pos = "Inner";
	child.trigger("click");

	// Should trigger 2
	div.remove();

	function getDiv() {
		var div = jQuery("<div class='outer'><div class='inner'></div></div>").click(function(){
			ok( true, type + " " + pos + " Click event fired." );
		}).focus(function(){
			ok( true, type + " " + pos + " Focus event fired." );
		}).find("div").click(function(){
			ok( false, type + " " + pos + " Click event fired." );
		}).focus(function(){
			ok( false, type + " " + pos + " Focus event fired." );
		}).end().appendTo("body");

		div[0].detachEvent = div[0].removeEventListener = function(t){
			ok( true, type + " Outer " + t + " event unbound" );
		};

		div[0].firstChild.detachEvent = div[0].firstChild.removeEventListener = function(t){
			ok( true, type + " Inner " + t + " event unbound" );
		};

		return div;
	}
});

test("jQuery.buildFragment - no plain-text caching (Bug #6779)", function() {
	expect(1);

	// DOM manipulation fails if added text matches an Object method
	var $f = jQuery( "<div />" ).appendTo( "#qunit-fixture" ),
		bad = [ "start-", "toString", "hasOwnProperty", "append", "here&there!", "-end" ];

	for ( var i=0; i < bad.length; i++ ) {
		try {
			$f.append( bad[i] );
		}
		catch(e) {}
	}
	equals($f.getText(), bad.join(""), "Cached strings that match Object properties");
	$f.remove();
});

test( "jQuery.html - execute scripts escaped with html comment or CDATA (#9221)", function() {
	expect( 3 );
	jQuery( [
	         '<script type="text/javascript">',
	         '<!--',
	         'ok( true, "<!-- handled" );',
	         '//-->',
	         '</script>'
	     ].join ( "\n" ) ).appendTo( "#qunit-fixture" );
	jQuery( [
	         '<script type="text/javascript">',
	         '<![CDATA[',
	         'ok( true, "<![CDATA[ handled" );',
	         '//]]>',
	         '</script>'
	     ].join ( "\n" ) ).appendTo( "#qunit-fixture" );
	jQuery( [
	         '<script type="text/javascript">',
	         '<!--//--><![CDATA[//><!--',
	         'ok( true, "<!--//--><![CDATA[//><!-- (Drupal case) handled" );',
	         '//--><!]]>',
	         '</script>'
	     ].join ( "\n" ) ).appendTo( "#qunit-fixture" );
});

test("jQuery.buildFragment - plain objects are not a document #8950", function() {
	expect(1);

	try {
		jQuery('<input type="hidden">', {});
		ok( true, "Does not allow attribute object to be treated like a doc object");
	} catch (e) {}

});

test("jQuery.clone - no exceptions for object elements #9587", function() {
	expect(1);

	try {
		$("no-clone-exception").clone();
		ok( true, "cloned with no exceptions" );
	} catch( e ) {
		ok( false, e.message );
	}
});
