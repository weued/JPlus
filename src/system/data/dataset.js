//===========================================
//  数据集对象   dataset.js     
//===========================================



// //==========================================
// // PyObject  by xuld
// //
// //   ����ݵ���
// //
// //
// //����˵��: ����Ҫ���ڴ洢������ݿ�ṹ�ı��
// //              ȫ�ֱ���  DataSet :  ȫ����ݵļ���
// //              һ��DataSet���ж��DataTable  ÿ��DataTable ����һ��DataTitle�Ͷ��DataRow
// //              ���ṩUI���档ֻ����Ϊһ�����(XML,��ݿ�,JSON)�ӿڡ�
// //���ʾ��:
// //     /*  js code 
// //		* * PyObject ���ʾ��
// //		* * ����һ����񲢴���һ����
// //      */
// //          var Table = DataSet.add("�������",["����1","����2","����3"]);    //����һ�����,������������Щ����
// //			Table.add("����1",["��һ�е�1��","��һ�е�2��","��һ�е�3��"]);           //����һ��
// //          Table.add("����2",["�ڶ��е�1��","�ڶ��е�2��","�ڶ��е�3��"]);           //����һ��
// //			Table["����1"]["����1"] = 3;             // �����������Ϊ����1���еĵ�һ�С�
// //			Table[0][3] = 6                          // Ҳ����ʹ������
// //			Table.create()                           // ����һ�� <TABLE> ��ǩ,�������һ�����ڵ���,�۲����еı�����
// //
// //��ʾ��:
// //       ���÷���˵��: 
// //          add   ����һ��
// //          del   ɾ��һ��
// //          indexOf   ����ָ�����������
// //          find   ����ָ����������,����Ҳ����й�����,���� -1
// //          insert   �ڵ�ǰλ��ĩβ����һ������
// //          insertAt   ��һ��λ�ò���һ������
// //          remove   ��������ɾ��,���Դ���һ������
// //          removeAt   ��������ɾ��
// //          search   ���ص�ǰ����ָ������
// //          getAt   ����ָ������λ��,�������Խ��,����һ�� NULL
// //          length  ����
// //          key     ����
// //
// //       DataSet::add()    ����һ����,����:�����1������ʾ������,���2��,ǰ������Ϊ�����,����Ǳ��⡣
// //       DataSet::del()    ɾ��һ����,����:������֡�
// //       DataSet::table    ȫ�����ļ���
// //                              �������һ������,Ҫʹ��table���ϻ�øñ��     DataSet.table[����]  �� DataSet.table[��]
// //       DataSet::count    �����
// //       DataSet::xType    Py����������˵��
// //       DataTable::addTitle    ���ӱ��ı���,�������������,�򶺺Ÿ������ַ�
// //       DataTable::addTitleAt    ���ӱ��ı��⵽һ��λ��,��һ������Ϊλ��(����),�ڶ���Ϊ����
// //       DataTable::render    ��Ⱦ��һ��DIVԪ��
// //       DataTable::container    ��ȡһ��<TABLE>
// //       DataTable::sort(��,�ȽϺ���,˳��/����,��ʼλ��,����λ��)    ����
// //                                 ������ʹ�ý϶�Ĺ���,ʹ�õĲ���ȫ��ѡ,
// //                                 ��û����ʱ,��ʹ�����С�
// //                                 �ȽϺ���,Ĭ���Ƿ�����С����
// //                                       �Ƚк���  2   ������,  ��ʾ 2���С� ����һ������ �� function(x,y){return x<y};  ����  x<y  ����
// //                                 ˳��,����:����,ʼ�������෴(Ĭ��true)��   
// //                                 ��ʼλ��,��ʼ�����λ�á�  
// //       
// //==========================================
// 
// 
 // /* dataSet
// *     by xuld
// *      http://www.xuld.net
// *   ע�Ͱ�
// *      ���ڼ�������:�����jsû�кܶ��Ż���,�����������⡣������и�õ��޸Ľ���,ϣ���ܷ�����һ���޸ĵ�Դ�롣
// *   ȫ��˵��
// *      �������ʹ��js����
// *   �����о���ѧϰ��
// */
// if(!window.dataSet && dataSet.xType!="dataSet"){
	// dataSet = function(name){
		// var playDataSet = {
// 			
			// //ȫ�����
			// table:new Array(),
// 			
			// //�����
			// count:0,
// 			
			// //�汾
			// version:0.1,
// 			
			// //��񳤶�
			// length:function(){
				// return this.table.length;
			// },
// 
			// //��ݴ�������ݷ���һ������
			// _getAt:function(t,x){
				// if(isNaN(x)){
					// return this._indexOf(x);
				// }else{
					// return x>t.length?null:t[x];
				// }
			// },
// 			
			// xType:"dataSet",
// 			
			// //����һ��ֵ��ĩβ
			// //����:
			// //  value : ����
			// //  key : ֵ 
			// _insert:function(t,value,key){
				// t.key = t.length;
// 
				// if(typeof value == "undefined" || value==""){
					// t[t.length] = key;
				// }else{
					// return t[t.length] = t[value] = key;
				// }
// 				
				// return t[t.key];
			// },
// 			
			// //��һ��λ�ò���һ��ֵ
			// //����:
			// //  table : ����
			// //  value : ����
			// //  key : ֵ
			// _insertAt:function(t,table,value,key){
				// t.key = table;
// 				
				// for(var i=t.length-1;i>=table;i--){
					// t[i+1] = t[i];
				// }			
// 				
				// if(typeof value == "undefined" || value==""){
					// t[table] = key;
				// }else{
					// t[value] = t[table] = key;
				// }
				// return t[t.key];
			// },
// 			
			// //����,��������,�Ҳ��� ���� -1
			// //����:
			// //  name : ����
			// _indexOf:function(t,name){
				// for(var i=0;i<t.length;i++)
					// if(t[i] &&  t[i].name==name)
						// return i;
				// return -1;
// 				
			// },
// 			
			// //ɾ��һ��ֵ
			// //����:
			// //  name : ֵ
			// _remove:function(t,name){
				// if(isArray(name)){
					// var aa=new Array();
					// for(var i=0; i<t.length; i++)
					   // for(var n=0; n<name.length;  n++ )
						// if(t[i] && t[i].name==name[n]){
						// aa.push(i);
						// break;
					// }
					// return this._removeAt(t,aa);
				// }
				// for(var i=0;i<t.length;i++)
					// if(t[i] &&  t[i].name==name){
						// this._removeAt(t,i);
						// return 1;
						// break;
					// }
				// return  0;
			// },
// 			
// 			
			// //ɾ��
			// //����:
			// //  table : ����
			// //  ���ر�ɾ��ĸ���
			// _removeAt:function(t,table){
				// if(isArray(table)){
					// var count = 0;
					// for(var v=0;v<table.length;v++)
						// if(t[table[v]]){
							// count++;
							// if(t[table[v]].name)
								// delete t[t[table[v]].name];
					        // delete t[table[v]];	
						// }
					// var start,v;
							// start = parseInt(table[0]);
							// v = start;
							// while(v++<t.length)
								// if(t[v])
									// t[start++] = t[v];
						// t.length -= count;
					// return count;
				// }
				// table = parseInt(table);
				// if(!t[table])
					// return 0;
				// if(t[table].name)
					 // delete t[t[table].name];
				// delete t[table];
				// while(table++<t.length)
					// t[table-1]  = t[table];
				// t.length--;
				// return 1;
			// },
// 			
			// _load :  function(t,value){
				// switch(typeof value){
					// case "object" :
						// if(value.xType){
							// t = value;
						// }else{
							// for(var i in value){
								// if(!i) continue;
								// this._insert(t,i,value[i]);
							// }
						// }
						// break;
					// case "string" :
							// value = value.split(",");
							// for(var i in value){
								// if(!i) continue;
								// this._insert(t,i,value[i]);
							// }
						// break;
					// default:
						// break;
				// }
// 				
			// },
// 			
// 			
			// //����һ��ֵ�����Ƿ����
			// //����:
			// //  table : ����
			// _search:function(t,table){
				// if(isArray(table)){
					// for(var v in table)
						// if(t[table[v]])
							// continue;
						// else
							// return false; 
				// }
				// return !!t[table];
// 				
			// },  
// 			
			// //��ݴ�������ݷ���һ�����
			// getAt:function(x){
				// return this._getAt(this.table,x);
			// },
// 			
			// //����һ�����ĩβ
			// //����:
			// //  tableName : ����
			// insert:function(tableName,value){
				// this.count++;
				// return this._insert(this.table,tableName,playDataTable(tableName,value));
			// },
// 			
			// //��һ��λ�ò���һ��ֵ
			// //����:
			// //  n : ����
			// // tableName: ����
			// insertAt:function(x,tableName,value){
				// this.count++;
				// return this._insertAt(this.table,x,tableName,playDataTable(tableName,value));
			// },
// 
			// //���ұ���,��������,�Ҳ��� ���� -1
			// //����:
			// //  name : ����
			// indexOf:function(name){
				// return this._indexOf(this.table,name);
// 				
			// },
// 
			// //ɾ��һ����
			// //����:
			// //  table : ����
			// remove:function(tableName){
				// this.count -= this._remove(this.table,tableName);
			// },
// 
			// //ɾ��һ����
			// //����:
			// //  table : ������
			// removeAt:function(x){
				// this.count -= this._removeAt(this.table,x);
			// },
// 			
			// //����һ�������Ƿ����
			// //����:
			// //  table : ����
			// search:function(tableName){
				// return this._search(this.table,tableName);
// 				
			// },
// 			
			// //����
			// key:0
		// };
// 		
		// //���һ����  ����:λ�ñ���
		// // add λ�� ���� ����
		// playDataSet.table.add =playDataSet.add =  function(table,TableName,C){
			// if(C && typeof table!="Object")
				// return playDataSet.insertAt(table,TableName,C);		
			// else if(!C && !TableName)
				// return playDataSet.insert(playDataSet.count+"_play",table);
			// else if(typeof table!="Object")
				// return playDataSet.insertAt(table,TableName,C);
			// else
				// return playDataSet.insert(table,TableName);
		// };
// 
		// //ɾ��һ��  ����:λ�ñ���
		// playDataSet.table.del = playDataSet.del = function(table){
			// if(isNaN(table))
				// playDataSet.remove(table);
			// else
				// playDataSet.removeAt(table);
		// };
// 		
		// playDataSet.table.search = playDataSet.search;
// 		
		// playDataSet.table.indexOf = playDataSet.indexOf;	
// 		
		// playDataSet.table.getAt = playDataSet.getAt;
// 		
		// return playDataSet;
	// }();
// 
   // playDataTable = function(name,title,vals){
// 	   
	    // var DataTable = new Array();
// 			
		// //ȫ����
		// DataTable.title = playDataColumn(name+"Title",title,this);
// 		
		// //����
		// DataTable.name = name;
// 		
		// //����һ���е�ĩβ
		// //����:
		// //  value : ����
		// DataTable.insert = function(value,vals){
			// return dataSet._insert(this,value,playDataRow(value,vals,this));
		// };
// 		
		// //����һ��
		// //����:
		// //  name : ����
		// DataTable.addTitle = function(value){
			// dataSet._load(this.title,value); 
		// };  
// 		
		// //����һ��һ��λ��
		// DataTable.addTitleAt = function(row,value){
			// dataSet._insertAt(this.title,row,value,value); 
		// };  
		// //��һ��λ�ò�����
		// //����:
		// //  row : ����
		// //  value : ����
		// DataTable.insertAt = function(row,value,vals){
			// var title = this.title;
			// return dataSet._insertAt(this,row,value,playDataRow(value,vals,this));
		// };
// 
		// //��������,��������,�Ҳ��� ���� -1
		// //����:
		// //  name : ����
		// DataTable.indexOf = function(name){
			// return dataSet._indexOf(this);
// 			
		// };
// 
		// //��һ���в���һ����Ԫ��,������,�Ҳ��� ���� -1
		// //����:
		// //  name : ֵ
		// DataTable.findAt = function(){
			// if(arguments.length==2)
				// for(var i=0;i<this.length;i++)
					// if(this[i][arguments[0]]==arguments[1])
						// return i;
			// else
				// for(var i=0;i<this.length;i++)
					// if(this[i][this.key]==arguments[0])
						// return i;	
			// return -1;
// 			
		// };	
// 		
		// DataTable.xType = "playDataTable";		
		// //����һ����Ԫ��,������������(��,��),�Ҳ��� ���� (-1,-1)
		// //����:
		// //  value : ֵ
		// DataTable.searchOf = function(value){
			// for(var i=0;i<this.length;i++)
				// for(var j=0;j<this[i].length;j++)
					// if(this[i][j]==value)
						// return [i,j];
			// return [-1,-1];
// 			
		// };		
// 		
		// //ɾ��һ��
		// //����:
		// //  row : ����
		// DataTable.remove = function(row){
			// dataSet._remove(this,row);
		// };
// 			
		// //ɾ��һ����
		// //����:
		// //  row : ����
		// DataTable.removeAt = function(row){
			// dataSet._removeAt(this,row);
		// };
// 			
		// //����һ�������Ƿ����
		// //����:
		// //  table : ����
		// DataTable.search = function(row){
			// return !!this[row];
		// }
// 		
		// //������,��������
		// // ����:
		// //  �е�����
		// //   ֵ �����Ƕ��Ÿ�����ֵ,��json,������,playDataRow
		// DataTable.add = function(row,value){
			// if(!value){
				// return this.insert("",row);
			// }else{
				// return this.insert(row,value);
			// }
		// }
// 		
		// DataTable.forEach = function(row,f){
			// if(!f){
				// f = row;
				// row = this.key  ;
			// }
// 			
			// for(var i=0;i<this.length;i++)
				// f(this[i][row],i,row);
// 			
// 		
		// }
// 		
		// //�������һ��,û�� null
		// DataTable.getAt = function(x){
			// return dataSet._getAt(x);
		// }
// 
// 
		// //����  (ð��)
		// //����: name id������
		// //  row  name bool f 
		// DataTable.sort = function(row,f,bool,start,end){
			// row = row || this.key;
			// fn = typeof f=="function"?f:function(x,y){return x<y};
			// if(bool===false) fn = function(x,y){return !fn(x,y)};
			// start = start || 0;
			// end = end || this.length;
			// var tmp;
			// for(var i=start;i< end;i++){
				// for(var j=i+1;j<end;j++)
					// if(!fn(this[i][row],this[j][row])){
						// tmp = 	this[j][row];
						// this[j][row] = this[i][row];
						// this[i][row] = tmp;
					// }
			// }
		// }
// 
		// //��һ��<table>��ǩ��������
		// DataTable.container = function(id){
			// id = typeof id=="string"?document.getElementById(id):id;
			// if(id.tagName.toUpperCase()!="TABLE") return;
			// for(var i=0;i<id.row.length();i++)
			  // for(var j=0;j<id.row[i].cell.length();j++)
			    // this[i][j] = id.row[i].cell[j].innerHTML;
		// }
// 
// 
// 
		// //д��һ��<table>��ǩ
		// DataTable.render = function(id){
			// id = typeof id=="string"?document.getElementById(id):id;
			// var sHTML="  <tr>\n";
			// sHTML  += "    <th>";
			// sHTML  += this.title.join("&nbsp;</th><th>");
			// sHTML  += "    </th>\n";
			// sHTML  += "  </tr>\n";
			// sHTML  += "\n";			
			// sHTML  += "  \n";			
			// for(var i=0;i<this.length;i++){
				// sHTML  += "  <tr>\n   <td>";
				// sHTML  += this[i].join("&nbsp;</td><td>");
				// sHTML  += "   </td>\n  </tr>\n";
			// }	
			// sHTML = "<table id=\"" + this.name + "\">" + sHTML + "</table>"
			// id.innerHTML = sHTML;
		// }
// 
		// DataTable.create = function(){
			// var n = this.name+"_v";
			// document.write("<div id=\"" + n + "\"></div>")
			// DataTable.render(n);
		// }
// 
// 
		// //����������id��
		// //����: name id������
		// DataTable.autoID = function(name,start,row){
			// name = name || "ID";
			// this.addTitleAt(row || 0,name);
			// start = start || 1;
			// for(var i=0;i<this.length;i++)
				// this[i].insertAt(0,name,start+i);
		// }
// 		
		// //������
		// DataTable.key = 0;
// 		
// 		
		// return DataTable;
	// };
// 	
	// playDataColumn = function(name,vals,parent){
		// var DataColumn = new Array();
// 		
		// DataColumn.key = 0;
// 		
		// DataColumn.name = name;
// 		
		// DataColumn.xType = "playDataColumn";
// 		
		// DataColumn.sorted = false;
// 		
		// DataColumn.parnet = parent;
// 		
		// DataColumn.show = true,
// 		
		// DataColumn.add = function(value){
			// dataSet._load(this,value); 
		// }
// 	
		// DataColumn.insert = function(value,values){
			// return dataSet._insert(this,value,values); 	
		// }
// 		
		// //��һ��λ�ò�����
		// //����:
		// //  row : ����
		// //  value : ����
		// DataColumn.insertAt = function(row,value,values){
			// return dataSet._insertAt(this,row,value,values);
		// };
// 
		// //�����в���ֵ,��������,�Ҳ��� ���� -1
		// //����:
		// //  name : ����
		// DataColumn.indexOf = function(name){
			// return dataSet._indexOf(this,name);
// 			
		// };
// 		
		// //�������õ���һ����������λ�õ�ֵ
		// //����:
		// //  value : ֵ
		// DataColumn.getAt = function(value){
			// return dataSet._getAt(this,value); 
// 			
// 			
		// };		
// 		
		// //ɾ��һ��
		// //����:
		// //  row : ����
		// DataColumn.remove = function(row){
			// dataSet._remove(this,row);
		// };
// 			
		// //ɾ��һ��
		// //����:
		// //  table : ����
		// DataColumn.removeAt = function(row){
			// dataSet._removeAt(this,row);
		// };
// 		
		// DataColumn.loadData = function(vals){
			// dataSet._load(this,vals);
		// }
		// //�������Ƿ����
		// //����:
		// //  table : ����
		// DataColumn.search = function(row){
			// return !!this[row];
// 			
		// }	
// 		
		// DataColumn.loadData(vals);
		// return DataColumn;
// 		
	// }
// 	
	// function isArray(a){
		// return typeof a == "object" && (a.constructor ==Array || typeof a.sort=="function" && !isNaN(a.length)) && !a.xType;
// 		
	// }
	// //���һ��
   // playDataRow = function(name,vals,parent){
// 	  
	    // var DataRow = new Array();
// 		
		// DataRow.xType = "playDataRow";
// 		
		// DataRow.title = parent.title;
		// //����
		// DataRow.name = name;
// 		
		// DataRow.parent = parent;
// 		
		// DataRow.sorted = false;
// 		
		// DataRow.show = true,
// 		
		// //�����е�ĩβ
		// //����:
		// //  value : ����
		// DataRow.insert = function(value,values){
			// return dataSet._insert(this,value,values);
		// };
// 		
		// //��һ��λ�ò�����
		// //����:
		// //  row : ����
		// //  value : ����
		// DataRow.insertAt = function(row,value,values){
			// return dataSet._insertAt(this,row,value,values);
		// };
// 
		// //���뵽һ������
		// DataRow.loadData =function(value){
			// dataSet._load(this,value);
		// };
// 		
		// //��ϱ���
		// DataRow.bind = function(v){
			// for(var i=0;i<v.length;i++)
				// this[v[i]] = this[i];
// 			
		// }
// 		
		// //�����в���ֵ,��������,�Ҳ��� ���� -1
		// //����:
		// //  name : ����
		// DataRow.indexOf = function(name){
			// return dataSet._indexOf(this,name);
// 			
		// };
// 	
		// //�������õ���һ����������λ�õ�ֵ
		// //����:
		// //  value : ֵ
		// DataRow.getAt = function(value){
			// return dataSet._getAt(this,value); 
// 			
// 			
		// };		
// 		
		// //ɾ��һ��
		// //����:
		// //  row : ����
		// DataRow.remove = function(row){
			// dataSet.remove(this,row);
		// };
// 			
		// //ɾ��һ��
		// //����:
		// //  table : ����
		// DataRow.removeAt = function(row){
			// dataSet.removeAt(this,row);
		// };
// 			
		// //�������Ƿ����
		// //����:
		// //  table : ����
		// DataRow.search = function(row){
			// return !!this[row];
// 			
		// }
// 		
		// //������
		// DataRow.key = 0;
// 		
		// DataRow.loadData(vals);
// 		
		// DataRow.bind(DataRow.title);
// 		
		// return DataRow;
	// };
// }