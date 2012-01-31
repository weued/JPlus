//===========================================
//  使类有存储数据功能   idatastore.js   A
//===========================================


/**
 * 使类具有存储的方法。
 * @interface Py.IDataStore
 */
namespace('.IDataStore', {
	
	/**
	 * 获取属于一个元素的数据。
	 * @method data
	 * @param {String} type 类型。
	 * @return {Object} 值。
	 */
	getData: function(type){
		return Py.data(this, type);
	},
	
	/**
	 * 如果存在，获取属于一个元素的数据。
	 * @method getData
	 * @param {String} type 类型。
	 * @return {Object} 值。
	 */
	getgetData: function(type){
		return Py.getData(this, type);
	},
	
	/**
	 * 设置属于一个元素的数据。
	 * @method setData
	 * @param {Object} obj 元素。
	 * @param {Number/String} type 类型。
	 * @param {mixed} data 内容。
	 */
	setData: function(type, data){
		return Py.setData(this, type, data);
	},
	
	/**
	 * 删除属于一个元素的数据。
	 * @param {String} [type] 类型。
	 */
	removeData: function(type) {
		if(this.data) {
			if(type)
				delete this.data[type];
			else
				delete this.data;
		}
	},
	
	cloneDataTo: function(dest){
		return Py.cloneData(dest, this);
	}
});
