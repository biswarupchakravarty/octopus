var guid = require('./Guid')


var defaultHandler = function(request, response) {
			response.writeHead(200, {'Content-Type': 'text/plain'})
			response.write('This is the default handler mapping. You can insert your custom handlers in the \
								handlers array of the WebApplication section. Each handler is an object that \
								contains the \'mapping\' of the handler (ex. .html, .jpg etc) and the handler itself \
								which is a function accepting the request and the response')
}

function WebApplication(options) {
	if (!this instanceof WebApplication) {
		return new WebApplication();
	}
	
	options = options || {}
	
	this.filters = options.filters || []
	this.name = options.name || 'DefaultWebApplication'
	this.root = options.root || 'octopus'
	this.router = options.router || [{
		canHandle: function(url) { return true },
		handler: defaultHandler
	}]
	
	this.resourceHandlers = options.resourceHandlers || [{
		mapping: '*.*',
		handler: defaultHandler
	}]
	
	this.onStartup = options.onStartup || function(){}
	this.onShutdown = options.onShutdown || function(){}
	
	this.id = guid()
	this.active = false
	
	//reference to the server
	this.server = {}
	
	this.start = function() {
		if (this.server)
			this.server.startApplication(this)
		return this
	}
	
	this.stop = function() {
		if (this.server)
			this.server.stopApplication(this)
		return this
	}
}

module.exports = WebApplication;
