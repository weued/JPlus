/*
 * @author AKI
 */

var Dialog = function(){
	var tmpl = '\
		<div class="dialog" style="display: block;">\
			<div class="dialogBg" style="height: 231px;"></div>\
			<div class="pop_box">\
				<div class="pop_gray"><a title="关闭" href="#" class="pop_close"></a></div>\
				<div class="sel_mid"></div>\
				<div class="pop_gray_b clearfix">\
					<a class="btn-s-gray fr ml4" href="#"><span>取消</span></a>\
					<a class="btn-s-red fr" href="#"><span>确定</span></a>\
				</div>\
			</div>\
		</div>';
	var dom = $(tmpl);
	dom.appendTo("body");
	this.dom = dom;
};
Dialog.prototype = {
	
	init:function(list){
		
		var list = list || [],
			defaultList = [{classname:".btn-s-gray",func:"cancel"},{classname:".pop_close ",func:"close"},{classname:".btn-s-red",func:"sure"}];
		
		list.push.apply(list,defaultList);
		
		Helper.on(list,this);
	},
	
	show:function(){
		this.dom.show();
	},
	
	setHtml:function(name,html){
		this.dom.find(name).html(html);
	},
	
	setTitle:function(str){
		this.setHtml(".title",str);
	},
	
	setContent:function(html){
		this.setHtml(".sel_mid",html);
	},
	
	hide:function(){
		this.dom.hide();
	},
	
	close:function(){
		this.hide();
	},
	cancel:function(){}
	
};










