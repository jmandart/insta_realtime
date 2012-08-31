var express = require('express'),
	app = express(),
	engines = require('consolidate'),
	Instagram = require('instagram-node-lib'),
	qs = require('querystring');

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

//app.set('views options', {layout: 'layout.html'});

app.get('/index', function(req, res){

	var images = Instagram.tags.recent({ name: 'jayistesting',
		complete: function(data, pagination){
	      // data is a javascript object/array/null matching that shipped Instagram
	      // when available (mostly /recent), pagination is a javascript object with the pagination information


	      // console.log('pagination', pagination);
	      // console.log('______________________________________________');
	      // console.log('______________________________________________');
	      // console.log('data', data);

	      	
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

    });

    // return null;
});

// app.get('/index', function(request, response){

// var url = Instagram.oauth.authorization_url({
//   scope: 'comments likes' // use a space when specifying a scope; it will be encoded into a plus
// });



// var token = Instagram.oauth.ask_for_access_token({
//     request: request,
//     response: response,
//     url: url,
//     redirect: 'http://staging1.pirata.co.uk:3001/index', // optional
//     complete: function(params, response){

//     console.log('C: params', params);
//     console.log('C: response', response);

//       // params['access_token']
//       // params['user']

//       response.writeHead(200, {'Content-Type': 'text/plain'});
//       // or some other response ended with
//       response.end();
//     },
//     error: function(errorMessage, errorObject, caller, response){
//     	console.log('E: response', response);
//       // errorMessage is the raised error message
//       // errorObject is either the object that caused the issue, or the nearest neighbor
//       // caller is the method in which the error occurred
//       response.writeHead(406, {'Content-Type': 'text/plain'});
//       // or some other response ended with
//       response.end();
//     }
//   });

// console.log('token', token);

// response.render('index', {
// 		title: 'REAL TIME'
// 	});
//   // return null;
// });

app.listen(3001);