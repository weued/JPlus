module("System");

test("System.Dom.Element", function() {
	ok( JPlus, "JPlus" );
	ok( $, "$" );
	ok( Element, "Element" );
});

test("Element.parse('html')", function() {
	var elem = Element.parse("<div/><hr/><code/><b/>");
	equals( elem.childNodes.length, 4, "节点个数" );

	for ( var i = 0; i < 3; ++i ) {
		elem = Element.parse("<input type='text' value='TEST' />");
	}
	equals( elem.value, "TEST", "默认值" );

	elem.remove();

	equals( Element.parse(" <div/> ").tagName, 'DIV', "确保空白被删除" );
	equals( Element.parse(" a<div/>b ").childNodes.length, 3, "确保空白被删除" );

	var long1 = "";
	for ( var i = 0; i < 128; i++ ) {
		long1 += "12345678";
	}

	equals( Element.parse(" <div/> ").tagName, 'DIV', "确保空白被删除" );
	equals( Element.parse(" a<div/>b ").childNodes.length, 3, "确保空白被删除" );

	// Test multi-line HTML
	var div = Element.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>");
	equals( div.nodeName.toUpperCase(), "DIV", "Make sure we're getting a div." );
	equals( div.firstChild.nodeType, 3, "Text node." );
	equals( div.lastChild.nodeType, 3, "Text node." );
	equals( div.childNodes[1].nodeType, 1, "Paragraph." );
	equals( div.childNodes[1].firstChild.nodeType, 3, "Paragraph text." );

	QUnit.reset();
	//ok( Element.parse("<link rel='stylesheet'/>"), "Creating a link" );

	ok( Element.parse("<input/>").setAttr("type", "hidden"), "Create an input and set the type." );

	var j = Element.parse("<span>hi</span> there <!-- mon ami -->");
	ok( j.childNodes.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	ok( !Element.parse("<option>test</option>").selected, "Make sure that options are auto-selected" );

	ok( Element.parse("<div></div>"), "Create a div with closing tag." );
	ok( Element.parse("<table></table>"), "Create a table with closing tag." );

	// Test very large html string
	var i;
	var li = "<li>very large html string</li>";
	var html = ["<ul>"];
	for ( i = 0; i < 50000; i += 1 ) {
		html.push(li);
	}
	html.push("</ul>");
	html = Element.parse(html.join(""));
	equals( html.nodeName.toUpperCase(), "UL");
	equals( html.firstChild.nodeName.toUpperCase(), "LI");
	equals( html.childNodes.length, 50000 );
});

test("Element.parse('html', context)", function() {
	expect(1);

	var div = Element.parse("<div/>");
	var span = Element.parse("<span/>", div);
	equals(span.tagName, 'SPAN', "Verify a span created with a div context works");
});

test("ElementList.prototype.each", function() {
	expect(1);
	var div = document.findAll("div");
	div.each(function(node){node.foo = "zoo";});
	var pass = true;
	for ( var i = 0; i < div.doms.length; i++ ) {
		if ( div.doms[i].foo != "zoo" ) pass = false;
	}
	ok( pass, "Execute a function, Relative" );
});
