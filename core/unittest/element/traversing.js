module("traversing");

test("find(String)", function() {
	expect(5);
	equals( "Yahoo", $("foo").find(".blogTest").text(), "Check for find" );

	// using contents will get comments regular, text, and comment nodes
	var j = $("nonnodes").contents();
	equals( j.find("div").length, 0, "Check node,textnode,comment to find zero divs" );

	same( $("qunit-fixture").find("> div").get(), q("foo", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest"), "find child elements" );
	same( $("qunit-fixture").find("> #foo, > #moretests").get(), q("foo", "moretests"), "find child elements" );
	same( $("qunit-fixture").find("> #foo > p").get(), q("sndp", "en", "sap"), "find child elements" );
});

test("find(node|jQuery object)", function() {
	expect( 11 );

	var $foo = $("foo"),
		$blog = jQuery(".blogTest"),
		$first = $("first"),
		$two = $blog.add( $first ),
		$fooTwo = $foo.add( $blog );

	equals( $foo.find( $blog ).text(), "Yahoo", "Find with blog jQuery object" );
	equals( $foo.find( $blog[0] ).text(), "Yahoo", "Find with blog node" );
	equals( $foo.find( $first ).length, 0, "#first is not in #foo" );
	equals( $foo.find( $first[0]).length, 0, "#first not in #foo (node)" );
	ok( $foo.find( $two ).is(".blogTest"), "Find returns only nodes within #foo" );
	ok( $fooTwo.find( $blog ).is(".blogTest"), "Blog is part of the collection, but also within foo" );
	ok( $fooTwo.find( $blog[0] ).is(".blogTest"), "Blog is part of the collection, but also within foo(node)" );

	equals( $two.find( $foo ).length, 0, "Foo is not in two elements" );
	equals( $two.find( $foo[0] ).length, 0, "Foo is not in two elements(node)" );
	equals( $two.find( $first ).length, 0, "first is in the collection and not within two" );
	equals( $two.find( $first ).length, 0, "first is in the collection and not within two(node)" );

});

test("is(String|undefined)", function() {
	expect(27);
	ok( $("form").is("form"), "Check for element: A form must be a form" );
	ok( !$("form").is("div"), "Check for element: A form is not a div" );
	ok( $("mark").is(".blog"), "Check for class: Expected class 'blog'" );
	ok( !$("mark").is(".link"), "Check for class: Did not expect class 'link'" );
	ok( $("simon").is(".blog.link"), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !$("simon").is(".blogTest"), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	ok( $("en").is("[lang=\"en\"]"), "Check for attribute: Expected attribute lang to be 'en'" );
	ok( !$("en").is("[lang=\"de\"]"), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	ok( $("text1").is("[type=\"text\"]"), "Check for attribute: Expected attribute type to be 'text'" );
	ok( !$("text1").is("[type=\"radio\"]"), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	ok( $("text2").is(":disabled"), "Check for pseudoclass: Expected to be disabled" );
	ok( !$("text1").is(":disabled"), "Check for pseudoclass: Expected not disabled" );
	ok( $("radio2").is(":checked"), "Check for pseudoclass: Expected to be checked" );
	ok( !$("radio1").is(":checked"), "Check for pseudoclass: Expected not checked" );
	ok( $("foo").is(":has(p)"), "Check for child: Expected a child 'p' element" );
	ok( !$("foo").is(":has(ul)"), "Check for child: Did not expect 'ul' element" );
	ok( $("foo").is(":has(p):has(a):has(code)"), "Check for childs: Expected 'p', 'a' and 'code' child elements" );
	ok( !$("foo").is(":has(p):has(a):has(code):has(ol)"), "Check for childs: Expected 'p', 'a' and 'code' child elements, but no 'ol'" );

	ok( !$("foo").is(0), "Expected false for an invalid expression - 0" );
	ok( !$("foo").is(null), "Expected false for an invalid expression - null" );
	ok( !$("foo").is(""), "Expected false for an invalid expression - \"\"" );
	ok( !$("foo").is(undefined), "Expected false for an invalid expression - undefined" );
	ok( !$("foo").is({ plain: "object" }), "Check passing invalid object" );

	// test is() with comma-seperated expressions
	ok( $("en").is("[lang=\"en\"],[lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( $("en").is("[lang=\"de\"],[lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( $("en").is("[lang=\"en\"] , [lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( $("en").is("[lang=\"de\"] , [lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
});

test("is(jQuery)", function() {
	expect(21);
	ok( $("form").is( jQuery("form") ), "Check for element: A form is a form" );
	ok( !$("form").is( jQuery("div") ), "Check for element: A form is not a div" );
	ok( $("mark").is( jQuery(".blog") ), "Check for class: Expected class 'blog'" );
	ok( !$("mark").is( jQuery(".link") ), "Check for class: Did not expect class 'link'" );
	ok( $("simon").is( jQuery(".blog.link") ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !$("simon").is( jQuery(".blogTest") ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	ok( $("en").is( jQuery("[lang=\"en\"]") ), "Check for attribute: Expected attribute lang to be 'en'" );
	ok( !$("en").is( jQuery("[lang=\"de\"]") ), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	ok( $("text1").is( jQuery("[type=\"text\"]") ), "Check for attribute: Expected attribute type to be 'text'" );
	ok( !$("text1").is( jQuery("[type=\"radio\"]") ), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	ok( !$("text1").is( jQuery("input:disabled") ), "Check for pseudoclass: Expected not disabled" );
	ok( $("radio2").is( jQuery("input:checked") ), "Check for pseudoclass: Expected to be checked" );
	ok( !$("radio1").is( jQuery("input:checked") ), "Check for pseudoclass: Expected not checked" );
	ok( $("foo").is( jQuery("div:has(p)") ), "Check for child: Expected a child 'p' element" );
	ok( !$("foo").is( jQuery("div:has(ul)") ), "Check for child: Did not expect 'ul' element" );

	// Some raw elements
	ok( $("form").is( jQuery("form")[0] ), "Check for element: A form is a form" );
	ok( !$("form").is( jQuery("div")[0] ), "Check for element: A form is not a div" );
	ok( $("mark").is( jQuery(".blog")[0] ), "Check for class: Expected class 'blog'" );
	ok( !$("mark").is( jQuery(".link")[0] ), "Check for class: Did not expect class 'link'" );
	ok( $("simon").is( jQuery(".blog.link")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !$("simon").is( jQuery(".blogTest")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
});

test("index()", function() {
	expect( 2 );

	equal( $("text2").index(), 2, "Returns the index of a child amongst its siblings" );

	equal( jQuery("<div/>").index(), -1, "Node without parent returns -1" );
});

test("index(Object|String|undefined)", function() {
	expect(16);

	var elements = jQuery([window, document]),
		inputElements = $("radio1,#radio2,#check1,#check2");

	// Passing a node
	equals( elements.index(window), 0, "Check for index of elements" );
	equals( elements.index(document), 1, "Check for index of elements" );
	equals( inputElements.index(document.getElementById("radio1")), 0, "Check for index of elements" );
	equals( inputElements.index(document.getElementById("radio2")), 1, "Check for index of elements" );
	equals( inputElements.index(document.getElementById("check1")), 2, "Check for index of elements" );
	equals( inputElements.index(document.getElementById("check2")), 3, "Check for index of elements" );
	equals( inputElements.index(window), -1, "Check for not found index" );
	equals( inputElements.index(document), -1, "Check for not found index" );

	// Passing a jQuery object
	// enabled since [5500]
	equals( elements.index( elements ), 0, "Pass in a jQuery object" );
	equals( elements.index( elements.eq(1) ), 1, "Pass in a jQuery object" );
	equals( $("form :radio").index( $("radio2") ), 1, "Pass in a jQuery object" );

	// Passing a selector or nothing
	// enabled since [6330]
	equals( $("text2").index(), 2, "Check for index amongst siblings" );
	equals( $("form").children().eq(4).index(), 4, "Check for index amongst siblings" );
	equals( $("radio2").index("#form :radio") , 1, "Check for index within a selector" );
	equals( $("form :radio").index( $("radio2") ), 1, "Check for index within a selector" );
	equals( $("radio2").index("#form :text") , -1, "Check for index not found within a selector" );
});

test("filter(Selector|undefined)", function() {
	expect(9);
	same( $("form input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	same( jQuery("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')" );
	same( jQuery("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')" );

	same( jQuery("p").filter(null).get(),      [], "filter(null) should return an empty jQuery object");
	same( jQuery("p").filter(undefined).get(), [], "filter(undefined) should return an empty jQuery object");
	same( jQuery("p").filter(0).get(),         [], "filter(0) should return an empty jQuery object");
	same( jQuery("p").filter("").get(),        [], "filter('') should return an empty jQuery object");

	// using contents will get comments regular, text, and comment nodes
	var j = $("nonnodes").contents();
	equals( j.filter("span").length, 1, "Check node,textnode,comment to filter the one span" );
	equals( j.filter("[name]").length, 0, "Check node,textnode,comment to filter the one span" );
});

test("filter(Function)", function() {
	expect(2);

	same( $("qunit-fixture p").filter(function() { return !jQuery("a", this).length }).get(), q("sndp", "first"), "filter(Function)" );

	same( $("qunit-fixture p").filter(function(i, elem) { return !jQuery("a", elem).length }).get(), q("sndp", "first"), "filter(Function) using arg" );
});

test("filter(Element)", function() {
	expect(1);

	var element = document.getElementById("text1");
	same( $("form input").filter(element).get(), q("text1"), "filter(Element)" );
});

test("filter(Array)", function() {
	expect(1);

	var elements = [ document.getElementById("text1") ];
	same( $("form input").filter(elements).get(), q("text1"), "filter(Element)" );
});

test("filter(jQuery)", function() {
	expect(1);

	var elements = $("text1");
	same( $("form input").filter(elements).get(), q("text1"), "filter(Element)" );
})

test("closest()", function() {
	expect(13);
	same( jQuery("body").closest("body").get(), q("body"), "closest(body)" );
	same( jQuery("body").closest("html").get(), q("html"), "closest(html)" );
	same( jQuery("body").closest("div").get(), [], "closest(div)" );
	same( $("qunit-fixture").closest("span,#html").get(), q("html"), "closest(span,#html)" );

	same( jQuery("div:eq(1)").closest("div:first").get(), [], "closest(div:first)" );
	same( jQuery("div").closest("body:first div:last").get(), q("fx-tests"), "closest(body:first div:last)" );

	// Test .closest() limited by the context
	var jq = $("nothiddendivchild");
	same( jq.closest("html", document.body).get(), [], "Context limited." );
	same( jq.closest("body", document.body).get(), [], "Context limited." );
	same( jq.closest("#nothiddendiv", document.body).get(), q("nothiddendiv"), "Context not reached." );

	//Test that .closest() returns unique'd set
	equals( $("qunit-fixture p").closest("#qunit-fixture").length, 1, "Closest should return a unique set" );

	// Test on disconnected node
	equals( jQuery("<div><p></p></div>").find("p").closest("table").length, 0, "Make sure disconnected closest work." );

	// Bug #7369
	equals( jQuery("<div foo='bar'></div>").closest("[foo]").length, 1, "Disconnected nodes with attribute selector" );
	equals( jQuery("<div>text</div>").closest("[lang]").length, 0, "Disconnected nodes with text and non-existent attribute selector" );
});

test("closest(Array)", function() {
	expect(7);
	same( jQuery("body").closest(["body"]), [{selector:"body", elem:document.body, level:1}], "closest([body])" );
	same( jQuery("body").closest(["html"]), [{selector:"html", elem:document.documentElement, level:2}], "closest([html])" );
	same( jQuery("body").closest(["div"]), [], "closest([div])" );
	same( $("yahoo").closest(["div"]), [{"selector":"div", "elem": document.getElementById("foo"), "level": 3}, { "selector": "div", "elem": document.getElementById("qunit-fixture"), "level": 4 }], "closest([div])" );
	same( $("qunit-fixture").closest(["span,#html"]), [{selector:"span,#html", elem:document.documentElement, level:4}], "closest([span,#html])" );

	same( jQuery("body").closest(["body","html"]), [{selector:"body", elem:document.body, level:1}, {selector:"html", elem:document.documentElement, level:2}], "closest([body, html])" );
	same( jQuery("body").closest(["span","html"]), [{selector:"html", elem:document.documentElement, level:2}], "closest([body, html])" );
});

test("closest(jQuery)", function() {
	expect(8);
	var $child = $("nothiddendivchild"),
		$parent = $("nothiddendiv"),
		$main = $("qunit-fixture"),
		$body = jQuery("body");
	ok( $child.closest( $parent ).is("#nothiddendiv"), "closest( jQuery('#nothiddendiv') )" );
	ok( $child.closest( $parent[0] ).is("#nothiddendiv"), "closest( jQuery('#nothiddendiv') ) :: node" );
	ok( $child.closest( $child ).is("#nothiddendivchild"), "child is included" );
	ok( $child.closest( $child[0] ).is("#nothiddendivchild"), "child is included  :: node" );
	equals( $child.closest( document.createElement("div") ).length, 0, "created element is not related" );
	equals( $child.closest( $main ).length, 0, "Main not a parent of child" );
	equals( $child.closest( $main[0] ).length, 0, "Main not a parent of child :: node" );
	ok( $child.closest( $body.add($parent) ).is("#nothiddendiv"), "Closest ancestor retrieved." );
});

test("not(Selector|undefined)", function() {
	expect(11);
	equals( $("qunit-fixture > p#ap > a").not("#google").length, 2, "not('selector')" );
	same( jQuery("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')" );
	same( jQuery("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );
	same( $("form option").not("option.emptyopt:contains('Nothing'),[selected],[value='1']").get(), q("option1c", "option1d", "option2c", "option3d", "option3e", "option4e","option5b"), "not('complex selector')");

	same( $("ap *").not("code").get(), q("google", "groups", "anchor1", "mark"), "not('tag selector')" );
	same( $("ap *").not("code, #mark").get(), q("google", "groups", "anchor1"), "not('tag, ID selector')" );
	same( $("ap *").not("#mark, code").get(), q("google", "groups", "anchor1"), "not('ID, tag selector')");

	var all = jQuery("p").get();
	same( jQuery("p").not(null).get(),      all, "not(null) should have no effect");
	same( jQuery("p").not(undefined).get(), all, "not(undefined) should have no effect");
	same( jQuery("p").not(0).get(),         all, "not(0) should have no effect");
	same( jQuery("p").not("").get(),        all, "not('') should have no effect");
});

test("not(Element)", function() {
	expect(1);

	var selects = $("form select");
	same( selects.not( selects[1] ).get(), q("select1", "select3", "select4", "select5"), "filter out DOM element");
});

test("not(Function)", function() {
	same( $("qunit-fixture p").not(function() { return jQuery("a", this).length }).get(), q("sndp", "first"), "not(Function)" );
});

test("not(Array)", function() {
	expect(2);

	equals( $("qunit-fixture > p#ap > a").not(document.getElementById("google")).length, 2, "not(DOMElement)" );
	equals( jQuery("p").not(document.getElementsByTagName("p")).length, 0, "not(Array-like DOM collection)" );
});

test("not(jQuery)", function() {
	expect(1);

	same( jQuery("p").not($("ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(jQuery)" );
});

test("has(Element)", function() {
	expect(2);

	var obj = $("qunit-fixture").has($("sndp")[0]);
	same( obj.get(), q("qunit-fixture"), "Keeps elements that have the element as a descendant" );

	var multipleParent = $("qunit-fixture, #header").has($("sndp")[0]);
	same( obj.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );
});

test("has(Selector)", function() {
	expect(3);

	var obj = $("qunit-fixture").has("#sndp");
	same( obj.get(), q("qunit-fixture"), "Keeps elements that have any element matching the selector as a descendant" );

	var multipleParent = $("qunit-fixture, #header").has("#sndp");
	same( obj.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );

	var multipleHas = $("qunit-fixture").has("#sndp, #first");
	same( multipleHas.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("has(Arrayish)", function() {
	expect(3);

	var simple = $("qunit-fixture").has($("sndp"));
	same( simple.get(), q("qunit-fixture"), "Keeps elements that have any element in the jQuery list as a descendant" );

	var multipleParent = $("qunit-fixture, #header").has($("sndp"));
	same( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have an element in the jQuery list as a descendant" );

	var multipleHas = $("qunit-fixture").has($("sndp, #first"));
	same( simple.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("andSelf()", function() {
	expect(4);
	same( $("en").siblings().andSelf().get(), q("sndp", "en", "sap"), "Check for siblings and self" );
	same( $("foo").children().andSelf().get(), q("foo", "sndp", "en", "sap"), "Check for children and self" );
	same( $("sndp, #en").parent().andSelf().get(), q("foo","sndp","en"), "Check for parent and self" );
	same( $("groups").parents("p, div").andSelf().get(), q("qunit-fixture", "ap", "groups"), "Check for parents and self" );
});

test("siblings([String])", function() {
	expect(5);
	same( $("en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	same( $("sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" );
	same( $("sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
	same( $("foo").siblings("form, b").get(), q("form", "floatTest", "lengthtest", "name-tests", "testForm"), "Check for multiple filters" );
	var set = q("sndp", "en", "sap");
	same( $("en, #sndp").siblings().get(), set, "Check for unique results from siblings" );
});

test("children([String])", function() {
	expect(3);
	same( $("foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	same( $("foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children" );
	same( $("foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("parent([String])", function() {
	expect(5);
	equals( $("groups").parent()[0].id, "ap", "Simple parent check" );
	equals( $("groups").parent("p")[0].id, "ap", "Filtered parent check" );
	equals( $("groups").parent("div").length, 0, "Filtered parent check, no match" );
	equals( $("groups").parent("div, p")[0].id, "ap", "Check for multiple filters" );
	same( $("en, #sndp").parent().get(), q("foo"), "Check for unique results from parent" );
});

test("parents([String])", function() {
	expect(5);
	equals( $("groups").parents()[0].id, "ap", "Simple parents check" );
	equals( $("groups").parents("p")[0].id, "ap", "Filtered parents check" );
	equals( $("groups").parents("div")[0].id, "qunit-fixture", "Filtered parents check2" );
	same( $("groups").parents("p, div").get(), q("ap", "qunit-fixture"), "Check for multiple filters" );
	same( $("en, #sndp").parents().get(), q("foo", "qunit-fixture", "dl", "body", "html"), "Check for unique results from parents" );
});

test("parentsUntil([String])", function() {
	expect(9);

	var parents = $("groups").parents();

	same( $("groups").parentsUntil().get(), parents.get(), "parentsUntil with no selector (nextAll)" );
	same( $("groups").parentsUntil(".foo").get(), parents.get(), "parentsUntil with invalid selector (nextAll)" );
	same( $("groups").parentsUntil("#html").get(), parents.not(":last").get(), "Simple parentsUntil check" );
	equals( $("groups").parentsUntil("#ap").length, 0, "Simple parentsUntil check" );
	same( $("groups").parentsUntil("#html, #body").get(), parents.slice( 0, 3 ).get(), "Less simple parentsUntil check" );
	same( $("groups").parentsUntil("#html", "div").get(), $("qunit-fixture").get(), "Filtered parentsUntil check" );
	same( $("groups").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multiple-filtered parentsUntil check" );
	equals( $("groups").parentsUntil("#html", "span").length, 0, "Filtered parentsUntil check, no match" );
	same( $("groups, #ap").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multi-source, multiple-filtered parentsUntil check" );
});

test("next([String])", function() {
	expect(4);
	equals( $("ap").next()[0].id, "foo", "Simple next check" );
	equals( $("ap").next("div")[0].id, "foo", "Filtered next check" );
	equals( $("ap").next("p").length, 0, "Filtered next check, no match" );
	equals( $("ap").next("div, p")[0].id, "foo", "Multiple filters" );
});

test("prev([String])", function() {
	expect(4);
	equals( $("foo").prev()[0].id, "ap", "Simple prev check" );
	equals( $("foo").prev("p")[0].id, "ap", "Filtered prev check" );
	equals( $("foo").prev("div").length, 0, "Filtered prev check, no match" );
	equals( $("foo").prev("p, div")[0].id, "ap", "Multiple filters" );
});

test("nextAll([String])", function() {
	expect(4);

	var elems = $("form").children();

	same( $("label-for").nextAll().get(), elems.not(":first").get(), "Simple nextAll check" );
	same( $("label-for").nextAll("input").get(), elems.not(":first").filter("input").get(), "Filtered nextAll check" );
	same( $("label-for").nextAll("input,select").get(), elems.not(":first").filter("input,select").get(), "Multiple-filtered nextAll check" );
	same( $("label-for, #hidden1").nextAll("input,select").get(), elems.not(":first").filter("input,select").get(), "Multi-source, multiple-filtered nextAll check" );
});

test("prevAll([String])", function() {
	expect(4);

	var elems = jQuery( $("form").children().slice(0, 12).get().reverse() );

	same( $("area1").prevAll().get(), elems.get(), "Simple prevAll check" );
	same( $("area1").prevAll("input").get(), elems.filter("input").get(), "Filtered prevAll check" );
	same( $("area1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multiple-filtered prevAll check" );
	same( $("area1, #hidden1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multi-source, multiple-filtered prevAll check" );
});

test("nextUntil([String])", function() {
	expect(11);

	var elems = $("form").children().slice( 2, 12 );

	same( $("text1").nextUntil().get(), $("text1").nextAll().get(), "nextUntil with no selector (nextAll)" );
	same( $("text1").nextUntil(".foo").get(), $("text1").nextAll().get(), "nextUntil with invalid selector (nextAll)" );
	same( $("text1").nextUntil("#area1").get(), elems.get(), "Simple nextUntil check" );
	equals( $("text1").nextUntil("#text2").length, 0, "Simple nextUntil check" );
	same( $("text1").nextUntil("#area1, #radio1").get(), $("text1").next().get(), "Less simple nextUntil check" );
	same( $("text1").nextUntil("#area1", "input").get(), elems.not("button").get(), "Filtered nextUntil check" );
	same( $("text1").nextUntil("#area1", "button").get(), elems.not("input").get(), "Filtered nextUntil check" );
	same( $("text1").nextUntil("#area1", "button,input").get(), elems.get(), "Multiple-filtered nextUntil check" );
	equals( $("text1").nextUntil("#area1", "div").length, 0, "Filtered nextUntil check, no match" );
	same( $("text1, #hidden1").nextUntil("#area1", "button,input").get(), elems.get(), "Multi-source, multiple-filtered nextUntil check" );

	same( $("text1").nextUntil("[class=foo]").get(), $("text1").nextAll().get(), "Non-element nodes must be skipped, since they have no attributes" );
});

test("prevUntil([String])", function() {
	expect(10);

	var elems = $("area1").prevAll();

	same( $("area1").prevUntil().get(), elems.get(), "prevUntil with no selector (prevAll)" );
	same( $("area1").prevUntil(".foo").get(), elems.get(), "prevUntil with invalid selector (prevAll)" );
	same( $("area1").prevUntil("label").get(), elems.not(":last").get(), "Simple prevUntil check" );
	equals( $("area1").prevUntil("#button").length, 0, "Simple prevUntil check" );
	same( $("area1").prevUntil("label, #search").get(), $("area1").prev().get(), "Less simple prevUntil check" );
	same( $("area1").prevUntil("label", "input").get(), elems.not(":last").not("button").get(), "Filtered prevUntil check" );
	same( $("area1").prevUntil("label", "button").get(), elems.not(":last").not("input").get(), "Filtered prevUntil check" );
	same( $("area1").prevUntil("label", "button,input").get(), elems.not(":last").get(), "Multiple-filtered prevUntil check" );
	equals( $("area1").prevUntil("label", "div").length, 0, "Filtered prevUntil check, no match" );
	same( $("area1, #hidden1").prevUntil("label", "button,input").get(), elems.not(":last").get(), "Multi-source, multiple-filtered prevUntil check" );
});

test("contents()", function() {
	expect(12);
	equals( $("ap").contents().length, 9, "Check element contents" );
	ok( $("iframe").contents()[0], "Check existance of IFrame document" );
	var ibody = $("loadediframe").contents()[0].body;
	ok( ibody, "Check existance of IFrame body" );

	equals( jQuery("span", ibody).text(), "span text", "Find span in IFrame and check its text" );

	jQuery(ibody).append("<div>init text</div>");
	equals( jQuery("div", ibody).length, 2, "Check the original div and the new div are in IFrame" );

	equals( jQuery("div:last", ibody).text(), "init text", "Add text to div in IFrame" );

	jQuery("div:last", ibody).text("div text");
	equals( jQuery("div:last", ibody).text(), "div text", "Add text to div in IFrame" );

	jQuery("div:last", ibody).remove();
	equals( jQuery("div", ibody).length, 1, "Delete the div and check only one div left in IFrame" );

	equals( jQuery("div", ibody).text(), "span text", "Make sure the correct div is still left after deletion in IFrame" );

	jQuery("<table/>", ibody).append("<tr><td>cell</td></tr>").appendTo(ibody);
	jQuery("table", ibody).remove();
	equals( jQuery("div", ibody).length, 1, "Check for JS error on add and delete of a table in IFrame" );

	// using contents will get comments regular, text, and comment nodes
	var c = $("nonnodes").contents().contents();
	equals( c.length, 1, "Check node,textnode,comment contents is just one" );
	equals( c[0].nodeValue, "hi", "Check node,textnode,comment contents is just the one from span" );
});

test("add(String|Element|Array|undefined)", function() {
	expect(16);
	same( $("sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document" );
	same( $("sndp").add( $("en")[0] ).add( $("sap") ).get(), q("sndp", "en", "sap"), "Check elements from document" );

	// We no longer support .add(form.elements), unfortunately.
	// There is no way, in browsers, to reliably determine the difference
	// between form.elements and form - and doing .add(form) and having it
	// add the form elements is way to unexpected, so this gets the boot.
	// ok( jQuery([]).add($("form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for jQuery(form.elements) since it's ambiguous in IE
	// use jQuery([]).add(form.elements) instead.
	//equals( jQuery([]).add($("form")[0].elements).length, jQuery($("form")[0].elements).length, "Array in constructor must equals array in add()" );

	var divs = jQuery("<div/>").add("#sndp");
	ok( !divs[0].parentNode, "Make sure the first element is still the disconnected node." );

	divs = jQuery("<div>test</div>").add("#sndp");
	equals( divs[0].parentNode.nodeType, 11, "Make sure the first element is still the disconnected node." );

	divs = $("sndp").add("<div/>");
	ok( !divs[1].parentNode, "Make sure the first element is still the disconnected node." );

	var tmp = jQuery("<div/>");

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>").appendTo(tmp)).add(jQuery("<p id='x2'>xxx</p>").appendTo(tmp));
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>").appendTo(tmp)[0]).add(jQuery("<p id='x2'>xxx</p>").appendTo(tmp)[0]);
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>")).add(jQuery("<p id='x2'>xxx</p>"));
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var notDefined;
	equals( jQuery([]).add(notDefined).length, 0, "Check that undefined adds nothing" );

	equals( jQuery([]).add( document.getElementById("form") ).length, 1, "Add a form" );
	equals( jQuery([]).add( document.getElementById("select1") ).length, 1, "Add a select" );
});

test("add(String, Context)", function() {
	expect(6);

	deepEqual( jQuery( "#firstp" ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add selector to selector " );
	deepEqual( jQuery( document.getElementById("firstp") ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add gEBId to selector" );
	deepEqual( jQuery( document.getElementById("firstp") ).add( document.getElementById("ap") ).get(), q( "firstp", "ap" ), "Add gEBId to gEBId" );

	var ctx = document.getElementById("firstp");
	deepEqual( jQuery( "#firstp" ).add( "#ap", ctx ).get(), q( "firstp" ), "Add selector to selector " );
	deepEqual( jQuery( document.getElementById("firstp") ).add( "#ap", ctx ).get(), q( "firstp" ), "Add gEBId to selector, not in context" );
	deepEqual( jQuery( document.getElementById("firstp") ).add( "#ap", document.getElementsByTagName("body")[0] ).get(), q( "firstp", "ap" ), "Add gEBId to selector, in context" );
});
