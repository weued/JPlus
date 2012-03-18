/** * @author  */using("Controls.Container.Tabbable");var TabControl = ScrollableControl.extend({		activedTab: null,		initChild: function (item) {
		if(item instanceof TabPage || item instanceof ContainerControl)			return item;				var p = new TabPage();		p.append(item);		return p;
	},		onControlAdded: function (childControl, index) {
		this.tabbable.items.insert(childControl.getTitle(), index).container = childControl.container;		childControl.container.attach(this.dom, null);				if(this.activedTab){			childControl.hide();		} else {			this.activedTab = childControl;			childControl.show();		}			
	},		onControlremoved: function (childControl, index) {		this.tabbable.items.removeAt(index);		childControl.container.attach(this.dom, null);				if(this.activedTab && this.activedTab.container == childControl){			this.setSelectedTab(this.tabbable(index - 1));		} else {			this.activedTab = childControl;			childControl.show();		}				},		setSelectedTab: function (tab) {
	
	},		onSelectTab: function (tab) {
		this.activedTab = '';
	},	init: function () {
		this.tabbable = new Tabbable(this.find('.x-tabbable'));		this.tabbable.on('select', this.onSelectTab);		this.tabPages = this.controls;		this.query('.x-tabcontrol-container').each(function(value, index){			this.tabbable[index].container = Dom.get(value);		}, this);
	}});var TabPage = Control.extend({		tpl: '<div class="x-tabcontrols-container"></div>',		title: '',		setTitle: function (value) {
		this.title = value;		return this;
	},		getTitle: function (value) {		return this.title;	},		init: function () {
	  this.container = rhis;
	}	});