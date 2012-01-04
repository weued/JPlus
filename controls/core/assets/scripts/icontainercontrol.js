//===========================================
//  可作为容器的控件接口   icontainercontrol.js         A
//===========================================


using("System.Data.Collection");



///  #region ControlCollection

/**
 * 控件集合。
 * @class ControlCollection
 */
Control.ControlCollection = Collection.extend({
		
	constructor: function(owner){
		this.owner = owner;
	},
	
	initItem: function(item){
		return this.owner.initItem(item);
	},
	
	onInsert: function(childControl, index){
		var me = this.owner;
		me.onControlAdded(childControl, index);
		childControl.parentControl = me;
	},
	
	onRemove: function(childControl, index){
		childControl.parentControl = null;
		this.owner.onControlRemoved(childControl);
	}
	
});


/// #endregion

/**
 * 可作为容器的控件接口。
 * @interface IContainerControl
 * <p>
 * 实现这个接口的函数必须实现 3个函数:
 * </p>
 * 
 * <p>
 * initItem(item)  onControlAdded(elem, index) 和  onControlRemoved(elem, index)
 * </p>
 * 
 * <p>
 * IContainerControl  为准备作为容器的控件提供接口。
 * 它会为对象生成 controls 属性，这个属性是一个 Control.ControlCollection 类型的值，并将管理当前控件的全部子控件:
 * <ul>
 * 		<li>初始化子元素 - 调用当前接口的  initItem 。模拟支持 add 重载，将 add 不是期望节点的参数转换为节点。 (默认会把字符串转到文本节点。)</li>
 * 		<li>增加子元素 - 调用当前接口的  onControlAdded 。</li>
 * 		<li>删除子元素 - 调用当前接口的  onControlRemoved 。   </li>说
 * </ul>
 * </p>
 * 
 * <p>
 * 这个接口不会干扰已经存在的类，必须在 init 内 手动调用   initChildren 。
 * </p>
 * 
 * <p>
 * 同时这个接口还会重写 appendChild 等系统函数， 让他们调用 controls.add 等。
 * </p>
 * 
 * <p>
 * 下面举个例子说明 IContainerControl 如何工作。
 * 
 * <ol>
 * 		<li>创建一个类 MyContainer, 并实现这个接口。</li>
 * 		<li>在 MyContainer的 init 成员内调用  this.initChildren('items') 。</li>
 * 		<li>创建 MyContainer类实例 mc 。</li>
 * 		<li>创建时候执行  mc.init 和   mc.initChildren ，并在 initChildren 内创建 mc.controls 。</li>
 * 		<li>调用 mc.appendChild('sth') 。</li>
 * 		<li>appendChild  被这个接口改写， 并调用   mc.controls.add(item) 。</li>
 * 		<li>mc.controls.add(item) 先调用  mc.controls.initItem(item) ，然后调用 mc.controls.onAdd(item)  。</li>
 * 		<li>mc.controls.initItem(item) 调用 mc.initItem(item) 。</li>
 * 		<li>默认的 mc.initItem(item)判断 item、 如果是字符串，则创建文本节点返回。如果 item.parentControl 不空，则调用item.parentControl.controls.remove(item)，返回 item。</li>
 * 		<li> mc.controls.onAdd(item) 调用 mc.onControlAdded(item, mc.controls.length) 。</li>
 * 		<li>默认的 onControlAdded(item) 调用  mc.dom.appendChild(item) 。</li>
 * </ol>
 * </p>
 * 
 */
namespace(".IContainerControl", {
	
	/**
	 * 获取目前所有子控件。
	 * @type {Control.ControlCollection}
	 * @name controls
	 */
	
	initItem: function(item){
		if(typeof item === 'string')
			return document.createTextNode(item);
		else if(item.parentControl)
			item.parentControl.controls.remove(item);    //   如果有指定父元素， 删除。
		return item;
	},
	
	onControlAdded: function(childControl, index){
		index = this.controls[index];
		this.dom.insertBefore(childControl.dom || childControl, index ? index.dom || index : null);
	},
	
	onControlRemoved: function(childControl, index){
		this.dom.removeChild(childControl.dom || childControl);
	},
	
	initChildren: function(alternativeName){
		this.controls = this[alternativeName] = new Control.ControlCollection(this);
	},
	
	/**
	 * 使用指定函数或 ID 获取指定的子控件。
	 * @param {String/Function} fn 查找的控件的ID/查找过滤的函数。
	 * @param {Boolean} child=true 是否深度查找。
	 * @return {Control} 控件。
	 */
	findControl: function(fn, child){
		if (typeof fn == 'string') {
			var id = fn;
			fn = function(ctrl) {
				return (ctrl.dom || ctrl).id === id;
			};
		}
			
		for(var controls = this.controls, i = 0; i < controls.length; i++){
			var ct = controls[i], r;
			if(fn(ct))
				return ct;
			
			if (child !== false && ct.findControl) {
				r = ct.findControl(fn, child);
				if(r)
					return r;
			}
		}
		
		
		return null;
		
	},
	
	/**
	 * 重写 appendChild ，实现将元素包装到 controls 内。
	 * @protected
	 * @virtual
	 */
	appendChild: function(childControl){
		return this.controls.add(childControl);
	},
	
	removeChild: function (childControl) {
		return this.controls.remove(childControl);
	},
	
	insertBefore: function (newControl, childControl) {
		return this.controls.insertAt(this.controls.indexOf(childControl), newControl);
	},
	
	replaceChild: function (newControl, childControl) {
		this.insertBefore(newControl, childControl);
		this.removeChild(childControl);
		return newControl;
	}
	
	
});