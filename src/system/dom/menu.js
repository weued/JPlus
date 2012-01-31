//===========================================
//  联动菜单   menu.
//===========================================






// 
// 
// 
// 
// //===============================================
// // class - menu
// // copyright:xuld
// // edited by xuld
// // ʹ�÷���:
// // func  �ص�����
// // 
// /*<FORM name=isc id=menu>
		// <SELECT onchange=redirect(this.options.selectedIndex) size=1 name=example> 
       		 // <OPTION selected>---Select1-------------</OPTION>
			 // <OPTION>Webmaster Sites</OPTION>
			 // <OPTION>News Sites</OPTION>
		// </SELECT>
		// <SELECT onchange=redirect1(this.options.selectedIndex) size=1 name=stage2> 
			// <OPTION value=" "></OPTION>
			// <OPTION  value=" ">---Select2--------------</OPTION>
			// <OPTION value=" " selected>---Select2--------------</OPTION>
		// </SELECT>
		// <SELECT  onchange=redirect2(this.options.selectedIndex) size=1 name=stage3> 
        	// <OPTION value=" "></OPTION>
			// <OPTION value=" ">---Select3----------------</OPTION>
			// <OPTION value=" " selected>---Select3----------------</OPTION>
		// </SELECT>
   // </FORM>*/
// //===============================================
// var groups=document.isc.example.options.length;
// var group=new Array(groups);
// function func(x){
	// window.status=x;
// }
// for (i=0; i<groups; i++)
	// group[i]=new Array();
// 
// group[0][0]=new Option("---Select2---"," ");
// 
// group[1][0]=new Option("Now Select This One"," ");
// group[1][1]=new Option("JavaScript","47");
// group[1][2]=new Option("DHTML","46");
// group[1][3]=new Option("CGI","45");
// 
// group[2][0]=new Option("Now Select This One"," ");
// group[2][1]=new Option("General News","115");
// group[2][2]=new Option("Technology News","116"); 
// 
// var temp=document.isc.stage2;
// 
// 
// function redirect(x){
// for (m=temp.options.length-1;m>0;m--)
// temp.options[m]=null
// for (i=0;i<group[x].length;i++){
// temp.options[i]=new Option(group[x][i].text,group[x][i].value)
// }
// temp.options[0].selected=true
// redirect1(0)
// }
// 
	// var secondGroups=document.isc.stage2.options.length;
	// var secondGroup=new Array(groups);
	// for (i=0; i<groups; i++)  {
		// secondGroup[i]=new Array(group[i].length);
		// for (j=0; j<group[i].length; j++)  {
			// secondGroup[i][j]=new Array();  
		// }
	// }
// 
// secondGroup[0][0][0]=new Option("---Select 3---"," ");
// secondGroup[1][0][0]=new Option("---Select 3---"," ");
// secondGroup[1][1][0]=new Option("Now Select This One"," ");
// secondGroup[1][1][1]=new Option("Website Abstraction","http://wsabstract.com");
// secondGroup[1][1][2]=new Option("JavaScript for the non programmer","http://webteacher.com/javascript/");
// secondGroup[1][1][3]=new Option("Java-Scripts.net","http://java-scripts.net");
// 
// secondGroup[1][2][0]=new Option("Now Select This One"," ");
// secondGroup[1][2][1]=new Option("Dynamic Drive","http://www.dynamicdrive.com");
// secondGroup[1][2][2]=new Option("Beginner\'s Guide to DHTML","http://www.geocities.com/ResearchTriangle/Facility/4490/");
// secondGroup[1][2][3]=new Option("Web Coder","http://webcoder.com/");
// 
// secondGroup[1][3][0]=new Option("Now Select This One"," ");
// secondGroup[1][3][1]=new Option("CGI Resources","http://www.cgi-resources.com");
// secondGroup[1][3][2]=new Option("Ada\'s Intro to CGI","http://adashimar.hypermart.net/");
// 
// secondGroup[2][0][0]=new Option("---Select 3---"," ");
// secondGroup[2][1][0]=new Option("Now Select This One"," ");
// secondGroup[2][1][1]=new Option("CNN","http://www.cnn.com");
// secondGroup[2][1][2]=new Option("MSNBC","http://www.msnbc.com");
// secondGroup[2][1][3]=new Option("ABC News","http://www.abcnews.com");
// 
// secondGroup[2][2][0]=new Option("Now Select A Page"," ");
// secondGroup[2][2][1]=new Option("News.com","http://www.news.com");
// secondGroup[2][2][2]=new Option("Wired","http://www.wired.com");
// 
// var temp1=document.isc.stage3
// function redirect1(y){
// for (m=temp1.options.length-1;m>0;m--)
// temp1.options[m]=null
// for (i=0;i<secondGroup[document.isc.example.options.selectedIndex][y].length;i++){
// temp1.options[i]=new Option(secondGroup[document.isc.example.options.selectedIndex][y][i].text,secondGroup[document.isc.example.options.selectedIndex][y][i].value)
// }
// temp1.options[0].selected=true
// }
// 
// function redirect2(z){
// x=temp1[z].value;
// func(x);
// }
