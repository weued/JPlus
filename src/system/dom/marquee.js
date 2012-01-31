//===============================================
//  marquee     滚动  (单个)
//  edited by xuld
//  使用方法;
//  marquee.creat({id:"div1",
//				 direction: "left",
//				 CSS:"}.marquee img{margin:2px;width:134px;height:96px;",
//				 width:900,
//				 height:100,
//               img:数组 或 text:数组 或 html: 或 elements: 数组
//				 });
//图片Array(
//		  {src:"do1.gif",onclick:"",onmouseover:""}
//		 )
//text Array("f")
//elements Array(
//		  {tag:div,id:"do1.gif",onclick:"",onmouseover:""}
//		 )
//   marquee.stop();
//   marquee.begin();
//   marquee.element  //  id 的 div
//===============================================


var marquee = [];
marquee.creat = function(){
	var A = arguments?arguments[0]:{};
	this.width = A.width || 400;         //宽
	this.height  = A.height || 100;        //高
	this.id = A.id || "div1";  //id
	this.direction = A.direction || "left";   //-------滚动方向有四个值left，right，up，down，自己试试--------//
	this.speed = A.speed || 100 ;//-------滚动速度100相当于1秒，越小越快--------//
	this.cid = this.id +"_c";//-------放图片的容器id--------//
	var sHTML="";
	var sCSS = "div.marquee{overflow:hidden; cursor:pointer; margin-top:50px;width:"+this.width+"px ;height:"+this.height+"px}\n\t.marquee li{list-style:none; float:left; border:0; padding:0px; margin:0px;}\n\t.marquee img{border:0px;  padding:0px; margin:0px;display:block;}\n";
	if( A.CSS)
		sCSS+=".marquee{" + A.CSS + "}\n";
	var HTML=1,bStop=1;    //使用<img>  和   <img />   //  鼠标移动停止
	
	if(A.img){
		HTML=HTML?"></li>\n":" /></li>\n";
		for(var i=0;i<A.img.length;i++){
			sHTML+="\t\t<li><img";
			for(attr in A.img[i])
				sHTML+=" "+attr + "='"+ A.img[i][attr] + "'";
			sHTML+=HTML;
			
		}
		
	}else if(A.elements){		
		sHTML+="<"+elements.tag+" ";
		for(attr in elements){
			if(attr.toString=="tag") continue;
			sHTML+=attr + "='"+ elements[attr] + "' ";
		}
		sHTML+=">\n";		
	}else if(A.text){
		for(var i=0;i<A.text.length;i++){
			sHTML+="\t\t<li>"+A.text[i]+"</li>\n";
			
		}
	
		
	}else if(A.html){
		sHTML+=A.html;
		
	}
	
	var sStop;
	if(bStop) sStop=" onmouseover=\"marquee.stop()\" onmouseout=\"marquee.begin()\""; else sStop="";
	sHTML = "<style>\n\t" + sCSS + "</style>\n<div id=\""+ this.id +"\" class=\"marquee\"" + sStop + ">\n\t<ul id=\""+ this.id+"_c\"  style=\"clear:both;list-style:none; border:0px; padding:0px; margin:0px;\">\n" + sHTML + "\n\t</ul>\n</div>"
	
	document.write(sHTML);
	
	
	
	
	var _HtmlL = document.getElementById(this.cid).innerHTML;
	var _HtmlT = document.getElementById(this.id).innerHTML;
	switch (this.direction){
		case "left":
			document.getElementById(this.cid).innerHTML=_HtmlL+_HtmlL+_HtmlL+_HtmlL;
			break;
		case "right":
			document.getElementById(this.cid).innerHTML=_HtmlL+_HtmlL+_HtmlL+_HtmlL;
			break;
		case "up":
			document.getElementById(this.id).innerHTML=_HtmlT+_HtmlT+_HtmlT+_HtmlT;
			break;
		case "down":
			document.getElementById(this.id).innerHTML=_HtmlT+_HtmlT+_HtmlT+_HtmlT;
			break;
	}
	document.getElementById(this.cid).style.width=this.width*2;
	document.getElementById(this.cid).style.height=this.height;
	this.element=document.getElementById(this.id);
	this.begin();
}

marquee.stop=function(id){
	if(!id) id = this.id;
	document.getElementById(id).scrollLeft=document.getElementById(this.id).scrollLeft;
	document.getElementById(id).scrollTop=document.getElementById(this.id).scrollTop;
	clearTimeout(marquee.showert);
}


marquee.begin=function(id){	
	if(!id) id = this.id;
	var ele;
	ele=document.getElementById(id);	
	switch (this.direction){
		case "left":
			window.shower=function(id){
				var ele;
				ele=document.getElementById(id);
				ele.style.width=marquee.width;
				ele.style.height=marquee.height;
				ele.scrollLeft=ele.scrollLeft+5;
				if (ele.scrollLeft>=marquee.width){
					ele.scrollLeft=0;
				}
				marquee.showert=setTimeout("window.shower('"+id+"')",marquee.speed);
			};
			
			break;
		case "right":
			window.shower=function(id){
				var ele;
				ele=document.getElementById(id);
				ele.style.width=marquee.width;
				ele.style.height=marquee.height;
				ele.scrollLeft=ele.scrollLeft-5;
				if (ele.scrollLeft<=0){
					ele.scrollLeft=marquee.width;
				}
				marquee.showert=setTimeout("window.shower('"+id+"')",marquee.speed);
			};
			break;
		case "up":
			window.shower=function(id){
				var ele;
				ele=document.getElementById(id);
				ele.style.width=marquee.width;
				ele.style.height=marquee.height;
				ele.scrollTop=ele.scrollTop+5;
				if (ele.scrollTop>=marquee.height){
					ele.scrollTop=0;
				}
				marquee.showert=setTimeout("window.shower('"+id+"')",marquee.speed);
			};
			break;
		case "down":
			window.shower=function(id){
				var ele;
				ele=document.getElementById(id);
				ele.style.width=marquee.width;
				ele.style.height=marquee.height;
				ele.scrollTop=ele.scrollTop-5;
				if (ele.scrollTop<=0){
					ele.scrollTop=marquee.height;
				}
				marquee.showert=setTimeout("window.shower('"+id+"')",marquee.speed);
			};
			break;
	}
	window.shower(this.id);	
}