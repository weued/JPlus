

function initTreeView(list){
	document.write('<ul>');
	for(var item in list) {
		document.write('<li>');
		if(typeof list[item] === 'string'){
			document.write('<a href="' + list[item] + '" target="_blank">');
			item = item.split(/\s*-\s*/);
			if(item[0].charAt(0) === '#') {
				document.write('<b>');
				document.write(item[0].substring(1));
				document.write('</b>');
			} else {
				document.write(item[0]);
			}
			
			document.write('</a>');
			if(item[1]) {
				document.write('<span> - <i>');
				document.write(item[1]);
				document.write('</i></span>');
			}
		} else {
			document.write(item);
			initTreeView(list[item]);
		}
		document.write('</li>');
	}
	document.write('</ul>');
}