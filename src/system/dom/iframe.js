//===========================================
//  框架               iframe.js       A
//===========================================
using("System.Controls.Control");

/**
 * IFrame
 * @class IFrame
 */
namespace(".IFrame", Py.Control.extend({
	
	xType: 'iframe',
	
	tpl: '<iframe src="about:blank"></iframe>',
	
	doReady: function(fn){
		var me = this;
		me.update();
		me.isReady = true;
	},
	
	onReady: function (fn) {
		
	},
	
	init: function(){
		var elem = this;
		this.dom.renderTo(true);
		if(navigator.isStd){
			setTimeout(function(){
				if (elem.dom.contentWindow.document.URL != 'about:blank')
					elem.onReady();
				else
					setTimeout(arguments.callee, 10);
			}, 20);
		} else {
				elem.on('load', elem.onReady);
		}
	},
	
	getDom: function(){
		return this.dom.contentWindow.document;
	},
	
	update: function(){
		var me = this;
		Py.setupWindow(me.window = me.dom.contentWindow);
		
		if(!navigator.isStd){
			me.window.document.getDom = function(){
				return this.body;
			};
		}
		return me;
	}

}));
	
	
