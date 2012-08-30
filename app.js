var express = require('express'),
	app = express(),
	engines = require('consolidate'),
	instagram = require('instagram-node-lib');

//Set Instagram
instagram.set('client_id', 'a1cf6651ba4743498540dbd8c4027f9e');
instagram.set('client_secret', '266f4960d8234179985a4554798e2ea1');
instagram.set('callback_url', 'http://jmandart.insta_realtime.nodejitsu.com/callback');
instagram.set('redirect_uri', 'http://jmandart.insta_realtime.nodejitsu.com/index');


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

// app.get('/', function(request, response){

//   instagram.oauth.ask_for_access_token({
//     request: request,
//     response: response,
//     //redirect: 'http://jmandart.insta_realtime.nodejitsu.com/index', // optional
//     complete: function(params, response){
//       // params['access_token']
//       // params['user']
//       response.writeHead(200, {'Content-Type': 'text/plain'});
//       // or some other response ended with
//       response.end();
//     },
//     error: function(errorMessage, errorObject, caller, response){
//       // errorMessage is the raised error message
//       // errorObject is either the object that caused the issue, or the nearest neighbor
//       // caller is the method in which the error occurred
//       response.writeHead(406, {'Content-Type': 'text/plain'});
//       // or some other response ended with
//       response.end();
//     }
//   });
//   return null;
// });

app.get('/index', function(req, res){

	console.log('hello index');
	res.render('index', {
		title: 'REAL TIME'
	});
});

app.get('/callback', function(req, res){

	instagram.subscriptions.handshake(req, res);

	// res.render('callback', {
	// 	title: 'REAL TIME - CALLBACK'
	// });
});

instagram.subscriptions.subscribe({ object: 'tag', object_id: 'jayistesting' });


app.listen(80);
//app.listen(3000);



// <?php
//     session_start();
        
//     $config = array(
//     'client_id' => 'a1cf6651ba4743498540dbd8c4027f9e',
//     'client_secret' => '266f4960d8234179985a4554798e2ea1',
//     'grant_type' => 'authorization_code',
//     'redirect_uri' => 'http://ipc.leedaubney.com/realtime_instagram/output.php',);
         
//      $instagram = new Instagram($config);
// ?>
//http://ipc.leedaubney.com/
//http://ipc.leedaubney.com/realtime_instagram/output.php