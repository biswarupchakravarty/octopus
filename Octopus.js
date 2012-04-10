var http = require('http')
var webapp = require('./WebApplication')
var url = require('url')



function Octopus(port) {
	port = port || 8080

	var that = {}
	var applications = []
	
	
	//the internal handle to the actual webserver
	var server = http.createServer(function(req, resp) {
			getHandler(req.url)(req, resp)
		})
	.listen(port)
	
	
	//default handler
	var defaultHandler = function(req, resp) {
		console.log('root hit for: ' + req.url)
		
		resp.writeHead(200, {'Content-Type': 'text/html'})
		resp.end('<h1>Hello World</h1><p>This is the default page of the Octopus server.</p>')
	}
	
	//404 handler
	var four04Handler = function(req, resp) {
		console.log('404 hit for: ' + req.url)
		
		resp.writeHead(404, {'Content-Type': 'text/html'})
		resp.end('<h1>404, bummer :(</h1><p>Could not find the application you were looking for.</p>')
	}
	
	//500 error handler
	var errHandler = function(req, resp, err) {
		console.log('500 hit for: ' + req.url)
		
		resp.writeHead({'Content-Type': 'text/html'})
		resp.write('<h1>Damn! 500 internal server error</h1><p>Your application code bugged out you noob</p>')
		if (err !== undefined)
			resp.write('<p>Here\'s the offending error: <span style="color: red">' + err + '</span></p>')
	}
	
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
				for (var y=0;y<app.router.length;y=y+1) {
						if (app.router[y].canHandle(requestUrl))
							return function (req, resp) {
								var newResponse = new Response()
								try {
									app.router[y].handler(req, newResponse)
									console.log('wrote ' + parseFloat(newResponse.getContent().length/1024).toFixed(3) + 'kb for ' + req.url)
								} catch(e) {
									newResponse.clearContent()
									errHandler(req, newResponse, e)
								} finally {
									resp.writeHead(200, newResponse.getHeaders())
									resp.end(newResponse.getContent())
								}
							}
				}
			}
		}
		
		return four04Handler;
	}
	
	//start a webapplication
	that.startApplication = function(app) {
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
	that.stopApplication = function(app) {
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
	that.newApplication = function(options) {
		var app = new webapp(options)
		app.server = this
		applications.push(app)
		
		return app
	}
	
	return that
}

//response object to be passed to request handlers
function Response(finishCallback) {
	if (!this instanceof Response)
		return new Response()
		
	var content = ''
	var headers = {}
	
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

//single instance
var singleton = Octopus()

exports.server = singleton
