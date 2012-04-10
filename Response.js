function OctopusResponse() {
	if (!this instanceof OctopusResponse)
		return new OctopusResponse()
		
	var content = ''
	var headers = {}

	var status = '200'
	
	this.getStatus = function() {return status }
	this.setStatus = function(s) { if (s && parseInt(s) == s) status = s.toString()}
	
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
		return headers
	}
	
	this.clearContent = function() {
		content = ''
	}
	
	this.end = function(str) {
		content += str
	}
}

module.exports = OctopusResponse
