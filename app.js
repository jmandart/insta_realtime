var express = require('express'),
	app = express(),
	engines = require('consolidate'),
	instagram = require('instagram-node-lib');

//Set Instagram
instagram.set('client_id', 'a1cf6651ba4743498540dbd8c4027f9e');
instagram.set('client_secret', '266f4960d8234179985a4554798e2ea1');
instagram.set('callback_url', 'http://staging1.pirata.co.uk:3001/callback');
instagram.set('redirect_uri', 'http://staging1.pirata.co.uk:3001/index');


// instagram.tags.info({
//   name: 'jayistesting',
//   complete: function(data){
//     console.log(data);
//   }
// });

// assign the underscore engine to .html files
app.engine('html', engines.underscore);

// set .html as the default extension 
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/oauth', function(req, res){

	// Allow Cross Domain Request from anywhere...
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

	  instagram.oauth.ask_for_access_token({
	    request: req,
	    response: res,
	    complete: function(params, response){
	      // params['access_token']
	      // params['user']
	      response.writeHead(200, {'Content-Type': 'text/plain'});
	      // or some other response ended with
	      response.end();
	    },
	    error: function(errorMessage, errorObject, caller, response){
	      // errorMessage is the raised error message
	      // errorObject is either the object that caused the issue, or the nearest neighbor
	      // caller is the method in which the error occurred
	      response.writeHead(406, {'Content-Type': 'text/plain'});
	      // or some other response ended with
	      response.end();
	    }
	  });
  return null;

});

app.get('/index', function(req, res){

	res.render('index', {
		title: 'REAL TIME'
	});
});

app.get('/callback', function(req, res){
	// Allow Cross Domain Request from anywhere...
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

	instagram.subscriptions.handshake(req, res);

	// res.render('callback', {
	// 	title: 'REAL TIME - CALLBACK'
	// });
});

instagram.subscriptions.subscribe({ object: 'tag', object_id: 'jayistesting' });

app.listen(3001);