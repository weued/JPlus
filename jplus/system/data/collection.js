//===========================================
//  集合
//===========================================


(function(){	
	
	/**
	 * 集合。
	 * @class Collection
	 */
	namespace(".Collection", Class({
		
		/**
		 * 获取当前的项数目。
		 */
		length: 0,
		
		/**
		 * 对项初始化。
		 * @protected
		 * @virtual
		 */
		initItem: function (item) {
			return item;
		},
		
		onAdd: function(item){
			return this.onInsert(item, this.length);
		},
	
		onInsert: Function.empty,
		
		onRemove: Function.empty,
		
		onBeforeSet: Function.empty,
		
		onAfterSet: Function.empty,
		
		add: function(item){
			Array.prototype.push.call(this, item = this.initItem(item));
			this.onAdd(item);
			return item;
		},
		
		addRange: function(args){
			
			
			var v = Array.isArray(args) ? args : arguments;
			this.onBeforeSet(args);
			Array.prototype.forEach.call(v, this.add, this);
			this.onAfterSet(v);
		},
		
		insertAt: function(index, item){
			
			Array.prototype.insert.call(this, index, item = this.initItem(item));
			
			this.onInsert(item, index + 1);
			
			return item;
		},
		
		clear: function(){
			this.onBeforeSet(index);
			clear(this);
			this.onAfterSet(index);
				
			return this;
		},
		
		remove: function(item){
			var index = this.indexOf(item);
			this.removeAt(index);
			return index;
		},
		
		removeAt: function(index){
			var item = this[index];
			if(item){
				Array.prototype.splice.call(this, index, 1);
				delete this[this.length];
				this.onRemove(item, index);
			}
				
			return item;
		},
			
		set: function(index, item){
			this.onBeforeSet(index);
			if(typeof index == 'number'){
				assert(index >= 0 && index < this.length, '设置的 index 超出范围。请确保 {0} <= index < {1}', 0, this.length);
				this.onInsert(item, index);
				this.onRemove(this[index], index);
				this[index] = item;
			} else{
				clear(this);
				index.forEach(this.add, this);
			}
			this.onAfterSet(index);
			return this;
		}
			
	}));
	
	String.map("indexOf contains forEach each invoke lastIndexOf", Array.prototype, Collection.prototype);
	
	function clear(arr){
		while (arr.length) {
			var item = arr[--arr.length];
			delete arr[arr.length];
			arr.onRemove(item, arr.length);
		}
	}

})();
