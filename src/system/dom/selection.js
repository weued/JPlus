//===========================================
//  元素的选区       selection.js       A
//===========================================



(function() {

	function getSelection(textBox) {
		return textBox.tagName == "TEXTAREA" ? textBox.createTextRange() : document.selection.createRange();
	}
	
	Element.implement({
		
		/**
		 * 选中一个文本框从 start 到 end 的内容。
		 */
		selectRange: 'selection' in document ? function(start, end) {
			var me = this.dom || this;
			me.select();
			var r =  document.selection.createRange() ; //   getSelection(textBox);
			r.moveStart("character", start);
			r.moveEnd("character", end);
			r.select();
			/*

			 range.collapse(true);
			 range.moveStart('character', -0x7FFFFFFF);//Move to the beginning
			 range.moveStart('character', start);
			 range.moveEnd('character', length);

			 */
		} : function(start, end) {
			var me = this.dom || this;
			me.select();
			me.selectionEnd = end;
			me.selectionStart = start;
		},
	
	/*
	
		selectRange: function(start, end){
			if (this.setSelectionRange){
				this.focus();
				this.setSelectionRange(start, end);
			} else {
				var value = this.get('value');
				var diff = value.substr(start, end - start).replace(/\r/g, '').length;
				start = value.substr(0, start).replace(/\r/g, '').length;
				var range = this.createTextRange();
				range.collapse(true);
				range.moveEnd('character', start + diff);
				range.moveStart('character', start);
				range.select();
			}
			return this;
		},
		
	 */
	
		/**
		 * 设置文本框的光标的位置。
		 */
		setCaretPosition: function(pos){
			if (pos == 'end') pos = this.get('value').length;
			this.selectRange(pos, pos);
			return this;
		},
	
	
		/**
		 * 在光标位置插入一段内容。
		 * @param {String} value 内容
		 * @param {Boolean} select=true 是否选中。
		 */
		insertAtCursor: function(value, select){
			var pos = this.getSelectedRange();
			var text = this.get('value');
			this.set('value', text.substring(0, pos.start) + value + text.substring(pos.end, text.length));
			if (select !== false) this.selectRange(pos.start, pos.start + value.length);
			else this.setCaretPosition(pos.start + value.length);
			return this;
		},
	
		/**
		 * 在光标后面插入文字，并选中指定的位置。
		 * @param {String} value 内容
		 * @param {Boolean} replace=true 是否删除光标末尾的内容。
		 * @param {Boolean} select=true 是否选中。
		 */
		insertAfterCursor: function(value, replace, select){
			options = Object.append({
				before: '',
				defaultMiddle: '',
				after: ''
			}, options);
	
			var value = this.getSelectedText() || options.defaultMiddle;
			var pos = this.getSelectedRange();
			var text = this.get('value');
	
			if (pos.start == pos.end){
				this.set('value', text.substring(0, pos.start) + options.before + value + options.after + text.substring(pos.end, text.length));
				this.selectRange(pos.start + options.before.length, pos.end + options.before.length + value.length);
			} else {
				var current = text.substring(pos.start, pos.end);
				this.set('value', text.substring(0, pos.start) + options.before + current + options.after + text.substring(pos.end, text.length));
				var selStart = pos.start + options.before.length;
				if (select !== false) this.selectRange(selStart, selStart + current.length);
				else this.setCaretPosition(selStart + text.length);
			}
			return this;
		},

		deselect: function (argument) {
			
		}
		
	}, 2)
	
	.implement({
	
		/**
		 * 获取文本框的光标位置。
		 */
		getCaretPosition: function(){
			return this.getSelectedRange().start;
		},
	
		/*
		
		
		
		getCaretPosition: 'selection' in document ? function(textBox) {
			var r = getSelection(textBox);
			r.moveStart("character", -textBox.value.length);
			return r.text.length;
		} : function(textBox) {
			return textBox.selectionStart;
		},
		
		
		setCaretPosition: function(textBox, position) {
			Element.select(textBox, position, position);
		},
		
		
		getSelectedText: function(){
			if (this.setSelectionRange) return this.getTextInRange(this.getSelectionStart(), this.getSelectionEnd());
			return document.selection.createRange().text;
		},
		
		
		*/
		
		
	
		/**
		 * 获取选中的文本。
		 */
		getSelectedText: function(){
			if (this.setSelectionRange) return this.getTextInRange(this.getSelectionStart(), this.getSelectionEnd());
			return document.selection.createRange().text;
		},
	
		getSelectedRange: function(){
			if (this.selectionStart != null){
				return {
					start: this.selectionStart,
					end: this.selectionEnd
				};
			}
	
			var pos = {
				start: 0,
				end: 0
			};
			var range = this.getDocument().selection.createRange();
			if (!range || range.parentElement() != this) return pos;
			var duplicate = range.duplicate();
	
			if (this.type == 'text'){
				pos.start = 0 - duplicate.moveStart('character', -100000);
				pos.end = pos.start + range.text.length;
			} else {
				var value = this.get('value');
				var offset = value.length;
				duplicate.moveToElementText(this);
				duplicate.setEndPoint('StartToEnd', range);
				if (duplicate.text.length) offset -= value.match(/[\n\r]*$/)[0].length;
				pos.end = offset - duplicate.text.length;
				duplicate.setEndPoint('StartToStart', range);
				pos.start = offset - duplicate.text.length;
			}
			return pos;
		}
		
	});

})();