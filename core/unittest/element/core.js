module("Element");

test("System.Dom.Element", function() {
	ok( JPlus, "JPlus" );
	ok( $, "$" );
	ok( Element, "Element" );
});

test("Element.parse", function() {
	var elem = Element.parse("<div/><hr/><code/><b/>");
	equals( elem.length, 4, "节点个数" );

	for ( var i = 0; i < 3; ++i ) {
		elem = Element.parse("<input type='text' value='TEST' />");
	}
	equals( elem.value, "TEST", "默认值" );

	elem.remove();

	equals( Element.parse(" <div/> ").tagName, 'DIV', "确保空白被删除" );
	equals( Element.parse(" a<div/>b ").length, 3, "确保空白被删除" );

	var long1 = "";
	for ( var i = 0; i < 128; i++ ) {
		long1 += "12345678";
	}

	equals( Element.parse(" <div/> ").tagName, 'DIV', "确保空白被删除" );
	equals( Element.parse(" a<div/>b ").length, 3, "确保空白被删除" );

	// Test multi-line HTML
	var div = Element.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>");
	equals( div.nodeName.toUpperCase(), "DIV", "Make sure we're getting a div." );
	equals( div.firstChild.nodeType, 3, "Text node." );
	equals( div.lastChild.nodeType, 3, "Text node." );
	equals( div.childNodes[1].nodeType, 1, "Paragraph." );
	equals( div.childNodes[1].firstChild.nodeType, 3, "Paragraph text." );

	QUnit.reset();
	//ok( Element.parse("<link rel='stylesheet'/>"), "Creating a link" );

	//  ok( Element.parse("<input/>").setAttr("type", "hidden"), "Create an input and set the type." );

	var j = Element.parse("<span>hi</span> there <!-- mon ami -->");
	ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

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
	
	
	var div = Element.parse("<div/>");
	var span = Element.parse("<span/>", div);
	equals(span.tagName, 'SPAN', "Verify a span created with a div context works");

});

test("Document.prototype.create",  function() {
	var el = document.create('div');
	equals(el.tagName, 'DIV', "成功创建");
	equals(el.append, Element.prototype.append, "包括 Element 方法");
});

test("Document.prototype.getDom",  function() {
	Element.parse('<div id="a"></div>').appendTo("qunit-fixture");
	var el = document.getDom('a');
	equals(el.tagName, 'DIV', "成功创建");
	equals(el.append, Element.prototype.append, "包括 Element 方法");
});

test("ElementList",  function() {
	var el = new ElementList(document.getElementsByTagName('span'));
	var length = el.length ;
	equals(length > 0, true, "可以获取长度");
	
	el.push(document.body);
	equals(el.length, length + 1, "push() 增加长度");
	equals(el[length], document.body, "push() 添加到最后一个元素");
	
	el.unshift(document.body);
	equals(el.length, length + 2, "unshift() 增加长度");
	equals(el[0], document.body, "unshift() 添加到第一个元素");
	
	equals(el.shift(), document.body, "shift() 移除返回第一个。");
	equals(el.length, length + 1, "shift() 减少长度");
	
	equals(el.pop(), document.body, "pop() 移除返回最后一个。");
	equals(el.length, length, "pop() 减少长度");
	
	same(el.filter(Function.returnTrue), el, "filter() 返回");
	
	equals(el.indexOf(document), -1, "indexOf() 返回");
	
	el.each(function(node){node.foo = "zoo";});
	var pass = true;
	for ( var i = 0; i < el.length; i++ ) {
		if ( el[i].foo != "zoo" ) pass = false;
	}
	ok( pass, "each() 执行" );
	
	ok(el[0].xType, "所有节点都包含 DOM 的方法");
	equals(el.item(-1), el[el.length -1], "item(-1) 返回最后的节点。");
});

test("Control",  function() {
	var el = new Control(document);
	equals(el.dom, document, "dom 属性");
});
