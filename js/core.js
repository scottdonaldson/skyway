var SKY = function(selector) {
	if (typeof selector === 'string') {
		var returned = (selector.split(' ').length === 1 && selector.slice(0, 1) === '#') ?
			document.getElementById( selector.slice(1) ) :
			document.querySelectorAll(selector);

		return (returned) ? returned : selector;

	} else {
		return selector;
	}
}

SKY.commas = function(string) {

	string += '';
	x = string.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2; 
}