//===========================================
//  右键菜单           C
//===========================================


using("System.Dom.Element");




if(navigator.isOpera && parseFloat(navigator.version) <= 10)
	Element.defineEvents('contextmenu', 'mouseup', function(e){
		return e.button === 2;
	});


/*

if (navigator.isIE9)
	Element.defineEvents('contextmenu', function(e){
		if(!('pageX' in e)){
			var event = window.event;
			String.map('clientX clientY screenX screenY', event, e);
			e.pageX = event.clientX + document.documentElement.scrollLeft;
			e.pageY = event.clientY + document.documentElement.scrollTop;
			e.layerX = event.x;
			e.layerY = event.y;
		}
	});

*/