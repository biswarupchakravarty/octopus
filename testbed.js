var server = require('./Octopus').server
var Cookie = require('./Cookies').cookie

var w = server.newApplication({root: 'crazy'})

w.onStartup = function() {
	console.log('I am ' + this.root + '.')
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
		
		var c = new Cookie()
		c.name = 'test'
		c.value = 'value is here'
		resp.setCookie(c)
		
		var c2 = new Cookie()
		c2.name = 'test2'
		c2.value = 'value should be ehre'
		resp.setCookie(c2)
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
