var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	engines = require('consolidate'),
	Instagram = require('instagram-node-lib'),
	qs = require('querystring'),
	async = require('async'),
	util = require('util'),
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


app.get('/', function(req, res){

	var images = Instagram.tags.recent({ name: 'jayistesting',
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

	// var handshake =  Instagram.subscriptions.handshake(req, res);
	// console.log('handshake', handshake);
	if(req.param("hub.challenge") != null){
    	res.send(req.param("hub.challenge"));
	} else {
	    console.log("ERROR on suscription request: %s", util.inspect(req));
	}
});


app.post('/callback', function(request, response){
	//

console.log('BOOM0');
	//setTimeout(function(){
		//console.log('BOOM1');
		//var body = '';

	    request.on('data', function (data) {

	    	console.log(data.body);
	        //body += data;
	     //    data.body.forEach(function(notificationOjb){
				  //   // Every notification object contains the id of the geography
				  //   // that has been updated, and the photo can be obtained from
				  //   // that geography
				  //   https.get({
				  //     host: 'api.instagram.com',
				  //     path: '/v1/tags/' + notificationOjb.object_id + '/media/recent' +
				  //     '?' + qs.stringify({client_id: process.env.instagram_client_id,count: 1}),
				  //   }, function(res){
				  //     var raw = "";

				  //     res.on('data', function(chunk) {
				  //       raw += chunk;
				  //     });


				  //     // When the whole body has arrived, it has to be a valid JSON, with data,
				  //     // and the first photo of the date must to have a location attribute.
				  //     // If so, the photo is emitted through the websocket
				  //     res.on('end', function() {
				  //       var response = JSON.parse(raw);
				  //       if(response['data'].length > 0 && response['data'][0]['location'] != null) {
				  //         io.sockets.emit('photo', raw);
				  //       } else {
				  //         console.log("ERROR: %s", util.inspect(response['meta']));
				  //       }
				  //     });

				  //   });
				  // });
	    });

	    // request.on('end', function () {

	    //     var POST = qs.parse(body);
	    //     // use POST
	    //     console.log('POST', POST);
	        
	    // });

	    // request.on('close', function () {
	    // 	//getNewImages();
	    	
	    // });

  response.writeHead(200);
    
});


// function getNewImages(){

// 	console.log('BOOM2');
// 	//console.log('indexImage', indexImage);

// 	Instagram.tags.recent({ name: 'jayistesting',
// 		complete: function(data, pagination){
// 	      // data is a javascript object/array/null matching that shipped Instagram
// 	      // when available (mostly /recent), pagination is a javascript object with the pagination information

// 	    //sendNewImage(data[0]);
// 	   //io.sockets.volatile.emit('add_image', { data: 'BOOM' });
// 	    console.log(data[0]);

// 	   // newImages.push(data[0]);
// 	    //console.log(newImages.length);
// 	    //sendNewImages();

// 	    },
// 	  	error: function(errorMessage, errorObject, caller){
// 	      // errorMessage is the raised error message
// 	      // errorObject is either the object that caused the issue, or the nearest neighbor
// 	      // caller is the method in which the error occurred
// 	    } 
		
// 	});
// }

// function sendNewImages(){
	
// 	// // console.log('timer is on --------');
// 	//  console.log('newImages.length1', newImages.length);
// 	// // console.log('--------');
// 	// if(newImages.length > 0){
// 	// 	console.log('newImages.length2', newImages.length);
// 	// 	console.log('sendNewImages', newImages[0]);
// 	// 	//io.sockets.emit('add_image', { data: '' });
// 	// 	newImages.length = 0;
// 	// 	// _.forEach(newImages, function(image){
// 	// 	// 	io.sockets.emit('add_image', { data: image });
// 	// 	// });
// 	// }
// }

//setInterval(sendNewImages,3000);

//setTimeout(sendNewImages, 3000);

server.listen(3001);