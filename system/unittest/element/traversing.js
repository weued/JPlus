module("traversing");




function q(){
	var el = new DomList();
	Object.each(arguments, function (dom) {
		el.push(Dom.get(dom).dom);
	});
	
	return el;
}

test("Control.prototype.query", function() {
	equals( document.query("#foo").query(".blogTest").getText().join(''), "Yahoo", "Check for find" );

	same( document.query("#qunit-fixture").query("> div"), q("foo", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest"), "find child elements" );
	same( document.query("#qunit-fixture").query("> #foo > p"), q("sndp", "en", "sap"), "find child elements" );
});

test("Control.prototype.getIndex()", function() {
	expect( 2 );

	equal( document.find("#text2").getIndex(), 2, "Returns the index of a child amongst its siblings" );

	equal( Dom.parse("<div/>").getIndex(), 0, "Node without parent returns 0" );
});

test("Control.prototype.getSiblings()", function() {
	same( Dom.get("en").getSiblings(), q("sndp", "sap"), "Check for siblings" );
});

test("Control.prototype.getChildren()", function() {
	same(  Dom.get("foo").getChildren(), q("sndp", "en", "sap"), "Check for children" );
});

test("Control.prototype.getParent()", function() {
	equals(  Dom.get("groups").getParent().dom.id, "ap", "Simple parent check" );
	equals(  Dom.get("groups").getParent("p").dom.id, "ap", "Filtered parent check" );
	equals(  Dom.get("groups").getParent("div2"), null, "Filtered parent check, no match" );
});

test("Control.prototype.getAllParent()", function() {
	equals( Dom.get("groups").getAllParent()[0].id, "ap", "Simple parents check" );
	equals( Dom.get("groups").getAllParent("p")[0].id, "ap", "Filtered parents check" );
	equals( Dom.get("groups").getAllParent("div")[0].id, "qunit-fixture", "Filtered parents check2" );
});

test("Control.prototype.getNext()", function() {
	equals( Dom.get("ap").getNext().dom.id, "foo", "Simple next check" );
	equals( Dom.get("ap").getNext("div").dom.id, "foo", "Filtered next check" );
	equals( Dom.get("ap").getNext("p2"), null, "Filtered next check, no match" );
});

test("Control.prototype.getPrevious()", function() {
	equals( Dom.get("foo").getPrevious().dom.id, "ap", "Simple prev check" );
	equals( Dom.get("foo").getPrevious("p").dom.id, "ap", "Filtered prev check" );
	equals( Dom.get("foo").getPrevious("div2"), null, "Filtered prev check, no match" );
});

test("Control.prototype.getAllPrevious()", function() {

	var elems = Dom.get("form").getChildren().slice(0, 12).reverse();

	same( Dom.get("area1").getAllPrevious(), elems, "Simple prevAll check" );
});

test("Control.prototype.getAllNext()", function() {

	var elems = document.query("form").getChildren().slice( 2, 12 );

	same( document.query("text1").getAllNext(), document.query("text1").getAllNext(), "nextUntil with no selector (nextAll)" );
});