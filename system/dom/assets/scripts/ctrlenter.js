//===========================================
//  Ctrl + Enter  提       
//===========================================



Control.addEvents('ctrlenter', 'keypress', function(e){
	return e.ctrlKey && (e.which == 13 || e.which == 10);
});

Dom.enableSubmitOnCtrlEnter = function(elem, check){
	Dom.get(elem).on('ctrlenter', function(){
		if((!check || check(this.value) !== false) && this.dom.form)
			this.form.submit();
	});
};