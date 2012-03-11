/**
 * @author xuld 
 */



using("System.Dom.Element");


/**
 * 为控件提供按控件定位的方法。
 * @interface
 */
Control.implement((function(){
	
	var setter1 = {
			
			l: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				var x = targetPosition.x - ctrlSize.x - offset;
				if(x <= documentPosition.x) {
					x = setter1.r(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, false);
				}
				
				return x;
			},
			
			r: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, checkOutOfRange) {
				var x = targetPosition.x + targetSize.x + offset;
				if(x + ctrlSize.x >= documentPosition.x + documentSize.x) {
					x = checkOutOfRange !== false ? setter1.l(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) : documentPosition.x;
				}
				
				return x;
			},
			
			c: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				return targetPosition.x + (targetSize.x - ctrlSize.x) / 2 + offset;
			},
			
			t: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				var y = targetPosition.y - ctrlSize.y - offset;
				if(y <= documentPosition.y) {
					y = setter1.b(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, false);
				}
				
				return y;
			},
			
			b: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, checkOutOfRange) {
				var y = targetPosition.y + targetSize.y + offset;
				if(y + ctrlSize.y >= documentPosition.y + documentSize.y) {
					if(checkOutOfRange === false) {
						if(ctrl.onOverflowY)
							ctrl.onOverflowY(documentSize.y);
						y = documentPosition.y;
					} else {
						y = setter1.t(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl);
					}
				}
				
				return y;
			}
			
		},
		
		setter2 = {
		
			l: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, checkOutOfRange) {
				var x = targetPosition.x + offset;
				if(x <= documentPosition.x) {
					x = checkOutOfRange !== false ? setter2.r(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) : documentPosition.x;
				}
				
				return x;
			},
			
			r: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				var x = targetPosition.x + targetSize.x - ctrlSize.x - offset;
				if(x <= documentPosition.x) {
					x = setter2.l(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl, false);
				}
				
				return x;
			},
			
			c: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				return targetPosition.y + (targetSize.y - ctrlSize.y) / 2 + offset;
			},
			
			t: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				var y = targetPosition.y + offset;
				if(y <= documentPosition.y) {
					if(checkOutOfRange === false) {
						if(ctrl.onOverflowY)
							ctrl.onOverflowY(documentSize.y);
						y = documentPosition.y;
					} else {
						y = setter2.b(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl);
					}
				}
				
				return y;
			},
			
			b: function (ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl) {
				var y = targetPosition.y + targetSize.y - ctrlSize.y - offset;
				if(y <= documentPosition.y) {
					y = setter2.t(ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offset, ctrl);
				}
				
				return y;
			}
			
		},
		
		setter = {
			bl: [setter2.l, setter1.b],
			rt: [setter1.r, setter2.t],
			rb: [setter1.r, setter2.b],
			lt: [setter1.l, setter2.t],
			lb: [setter1.l, setter2.b],
			br: [setter2.r, setter1.b],
			tr: [setter2.r, setter1.t],
			tl: [setter2.l, setter1.t],
			rc: [setter1.r, setter2.c],
			bc: [setter1.c, setter1.b],
			tc: [setter1.c, setter1.t],
			lc: [setter1.l, setter2.c],
			cc: [setter1.c, setter2.c],
			
			'lb-': [setter2.l, setter2.b],
			'rt-': [setter2.r, setter2.t],
			'rb-': [setter2.r, setter2.b],
			'lt-': [setter2.l, setter2.t],
			'rc-': [setter2.r, setter2.c],
			'bc-': [setter1.c, setter2.b],
			'tc-': [setter1.c, setter2.t],
			'lc-': [setter2.l, setter2.c],
			
			'lb^': [setter1.l, setter1.b],
			'rt^': [setter1.r, setter1.t],
			'rb^': [setter1.r, setter1.b],
			'lt^': [setter1.l, setter1.t]
			
		};
		
		/*
		 *      tl   tc   tr
		 *      ------------
		 *   lt |          | rt
		 *      |          |
		 *   lc |    cc    | rc
		 *      |          |
		 *   lb |          | rb
		 *      ------------
		 *      bl   bc   br
		 */
	
	return {
		
		/**
		 * 基于某个控件，设置当前控件的位置。改函数让控件显示都目标的右侧。
		 * @param {Controls} ctrl 目标的控件。
		 * @param {String} align 设置的位置。如 lt rt 。完整的说明见备注。
		 * @param {Number} offsetX 偏移的X大小。
		 * @param {Number} offsetY 偏移的y大小。
		 * @memberOf Control
		 */
		align: function (ctrl, position,  offsetX, offsetY) {
			var ctrlSize = this.getSize(),
				targetSize = ctrl.getSize(),
				targetPosition = ctrl.getPosition(),
				documentSize = document.getSize(),
				documentPosition = document.getPosition();
					
			assert(!position || position in setter, "Control.prototype.align(ctrl, position,  offsetX, offsetY): {position} 必须是 l r c 和 t b c 的组合。如 lt", position);
				
			position = setter[position] || setter.lb;
			
			this.setPosition(
				position[0](ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offsetX || 0, this),
				position[1](ctrlSize, targetSize, targetPosition, documentSize, documentPosition, offsetY || 0, this)
			);
		}
		
	};
	
})());

