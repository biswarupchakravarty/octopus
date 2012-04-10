var server = require('./Octopus').server

var w = server.newApplication()

w.onStartup = function() {
	console.log('i am born!!')
}

w.onShutdown = function() {
	console.log('i am dying!! now to throw an error')
}

w.router = [
{
	canHandle: function(url) {
		return url.indexOf('exist') != -1
	},
	handler: function(req, resp) {
		resp.writeHead({'Server-Process-Id': process.pid})
		resp.writeHead({'Content-Type': 'text/html'})
		resp.write('hello world, i am a web application')
	}
},
{
	canHandle: function(url) {
		return url.indexOf('error') != -1
	},
	handler: function(req, resp) {
		resp.writeHead({'Server-Process-Id': process.pid})
		resp.writeHead({'Content-Type': 'text/html'})
		resp.write('hello world, i am a web application')
		throw new Error()
	}
}
]

w.start()
