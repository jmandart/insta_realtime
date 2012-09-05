var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	engines = require('consolidate'),
	Instagram = require('instagram-node-lib'),
	qs = require('querystring'),
	async = require('async'),
	_ = require('underscore');

//Set Instagram
Instagram.set('client_id', 'a1cf6651ba4743498540dbd8c4027f9e');
Instagram.set('client_secret', '266f4960d8234179985a4554798e2ea1');
Instagram.set('callback_url', 'http://staging1.pirata.co.uk:3001/callback');
Instagram.set('redirect_uri', 'http://staging1.pirata.co.uk:3001/index');

//Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'jayistesting',  });

//io.set('log level', 1);

// assign the underscore engine to .html files
app.engine('html', engines.underscore);

// set .html as the default extension 
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/css", express.static(__dirname + '/css'));

var newImages = [];

app.get('/index', function(req, res){

	Instagram.tags.recent({ name: 'jayistesting',
		complete: function(data, pagination){
	      // data is a javascript object/array/null matching that shipped Instagram
	      // when available (mostly /recent), pagination is a javascript object with the pagination information
		    res.render('index', {
				title: 'REAL TIME',
				data: data
			});

	    },
	  	error: function(errorMessage, errorObject, caller){
	      // errorMessage is the raised error message
	      // errorObject is either the object that caused the issue, or the nearest neighbor
	      // caller is the method in which the error occurred
	    } 
	});
});


app.get('/callback', function(req, res){

	var handshake =  Instagram.subscriptions.handshake(req, res);
	console.log('handshake', handshake);
});


app.post('/callback', function(req, res){

		var body = '';

	    req.on('data', function (data) {
	        body += data;
	    });

	    req.on('end', function () {

	        var POST = qs.parse(body);
	        // use POST
	        console.log('POST', POST);
	        getNewImages();
	    });

	    req.on('close', function () {
	    	//getNewImages();
	    	
	    });
	    res.writeHead(200);
});


function getNewImages(){

	console.log('BOOM2');

	Instagram.tags.recent({ name: 'jayistesting',
		complete: function(data, pagination){
	    // data is a javascript object/array/null matching that shipped Instagram
	    // when available (mostly /recent), pagination is a javascript object with the pagination information

	    	//sendNewImage(data[0]);
	   		io.sockets.emit('photo', { data: data[0] });
	    	console.log(data[0]);

	    },
	  	error: function(errorMessage, errorObject, caller){
	      // errorMessage is the raised error message
	      // errorObject is either the object that caused the issue, or the nearest neighbor
	      // caller is the method in which the error occurred
	    } 
		
	});
}

server.listen(3001);