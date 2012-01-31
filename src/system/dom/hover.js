//===========================================
//  移到后独显样式   hover.js    A
//===========================================




using("System.Dom.Element");


Element.implement({
	
	
	setHoverClass: function(){
		
	},
	
	
	// addClassOnOver : function(className, preventFlicker){
	    // this.on("mouseover", function(){
	        // Ext.fly(this, '_internal').addClass(className);
	    // }, this.dom);
	    // var removeFn = function(e){
	        // if(preventFlicker !== true || !e.within(this, true)){
	            // Ext.fly(this, '_internal').removeClass(className);
	        // }
	    // };
	    // this.on("mouseout", removeFn, this.dom);
	    // return this;
	// },
// 	
// 	
	// addClassOnFocus : function(className){
	    // this.on("focus", function(){
	        // Ext.fly(this, '_internal').addClass(className);
	    // }, this.dom);
	    // this.on("blur", function(){
	        // Ext.fly(this, '_internal').removeClass(className);
	    // }, this.dom);
	    // return this;
	// },
// 	
	// addClassOnClick : function(className){
	    // var dom = this.dom;
	    // this.on("mousedown", function(){
	        // Ext.fly(dom, '_internal').addClass(className);
	        // var d = Ext.get(document);
	        // var fn = function(){
	            // Ext.fly(dom, '_internal').removeClass(className);
	            // d.removeListener("mouseup", fn);
	        // };
	        // d.on("mouseup", fn);
	    // });
	    // return this;
	// },
	
});



