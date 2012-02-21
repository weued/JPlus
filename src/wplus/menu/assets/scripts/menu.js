/**
 * Menu
 * @author WJZ
 */

(function($){
	
	/*Menu class*/
	var Menu = function(){
		return this.init.apply(this, arguments);
	};
	
	Menu.defaults = {
		top : 0,
		left : 0,
		parent : 'body'
	};
	
	Menu.uuid = 0;
	
	Menu.prototype = {
		constructor : Menu,
		
		init : function(options){
			var _this = this;
			
			var settings = $.extend({}, Menu.defaults, options);
			
			_this.menu_arr = settings.menu_arr || [];	//菜单项参数
			_this.menu_id = 'menu' + Menu.uuid++;		//标识菜单唯一的id
			_this.parent = $(settings.parent);			//父元素
			_this.child_menus = {};						//存储子菜单的数组
			_this.parent_menu = null;					//父菜单
			_this.top_menu = null;						//顶级菜单
			_this.menu_items = [];						//存储菜单项的数组
			
			_this.$bg = $('<div class="menu_bg" rel="menu"><div class="menu_bg_left"></div></div>');
			_this.$bg.css({top : settings.top, left : settings.left});
			
			_this.$menu = $('<div class="menu"></div>'); 
			
			_this.parent.append(_this.$bg.append(_this.$menu));
			
			_this.buildMenu();
			
			return _this;
		},
		
		//显示菜单：不同位置有不同的显示
		showMenu : function(offset){			
			var parent_width = this.parent.width(),
				menu_width = 156;
				
			var off_top = offset.top,
				off_left = offset.left;
			var menu_top = off_top,
				menu_left = off_left;
			
			var overflow = off_left + menu_width > parent_width;
			
			if(overflow){				
				if(this.parent_menu){
					menu_left = menu_left - menu_width*2 + 4;
				}else{
					menu_left = parent_width - menu_width;
				}				
			}
			
			this.$bg.css({top : menu_top + 'px', left : menu_left + 'px'});
			
			this.$bg.show();
			
			return this;
		},
		
		//隐藏菜单，同时要隐藏所有的子菜单
		hideMenu : function(){
			this.$bg.hide();
				
			for(p in this.child_menus){
				this.child_menus[p].hideMenu();
			}
								
			return this;
		},
		
		//添加菜单项，可以动态添加
		addMenuItem : function(menu_item, position){	
			var new_menu_item = new MenuItem(menu_item, this);
			
			var item_count = this.menu_items.length;
			var _this = this;
			
			if(new_menu_item.type == 2){
				new_menu_item.relatedMenu.setTarget(_this.target).resetZindex();
			}
			
			if(position < 0){
				position = 0;
			}
			
			if(position == undefined || position > item_count){
				position = item_count + 1;;
			}
			
			if(this.menu_items[position]){
				this.menu_items[position].$item.before(new_menu_item.$item);
			}else this.$menu.append(new_menu_item.$item);
			
			this.resizeMenu(new_menu_item, 'add');
			this.menu_items.splice(position, 0, new_menu_item);
			
			return this;
		},
		
		//删除菜单项，可以动态删除
		deleteMenuItem : function(position){
			var item_count = this.menu_items.length;
			
			if(position < 0){
				position = 0;
			}
			
			if(position == undefined || position > item_count){
				position = item_count;
			}
		
			var delete_item = this.menu_items[position];
			
			if(!delete_item) return;
			
			this.resizeMenu(delete_item, 'delete');
			
			if(delete_item.type == '2'){
				var menu_id = delete_item.relatedMenu.menu_id;
				var delete_menu = this.child_menus[menu_id];
				delete_menu.parent_menu = null;		//子菜单脱离后属性重置
				delete_menu.top_menu = null;
				delete_menu.target = null;
				
				delete this.child_menus[menu_id];
			}
			
			delete_item.$item.remove();
			this.menu_items.splice(position, 1);
			delete_item = undefined;
			
			return this;
		},
		
		//根据菜单参数构建菜单
		buildMenu : function(){
			var new_menu_item,
				_this = this,
				mr = this.menu_arr;
			
			for(var i = 0, l = mr.length; i < l; i++){
				new_menu_item = new MenuItem(mr[i], _this);	
		
				_this.menu_items.push(new_menu_item);
				_this.$menu.append(new_menu_item.$item);
				_this.resizeMenu(new_menu_item, 'add');
			}
			
			_this.resetZindex();
			
			return this;
		},
		
		//调整菜单的大小
		resizeMenu : function(menu_item, type){
			var ih;
			
			ih = menu_item.type == '3' ? 5 : menu_item.$item.height();
			
			var h = type == 'add' ? this.$menu.height() + ih : this.$menu.height()- ih;
			
			this.$menu.height(h);
			this.$bg.height(h + 2);
			
			return this;
		},
		
		//设置触发菜单的源，即在源上右键后可显示菜单,所有子菜单的源于顶级菜单的源保持一致
		setTarget : function(target){
			this.target = target;
		
			for(p in this.child_menus){
				this.child_menus[p].setTarget(target);
			}
			
			return this;
		},
		
		//调整菜单的层次
		resetZindex : function(){
			if(this.parent_menu){
				var zindex = Number(this.parent_menu.$bg.css('z-index'));
				this.$bg.css({'z-index' : zindex + 1});
			}
			 
			for(p in this.child_menus){
				this.child_menus[p].resetZindex();
			}
			
			return this;
		},
		
		//设置菜单的顶级菜单
		setTopMenu : function(){									
			if (!this.parent_menu.top_menu) {
				this.top_menu = this.parent_menu;
			}else{
				this.top_menu = this.parent_menu.top_menu;
			}
			
			for(p in this.child_menus){
				this.child_menus[p].setTopMenu();
			}
			
			return this;
		}

	};
	
	//在jquery对象上绑定菜单，同时该对象成为菜单的源
	$.fn.bindPopMenu = function(menu){
		menu.setTarget($(this));
	
		this.bind('contextmenu', function(e){
			menu.hideMenu();							  
			var offset = {top : e.pageY, left : e.pageX};
			menu.showMenu(offset);
			
			return false;
		});	
		
		$(document).click(function(e){
			var from = e.srcElement.className;
			
			if (from.indexOf('menu') == -1) {
				menu.hideMenu();
			};
		});
		
	};
	
	
	/*MenuItem class, 内部类*/
	var MenuItem = function(){
		return this.init.apply(this, arguments);
	};
	
	//菜单项的类型
	MenuItem.type = {
		NORMAL : 1,
		MENU : 2,
		LINE : 3
	};
	
	MenuItem.uuid = 0;	//标识菜单项的唯一id
	
	MenuItem.prototype = {
		constructor : MenuItem,
		
		init : function(){
			var _this = this;
			var menu_item = arguments[0];
			
			if (menu_item instanceof MenuItem) return menu_item;		//该句可省略
			
			var parent_menu = arguments[1] || null;
			
			_this.parent_menu = parent_menu;							//菜单项所属的菜单
			_this.menu_item_id = 'menu_item' + MenuItem.uuid++;			//菜单项的id
			_this.type = MenuItem.type[menu_item.type];              	//菜单项的类型		
			_this.icon_url = menu_item.icon_url || 'url(about:blank)';	//菜单项图标url
			_this.txt = menu_item.txt || '';							//菜单项的文字
			
			switch(_this.type){
				case 1:
					_this.createNormalItem(menu_item, parent_menu);
					break;
				case 2:
					_this.createChildmenuItem(menu_item, parent_menu);
					break;
				case 3:
					_this.createLineItem();
					break;
			}
			
			_this.$item.mouseover(function(){
				if(parent_menu.now_child_menu){
					parent_menu.now_child_menu.hideMenu();
					parent_menu.now_child_menu = null;
				}
				
				if(_this.hasChildMenu){						   					   
					var offset = _this.$item.offset();
					
					menu_item.child_menu.showMenu({
						top : offset.top - 2,   //微调
						left: offset.left + 152 //微调
					});
					
					parent_menu.now_child_menu = menu_item.child_menu;
				}
				
			});
				
			return _this;
		},
		
		createNormalItem : function(menu_item, parent_menu){
			var _this = this;
			_this.fn = menu_item.fn || null;	//菜单项点击后执行的方法
			
			_this.createItem();
				
			_this.hasChildMenu = false;			//普通菜单项无关联的子菜单
			
			_this.$item.click(function (){		//菜单项包含的jquery对象
				//执行方法，目前提供2个参数：菜单项元素, 下标, 可使用this获取源
				if(_this.fn) _this.fn.call(_this.parent_menu.target, _this.$item, _this.getSerialNumber());	
				
				if (parent_menu.top_menu) {
					parent_menu.top_menu.hideMenu();
				} else{
					parent_menu.hideMenu();
				};
			});
				
		},
		
		createChildmenuItem : function(menu_item, parent_menu){
			var _this = this;
			
			_this.createItem();
				
			var more_button = $('<div class="menu_more">></div>');
				_this.$item.append(more_button);
			
			var cm = menu_item.child_menu;   //子菜单
			
			_this.relatedMenu = cm;			//菜单项相关联的子菜单
			cm.parent_menu = parent_menu;	//设置父菜单
			cm.setTopMenu();				//设置顶级菜单
			
			var i = 0; 
			for(p in parent_menu.child_menus){
				i++;
			}
			parent_menu.child_menus[cm.menu_id] = cm; //父菜单上添加子菜单的引用
			
			_this.hasChildMenu = true;		//表示含有关联的子菜单
			
		},
		
		createItem : function(){
			var _this = this;
			
			var $item = $('<div class="menu_item" rel="menu_item"></div>');
				_this.$item = $item;
				
			var $icon = $('<i class="menu_icon"></i>');
				$icon.css({background : _this.icon_url}).appendTo(_this.$item);
				
			var $txt = $('<span class="menu_txt">' + _this.txt + '</span>');
				$txt.appendTo(_this.$item);
		},
		
		createLineItem : function(){
			var _this = this;
			
			var $item = $('<div class="menu_line"></div>');
				_this.$item = $item;
				
			_this.hasChildMenu = false;
		},
		
		//获取在菜单中的下标值
		getSerialNumber : function(){
			var items = this.parent_menu.menu_items;
			if(!items) return null;
			
			var s = 0;
			for(var i = 0, l = items.length; i < l; i++){
				if(items[i].type == 3)
					continue;
				
				if(items[i].menu_item_id == this.menu_item_id)
					return s;
					
				s++;
			}
			
			return null;
		}
	
		
	};
	
	$.PopMenu = Menu;	
	
})(jQuery);
