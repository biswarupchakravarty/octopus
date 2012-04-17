function Cookie(options) {
	
	if (!this instanceof Cookie)
		return new Cookie()
	
	options = options || {}
		
	this.name = options.name || ''
	this.value = options.value || ''
	
	this.path = options.path || ''
	this.expires = options.expires || new Date()
	this.domain = options.domain || ''
	this.secure = options.secure || ''
	this.httpOnly = options.httpOnly || ''
	
	this.toString = function() {
		return this.name + "=" + this.value
	}
  
	this.toHeader = function() {
		var header = this.toString()
/*
		if ( this.path      ) header += '; path=' + this.path
		if ( this.expires   ) header += '; expires=' + this.expires.toUTCString()
		if ( this.domain    ) header += '; domain=' + this.domain
		if ( this.secure    ) header += '; secure'
		if ( this.httpOnly  ) header += '; httponly'
*/
		return header
	}
}

exports.cookie = Cookie

function CookieCollection() {
	if (!this instanceof CookieCollection)
		return new CookieCollection()
		
	var cookies = []
	
	this.getAll = function() {
		return cookies
	}
	
	this.get = function(name) {
		if (!name)
			var name = ''
		
		for (var x=0 ; x < cookies.length ; x=x+1) {
			if(cookies[x].name.toLowerCase() == name.toLowerCase()) {
				return cookies[x]
			}
		}
		
		return null
	}
}
