Array.prototype.contains = function(vl) {
	var _reg = 0;
	for(var i = 0; i<this.length; i++) {
		if(this[i] === vl) {
			_reg++;
		}
	}
return _reg;
};
String.prototype.replaceAll = function(token, newToken, ignoreCase) {
	var str = this.toString();
	if(str && token) {
		if(ignoreCase === true) {
			var i = -1;
			while((i = str.toUpperCase().indexOf(token.toUpperCase())) != -1) {
			    var sb = new syoStringBuilder();
			    sb.append(str.substring(0, i));
				sb.append(newToken);
				sb.append(str.substring(i + token.length));
			    str = sb.getString();
			}
		} else {
			while(str.indexOf(token) != -1) {
				str = str.replace(token, newToken);
			}
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