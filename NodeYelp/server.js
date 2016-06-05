var Yelp = require('yelp')
    express = require('express'),
    app = express(),
    oauthSignature = require('oauth-signature'),
    request = require('request'),
    query_string = require('querystring'),
    _ = require('lodash')
    method_override = require('method-override'),
    body_parser = require('body-parser');
var nonce = require('nonce')();

var yelp = new Yelp({

	consumer_key:"xQhGAXcgh5FckYRC9rTMEg",
	consumer_secret:'EtaajsR2kN0WgZIbs_3v-fNukfE',
	token:'wEkTJnPJbTXfFKiaMn3uoyepW0DObFBY',
	token_secret:'s2_bdwfjNnGWuwNyw1WMn-r2JtQ'

});
// var request_yelp = function(set_parameters,callback){
// 	var http_method = 'GET',
// 		url = 'http://api.yelp.com/v2/search',
// 		//to be received with request
// 		default_parameters = {
// 			cll:'40.60475,-73.99764',
// 			radius_fitler:'4000',
// 			category_filter:'bars'
// 		},
// 		required_params = {
// 			oauth_consumer_key:"xQhGAXcgh5FckYRC9rTMEg",
// 			oauth_token:"wEkTJnPJbTXfFKiaMn3uoyepW0DObFBY",
// 			oauth_nonce: nonce(),
// 			oauth_timestamp: nonce().toString().substr(0,10),
// 			oauth_signature_method: 'HMAX-SHA1',
// 			oauth_version: '1.0'
// 		},
// 		parameters = _.assign(default_parameters,set_parameters,required_params);
// 	var consumer_secret = 'EtaajsR2kN0WgZIbs_3v-fNukfE',
// 		token_secret = 's2_bdwfjNnGWuwNyw1WMn-r2JtQ'
// 	var signature = oauthSignature.generate(http_method,url,parameters,consumer_secret,
// 											token_secret,{encodeSignature:false});
// 	parameters.oauth_signature = signature;
// 	var paramUrl = query_string.stringify(parameters);
// 	var apiUrl = url+'?'+paramUrl;

// 	 request(apiUrl, function(error, response, body){
//    		return callback(error, response, body);
//   });
// }
// request_yelp('',respond);
// var respond = function(data){
// 	console.log(data);
// }
app.use(body_parser.urlencoded({'extended':'true'}));
app.use(body_parser.json());
app.use(body_parser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(method_override('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.listen(3000);
app.get('/search',function(req,res){
	
	
	
	yelp.search({category_filter:'bars,pubs',location:'Montreal'})
	    .then(function(data){
	    	res.setHeader('Access-Control-Allow-Origin', '*');
			res.send(data)
	    })
	    .catch(function(err){
		res.send(err)
	    });
	
	
});
/*
yelp.search({term:'bar/pub',location:'Montreal'})
    .then(function(data){
    	console.log(data);
     })
    .catch(function(err){
      console.log(err)
    });
	*/
