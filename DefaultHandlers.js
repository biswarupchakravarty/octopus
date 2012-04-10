
//404 handler
var error404 = function(request, response) {
	response.writeHead({'Content-Type': 'text/html'})
	response.write('<h2>Have you seen ' + request.url + '?? Coz I sure haven\'t</h2><br/><p>Actually, the web server cannot locate the resource you requested.</p>')
	response.setStatus(404)
}

//500 handler
var error500 = function(request, response) {
	response.writeHead({'Content-Type': 'text/html'})
	response.write('<h2>Something broke at ' + request.url + '.</h2><br/><p>Actually, there was an internal error in the resource you requested. </p>')
	response.setStatus(500)
}

//default handler
var defaultHandler = function(request, response) {
	
	response.writeHead({'Content-Type': 'text/html'})
	response.end('<h1>Hello World!</h1><p>This is the default page of the Octopus server.</p>')
	response.setStatus(200)
}

var failSafeHandler = function (innerHandler) {
	if (!innerHandler || typeof(innerHandler) != 'function') return
	
	return function(req, res) {
		try {
			innerHandler(req, res)
		} catch(e) {
			res.clearContent()
			error500(req, res)
		}
	}
}

exports.error404Handler = error404
exports.error500Handler = error500
exports.defaultHandler = defaultHandler
exports.failSafeHandler = failSafeHandler
