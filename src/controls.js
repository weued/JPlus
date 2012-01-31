

using("System.Dom.Element");

JPlus.resolveNamespace = (function(resolveNamespace){
	
	return function(ns, isStyle){
		if(/^controls\./.test(ns)) {
			return '../' + ns.replace(/(\.[^.]+)$/, isStyle ? '.assets.styles$1' : '.assets.scripts$1').replace(/\./g, '/');
		}
		
		return resolveNamespace(ns, isStyle);
	};
	
	
})(JPlus.resolveNamespace);