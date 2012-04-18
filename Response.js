function OctopusResponse() {
	if (!this instanceof OctopusResponse)
		return new OctopusResponse()
		
	var content = ''
	var headers = {}

	var status = '200'
	
	this.getStatus = function() {
		return status
	}
	
	this.setStatus = function(s) {
		if (s && parseInt(s) == s)
			status = s.toString()
	}
	
	this.write = function(str) {
		content += str.toString()
	}
	
	this.writeHead = function(o) {
		for (var head in o)
			if (typeof(o[head]) != 'function')
				headers[head] = o[head]
	}
	
	this.getContent = function() {
		return content
	}
	
	this.getHeaders = function() {
		var arr = []
		
		for (var key in headers) {
			arr.push([key,headers[key]])
		}
		
		for (var c in cookies) {
			arr.push(['Set-Cookie',cookies[c].toHeader()])
		}
		
		return arr
	}
	
	//cookie container
	var cookies = []
	
	this.setCookie = function(cookie) {
		cookies.push(cookie)
	}
	
	this.getCookie = function(cName) {
		for (var x=0;x<cookies.length;x=x+1)
			if (cookies[x].name.toLowerCase() == cName.toLowerCase())
				return cookies[x]
		return null
	}
	
	this.getCookies = function() {
		return cookies
	}
	
	this.clearContent = function() {
		content = ''
	}
	
	this.end = function(str) {
		content += str
	}
	
	this.cookies = []
}

module.exports = OctopusResponse
