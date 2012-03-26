module("Dimensions");

test("Control.prototype.getWidth", function() {
	expect(6);

	var $div = Dom.get("nothiddendiv");
	$div.setWidth( 30 );
	equal($div.getWidth(), 30, "Test set to 30 correctly");
	$div.hide();
	equal($div.getWidth(), 30, "Test hidden div");
	$div.show();
	$div.setWidth( -1 ); // handle negative numbers by ignoring #1599
	equal($div.getWidth(), 0, "负值 转为 0");
	$div.setWidth( 30 );
	$div.setStyle("padding", "20px");
	equal($div.getWidth(), 30, "Test padding specified with pixels");
	$div.setStyle("border", "2px solid #fff");
	equal($div.getWidth(), 30, "Test border specified with pixels");

	Dom.setStyles($div.dom, { display: "", border: "", padding: "" });

	Dom.setStyles(Dom.get("nothiddendivchild").dom, { width: '20px', padding: "3px", border: "2px solid #fff" });
	equal(Dom.get("nothiddendivchild").getWidth(), 20, "Test child width with border and padding");
	Dom.setStyles(Dom.get("nothiddendiv").dom, { border: "", padding: "", width: "" });
	Dom.setStyles(Dom.get("nothiddendivchild").dom, { border: "", padding: "", width: "" });
	
	JPlus.setData($div, "display", null);
});

test("Control.prototype.getHeight", function() {
	expect(6);

	var $div = Dom.get("nothiddendiv");
	$div.setHeight( 30 );
	equal($div.getHeight(), 30, "Test set to 30 correctly");
	$div.hide();
	equal($div.getHeight(), 30, "Test hidden div");
	$div.show();
	$div.setHeight( -1 ); // handle negative numbers by ignoring #1599
	equal($div.getHeight(), 0, "负值 转为 0");
	
	$div.setHeight( 30 );
	$div.setStyle("padding", "20px");
	equal($div.getHeight(), 30, "Test padding specified with pixels");
	$div.setStyle("border", "2px solid #fff");
	equal($div.getHeight(), 30, "Test border specified with pixels");

	Dom.setStyles($div.dom, { display: "", border: "", padding: "", height: "1px" });

	Dom.setStyles(Dom.get("nothiddendivchild").dom, { height: '20px', padding: "3px", border: "2px solid #fff" });
	equal(Dom.get("nothiddendivchild").getHeight(), 20, "Test child height with border and padding");
	Dom.setStyles(Dom.get("nothiddendiv").dom, { border: "", padding: "", height: "" });
	Dom.setStyles(Dom.get("nothiddendivchild").dom, { border: "", padding: "", height: "" });

	JPlus.setData($div, "display", null);
});

test("child of a hidden elem has accurate getWidth()/getHeight()  see #9441 #9300", function() {
	
	// setup html
	var $divNormal       = Dom.parse("<div>").set({ width: "100px", height: "100px", border: "10px solid white", padding: "2px", margin: "3px" }),
		$divChild        = $divNormal.clone(),
		$divHiddenParent = Dom.parse("<div>").set( "display", "none" ).append( $divChild ).appendTo();
	$divNormal.appendTo();

	// tests that child div of a hidden div works the same as a normal div
	equal( $divChild.getWidth(), $divNormal.getWidth(), "child of a hidden element getWidth() is wrong see #9441" );
	
	equal( $divChild.getHeight(), $divNormal.getHeight(), "child of a hidden element getHeight() is wrong see #9441" );
	
	// teardown html
	$divHiddenParent.remove();
	$divNormal.remove();
});

test("Control.prototype.getSize", function() {

	equal( document.getSize().y > 0, true, "Test on document without margin option" );
	
	var $div = Dom.get("nothiddendiv");
	$div.set("height", 30);

	equal($div.getSize().y, 30, "Test with only width set");
	$div.set("padding", "20px");
	equal($div.getSize().y, 70, "Test with padding");
	$div.set("border", "2px solid #fff");
	equal($div.getSize().y, 74, "Test with padding and border");
	$div.set("margin", "10px");
	equal($div.getSize().y, 74, "Test with padding, border and margin without margin option");
	$div.hide();
	equal($div.getSize().y, 0, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.set({ display: "", border: "", padding: "", width: "", height: "" });

	var div = Dom.parse( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equal( div.getSize().y, 0, "Make sure that disconnected nodes are handled." );

	div.remove();
});
