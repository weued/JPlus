

JPlus.resolveNamespace = (function(resolveNamespace){
	
	return function(ns, isStyle){
		if(/^uplus\./.test(ns)) {
			return '../' + ns.replace(/(\.[^.]+)$/, isStyle ? '.Styles$1' : '.Scripts$1').replace(/\./g, '/');
		}
		
		return resolveNamespace(ns, isStyle);
	};
	
	
})(JPlus.resolveNamespace);