var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	engines = require('consolidate'),
	Instagram = require('instagram-node-lib'),
	qs = require('querystring'),
	io = require('socket.io').listen(server);

//Set Instagram
Instagram.set('client_id', 'a1cf6651ba4743498540dbd8c4027f9e');
Instagram.set('client_secret', '266f4960d8234179985a4554798e2ea1');
Instagram.set('callback_url', 'http://staging1.pirata.co.uk:3001/callback');
Instagram.set('redirect_uri', 'http://staging1.pirata.co.uk:3001/index');

Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'jayistesting',  });


// assign the underscore engine to .html files
app.engine('html', engines.underscore);

// set .html as the default extension 
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/css", express.static(__dirname + '/css'));

var images = [];


app.get('/index', function(req, res){

	var images = Instagram.tags.recent({ name: 'jayistesting',
		complete: function(data, pagination){
	      // data is a javascript object/array/null matching that shipped Instagram
	      // when available (mostly /recent), pagination is a javascript object with the pagination information

	      console.log('pagination', pagination);
	      // console.log('______________________________________________');
	      // console.log('______________________________________________');
	      console.log('data', data.length);

	     forEach(data, function(el){
	     	console.log('______________________________________________');
	     	console.log(el);
	     });

	      	
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

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});




app.get('/callback', function(req, res){

	var handshake =  Instagram.subscriptions.handshake(req, res);
	console.log('handshake', handshake);

	// res.render('callback', {
	// 	title: 'REAL TIME - CALLBACK'
	// });
});

app.post('/callback', function(req, res){
	console.log('BOOM');
	var body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {

        var POST = qs.parse(body);
        // use POST
        console.log('POST', POST);
        res.send({more: 'BOOM'});

    });

    // return null;
});

server.listen(3001);