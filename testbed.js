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
	canHandle: function() {return true},
	handler: function(req, resp) {
		resp.writeHead({'Server-Process-Id': process.pid})
		resp.write('hello world, i am a web application')
	}
}
]

//start application
w.start()

//stop application
w.stop()
