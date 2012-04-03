Array.prototype.contains = function(obj) {
	var _reg = 0, t = this, i = t.length;
	while(i--) { //!== 0
		if(t[i] === obj) {
			_reg++;
		}
	}
return _reg;
};
String.prototype.replaceAll = function(token, newToken, ignoreCase) {
	var str, i = -1, _token;
	if((str = this.toString()) && typeof token === "string") {
		_token = ignoreCase === true? token.toLowerCase() : undefined;
		while((i = (
			_token !== undefined? 
				str.toLowerCase().indexOf(
							_token, 
							i >= 0? i + newToken.length : 0
				) : str.indexOf(
							token,
							i >= 0? i + newToken.length : 0
				)
		)) !== -1 ) {
		    str = str.substring(0, i)
		    		.concat(newToken)
		    		.concat(str.substring(i + token.length));
		}
	}
return str;
};
String.prototype.contains = function(token, ignoreCase) {
	var _reg = 0, str = this.toString(), i;
	if(str && typeof token === "string") {
		if(ignoreCase === true) {
			token = token.toLowerCase();
			str = str.toLowerCase();
		}
		while((i = str.indexOf(token)) !== -1) {
			str = str.substring(i + token.length);
			_reg++;
		}
	}
	return _reg;
};