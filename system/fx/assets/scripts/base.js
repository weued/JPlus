/**
 * @fileOverview 提供底层的 特效算法支持。
 * @author xuld
 */


var Fx = Fx || {};

/**
 * 实现特效。
 * @class Fx.Base
 * @abstract
 */
Fx.Base = (function(){
	
	
	/// #region interval
	
	var cache = {};
	
	/**
	 * 定时执行的函数。
	 */
	function interval(){
		var i = this.length;
		while(--i >= 0)
			this[i].step();
	}
	
	/// #endregion
		
	/**
	 * @namespace Fx
	 */
	return Class({
	
		/**
		 * 每秒的运行帧次。
		 * @type {Number}
		 */
		fps: 50,
		
		/**
		 * 总运行时间。 (单位:  毫秒)
		 * @type {Number}
		 */
		duration: 500,
		
		/**
		 * 在特效运行时，第二个特效的执行方式。 可以为 'ignore' 'cancel' 'wait' 'restart' 'replace'
		 * @type {String}
		 */
		link: 'ignore',
		
		/**
		 * xType
		 * @type {String}
		 */
		xType: 'fx',
		
		/**
		 * 初始化当前特效。
		 * @param {Object} options 选项。
		 */
		constructor: function() {
			this._competeListeners = [];
		},
		
		/**
		 * 实现变化。
		 * @param {Object} p 值。
		 * @return {Object} p 变化值。
		 */
		transition: function(p) {
			return -(Math.cos(Math.PI * p) - 1) / 2;
		},
		
		/**
		 * 当被子类重写时，实现生成当前变化所进行的初始状态。
		 * @param {Object} from 开始位置。
		 * @param {Object} to 结束位置。
		 * @return {Base} this
		 */
		compile: function(from, to) {
			var me = this;
			me.from = from;
			me.to = to;
			return me;
		},
		
		/**
		 * 进入变换的下步。
		 */
		step: function() {
			var me = this, time = Date.now() - me.time;
			if (time < me.duration) {
				me.set(me.transition(time / me.duration));
			}  else {
				me.set(1);
				me.complete();
			}
		},
		
		/**
		 * @event step 当进度改变时触发。
		 * @param {Number} value 当前进度值。
		 */
		
		/**
		 * 根据指定变化量设置值。
		 * @param {Number} delta 变化量。 0 - 1 。
		 * @abstract
		 */
		set: function(value){
			this.trigger('step', Fx.compute(this.from, this.to, value));
		},
		
		/**
		 * 增加完成后的回调工具。
		 * @param {Function} fn 回调函数。
		 */
		ready: function(fn){
			assert.isFunction(fn, "Fx.Base.prototype.ready(fn): 参数 {fn} ~。    ");
			this._competeListeners.unshift(fn);	
			return this;
		},
		
		/**
		 * 检查当前的运行状态。
		 * @param {Object} from 开始位置。
		 * @param {Object} to 结束位置。
		 * @param {Number} duration=-1 变化的时间。
		 * @param {Function} [onStop] 停止回调。
		 * @param {Function} [onStart] 开始回调。
		 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 reset 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。 replace 直接替换成新的渐变。
		 * @return {Boolean} 是否可发。
		 */
		delay: function() {
			var me = this, args = arguments;
			
			//如正在运行。
			if(me.timer){
				switch (args[5] || me.link) {
					
					// 链式。
					case 'wait':
						this._competeListeners.unshift(function() {
							
							this.start.apply(this, args);
							return false;
						});
						
						//  如当前fx完成， 会执行 _competeListeners 。
						
						//  [新任务开始2, 新任务开始1]
						
						//  [新任务开始2, 回调函数] 
						
						//  [新任务开始2]
						
						//  []
						
						return false;
						
					case 'reset':
						me.pause();
						while(me._competeListeners.pop());
						break;
						
					// 停掉目前项。
					case 'cancel':
						me.stop();
						break;
						
					case 'replace':
						me.pause();
						break;
						
					// 忽视新项。
					default:
						return false;
				}
			}
			
			return true;
		},
		
		/**
		 * 开始运行特效。
		 * @param {Object} from 开始位置。
		 * @param {Object} to 结束位置。
		 * @param {Number} duration=-1 变化的时间。
		 * @param {Function} [onStop] 停止回调。
		 * @param {Function} [onStart] 开始回调。
		 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
		 * @return {Base} this
		 */
		start: function() {
			var me = this, args = arguments;
			
			if (!me.timer || me.delay.apply(me, args)) {
				
				// 如果 duration > 0  更新。
				if (args[2] > 0) this.duration = args[2];
				else if(args[2] < -1) this.duration /= -args[2];
				
				// 存储 onStop
				if (args[3]) {
					assert.isFunction(args[3], "Fx.Base.prototype.start(from, to, duration, onStop, onStart, link): 参数 {callback} ~。      ");
					me._competeListeners.push(args[3]);
				}
				
				// 执行 onStart
				if (args[4] && args[4].apply(me, args) === false) {
					return me.complete();
				}
			
				// 设置时间
				me.time = 0;
				
				me.compile(args[0], args[1]).set(0);
				me.resume();
			}
			return me;
		},
		
		/**
		 * 完成当前效果。
		 */
		complete: function() {
			var me = this;
			me.pause();
			var handlers = me._competeListeners;
			while(handlers.length)  {
				if(handlers.pop().call(me) === false)
					return me;
			}
			
			return me;
		},
		
		/**
		 * 中断当前效果。
		 */
		stop: function() {
			var me = this;
			me.set(1);
			me.pause();
			return me;
		},
		
		/**
		 * 暂停当前效果。
		 */
		pause: function() {
			var me = this;
			if (me.timer) {
				me.time = Date.now() - me.time;
				var fps = me.fps, value = cache[fps];
				value.remove(me);
				if (value.length === 0) {
					clearInterval(me.timer);
					delete cache[fps];
				}
				me.timer = undefined;
			}
			return me;
		},
		
		/**
		 * 恢复当前效果。
		 */
		resume: function() {
			var me = this;
			if (!me.timer) {
				me.time = Date.now() - me.time;
				var fps = me.fps, value = cache[fps];
				if(value){
					value.push(me);
					me.timer = value[0].timer;
				}else{
					me.timer = setInterval(Function.bind(interval, cache[fps] = [me]), Math.round(1000 / fps ));
				}
			}
			return me;
		}
		
	});
	

})();

/**
 * 常用计算。
 * @param {Object} from 开始。
 * @param {Object} to 结束。
 * @param {Object} delta 变化。
 */
Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};