(function(resolveNamespace){
	
	JPlus.resolveNamespace = function(ns, isStyle){
		if(/^iplus\./i.test(ns)) {
			ns = ns.replace(/(\.[^.]+)$/, isStyle ? '.Styles$1' : '.Scripts$1');
		}
		
		return resolveNamespace(ns, isStyle);
	};
	
	
})(JPlus.resolveNamespace);