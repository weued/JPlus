/** 
 * @projectDescription Py.Doc is a tool for creating Javascript API documents.
 * @fileOverview Py.Doc test page.
 * @author xuld
 * @version 0.1
 * @file test.js
 * @license MIT license
 */
 
 
 /**
  * A class of tree.
  * @class
  * @constructor
  * @param {String} id the html id
  */
function Tree(id){
	
	/** get/set the color of current tree */
	this.color = 'red';
	
	/** get the color of current tree */
	this.getColor = function(){
		return this.color;
	};
	
	/** get the dom of current tree @type Element @protected @property */
	 var dom = this.dom = document.getElementById(id);

	/** get the total count. */
 	Tree.count = 2;
	
}

/** 
 * A sub class of Tree.
 * @class
 * @constructor
 * @extends Tree
 */
function SubTree(){


}

var tr = new SubTree().color;


/** get the total count. */
SubTree.count = 4;

(function(window){
	
	/** @memberOf SubTree */
	window.prop = {
		
		/**get the current state */
		opened: false
	
	} ;

})(window);


/** this is a function */
function func(){

}

// call the function with a Number-type value
func(2);

/** 
 * this is another function 
 * @return {Number} return a Number-type value
 */
function func2(){

}


var value = func2();


(function(){

 /**
  * @class Object
  */
 apply(Object.prototype, {
 
	/** prop */
	prop: {
	
	}
 
 })
 
 })  ();
 
 /**
  * @class Boolean
  */
 (function(){
 
	/** to number */
	function toNumber(){
 
	}
 
 })();
 
 /**
  * @namespace Boolean
  */
 (function(){
 
	/** to number */
	function toNumber(){
 
	}
 
 })();
 
 
 /**
  * @class BlackTree
  */
  
  /**
   * @property color
   * @memberOf BlackTree
   */
   
   
 /**
  * @class Qoo
  */
a=  {

  /**@name e*/
  g: 4

}



  /**
   * @name m
   */
v = 2;




 /**
  * @class GG
  */
b =  function(){

   /***/
  this.cc = 3;    

    /***/
    function a(){

          /***/
       this.c =3
   }
}


 
 /**
  * @class Ee
  */
f = apply({}, {

   /**    */
   e: 4,

   /**    */
   f: 2


})

