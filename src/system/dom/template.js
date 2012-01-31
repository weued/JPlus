//===========================================
//  模板               template.js       A
//===========================================


namespace(".Template", Py.Class({
	
	parse: function(self){
	       var temp;
		   if(self.right=="}}"){//这里主要是为了解决{{{造成的bug!
		      temp=self.tplcontent.replace(/(}})([^}])/g,function(){
			     return arguments[1]+"   "+arguments[2];
			  }).split(new RegExp('(?='+self.left+')|('+self.right+')(?:[^}])'))
		   }else{
		      temp=self.tplcontent.split(new RegExp('(?='+self.left+')|('+self.right+')'))
		   }
			temp.filter(function(k,v){
                   return !(new RegExp(self.right)).test(v);
            }).each(
			  function(k,v){
			    if((new RegExp('^'+self.left)).test(v)){
				    if(new RegExp('^'+self.left+'\s*=').test(v)){
				       self.body.push(v.replace(new RegExp('^'+self.left+'\s*=(.*)'),'\ttemp.push($1);\n').replace(/\\n/g,''));
				    }else{
					   self.body.push(v.replace(new RegExp('^'+self.left+'\s*(.*)'),'$1\n').replace(/\\n/g,''));
					}
				}
				else {self.body.push('\ttemp.push(\"'+v.replace(/\n|\t/g,'')+'\");\n');}
			  })
			  return self.body.join("");
		},
		
		
		init:function(options){
			this.tpl=options.tpl;//待解析的模版
			this.target=options.target||options.tpl;//解析后渲染的模板dom
		    this.tplcontent=dom.quote(options.tpl.text||options.tpl.value);
		    this.left=options.left||"{{";//左分隔符
			this.right=options.rigth||"}}";//右分隔符
			this.namespace=options.namespace||"data";//编译生成的函数，里边所用变量的环境,即模版中所用变量的执行环境
			this.body=[];
			this.compiled="";//编译生成的函数
			this.data=options.data;
		},
		compile:function(){
			if(!this.compiled){
				this.compiled=new Function(this.namespace,'var temp=[];\n'+Template.parse(this)+'\n return  temp.join("");');
			}
			return this.compiled;
		},
		render:function(){
			this.target.innerHTML=this.compile()(this.data);
			return this.compile()(this.data);
		},
		
		
	
	
	
}));




 /**
 // * @author hust_小C
 // * email:hustcoolboy@gmail.com
 // */
// var dom = {
                    // quote: function (str) {
                        // str = str.replace(/[\x00-\x1f\\]/g, function (chr) {
                        // var special = metaObject[chr];
                        // return special ? special : '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4)
                    // });
					// return str.replace(/"/g, '\\"') ;
//                  
                // }
            // },
            // metaObject = {
                // '\b': '\\b',
                // '\t': '\\t',
                // '\n': '\\n',
                // '\f': '\\f',
                // '\r': '\\r',
                // '\\': '\\\\'
            // };
// //上边的dom来自司徒正美http://www.cnblogs.com/rubylouvre/
// (function(w){
    // w.Template=Template||{};
	// function Template(options){
	    // return this instanceof arguments.callee?this.init(options):new arguments.callee(options);
	// }
// 	
// })(this);