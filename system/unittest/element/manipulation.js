module("Manipulation");

var bareObj = function(value) { return value; };
var functionReturningObj = function(value) { return (function() { return value; }); };

test("Control.prototype.getText", function() {
	
	var expected = "This link has class=\"blog\": Simon Willison's Weblog";
	equal( Dom.get("sap").getText().replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for merged text of more then one element." );

	// Check serialization of text values
	equal( new Control(document.createTextNode("foo")).getText(), "foo", "Text node was retreived from .getText()." );

	var val = "<div><b>Hello</b> cruel world!</div>";
	equal( Dom.get("foo").setText(val).dom.innerHTML.replace(/>/g, "&gt;"), "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );

	document.getElementById("text1").value = "bla";
	equal( Dom.get("text1").getText(), "bla", "Check for modified value of input element" );

	QUnit.reset();

	equal( Dom.get("text1").getText(), "Test", "Check for value of input element" );
	// ticket #1714 this caused a JS error in IE
	equal( Dom.get("first").getText(), "Try them out:", "Check a paragraph element to see if it has a value" );
	
	equal( Dom.get("select2").getText(), "3", "Call getText() on a single=\"single\" select" );

	//deepEqual( Dom.get("select3").getText(), "1,2", "Call getText() on a multiple=\"multiple\" select" );

	equal( Dom.get("option3c").getText(), "2", "Call getText() on a option element with value" );

	//equal( Dom.get("option3a").getText(), "Nothing", "Call getText() on a option element with empty value" );

	equal( Dom.get("option3e").getText(), "no value", "Call getText() on a option element with no value attribute" );

	//equal( Dom.get("option3a").getText(), "Nothing", "Call getText() on a option element with no value attribute" );

	// IE6 fails in this case. Just ignore it.
	if(!navigator.isIE6){
		Dom.get("select3").setText("");
		deepEqual( Dom.get("select3").getText(), "", "Call getText() on a multiple=\"multiple\" select" );
	}
	//deepEqual( Dom.get("select4").getText(), "1,2,3", "Call getText() on multiple=\"multiple\" select with all disabled options" );

	Dom.get("select4").setAttr("disabled", true);
	//deepEqual( Dom.get("select4").getText(), "1,2,3", "Call getText() on disabled multiple=\"multiple\" select" );

	equal( Dom.get("select5").getText(), "3", "Check value on ambiguous select." );

	Dom.get("select5").setText(1);
	equal( Dom.get("select5").getText(), "1", "Check value on ambiguous select." );

	Dom.get("select5").setText(3);
	equal( Dom.get("select5").getText(), "3", "Check value on ambiguous select." );

	// var checks = Dom.parse("<input type='checkbox' name='test' value='1'/><input type='checkbox' name='test' value='2'/><input type='checkbox' name='test' value=''/><input type='checkbox' name='test'/>").appendTo("#form");
// 
	// deepEqual( checks.getText(), "", "Get unchecked values." );
// 
	// equal( checks.eq(3).getText(), "on", "Make sure a value of 'on' is provided if none is specified." );
// 
	// checks.setText("2");
	// deepEqual( checks.serialize(), "test=2", "Get a single checked value." );
// 
	// checks.setText(",1");
	// deepEqual( checks.serialize(), "test=1&test=", "Get multiple checked values." );
// 
	// checks.setText(",2");
	// deepEqual( checks.serialize(), "test=2&test=", "Get multiple checked values." );
// 
	// checks.setText("1,on");
	// deepEqual( checks.serialize(), "test=1&test=on", "Get multiple checked values." );

	//   checks.remove();

	var button = Dom.get("button").insert("afterEnd", "<button value='foobar'>text</button>");
	equal( button.getText(), "text", "Value retrieval on a button does not return innerHTML" );
	equal( button.setText("baz").getHtml(), "baz", "Setting the value does not change innerHTML" );

	//   equal( Dom.parse("<option/>").setText("test").getAttr("value"), "test", "Setting value sets the value attribute" );
});


/*  


test("Control.prototype.wrap", function() {
	var defaultText = "Try them out:"
	var result = Dom.get("first").wrap( "<div class='red'><span></span></div>").getText();
	equal( defaultText, result, "Check for wrapping of on-the-fly html" );
	ok( Dom.get("first").get('parent').get('parent').hasClass("red"), "Check if wrapper has class 'red'" );

	QUnit.reset();
	var defaultText = "Try them out:";
	Dom.get("first").wrap(document.getElementById("empty"));
	var result = Dom.get("first").get('parent');
	equal( result.tagName, "OL", "Check for element wrapping" );
	equal( result.getText(), defaultText, "Check for element wrapping" );

	QUnit.reset();
	Dom.get("check1").on('click', function() {
		var checkbox = this;
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action" );
		Dom.get(checkbox).wrap( "<div id='c1' style='display:none;'></div>");
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action" );
	}).trigger('click')     ;

	var j = Dom.parse("<label/>");
	j.wrap( "<li/>");
	equal( j.nodeName.toUpperCase(), "LABEL", "Element is a label" );
	equal( j.parentNode.nodeName.toUpperCase(), "LI", "Element has been wrapped" );
	
	// wrap an element containing a text node
	j = Dom.parse("<span/>");
	j.wrap("<div>test</div>");
	equal( j.previousSibling.nodeType, 3, "Make sure the previous node is a text element" );
	equal( j.parentNode.nodeName.toUpperCase(), "DIV", "And that we're in the div element." );

	// Try to wrap an element with multiple elements (should fail)
	//j = Dom.parse("<div><span></span></div>").getChildren();
	//j.wrap("<p></p><div></div>");
	//equal( j[0].parentNode.parentNode.childNodes.length, 1, "There should only be one element wrapping." );
	//equal( j[0].parentNode.nodeName.toUpperCase(), "P", "The span should be in the paragraph." );

	j = Dom.parse("<span/>");
	j.wrap("<div></div>");
	
	equal( j.parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	// wrap an element with a Dom.parse set and event
	result = Dom.parse("<div></div>").on('click', function(){
		ok(true, "Event triggered.");

		// Remove handlers on detached elements
		this.un();
	});

	j = Dom.parse("<span/>");
	j.wrap(result);
	equal( j.parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	j.get('parent').trigger("click");

	// clean up attached elements
	QUnit.reset();
});


test("wrapAll(String|Element)", function() {
	expect(8);
	var prev = Dom.get("firstp")[0].previousSibling;
	var p = Dom.get("firstp,#first")[0].parentNode;

	var result = Dom.get("firstp,#first").wrapAll( "<div class='red'><div class='tmp'></div></div>" );
	equal( result.get('parent').length, 1, "Check for wrapping of on-the-fly html" );
	ok( Dom.get("first").get('parent').get('parent').is(".red"), "Check if wrapper has class 'red'" );
	ok( Dom.get("firstp").get('parent').get('parent').is(".red"), "Check if wrapper has class 'red'" );
	equal( Dom.get("first").get('parent').get('parent')[0].previousSibling, prev, "Correct Previous Sibling" );
	equal( Dom.get("first").get('parent').get('parent')[0].parentNode, p, "Correct Parent" );

	QUnit.reset();
	var prev = Dom.get("firstp")[0].previousSibling;
	var p = Dom.get("first")[0].parentNode;
	var result = Dom.get("firstp,#first").wrapAll( document.getElementById("empty") );
	equal( Dom.get("first").get('parent')[0], Dom.get("firstp").get('parent')[0], "Same Parent" );
	equal( Dom.get("first").get('parent')[0].previousSibling, prev, "Correct Previous Sibling" );
	equal( Dom.get("first").get('parent')[0].parentNode, p, "Correct Parent" );
});


test("wrapInner(String|Element)", function() {
	expect(11);
	var num = Dom.get("first").getChildren().length;
	var result = Dom.get("first").wrapInner(val("<div class='red'><div id='tmp'></div></div>"));
	equal( Dom.get("first").getChildren().length, 1, "Only one child" );
	ok( Dom.get("first").getChildren().is(".red"), "Verify Right Element" );
	equal( Dom.get("first").getChildren().getChildren().getChildren().length, num, "Verify Elements Intact" );

	QUnit.reset();
	var num = Dom.get("first").setHtml("foo<div>test</div><div>test2</div>").getChildren().length;
	var result = Dom.get("first").wrapInner(val("<div class='red'><div id='tmp'></div></div>"));
	equal( Dom.get("first").getChildren().length, 1, "Only one child" );
	ok( Dom.get("first").getChildren().is(".red"), "Verify Right Element" );
	equal( Dom.get("first").getChildren().getChildren().getChildren().length, num, "Verify Elements Intact" );

	QUnit.reset();
	var num = Dom.get("first").getChildren().length;
	var result = Dom.get("first").wrapInner(val(document.getElementById("empty")));
	equal( Dom.get("first").getChildren().length, 1, "Only one child" );
	ok( Dom.get("first").getChildren().is("#empty"), "Verify Right Element" );
	equal( Dom.get("first").getChildren().getChildren().length, num, "Verify Elements Intact" );

	var div = Dom.parse("<div/>");
	div.wrapInner(val("<span></span>"));
	equal(div.getChildren().length, 1, "The contents were wrapped.");
	equal(div.getChildren()[0].nodeName.toLowerCase(), "span", "A span was inserted.");
});

test("unwrap()", function() {
	expect(9);

	Dom.parse("body").append("  <div id='unwrap' style='display: none;'> <div id='unwrap1'> <span class='unwrap'>a</span> <span class='unwrap'>b</span> </div> <div id='unwrap2'> <span class='unwrap'>c</span> <span class='unwrap'>d</span> </div> <div id='unwrap3'> <b><span class='unwrap unwrap3'>e</span></b> <b><span class='unwrap unwrap3'>f</span></b> </div> </div>");

	var abcd = Dom.get("unwrap1 > span, #unwrap2 > span").get(),
		abcdef = Dom.get("unwrap span").get();

	equal( Dom.get("unwrap1 span").add("#unwrap2 span:first").unwrap().length, 3, "make #unwrap1 and #unwrap2 go away" );
	deepEqual( Dom.get("unwrap > span").get(), abcd, "all four spans should still exist" );

	deepEqual( Dom.get("unwrap3 span").unwrap().get(), Dom.get("unwrap3 > span").get(), "make all b in #unwrap3 go away" );

	deepEqual( Dom.get("unwrap3 span").unwrap().get(), Dom.get("unwrap > span.unwrap3").get(), "make #unwrap3 go away" );

	deepEqual( Dom.get("unwrap").getChildren().get(), abcdef, "#unwrap only contains 6 child spans" );

	deepEqual( Dom.get("unwrap > span").unwrap().get(), Dom.parse("body > span.unwrap").get(), "make the 6 spans become children of body" );

	deepEqual( Dom.parse("body > span.unwrap").unwrap().get(), Dom.parse("body > span.unwrap").get(), "can't unwrap children of body" );
	deepEqual( Dom.parse("body > span.unwrap").unwrap().get(), abcdef, "can't unwrap children of body" );

	deepEqual( Dom.parse("body > span.unwrap").get(), abcdef, "body contains 6 .unwrap child spans" );

	Dom.parse("body > span.unwrap").remove();
});

*/

test("Control.prototype.append", function() {
	var defaultText = "Try them out:"
	equal( Dom.get("first").getText(), defaultText, "Check defaultText" );
	var result = Dom.get("first");
	result.append("<b>buga</b>");
	equal( result.getText(), defaultText + "buga", "Check if text appending works" );
	equal( Dom.get("select3").append("<option value='appendTest'>Append Test</option>").getAttr("value"), "appendTest", "Appending html options to select element");
	
	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	Dom.get("sap").append(document.getElementById("first"));
	equal( Dom.get("sap").getText().replace(/[\r\n]/g, '').replace("hasclass", "has class"), expected, "Check for appending of element" );
	
	// QUnit.reset();
	// Dom.get("sap").append( 5 );
	// ok( Dom.get("sap").dom.innerHTML.match( /5$/ ), "Check for appending a number" );

	QUnit.reset();
	Dom.get("sap").append(  " text with spaces " );
	ok( Dom.get("sap").dom.innerHTML.match(/ text with spaces $/), "Check for appending text with spaces" );

	QUnit.reset();
	ok( Dom.get("sap").append("" ), "Check for appending an empty string." );
	//  ok( Dom.get("sap").append( document.getElementsByTagName("foo") ), "Check for appending an empty nodelist." );

	QUnit.reset();
	var form =  document.query("form");
	form.append("<input name='radiotest' type='radio' checked='checked' />");
	
	form.query("input[name=radiotest]").each(function(node){
		ok( node.checked, "Append checked radio");
	});
	form.remove();

	QUnit.reset();
	var form =  document.query("form");
	form.append("<input name='radiotest' type='radio' checked    =   'checked' />");
	form.query("input[name=radiotest]").each(function(node){
		ok( node.checked, "Append alternately formated checked radio");
	});
	
	form.remove();

	QUnit.reset();
	var form =  document.query("form");
	form.append("<input name='radiotest' type='radio' checked />");
	form.query("input[name=radiotest]").each(function(node){
		ok( node.checked, "Append HTML5-formated checked radio");
	});
	
	form.remove();

	QUnit.reset();
	Dom.get("sap").append( document.getElementById("form") );
	equal( !Dom.get("sap").find('form'), false, "Check for appending a form" ); // Bug #910

	QUnit.reset();
	var pass = true;
	try {
		var body = Dom.get("iframe").contentWindow.document.body;
	
		if(body !== null) {
			pass = false;
			new Control( body ).append( "<div>test</div>"   );
		}
		
		
		
		
		pass = true;
	} catch(e) {}

	ok( pass, "Test for appending a DOM node to the contents of an IFrame" );

	QUnit.reset();
	Dom.get("select1").append( "<OPTION>Test</OPTION>" );
	equal( Dom.get("select1").getLast('option').getText(), "Test", "Appending &lt;OPTION&gt; (all caps)" );
	
	var colgroup = Dom.get("table").append( "<colgroup></colgroup>" );
	//     colgroup = new Dom(colgroup.childNodes[0] || colgroup);
	// equal( Dom.get("table").get("last").tagName.toLowerCase(), "colgroup", "Append colgroup" );

	colgroup.append ( "<col/>" );
	equal( colgroup.getLast().dom.tagName, "COL", "Append col" );
	
	// QUnit.reset();
	// Dom.get("table").append( "<caption></caption>" );
	// equal( Dom.get("table").get("first").tagName.toLowerCase(), "caption", "Append caption" );

	//  QUnit.reset();
	// var Dom.getinput = Dom.parse("<input />").set({ "type": "checkbox", "checked": true }).appendTo('testForm');
	//  equal( Dom.getinput.checked, true, "A checked checkbox that is appended stays checked" );

	QUnit.reset();
	var radio = document.find("input[type='radio'][name='R1']"),
		radioNot = Dom.parse("<input type='radio' name='R1' checked='checked'/>").appendTo(radio.getParent()).insert("afterEnd", radio);
	radio.trigger('click');
	radioNot.checked = false;
	
  
	radio.getParent().replaceWith("<div></div>").append(radio);
	//   equal( Dom.getradio.checked, true, "Reappending radios uphold which radio is checked" );
	equal( radioNot.checked, false, "Reappending radios uphold not being checked" );

	radioNot.remove();
	QUnit.reset();

	var prev = Dom.get("sap").getChildren().length;

	Dom.get("sap").append(
		"<span></span>" +
		"<span></span>" +
		"<span></span>"
	);

	equal( Dom.get("sap").getChildren().length, prev + 3, "Make sure that multiple arguments works." );
	QUnit.reset();
});


/*

test("append the same fragment with events (Bug #6997, 5566)", function () {
	var doExtra = !Dom.parse.support.noCloneEvent && document.fireEvent;
	expect(2 + (doExtra ? 1 : 0));
	stop(1000);

	var element;

	// This patch modified the way that cloning occurs in IE; we need to make sure that
	// native event handlers on the original object don't get disturbed when they are
	// modified on the clone
	if ( doExtra ) {
		element = Dom.parse("div:first").on('click' ,function () {
			ok(true, "Event exists on original after being unbound on clone");
			Dom.parse(this).unbind("click");
		});
		var clone = element.clone(true).unbind("click");
		clone[0].fireEvent("onclick");
		element[0].fireEvent("onclick");

		// manually clean up detached elements
		clone.remove();
	}

	element = Dom.parse("<a class='test6997'></a>").on('click' ,function () {
		ok(true, "Append second element events work");
	});

	Dom.get("listWithTabIndex li").append(element)
		.find("a.test6997").eq(1).trigger('click');

	element = Dom.parse("<li class='test6997'></li>").on('click' ,function () {
		ok(true, "Before second element events work");
		start();
	});

	Dom.get("listWithTabIndex li").before(element);
	Dom.get("listWithTabIndex li.test6997").eq(1).trigger('click');
});


*/


/*

test("Control.prototype.append(xml)", function() {
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

test("Control.prototype.appendTo", function() {

	var defaultText = "Try them out:";
	Dom.parse("<b>buga</b>").appendTo("first");
	equal( Dom.get("first").getText(), defaultText + "buga", "Check if text appending works" );
	equal( Dom.parse("<option value='appendTest'>Append Test</option>").appendTo("select3").getParent().getLast("option").getAttr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var l = Dom.get("first").getChildren().length + 2;
	new DomList([ Dom.parse("<strong>test</strong>"), Dom.parse("<strong>test</strong>") ])
		.appendTo("first");
	equal( Dom.get("first").getChildren().length, 2, "Make sure the elements were inserted." );
	equal( Dom.get("first").getChildren()[Dom.get("first").getChildren().length - 1].nodeName.toLowerCase(), "strong", "Verify the last element." );

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	Dom.get("first").appendTo("sap");
	equal( Dom.get("sap").getText().replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	new DomList([document.getElementById("first"), document.getElementById("yahoo")]).appendTo("sap");
	equal( Dom.get("sap").getText().replace(/[\r\n]/g, "").replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for appending of array of elements" );

	QUnit.reset();
	ok( Dom.create("script").appendTo(), "Make sure a disconnected script can be appended." );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	Dom.get("yahoo").appendTo("sap");
	Dom.get("first").appendTo("sap");
	equal( Dom.get("sap").getText().replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for appending of Dom.parse object" );
	
	QUnit.reset();
	Dom.get("select1").appendTo("foo");

	QUnit.reset();
	var div = Dom.parse("<div/>").on('click', function(){
		ok(true, "Running a cloned click.");
	});
	div.appendTo("moretests");

	Dom.get("qunit-fixture").query("div").item(-1).trigger('click');
	Dom.get("moretests").query("div").item(-1).trigger('click');

	QUnit.reset();
	var div = Dom.parse("<div/>").appendTo("moretests");

	div.addClass("test");

	ok( Dom.get("moretests").getLast('div').hasClass("test"), "appendTo element was modified after the insertion" );

	QUnit.reset();

	div = Dom.parse("<div/>");
	div.append(Dom.parse("<span>a</span><b>b</b>"));

	equal( div.getChildren().length, 2, "Make sure the right number of children were inserted." );

	div = Dom.get("moretests").query('div');

	var num = Dom.get("qunit-fixture").query('div').length;
	div.remove().appendTo("qunit-fixture");

	equal( Dom.get("qunit-fixture").query('div').length, num, "Make sure all the removed divs were inserted." );

	QUnit.reset();
});

test("Control.prototype.insert('afterBegin', html)", function() {
	var defaultText = "Try them out:"
	var result = Dom.get("first");
	result.insert( 'afterBegin', "<b>buga</b>");
	equal( result.getText(), "buga" + defaultText, "Check if text prepending works" );
	equal( Dom.get("select3").insert( 'afterBegin', "<option value='prependTest'>Prepend Test</option>" ).getAttr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	Dom.get("sap").insert('afterBegin', document.getElementById("first"));
	equal( Dom.get("sap").getText().replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "YahooThis link has class=\"blog\": Simon Willison's Weblog";
	Dom.get("sap").insert( 'afterBegin', Dom.get("yahoo") );
	equal( Dom.get("sap").getText().replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for prepending of Dom.parse object" );
});

test("Control.prototype.insert('beforeBegin', html)", function() {
	var expected = "This is a normal link: bugaYahoo";
	Dom.get("yahoo").insert('beforeBegin', "<b>buga</b>");
	equal( Dom.get("en").getText().replace(/[\r\n]/g, ""), expected, "Insert String before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:Yahoo";
	Dom.get("yahoo").insert( 'beforeBegin' , document.getElementById("first"));
	
	// !Safari
	equal( Dom.get("en").getText().replace(/[\r\n]/g, "").replace("link:T", "link: T"), expected, "Insert element before" );

	QUnit.reset();
	expected = "This is a normal link: diveintomarkYahoo";
	Dom.get("yahoo").insert('beforeBegin', Dom.get("mark"));
	equal( Dom.get("en").getText().replace(/[\r\n]/g, ""), expected, "Insert Dom.parse before" );

	// var set = Dom.parse("<div/>").insert("<span>test</span>", 'beforeBegin');
	// equal( set.nodeName.toLowerCase(), "span", "Insert the element before the disconnected node." );
});

test("Control.prototype.insert('afterEnd', html)", function() {
	var expected = "This is a normal link: Yahoobuga";
	Dom.get("yahoo").insert( 'afterEnd',  "<b>buga</b>" );
	equal( Dom.get("en").getText().replace(/[\r\n]/g, ""), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	Dom.get("yahoo").insert(  'afterEnd',  document.getElementById("first")  );
	equal( Dom.get("en").getText().replace(/[\r\n]/g, ""), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: Yahoodiveintomark";
	Dom.get("yahoo").insert( 'afterEnd',  Dom.get("mark"));
	equal( Dom.get("en").getText().replace(/[\r\n]/g, ""), expected, "Insert Dom.parse after" );

	// var set = Dom.parse("<div/>").insert("<span>test</span>"   , 'afterEnd');
	// equal( set.nodeName.toLowerCase(), "span", "Insert the element after the disconnected node." );
});

test("Control.prototype.insert('beforeEnd', html)", function() {
	var expected = "This is a normal link: Yahoobuga";
	Dom.get("yahoo").insert( 'beforeEnd', "<b>buga</b>" );
	equal( Dom.get("en").getText().replace(/[\r\n]/g, ""), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	Dom.get("yahoo").insert(   'beforeEnd', document.getElementById("first")  );
	equal( Dom.get("en").getText().replace(/[\r\n]/g, ""), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: Yahoodiveintomark";
	Dom.get("yahoo").insert('beforeEnd', Dom.get("mark"));
	equal( Dom.get("en").getText().replace(/[\r\n]/g, ""), expected, "Insert Dom.parse after" );

	var set = Dom.parse("<div/>").insert('beforeEnd', "<span>test</span>");
	equal( set.dom.nodeName.toLowerCase(), "span", "Insert the element after the disconnected node." );
});

test("Control.prototype.replaceWith", function() {

	Dom.get("yahoo").replaceWith( "<b id='replace'>buga</b>" );
	ok( Dom.get("replace"), "Replace element with string" );
	ok( !Dom.get("yahoo"), "Verify that original element is gone, after string" );

	QUnit.reset();
	Dom.get("yahoo").replaceWith( document.getElementById("first") );
	ok( Dom.get("first"), "Replace element with element" );
	ok( !Dom.get("yahoo"), "Verify that original element is gone, after element" );

	QUnit.reset();
	Dom.get("qunit-fixture").append("<div id='bar'><div id='baz'></div></div>");
	Dom.get("baz").replaceWith("Baz");
	equal( Dom.get("bar").getText().replace(/[\r\n]/g, ""),"Baz", "Replace element with text" );
	ok( !Dom.get("baz"), "Verify that original element is gone, after element" );

	QUnit.reset();
	Dom.get("yahoo").replaceWith( Dom.get("mark") );
	ok( Dom.get("first"), "Replace element with set of elements" );
	ok( Dom.get("mark"), "Replace element with set of elements" );
	ok( !Dom.get("yahoo"), "Verify that original element is gone, after set of elements" );

	QUnit.reset();
	var tmp = Dom.parse("<div/>").appendTo().on('click', function(){ ok(true, "Newly bound click run." ); });
	var y = Dom.parse("<div/>").appendTo().on('click',function(){ ok(true, "Previously bound click run." ); });
	var child = y.append("<b>test</b>").on('click',function(){ ok(true, "Child bound click run." ); return false; });

	y.replaceWith( tmp );

	tmp.trigger('click');
	y.trigger('click'); // Shouldn't be run
	//  child.trigger('click'); // Shouldn't be run

	tmp.remove();
	y.remove();
	//child.remove();

	QUnit.reset();

	y = Dom.parse("<div/>").appendTo().on('click' ,function(){ ok(true, "Previously bound click run." ); });
	
	var child2 = y.append("<u>test</u>").on('click' ,function(){ ok(true, "Child 2 bound click run." ); return false; });

	y.replaceWith( child2 );

	child2.trigger('click');

	y.remove();
	child2.remove();

	QUnit.reset();

	var set = Dom.parse("<div/>").replaceWith( "<span>test</span>" );
	equal( set.dom.nodeName.toLowerCase(), "span", "Replace the disconnected node." );

	var div = Dom.parse("<div class='replacewith'></div>").appendTo();
	// TODO: Work on Dom.parse(...) inline script execution
	//div.replaceWith("<div class='replacewith'></div><script>" +
		//"equal(Dom.parse('.replacewith').length, 1, 'Check number of elements in page.');" +
		//"</script>");
	equal(document.query(".replacewith").length, 1, "Check number of elements in page.");
	document.query(".replacewith").remove();

	QUnit.reset();

	Dom.get("qunit-fixture").append("<div id='replaceWith'></div>");
	equal( Dom.get("qunit-fixture").query("div[id=replaceWith]").length, 1, "Make sure only one div exists." );

	Dom.get("replaceWith").replaceWith( "<div id='replaceWith'></div>" );
	equal( Dom.get("qunit-fixture").query("div[id=replaceWith]").length, 1, "Make sure only one div exists." );

	Dom.get("replaceWith").replaceWith(  "<div id='replaceWith'></div>" );
	equal( Dom.get("qunit-fixture").query("div[id=replaceWith]").length, 1, "Make sure only one div exists." );
});

test("Control.prototype.replaceWith(string) for more than one element", function(){
	expect(3);

	equal(document.query("#foo p").length, 3, "ensuring that test data has not changed");

	document.query("#foo p").replaceWith("<span>bar</span>");
	equal(document.query("#foo span").length, 3, "verify that all the three original element have been replaced");
	equal(document.query("#foo p").length, 0, "verify that all the three original element have been replaced");
});

test("Dom.parse.clone() (#8017)", function() {

	var main = Dom.get("qunit-fixture"),
			clone = main.clone();

	equal( main.dom.childNodes.length, clone.dom.childNodes.length, "Simple child length to ensure a large dom tree copies correctly" );

	
	Dom.get("qunit-fixture").append("<select class='test8070'></select><select class='test8070'></select>");
	var selects = document.query(".test8070");
	
	selects.append("<OPTION>1</OPTION><OPTION>2</OPTION>");

	equal( selects[0].childNodes.length, 2, "First select got two nodes" );
	equal( selects[1].childNodes.length, 2, "Second select got two nodes" );

	selects.dispose();
	
});

test("Control.prototype.clone", function() {
	equal( "This is a normal link: Yahoo", Dom.get("en").getText(), "Assert text for #en" );
	var clone = Dom.get("yahoo").clone();
	Dom.get("first").append(clone);
	equal( "Try them out:Yahoo", Dom.get("first").getText(), "Check for clone" );
	equal( "This is a normal link: Yahoo", Dom.get("en").getText(), "Reassert text for #en" );

	var cloneTags = [
		"<table/>", "<tr/>", "<td/>", "<div/>",
		"<button/>", "<ul/>", "<ol/>", "<li/>",
		"<input type='checkbox' />", "<select/>", "<option/>", "<textarea/>",
		"<tbody/>", "<thead/>", "<tfoot/>", "<iframe/>"
	];
	for (var i = 0; i < cloneTags.length; i++) {
		var j = Dom.parse(cloneTags[i]);
		equal( j.dom.tagName, j.clone().dom.tagName, "Clone a " + cloneTags[i]);
	}
	
	var div = Dom.parse("<div><ul><li>test</li></ul></div>").on('click' ,function(){
		ok( true, "Bound event still exists." );
	});

	clone = div.clone(true);

	// manually clean up detached elements
	div.remove();

	div = clone.clone(true);

	// manually clean up detached elements
	clone.remove();

	equal( div.dom.nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div.trigger("click");

	// manually clean up detached elements
	div.remove();

	div = Dom.parse("<div/>");
	 div.append(document.createElement("table"));
	div.find("table").on('click' ,function(){
		ok( true, "Bound event still exists." );
	});

	clone = div.clone(true);
	equal( clone.dom.nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	clone.find("table").trigger("click");

	// manually clean up detached elements
	div.remove();
	clone.remove();

	var divEvt = Dom.parse("<div><ul><li>test</li></ul></div>").on('click' ,function(){
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
	div = Dom.parse("<div/>").setHtml("<object height='355' width='425' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	// !IE9
	//clone = div.clone(true);
	//equal( clone.getHtml(), div.getHtml(), "Element contents cloned" );
	//equal( clone.nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// and here's a valid one.
	div = Dom.parse("<div/>").setHtml("<object height='355' width='425' type='application/x-shockwave-flash' data='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone(true);
	equal( clone.getHtml(), div.getHtml(), "Element contents cloned" );
	equal( clone.dom.nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// manually clean up detached elements
	div.remove();
	clone.remove();

	var form = document.createElement("form");
	form.action = "/test/";
	var div = document.createElement("div");
	div.appendChild( document.createTextNode("test") );
	form.appendChild( div );

	equal( Dom.get(form).clone().getChildren().length, 1, "Make sure we just get the form back." );

	//equal( document.find("body").clone().tagName, "BODY", "Make sure cloning body works" );
});

test("clone(form element) (Bug #3879, #6655)", function() {
	var element = Dom.parse("<select><option>Foo</option><option selected>Bar</option></select>");

	equal( element.clone().find(":selected").getText(), element.find(":selected").getText(), "Selected option cloned correctly" );

	element = Dom.parse("<input type='checkbox' value='foo'>").setAttr("checked", "checked");
	clone = element.clone();

	equal( clone.dom.defaultValue, "foo", "Checked input defaultValue cloned correctly" );

	// defaultChecked also gets set now due to setAttribute in attr, is this check still valid?
	// equal( clone[0].defaultChecked, !Dom.parse.support.noCloneChecked, "Checked input defaultChecked cloned correctly" );

	// element = Dom.parse("<input type='text' value='foo'>");
	// clone = element.clone();
	// equal( clone.defaultValue, "foo", "Text input defaultValue cloned correctly" );

	// element = Dom.parse("<textarea>foo</textarea>");
	// clone = element.clone();
	// equal( clone.defaultValue, "foo", "Textarea defaultValue cloned correctly" );
});

test("clone(multiple selected options)", function() {
	expect(1);
	var element = Dom.parse("<select><option>Foo</option><option selected>Bar</option><option selected>Baz</option></select>");

	equal( element.clone().query(":selected").length, element.query(":selected").length, "Multiple selected options cloned correctly" );

});

test("Control.prototype.setHtml", function() {

	Dom.parse.scriptorder = 0;

	var div = document.query("#qunit-fixture > div");
	div.setHtml( "<b>test</b>");
	var pass = true;
	for ( var i = 0; i < div.length; i++ ) {
		if ( div[i].childNodes.length != 1 ) pass = false;
	}
	ok( pass, "Set HTML" );

	div = Dom.parse("<div/>").setHtml( "<div id='parent_1'><div id='child_1'/></div><div id='parent_2'/>"  );

	equal( div.getChildren().length, 2, "Make sure two child nodes exist." );
	equal( div.getChildren().getChildren().length, 1, "Make sure that a grandchild exists." );

	var space = Dom.parse("<div/>").setHtml( "&#160;" ).dom.innerHTML;
	ok( /^\xA0$|^&nbsp;$/.test( space ), "Make sure entities are passed through correctly." );
	equal( Dom.parse("<div/>").setHtml( "&amp;" ).dom.innerHTML, "&amp;", "Make sure entities are passed through correctly." );

	Dom.get("qunit-fixture").setHtml( "<style>.foobar{color:green;}</style>" );

	  equal( Dom.get("qunit-fixture").getChildren().length, 1, "Make sure there is a child element." );
	    equal( Dom.get("qunit-fixture").getChildren()[0].nodeName.toUpperCase(), "STYLE", "And that a style element was inserted." );

	//QUnit.reset();
	//Dom.get("qunit-fixture").setHtml( "<select/>" );
	//document.find("#qunit-fixture select").setHtml( "<option>O1</option><option selected='selected'>O2</option><option>O3</option>" );
	//equal( document.find("#qunit-fixture select").getText(), "O2", "Selected option correct" );

	var div = Dom.parse("<div />");
	equal( div.setHtml( 5 ).getHtml(), "5", "Setting a number as html" );
	equal( div.setHtml( 0 ).getHtml(), "0", "Setting a zero as html" );

	var div2 = Dom.parse("<div/>"), insert = "&lt;div&gt;hello1&lt;/div&gt;";
	equal( div2.setHtml(insert).getHtml().replace(/>/g, "&gt;"), insert, "Verify escaped insertion." );
	equal( div2.setHtml("x" + insert).getHtml().replace(/>/g, "&gt;"), "x" + insert, "Verify escaped insertion." );
	// equal( div2.setHtml(" " + insert).getHtml().replace(/>/g, "&gt;"), " " + insert, "Verify escaped insertion." );

	var map = Dom.parse("<map/>").setHtml("<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.jquery.com/' alt='Dom.parse'>");

	equal( map.dom.childNodes.length, 1, "The area was inserted." );
	equal( map.dom.firstChild.nodeName.toLowerCase(), "area", "The area was inserted." );

	QUnit.reset();

	Dom.get("qunit-fixture").setHtml("<script type='something/else'>ok( false, 'Non-script evaluated.' );</script><script type='text/javascript'>ok( true, 'text/javascript is evaluated.' );</script><script>ok( true, 'No type is evaluated.' );</script><div><script type='text/javascript'>ok( true, 'Inner text/javascript is evaluated.' );</script><script>ok( true, 'Inner No type is evaluated.' );</script><script type='something/else'>ok( false, 'Non-script evaluated.' );</script></div>");

	var child = Dom.get("qunit-fixture").query("script");

	equal( child.length, 6, "Make sure that two non-JavaScript script tags are left." );
	equal( child.item(0).dom.type, "something/else", "Verify type of script tag." );
	equal( child.item(-1).dom.type, "something/else", "Verify type of script tag." );

	Dom.get("qunit-fixture").setHtml("<script>ok( true, 'Test repeated injection of script.' );</script>");
	Dom.get("qunit-fixture").setHtml("<script>ok( true, 'Test repeated injection of script.' );</script>");
	Dom.get("qunit-fixture").setHtml("<script>ok( true, 'Test repeated injection of script.' );</script>");

	Dom.get("qunit-fixture").setHtml("<script type='text/javascript'>ok( true, 'Dom.parse().getHtml().evalScripts() Evals Scripts Twice in Firefox, see #975 (1)' );</script>");

	Dom.get("qunit-fixture").setHtml("foo <form><script type='text/javascript'>ok( true, 'Dom.parse().getHtml().evalScripts() Evals Scripts Twice in Firefox, see #975 (2)' );</script></form>");

	Dom.get("qunit-fixture").setHtml("<script>equal(Dom.parse.scriptorder++, 0, 'Script is executed in order');equal(Dom.parse('#scriptorder').length, 1,'Execute after html (even though appears before)')<\/script><span id='scriptorder'><script>equal(Dom.parse.scriptorder++, 1, 'Script (nested) is executed in order');equal(Dom.parse('#scriptorder').length, 1,'Execute after html')<\/script></span><script>equal(Dom.parse.scriptorder++, 2, 'Script (unnested) is executed in order');equal(Dom.parse('#scriptorder').length, 1,'Execute after html')<\/script>");
});

test("Control.prototype.remove", function() {

	var first = Dom.get("ap");

	Dom.get("ap").getChildren().remove();
	ok( Dom.get("ap").getText().length > 10, "Check text is not removed" );
	equal( Dom.get("ap").getChildren().length, 0, "Check remove" );

	QUnit.reset();

	var count = 0;
	var first = Dom.get("ap").getFirst();
	var cleanUp = first.on('click' ,function() { count++ }).remove().appendTo("qunit-fixture");
	cleanUp.trigger('click');
	// manually clean up detached elements
	cleanUp.remove();
});

test("Control.prototype.empty", function() {
	equal( Dom.get("ap").getChildren().empty().getText().join('').length, 0, "Check text is removed" );
	equal( Dom.get("ap").getChildren().length, 4, "Check elements are not removed" );

});

test( "Dom.parse - execute scripts escaped with html comment or CDATA (#9221)", function() {
	Dom.parse( [
	         '<script type="text/javascript">',
	         '<!--',
	         'ok( true, "<!-- handled" );',
	         '//-->',
	         '</script>'
	     ].join ( "\n" ) ).appendTo( "qunit-fixture" );
	// Dom.parse( [
	 //        '<script type="text/javascript">',
	 //        '<![CDATA[',
	 //        'ok( true, "<![CDATA[ handled" );',
	 //        '//]]>',
	 //        '</script>'
	  //    ].join ( "\n" ) ).appendTo( "qunit-fixture" );
	Dom.parse( [
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
		Dom.get("no-clone-exception").clone();
		ok( true, "cloned with no exceptions" );
	} catch( e ) {
		ok( false, e.message );
	}
});
