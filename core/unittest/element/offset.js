module("Offset");

test("disconnected node", function() {
	expect(2);

	var result = document.create("div").getOffset();

	equals( result.x, 0, "Check top" );
	equals( result.y, 0, "Check left" );
});

var supportsScroll = false;

testoffset("absolute", function(iframe) {
	expect(4);

	var document = iframe.document, tests;

	// force a scroll value on the main window
	// this insures that the results will be wrong
	// if the offset method is using the scroll offset
	// of the parent window
	var forceScroll = Element.parse("<div style='width: 2000px, height: 2000px'>", iframe).appendTo();
	iframe.scrollTo(200, 200);

	if ( document.documentElement.scrollTop || document.body.scrollTop ) {
		supportsScroll = true;
	}

	iframe.scrollTo(1, 1);
	
	equals( document.getDom("absolute-1").getPosition().x, 1, "document.getDom('absolute-1').getOffsets().x");
	equals( document.getDom("absolute-1").getPosition().y, 1, "document.getDom('absolute-1').getOffsets().y");

	
	equals( document.getDom("absolute-1").getOffset().x, 0, "document.getDom('absolute-1').getPosition().x");
	equals( document.getDom("absolute-1").getOffset().y, 0, "document.getDom('absolute-1').getPosition().y");

	forceScroll.remove();
});

testoffset("absolute", function( iframe ) {

	var document = iframe.document ;

	// get offset tests
	var tests = [
		{ id: "absolute-1",     x:  1, y:  1  },
		{ id: "absolute-1-1",   x:  5, y:  5 },
		{ id: "absolute-1-1-1", x:  9, y:  9  },
		{ id: "absolute-2",     x: 20, y: 20 }
	];
	Object.each( tests, function(test) {
		equals(  document.getDom( test.id ).getPosition().x, test.x, "document.getDom('" + test.id + "').getPosition().x" );
		equals(  document.getDom( test.id ).getPosition().x,  test.y,  "document.getDom('" + test.id + "').getPosition().y" );
	});


	// get position
	tests = [
		{ id: "absolute-1",     y:  0, x:  0 },
		{ id: "absolute-1-1",   y:  1, x:  1 },
		{ id: "absolute-1-1-1", y:  1, x:  1 },
		{ id: "absolute-2",     y: 19, x: 19 }
	];
	Object.each( tests, function(test) {
		equals( document.getDom( test.id ).getOffset().y,  test.y,  "document.getDom('" + test.id + "').getOffset().y" );
		equals( document.getDom( test.id ).getOffset().x, test.x, "document.getDom('" + test.id + "').getOffset().x" );
	});

	// test #5781
	var offset = document.getDom( "positionTest" ).setOffset({ y: 10, x: 10 }).getPosition();
	equals( offset.y,  10, "Setting offset on element with position absolute but 'auto' values." )
	equals( offset.x, 10, "Setting offset on element with position absolute but 'auto' values." )


	// set offset
	tests = [
		{ id: "absolute-2",     y: 30, x: 30 },
		{ id: "absolute-2",     y: 10, x: 10 },
		{ id: "absolute-2",     y: -1, x: -1 },
		{ id: "absolute-2",     y: 19, x: 19 },
		{ id: "absolute-1-1-1", y: 15, x: 15 },
		{ id: "absolute-1-1-1", y:  5, x:  5 },
		{ id: "absolute-1-1-1", y: -1, x: -1 },
		{ id: "absolute-1-1-1", y:  9, x:  9 },
		{ id: "absolute-1-1",   y: 10, x: 10 },
		{ id: "absolute-1-1",   y:  0, x:  0 },
		{ id: "absolute-1-1",   y: -1, x: -1 },
		{ id: "absolute-1-1",   y:  5, x:  5 },
		{ id: "absolute-1",     y:  2, x:  2 },
		{ id: "absolute-1",     y:  0, x:  0 },
		{ id: "absolute-1",     y: -1, x: -1 },
		{ id: "absolute-1",     y:  1, x:  1 }
	];
	Object.each( tests, function(test) {
		document.getDom( test.id ).setPosition({ y: test.y, x: test.x });
		equals( document.getDom( test.id ).getPosition().y,  test.y,  "document.getDom('" + test.id + "').setOffset({ y: "  + test.y  + " })" );
		equals( document.getDom( test.id ).getPosition().x, test.x, "document.getDom('" + test.id + "').setOffset({ x: " + test.x + " })" );

		document.getDom( test.id ).setPosition({ x: test.x + 2, y:  test.y  + 2 })
		equals( document.getDom( test.id ).getPosition().y,  test.y  + 2, "Setting one property at a time." );
		equals( document.getDom( test.id ).getPosition().x, test.x + 2, "Setting one property at a time." );
		
		
	});
	
	
	var offsets = document.getDom('positionTest').getOffset();
	document.getDom('positionTest').setOffset(offsets);
	equals( document.getDom('positionTest').getOffset().y,  offsets.y,  "document.getDom('positionTest').setOffset().getOffset()" );
	equals( document.getDom('positionTest').getOffset().x,  offsets.x,  "document.getDom('positionTest').setOffset().getOffset()" );
	
	var position = document.getDom('positionTest').getPosition();
	document.getDom('positionTest').setPosition(position);
	equals( document.getDom('positionTest').getPosition().y,  position.y,  "document.getDom('positionTest').setPosition().getPosition()" );
	equals( document.getDom('positionTest').getPosition().x,  position.x,  "document.getDom('positionTest').setPosition().getPosition()" );
});

testoffset("relative", function( iframe ) {

	var document = iframe.document ;

	// IE is collapsing the top margin of 1px
	var ie = navigator.isQuirks;

	// get offset
	var tests = [
		{ id: "relative-1",   y: ie ?   6 :   7, x:  7 },
		{ id: "relative-1-1", y: ie ?  13 :  15, x: 15 },
		{ id: "relative-2",   y: ie ? 141 : 142, x: 27 }
	];
	Object.each( tests, function(test) {
		equals( document.getDom( test.id ).getPosition().y,  test.y,  "document.getDom('" + test.id + "').getPosition().y" );
		equals( document.getDom( test.id ).getPosition().x, test.x, "document.getDom('" + test.id + "').getPosition().x" );
	});


	// get position
	tests = [
		//{ id: "relative-1",   y: ie ?   5 :   6, x:  6 },
		//{ id: "relative-1-1", y: ie ?   4 :   5, x:  5 },
		//{ id: "relative-2",   y: ie ? 140 : 141, x: 26 }
		{ id: "relative-1",   y: 0, x:  0 },
		{ id: "relative-1-1", y: 0, x:  0 },
		{ id: "relative-2",   y: 20, x: 20 }
	];
	Object.each( tests, function(test) {
		equals( document.getDom( test.id ).getOffset().y,  test.y,  "document.getDom('" + test.id + "').getOffset().y" );
		equals( document.getDom( test.id ).getOffset().x, test.x, "document.getDom('" + test.id + "').getOffset().x" );
	});


	// set offset
	tests = [
		{ id: "relative-2",   y: 200, x:  50 },
		{ id: "relative-2",   y: 100, x:  10 },
		{ id: "relative-2",   y:  -5, x:  -5 },
		{ id: "relative-2",   y: 142, x:  27 },
		{ id: "relative-1-1", y: 100, x: 100 },
		{ id: "relative-1-1", y:   5, x:   5 },
		{ id: "relative-1-1", y:  -1, x:  -1 },
		{ id: "relative-1-1", y:  15, x:  15 },
		{ id: "relative-1",   y: 100, x: 100 },
		{ id: "relative-1",   y:   0, x:   0 },
		{ id: "relative-1",   y:  -1, x:  -1 },
		{ id: "relative-1",   y:   7, x:   7 }
	];
	Object.each( tests, function(test) {
		document.getDom( test.id ).setOffset({ y: test.y, x: test.x });
		equals( document.getDom( test.id ).getOffset().y,  test.y,  "document.getDom('" + test.id + "').setOffset({ y: "  + test.y  + " })" );
		equals( document.getDom( test.id ).getOffset().x, test.x, "document.getDom('" + test.id + "').setOffset({ x: " + test.x + " })" );
	});
	
	
	var offsets = document.getDom('positionTest').getOffset();
	document.getDom('positionTest').setOffset(offsets);
	equals( document.getDom('positionTest').getOffset().y,  offsets.y,  "document.getDom('positionTest').setOffset().getOffset()" );
	equals( document.getDom('positionTest').getOffset().x,  offsets.x,  "document.getDom('positionTest').setOffset().getOffset()" );
	
	var position = document.getDom('positionTest').getPosition();
	document.getDom('positionTest').setPosition(position);
	equals( document.getDom('positionTest').getPosition().y,  position.y,  "document.getDom('positionTest').setPosition().getPosition()" );
	equals( document.getDom('positionTest').getPosition().x,  position.x,  "document.getDom('positionTest').setPosition().getPosition()" );
});

testoffset("static", function( iframe ) {

	var document = iframe.document ;

	// IE is collapsing the top margin of 1px
	var ie = navigator.isQuirks;

	// get offset
	var tests = [
		{ id: "static-1",     y: ie ?   6 :   7, x:  7 },
		{ id: "static-1-1",   y: ie ?  13 :  15, x: 15 },
		{ id: "static-1-1-1", y: ie ?  20 :  23, x: 23 },
		{ id: "static-2",     y: ie ? 121 : 122, x:  7 }
	];
	Object.each( tests, function(test) {
		equals( document.getDom( test.id ).getPosition().y,  test.y,  "document.getDom('" + test.id + "').getPosition().y" );
		equals( document.getDom( test.id ).getPosition().x, test.x, "document.getDom('" + test.id + "').getPosition().x" );
	});


	// get position
	tests = [
		//{ id: "static-1",     y: ie ?   5 :   6, x:  6 },
		//{ id: "static-1-1",   y: ie ?  12 :  14, x: 14 },
		//{ id: "static-1-1-1", y: ie ?  19 :  22, x: 22 },
		//{ id: "static-2",     y: ie ? 120 : 121, x:  6 }
		{ id: "static-1",     y: 0, x:  0 },
		{ id: "static-1-1",   y: 0, x: 0 },
		{ id: "static-1-1-1", y: 0, x: 0 },
		{ id: "static-2",     y: 20, x:  20 }
	];
	
	// !Opera
	
	//Object.each( tests, function(test) {
	//	equals( document.getDom( test.id ).getOffset().y,  test.y,  "document.getDom('" + test.id  + "').getOffset().y" );
	//	equals( document.getDom( test.id ).getOffset().x, test.x, "document.getDom('" + test.id +"').getOffset().x" );
	//});


	// set offset
	tests = [
		{ id: "static-2",     y: 200, x: 200 },
		{ id: "static-2",     y: 100, x: 100 },
		{ id: "static-2",     y:  -2, x:  -2 },
		{ id: "static-2",     y: 121, x:   6 },
		{ id: "static-1-1-1", y:  50, x:  50 },
		{ id: "static-1-1-1", y:  10, x:  10 },
		{ id: "static-1-1-1", y:  -1, x:  -1 },
		{ id: "static-1-1-1", y:  22, x:  22 },
		{ id: "static-1-1",   y:  25, x:  25 },
		{ id: "static-1-1",   y:  10, x:  10 },
		{ id: "static-1-1",   y:  -3, x:  -3 },
		{ id: "static-1-1",   y:  14, x:  14 },
		{ id: "static-1",     y:  30, x:  30 },
		{ id: "static-1",     y:   2, x:   2 },
		{ id: "static-1",     y:  -2, x:  -2 },
		{ id: "static-1",     y:   7, x:   7 }
	];
	Object.each( tests, function(test) {
		document.getDom( test.id ).setOffset({ y: test.y, x: test.x });
		equals( document.getDom( test.id ).getOffset().y,  test.y,  "document.getDom('" + test.id + "').setOffset({ y: "  + test.y  + " })" );
		equals( document.getDom( test.id ).getOffset().x, test.x, "document.getDom('" + test.id + "').setOffset({ x: " + test.x + " })" );
	});
	
	
	var offsets = document.getDom('positionTest').getOffset();
	document.getDom('positionTest').setOffset(offsets);
	equals( document.getDom('positionTest').getOffset().y,  offsets.y,  "document.getDom('positionTest').setOffset().getOffset()" );
	equals( document.getDom('positionTest').getOffset().x,  offsets.x,  "document.getDom('positionTest').setOffset().getOffset()" );
	
	var position = document.getDom('positionTest').getPosition();
	document.getDom('positionTest').setPosition(position);
	equals( document.getDom('positionTest').getPosition().y,  position.y,  "document.getDom('positionTest').setPosition().getPosition()" );
	equals( document.getDom('positionTest').getPosition().x,  position.x,  "document.getDom('positionTest').setPosition().getPosition()" );
});

testoffset("fixed", function( iframe ) {


if(navigator.isIE6)
	return

	var document = iframe.document ;

	var tests = [
		{ id: "fixed-1", y: 1001, x: 1001 },
		{ id: "fixed-2", y: 1021, x: 1021 }
	];

	Object.each( tests, function(test) {
		equals( document.getDom( test.id ).getPosition().y,  test.y,  "document.getDom('" + test.id + "').getPosition().y" );
		equals( document.getDom( test.id ).getPosition().x, test.x, "document.getDom('" + test.id + "').getPosition().x" );
	});

	tests = [
		{ id: "fixed-1", y: 100, x: 100 },
		{ id: "fixed-1", y:   0, x:   0 },
		{ id: "fixed-1", y:  -4, x:  -4 },
		{ id: "fixed-2", y: 200, x: 200 },
		{ id: "fixed-2", y:   0, x:   0 },
		{ id: "fixed-2", y:  -5, x:  -5 }
	];

	Object.each( tests, function(test) {
		document.getDom( test.id ).setOffset({ y: test.y, x: test.x });
		equals( document.getDom( test.id ).getOffset().y,  test.y,  "document.getDom('" + test.id + "').setOffset({ y: "  + test.y  + " })" );
		equals( document.getDom( test.id ).getOffset().x, test.x, "document.getDom('" + test.id + "').setOffset({ x: " + test.x + " })" );
	});

	// Bug 8316
	var noTopLeft = document.getDom("fixed-no-top-left");
	equals( noTopLeft.getPosition().y,  1007,  "Check offset top for fixed element with no top set" );
	equals( noTopLeft.getPosition().x, 1007, "Check offset left for fixed element with no left set" );
	
	
	var offsets = document.getDom('positionTest').getOffset();
	document.getDom('positionTest').setOffset(offsets);
	equals( document.getDom('positionTest').getOffset().y,  offsets.y,  "document.getDom('positionTest').setOffset().getOffset()" );
	equals( document.getDom('positionTest').getOffset().x,  offsets.x,  "document.getDom('positionTest').setOffset().getOffset()" );
	
	var position = document.getDom('positionTest').getPosition();
	document.getDom('positionTest').setPosition(position);
	equals( document.getDom('positionTest').getPosition().y,  position.y,  "document.getDom('positionTest').setPosition().getPosition()" );
	equals( document.getDom('positionTest').getPosition().x,  position.x,  "document.getDom('positionTest').setPosition().getPosition()" );
});

testoffset("table", function( iframe ) {

	var document = iframe.document ;
	expect(4);

	equals( document.getDom("table-1").getPosition().y, 6, "document.getDom('table-1').getPosition().y" );
	equals( document.getDom("table-1").getPosition().x, 6, "document.getDom('table-1').getPosition().x" );

	equals( document.getDom("th-1").getPosition().y, 10, "document.getDom('th-1').getPosition().y" );
	equals( document.getDom("th-1").getPosition().x, 10, "document.getDom('th-1').getPosition().x" );
});

testoffset("scroll", function( iframe ) {

	var document = iframe.document ;
	
	var ie = navigator.isQuirks;

	// IE is collapsing the top margin of 1px
	equals( document.getDom("scroll-1").getPosition().y, ie ? 6 : 7, "document.getDom('scroll-1').getPosition().y" );
	equals( document.getDom("scroll-1").getPosition().x, 7, "document.getDom('scroll-1').getPosition().x" );

	// IE is collapsing the top margin of 1px
	equals( document.getDom("scroll-1-1").getPosition().y, ie ? 9 : 11, "document.getDom('scroll-1-1').getPosition().y" );
	equals( document.getDom("scroll-1-1").getPosition().x, 11, "document.getDom('scroll-1-1').getPosition().x" );


	// scroll offset tests .scrollTop/Left
	equals( document.getDom("scroll-1").getScroll().y, 5, "document.getDom('scroll-1').getScroll().y" );
	equals( document.getDom("scroll-1").getScroll().x, 5, "document.getDom('scroll-1').getScroll().x" );

	equals( document.getDom("scroll-1-1").getScroll().y, 0, "document.getDom('scroll-1-1').getScroll().y" );
	equals( document.getDom("scroll-1-1").getScroll().x, 0, "document.getDom('scroll-1-1').getScroll().x" );

	// equals( $(document.body).getScroll().y, 0, "$(document.body).getScroll().y" );
	// equals( $(document.body).getScroll().x, 0, "$(document.body).getScroll().y" );

	iframe.name = "test";
	
	equals( document.getScroll().y, 1000, "document.getDom(document).getScroll().y" );
	equals( document.getScroll().x, 1000, "document.getDom(document).getScroll().x" );

	document.setScroll(0,0);
	equals( document.getScroll().y, 0, "document.getScroll().y other document" );
	equals( document.getScroll().x, 0, "document.getScroll().x other document" );

	equal( document.setScroll(null, 100), document, "document.getDom().scrollTop(100) testing setter on empty jquery object" );
	equal( document.setScroll(100, null), document, "document.getDom().scrollLeft(100) testing setter on empty jquery object" );
	equal( document.setScroll(null, null), document, "document.getDom().setScroll(null, null) testing setter on empty jquery object" );
	strictEqual( document.getScroll().y, 100, "document.getDom().scrollTop(100) testing setter on empty jquery object" );
	strictEqual( document.getScroll().x, 100, "document.getDom().scrollLeft(100) testing setter on empty jquery object" );
});

testoffset("body", function( iframe ) {
	expect(2);
	equals( iframe.document.body.getPosition().y, 1, "document.body.getPosition().y" );
	equals( iframe.document.body.getPosition().x, 1, "document.body.getPosition().x" );
});

test("offsetParent", function(){

	var body = $(document.body).get('offsetParent');
	equals( body, document.body, "The body is its own offsetParent." );

	var header = document.getDom("qunit-header").get('offsetParent');
	equals( header, document.body, "The body is the offsetParent." );

	var div = document.getDom("nothiddendivchild").get('offsetParent');
	equals( div, document.body, "The body is the offsetParent." );

	document.getDom("nothiddendiv").set("position", "relative");

	div = document.getDom("nothiddendivchild").get('offsetParent');
	equals( div, document.getDom("nothiddendiv"), "The div is the offsetParent." );

	div = $(document.body).get('offsetParent');
	equals( div, document.body, "The body is the offsetParent." );
});

test("fractions (see #7730 and #7885)", function() {
	expect(2);

	$(document.body).append('<div id="fractions"/>');

	var expected = { y: 1000, x: 1000 };
	var div = document.getDom('fractions');

	div.set({
		position: 'absolute',
		left: '1000.7432222px',
		top: '1000.532325px',
		width: 100,
		height: 100
	});

	div.setOffset(expected);

	var result = div.getPosition();

	equals( result.y, expected.y, "Check top" );
	equals( result.x, expected.x, "Check left" );

	div.remove();
});

function testoffset(name, fn) {

	test(name, function() {
		// pause execution for now
		stop();

		// load fixture in iframe
		var iframe = loadFixture(),
			win = iframe.contentWindow,
			interval = setInterval( function() {
				if ( win && win.JPlus && win.document.isReady ) {
					clearInterval( interval );
					// continue
					start();
					// call actual tests passing the correct jQuery isntance to use
					fn.call( this, win );
					document.body.removeChild( iframe );
					iframe = null;
				}
			}, 15 );
	});

	function loadFixture() {
		var src = "./data/offset/" + name + ".html?" + parseInt( Math.random()*1000, 10 ),
			iframe = Element.parse("<iframe />").set({
				width: 500, height: 500, position: "absolute", top: -600, left: -600, visibility: "hidden"
			}).appendTo();
		iframe.contentWindow.location = src;
		return iframe;
	}
}
