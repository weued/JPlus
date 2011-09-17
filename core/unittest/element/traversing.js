module("traversing");




function q(){
	var el = new ElementList();
	Object.each(arguments, function (dom) {
		el.push($(dom));
	});
	
	return el;
}

test("Element.prototype.find", function() {
	equals( "Yahoo", document.findAll("#foo").findAll(".blogTest").getText().join(''), "Check for find" );

	same( document.findAll("#qunit-fixture").findAll("> div"), q("foo", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest"), "find child elements" );
	same( document.findAll("#qunit-fixture").findAll("> #foo > p"), q("sndp", "en", "sap"), "find child elements" );
});

test("Element.prototype.get('index')", function() {
	expect( 2 );

	equal( document.find("#text2").get('index'), 2, "Returns the index of a child amongst its siblings" );

	equal( Element.parse("<div/>").get('index'), 0, "Node without parent returns 0" );
});

test("Element.prototype.get('closest')", function() {
	same( document.find("body").get('closest', function () {
		return true;
	}), document.find("body"), "get('closest', body)" );
});

test("Element.prototype.get('siblings')", function() {
	same( $("en").get('siblings'), q("sndp", "sap"), "Check for siblings" );
});

test("Element.prototype.get('children')", function() {
	same(  $("foo").get('children'), q("sndp", "en", "sap"), "Check for children" );
});

test("Element.prototype.get('parent')", function() {
	equals(  $("groups").get('parent').id, "ap", "Simple parent check" );
	equals(  $("groups").get('parent', "p").id, "ap", "Filtered parent check" );
	equals(  $("groups").get('parent', "div2"), null, "Filtered parent check, no match" );
});

test("Element.prototype.get('parents')", function() {
	equals( $("groups").get('parents')[0].id, "ap", "Simple parents check" );
	equals( $("groups").get('parents', "p")[0].id, "ap", "Filtered parents check" );
	equals( $("groups").get('parents', "div")[0].id, "qunit-fixture", "Filtered parents check2" );
});

test("Element.prototype.get('next')", function() {
	equals( $("ap").get('next').id, "foo", "Simple next check" );
	equals( $("ap").get('next', "div").id, "foo", "Filtered next check" );
	equals( $("ap").get('next', "p2"), null, "Filtered next check, no match" );
});

test("Element.prototype.get('previous')", function() {
	equals( $("foo").get('previous').id, "ap", "Simple prev check" );
	equals( $("foo").get('previous', "p").id, "ap", "Filtered prev check" );
	equals( $("foo").get('previous', "div2"), null, "Filtered prev check, no match" );
});

test("Element.prototype.get('previouses')", function() {

	var elems = $("form").get('children').slice(0, 12).reverse();

	same( $("area1").get('previouses'), elems, "Simple prevAll check" );
});

test("Element.prototype.get('nexts')", function() {

	var elems = document.findAll("form").get('children').slice( 2, 12 );

	same( document.findAll("text1").get('nexts'), document.findAll("text1").get('nexts'), "nextUntil with no selector (nextAll)" );
});