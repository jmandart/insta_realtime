var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	engines = require('consolidate'),
	Instagram = require('instagram-node-lib'),
	qs = require('querystring'),
	io = require('socket.io').listen(server),
	async = require('async'),
	_ = require('underscore');

//Set Instagram
Instagram.set('client_id', 'a1cf6651ba4743498540dbd8c4027f9e');
Instagram.set('client_secret', '266f4960d8234179985a4554798e2ea1');
Instagram.set('callback_url', 'http://staging1.pirata.co.uk:3001/callback');
Instagram.set('redirect_uri', 'http://staging1.pirata.co.uk:3001/index');

//Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'jayistesting',  });


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

	     // _.forEach(data, function(el){
	     // 	images.push(el);
	     // });

	      	
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

var mySocket;
io.sockets.on('connection', function (socket) {

	mySocket = socket
  
});

function sendNewImage(image) {
	mySocket.emit('add_image', { data: image });
}

// socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });




app.get('/callback', function(req, res){

	var handshake =  Instagram.subscriptions.handshake(req, res);
	console.log('handshake', handshake);

	// res.render('callback', {
	// 	title: 'REAL TIME - CALLBACK'
	// });
});


var q = async.queue(function (task, callback) {
    console.log('hello ' + task.name);
    
    callback();
}, 1);



app.post('/callback', function(req, res){
	console.log('BOOM1');
	var body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {

        var POST = qs.parse(body);
        // use POST
        console.log('POST', POST);
        //res.send({more: 'BOOM'});
    });

    req.on('close', function () {
    	getNewImages();
    	
    });

 //    res.send('0');

    // return null;
});

var indexImage = 1; 
function getNewImages(){

	console.log('BOOM2');
	console.log('indexImage', indexImage);

	Instagram.tags.recent({ name: 'jayistesting',
		complete: function(data, pagination){
	      // data is a javascript object/array/null matching that shipped Instagram
	      // when available (mostly /recent), pagination is a javascript object with the pagination information

	    sendNewImage(data[0]);

	    },
	  	error: function(errorMessage, errorObject, caller){
	      // errorMessage is the raised error message
	      // errorObject is either the object that caused the issue, or the nearest neighbor
	      // caller is the method in which the error occurred
	    } 
		});

// 	q.push({name: 'foo'+indexImage}, function (err) {
// 		Instagram.tags.recent({ name: 'jayistesting',
// 		complete: function(data, pagination){
// 	      // data is a javascript object/array/null matching that shipped Instagram
// 	      // when available (mostly /recent), pagination is a javascript object with the pagination information

// 	    sendNewImage(data[0]);

// 	    },
// 	  	error: function(errorMessage, errorObject, caller){
// 	      // errorMessage is the raised error message
// 	      // errorObject is either the object that caused the issue, or the nearest neighbor
// 	      // caller is the method in which the error occurred
// 	    } 
// 		});
    		
// console.log('finished processing foo');
// 		});

	indexImage++;
}

q.drain = function() {
    console.log('all items have been processed');
}


server.listen(3001);