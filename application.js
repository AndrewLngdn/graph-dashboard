var static = require('node-static');

var fileServer = new static.Server('./public');

require('http').createServer(function (request, response) {

	request.addListener('end', function() {
		
		fileServer.serve(request, response);

	}).resume();

}).listen(process.env.PORT || 8000);
