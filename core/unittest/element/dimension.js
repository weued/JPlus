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

test("Element.prototype.getHeight", function() {
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

test("child of a hidden elem has accurate getWidth()/getHeight()  see #9441 #9300", function() {
	
	// setup html
	var $divNormal       = Element.parse("<div>").set({ width: "100px", height: "100px", border: "10px solid white", padding: "2px", margin: "3px" }),
		$divChild        = $divNormal.clone(),
		$divHiddenParent = Element.parse("<div>").set( "display", "none" ).append( $divChild ).appendTo();
	$divNormal.appendTo();

	// tests that child div of a hidden div works the same as a normal div
	equals( $divChild.getWidth(), $divNormal.getWidth(), "child of a hidden element getWidth() is wrong see #9441" );
	
	equals( $divChild.getHeight(), $divNormal.getHeight(), "child of a hidden element getHeight() is wrong see #9441" );
	
	// teardown html
	$divHiddenParent.remove();
	$divNormal.remove();
});

test("Element.prototype.getSize", function() {

	equal( document.getSize().y > 0, true, "Test on document without margin option" );
	
	var $div = $("nothiddendiv");
	$div.set("height", 30);

	equals($div.getSize().y, 30, "Test with only width set");
	$div.set("padding", "20px");
	equals($div.getSize().y, 70, "Test with padding");
	$div.set("border", "2px solid #fff");
	equals($div.getSize().y, 74, "Test with padding and border");
	$div.set("margin", "10px");
	equals($div.getSize().y, 74, "Test with padding, border and margin without margin option");
	$div.hide();
	equals($div.getSize().y, 0, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.set({ display: "", border: "", padding: "", width: "", height: "" });

	var div = Element.parse( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.getSize().y, 0, "Make sure that disconnected nodes are handled." );

	div.remove();
});
