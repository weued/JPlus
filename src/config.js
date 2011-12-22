

// 默认配置。可以删除以下代码。

/**
 * @type Object
 */
var JPlus = {

    /**
	 * 是否打开调试。
	 * @config {Boolean}
	 */
    debug: true,

    /**
	 * 根目录。(需要末尾追加 /)
	 * @config {String} 程序会自动搜索当前脚本的位置为跟目录。
	 */
    rootPath: undefined,

    /**
	 * 是否输出 assert 来源。
	 * @config {Boolean}
	 * @value false 如果此项是 true， 将会输出 assert 失败时的来源函数。
	 */
    stackTrace: false,

    /**
	 * 默认的全局名字空间。
	 * @config {Object}
	 * @value window
	 */
    defaultNamespace: 'JPlus'

};
