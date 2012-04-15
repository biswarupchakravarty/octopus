var http = require('http')
var webapp = require('./WebApplication')
var url = require('url')
var OctopusResponse = require('./Response')

var error404Handler = require('./DefaultHandlers').error404Handler
var error500Handler = require('./DefaultHandlers').error500Handler
var defaultHandler = require('./DefaultHandlers').defaultHandler
var failSafeHandler = require('./DefaultHandlers').failSafeHandler

function Octopus(port) {
	if (!this instanceof Octopus)
		return new Octopus()
	
	port = port || 8080

	var applications = []
	
	var serverAction = function(req, resp) {
		//create response object
		var response = new OctopusResponse()
		
		//get handler
		var handler = getHandler(req.url)
		
		//execute handler
		handler(req, response)
		
		//write the headers
		resp.writeHead(response.getStatus(), response.getHeaders())
		
		//write contents and end request
		resp.end(response.getContent())
	}
	
	var server = http
					.createServer(serverAction)
					.listen(port)
	
	
	
	
	//delegation login
	var getHandler = function(requestUrl) {
		requestUrl = url.parse(requestUrl)
		var segments = []
		for (var x=0;x<requestUrl.pathname.split('/').length;x=x+1)
			if (requestUrl.pathname.split('/')[x].length != 0)
				segments.push(requestUrl.pathname.split('/')[x])
				
		if (segments.length < 1 || segments[0].indexOf('.') != -1)
			return defaultHandler
		
		for (var x=0;x<applications.length;x=x+1) {
			if (applications[x].active && applications[x].root.toLowerCase() == segments[0].toLowerCase()) {
				var app = applications[x]
				//handle resource requests
				//TODO
				
				//handle non resource requests
				for (var y=0;y<app.router.length;y=y+1) 
						if (app.router[y].canHandle(requestUrl.pathname))
							return failSafeHandler(app.router[y].handler)

			}
		}
		return error404Handler;
	}
	
	//start a webapplication
	this.startApplication = function(app) {
		if (!app || !app.id) return
		
		try {
			for (var x=0;x<applications.length;x=x+1)
				if (applications[x].active == false && applications[x].id === app.id) {
					applications[x].onStartup()
					applications[x].active = true
					console.log('Successfully started application with id: ' + app.id)
				}
		} catch(e) {
			console.log('Failed to start application with id: ' + app.id)
		}
	}
	
	//stop a webapplication
	this.stopApplication = function(app) {
		if (!app || !app.id) return
				
		try {
			for (var x=0;x<applications.length;x=x+1) 
				if (applications[x].active == true && applications[x].id === app.id) { 
					applications[x].onShutdown()
					applications[x].active = false					
					console.log('Successfully stopped application with id: ' + app.id)
				}
		} catch(e) {
			console.log('Failed to stop application with id: ' + app.id)			
		}
	}
	
	//creates a new webapplication and returns it after registering it
	this.newApplication = function(options) {
		var app = new webapp(options)
		app.server = this
		applications.push(app)
		
		return app
	}
}

//single instance
var singleton = new Octopus()

exports.server = singleton
