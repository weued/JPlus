//===========================================
//  判断元素是否在制定原元素范围   within.js    A
//===========================================


Element.implement({
	
	within: function (bound) {
		return ((bound.right < box.right && bound.right > box.left) || (bound.left < box.right && bound.left > box.left)) &&
			  ((bound.bottom < box.bottom && bound.bottom > box.top) || (bound.top < box.bottom && bound.top > box.top)) ;
	}


});