module("Dimensions");

test("Element.prototype.getWidth", function() {
	expect(6);

	var $div = $("nothiddendiv");
	$div.setWidth( 30 );
	equals($div.getWidth(), 30, "Test set to 30 correctly");
	$div.hide();
	equals($div.getWidth(), 30, "Test hidden div");
	$div.show();
	$div.setWidth( -1 ); // handle negative numbers by ignoring #1599
	equals($div.getWidth(), 0, "负值 转为 0");
	$div.setWidth( 30 );
	$div.setStyle("padding", "20px");
	equals($div.getWidth(), 30, "Test padding specified with pixels");
	$div.setStyle("border", "2px solid #fff");
	equals($div.getWidth(), 30, "Test border specified with pixels");

	Element.setStyles($div, { display: "", border: "", padding: "" });

	Element.setStyles($("nothiddendivchild"), { width: '20px', padding: "3px", border: "2px solid #fff" });
	equals($("nothiddendivchild").getWidth(), 20, "Test child width with border and padding");
	Element.setStyles($("nothiddendiv"), { border: "", padding: "", width: "" });
	Element.setStyles($("nothiddendivchild"), { border: "", padding: "", width: "" });
	
	JPlus.setData($div, "display", null);
});

test("getHeight()", function() {
	expect(6);

	var $div = $("nothiddendiv");
	$div.setHeight( 30 );
	equals($div.getHeight(), 30, "Test set to 30 correctly");
	$div.hide();
	equals($div.getHeight(), 30, "Test hidden div");
	$div.show();
	$div.setHeight( -1 ); // handle negative numbers by ignoring #1599
	equals($div.getHeight(), 0, "负值 转为 0");
	
	$div.setHeight( 30 );
	$div.setStyle("padding", "20px");
	equals($div.getHeight(), 30, "Test padding specified with pixels");
	$div.setStyle("border", "2px solid #fff");
	equals($div.getHeight(), 30, "Test border specified with pixels");

	Element.setStyles($div, { display: "", border: "", padding: "", height: "1px" });

	Element.setStyles($("nothiddendivchild"), { height: '20px', padding: "3px", border: "2px solid #fff" });
	equals($("nothiddendivchild").getHeight(), 20, "Test child height with border and padding");
	Element.setStyles($("nothiddendiv"), { border: "", padding: "", height: "" });
	Element.setStyles($("nothiddendivchild"), { border: "", padding: "", height: "" });

	JPlus.setData($div, "display", null);
});

test("innergetWidth()", function() {
	expect(8);

	equals(jQuery(window).innergetWidth(), null, "Test on window without margin option");
	equals(jQuery(window).innerWidth(true), null, "Test on window with margin option");

	equals(jQuery(document).innergetWidth(), null, "Test on document without margin option");
	equals(jQuery(document).innerWidth(true), null, "Test on document with margin option");

	var $div = $("nothiddendiv");
	// set styles
	$div.css({
		margin: 10,
		border: "2px solid #fff",
		width: 30
	});

	equals($div.innergetWidth(), 30, "Test with margin and border");
	$div.css("padding", "20px");
	equals($div.innergetWidth(), 70, "Test with margin, border and padding");
	$div.hide();
	equals($div.innergetWidth(), 70, "Test hidden div");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.innergetWidth(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});

test("innergetHeight()", function() {
	expect(8);

	equals(jQuery(window).innergetHeight(), null, "Test on window without margin option");
	equals(jQuery(window).innerHeight(true), null, "Test on window with margin option");

	equals(jQuery(document).innergetHeight(), null, "Test on document without margin option");
	equals(jQuery(document).innerHeight(true), null, "Test on document with margin option");

	var $div = $("nothiddendiv");
	// set styles
	$div.css({
		margin: 10,
		border: "2px solid #fff",
		height: 30
	});

	equals($div.innergetHeight(), 30, "Test with margin and border");
	$div.css("padding", "20px");
	equals($div.innergetHeight(), 70, "Test with margin, border and padding");
	$div.hide();
	equals($div.innergetHeight(), 70, "Test hidden div");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.innergetHeight(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});

test("outergetWidth()", function() {
	expect(11);

	equal( jQuery( window ).outergetWidth(), null, "Test on window without margin option" );
	equal( jQuery( window ).outerWidth( true ), null, "Test on window with margin option" );
	equal( jQuery( document ).outergetWidth(), null, "Test on document without margin option" );
	equal( jQuery( document ).outerWidth( true ), null, "Test on document with margin option" );

	var $div = $("nothiddendiv");
	$div.css("width", 30);

	equals($div.outergetWidth(), 30, "Test with only width set");
	$div.css("padding", "20px");
	equals($div.outergetWidth(), 70, "Test with padding");
	$div.css("border", "2px solid #fff");
	equals($div.outergetWidth(), 74, "Test with padding and border");
	$div.css("margin", "10px");
	equals($div.outergetWidth(), 74, "Test with padding, border and margin without margin option");
	$div.css("position", "absolute");
	equals($div.outerWidth(true), 94, "Test with padding, border and margin with margin option");
	$div.hide();
	equals($div.outerWidth(true), 94, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.css({ position: "", display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.outergetWidth(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});

test("child of a hidden elem has accurate inner/outer/getWidth()/getHeight()  see #9441 #9300", function() {
	expect(8);

	// setup html
	var $divNormal       = jQuery("<div>").css({ width: "100px", height: "100px", border: "10px solid white", padding: "2px", margin: "3px" }),
		$divChild        = $divNormal.clone(),
		$divHiddenParent = jQuery("<div>").css( "display", "none" ).append( $divChild ).appendTo("body");
	$divNormal.appendTo("body");

	// tests that child div of a hidden div works the same as a normal div
	equals( $divChild.getWidth(), $divNormal.getWidth(), "child of a hidden element getWidth() is wrong see #9441" );
	equals( $divChild.innergetWidth(), $divNormal.innergetWidth(), "child of a hidden element innergetWidth() is wrong see #9441" );
	equals( $divChild.outergetWidth(), $divNormal.outergetWidth(), "child of a hidden element outergetWidth() is wrong see #9441" );
	equals( $divChild.outerWidth(true), $divNormal.outerWidth( true ), "child of a hidden element outerWidth( true ) is wrong see #9300" );

	equals( $divChild.getHeight(), $divNormal.getHeight(), "child of a hidden element getHeight() is wrong see #9441" );
	equals( $divChild.innergetHeight(), $divNormal.innergetHeight(), "child of a hidden element innergetHeight() is wrong see #9441" );
	equals( $divChild.outergetHeight(), $divNormal.outergetHeight(), "child of a hidden element outergetHeight() is wrong see #9441" );
	equals( $divChild.outerHeight(true), $divNormal.outerHeight( true ), "child of a hidden element outerHeight( true ) is wrong see #9300" );

	// teardown html
	$divHiddenParent.remove();
	$divNormal.remove();
});

test("outergetHeight()", function() {
	expect(11);

	equal( jQuery( window ).outergetHeight(), null, "Test on window without margin option" );
	equal( jQuery( window ).outerHeight( true ), null, "Test on window with margin option" );
	equal( jQuery( document ).outergetHeight(), null, "Test on document without margin option" );
	equal( jQuery( document ).outerHeight( true ), null, "Test on document with margin option" );

	var $div = $("nothiddendiv");
	$div.css("height", 30);

	equals($div.outergetHeight(), 30, "Test with only width set");
	$div.css("padding", "20px");
	equals($div.outergetHeight(), 70, "Test with padding");
	$div.css("border", "2px solid #fff");
	equals($div.outergetHeight(), 74, "Test with padding and border");
	$div.css("margin", "10px");
	equals($div.outergetHeight(), 74, "Test with padding, border and margin without margin option");
	equals($div.outerHeight(true), 94, "Test with padding, border and margin with margin option");
	$div.hide();
	equals($div.outerHeight(true), 94, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.outergetHeight(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});
