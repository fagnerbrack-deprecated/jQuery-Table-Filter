Array.prototype.contains = function(vl) {
	var _reg = 0;
	for(var i = 0; i<this.length; i++) {
		if(this[i] === vl) {
			_reg++;
		}
	}
return _reg;
};
/**
 * ReplaceAll by Fagner Brack (MIT Licensed)
 * Replaces all occurrences of a substring in a string
 */
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
     var _reg = 0;
     
     if(token) {
	     var str = (ignoreCase === true)? this.toUpperCase(): this.toString();
	     token = (ignoreCase === true)? token.toUpperCase(): token;
	     
	     //char
	     if(str.length === 1) {
	         for(var i = 0; i<str.length; i++) {
	             if(str[i] == token) {
	                 _reg++;
	             }
	         }
	     } else {// substring
	         var arr = [];
	         var i = -1;
	         while(str && (i = str.indexOf(token)) != -1) {
	             arr.push(str.substring(i, i + token.length));
	             str = str.substring(i + token.length);
	         }
	     _reg = arr.length;
	     }
     }
 return _reg;
 };