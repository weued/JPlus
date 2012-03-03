/** * @author  */using("System.Dom.Element");Dom.autoResizeTextArea = function (dom) {
	dom = Dom.get(dom);	dom.setStyle('overflow', 'hidden')		.on('keypress', autoResize);			autoResize.call(dom);				function autoResize() {		this.setHeight('auto');
		this.setHeight(this.getScrollSize().y);
	}
};