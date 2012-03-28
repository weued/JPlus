(function(w) {
	var dom = {
		quote: function(str) {
			str = str.replace(/[\x00-\x1f\\]/g,
			function(chr) {
				var special = metaObject[chr];
				return special ? special: '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice( - 4)
			});
			return str.replace(/"/g, '\\"');
		}
	},
	metaObject = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'\\': '\\\\'
	};
	w.Template = Template || {};
	function Template(options) {
		return this instanceof arguments.callee ? this.init(options) : new arguments.callee(options);
	}
	Template.parse = function(self) {
		var temp;
		if (self.right == "}}") {
			temp = self.tpl.replace(/(}})([^}])/g,
			function() {
				return arguments[1] + " " + arguments[2];
			}).split(new RegExp('(?=' + self.left + ')|(' + self.right + ')(?:[^}])'));
		} else {
			temp = self.tpl.split(new RegExp('(?=' + self.left + ')|(' + self.right + ')'));
		}
		temp.filter(function(k, v) {
			return ! (new RegExp(self.right)).test(v);
		}).each(function(k, v) {
			if ((new RegExp('^' + self.left)).test(v)) {
				if (new RegExp('^' + self.left + '\s*=').test(v)) {
					self.body.push(v.replace(new RegExp('^' + self.left + '\s*=(.*)'), '\ttemp.push($1);\n').replace(/\\n/g, ''));
				} else {
					self.body.push(v.replace(new RegExp('^' + self.left + '\s*(.*)'), '$1\n').replace(/\\n/g, ''));
				}
			} else {
				self.body.push('\ttemp.push(\"' + v.replace(/\n|\t/g, '') + '\");\n');
			}
		});
		return self.body.join("");
	};
	Template.prototype = {
		init: function(options) {
			this.tpl = dom.quote(options.tpl);
			this.left = options.left || "{{";
			this.right = options.right || "}}";
			this.namespace = options.namespace || "data";
			this.body = [];
			this.compiled = "";
			this.data = options.data;
		},
		compile: function() {
			if (!this.compiled) {
				this.compiled = new Function(this.namespace, 'var temp=[];\n' + Template.parse(this) + '\n return  temp.join("");');
			}
			return this.compiled;
		},
		render: function(data) {
			return this.compile()(data||this.data);
		}
	}
})(window);
Array.prototype.filter = function(fn) {
	var temp = [];
	for (var i = 0,
	l = this.length; i < l; i++) {
		this[i] && fn.call(this, i, this[i]) && temp.push(this[i]);
	}
	return temp;
}
Array.prototype.each = function(fn) {
	var temp = [];
	for (var i = 0,
	l = this.length; i < l; i++) {
		fn.call(this, i, this[i]);
	}
	return this;
}