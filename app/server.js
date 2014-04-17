#!/usr/bin/env node

var querystring = require('querystring');
var utils = require('util');
var http = require('http');
var fs = require('fs');
var urling = require('url');

//////////////////////
//AUTHENTICATION STUFF
var mongoose = require('mongoose');
var User = require("./user-model.js");

var connStr = 'mongodb://localhost:27017/blogApr';
mongoose.connect(connStr, function(err) {
    if (err) console.log(err);//throw err;
    console.log('Successfully connected to MongoDB');
});
//////////////////////
//////////////////////

var methods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

var userTypes = {
    admin: 'admin',
    guest: 'guest'
};

var server = http.createServer(function(request, response) {

    console.log((new Date()) + ' Received ' + request.method + ' request for ' + request.url);

    switch(request.method){

        case methods.GET:
            
            if(request.url.substring(0, 6) ==  '/posts'){

                //var parts = urling.parse(request.url, true).query;
                
                data = JSON.stringify([
                    {title: 'one', body: 'bodyone', time: 'today'},
                    {title: 'two', body: 'bodytwo', time: 'today'},
                    {title: 'three', body: 'bodythree', time: 'today'},
                    {title: 'four', body: 'bodyfour', time: 'today'},
                    {title: 'five', body: 'bodyfive', time: 'today'},
                    {title: 'six', body: 'bodysix', time: 'today'},
                    {title: 'seven', body: 'bodyseven', time: 'today'},
                    {title: 'eight', body: 'bodyeight', time: 'today'},
                    {title: 'nine', body: 'bodynine', time: 'today'},
                    {title: 'ten', body: 'bodyten', time: 'today'},
                    {title: 'eleven', body: 'bodyeleven', time: 'today'},
                    {title: 'twelve', body: 'bodytwelve', time: 'today'},
                    {title: 'thirteen', body: 'bodythirteen', time: 'today'},
                    {title: 'fourteen', body: 'bodyfourteen', time: 'today'}
                ]);

                response.writeHead(200, {'Content-Type': 'application/json'});
                response.write(data);
                response.end();

            }else{

                var url = '.' + (request.url == '/' ? '/index.html' : request.url);

                fs.readFile(url, function (err, data) {
                
                    if (err) {
                        console.log(err);
                        response.writeHead(500);
                        return response.end('Error loading index.html');
                    }

                    var tmp  = url.lastIndexOf(".");
                    var ext  = url.substring((tmp + 1));
                    var mime = mimes[ext] || 'text/plain';

                    response.writeHead(200, { 'Content-Type': mime });
                    response.end(data, 'utf-8');
                });
            }
            break;

        case methods.POST:

            if(request.url.substring(0, 8) === '/posting'){
                
                var fullBody = '';
                request.on('data', function(chunk) {
                    fullBody += chunk.toString();
                });

                request.on('end', function(){

                    response.writeHead('200', 'OK', {'Content-Type': 'text/html'});

                    var decodedBody = querystring.parse(fullBody);

                    var parts = urling.parse(request.url, true).query;
                    console.log('>>', parts);

                    response.write('<html><head><title>Post data</title></head><body><pre>');  
                    response.write(utils.inspect(decodedBody.data));              
                    response.write('</pre></body></html>');       
                    response.end();
                })

            }else
            if(request.url.substring(0, 6) === '/login'){

                var fullBody = '';

                request.on('data', function(chunk) {
                    fullBody += chunk.toString();
                });

                request.on('end', function(){
                    compareUser( JSON.parse(fullBody) );
                });

                function compareUser( data ){

                    User.findOne({ username: data.user }, function(err, user) {
         
                        // test a matching password
                        if(user === null){
                            response.end( 
                                JSON.stringify({ 
                                    success: false, 
                                    user: '', 
                                    err: true, 
                                    errMessage: 'User does not exist.' 
                                }) 
                            );
                        }else{

                            user.comparePassword(data.pass, function(err, isMatch) {
                                
                                if (err) {

                                    response.end( 
                                        JSON.stringify({   
                                            success: false, 
                                            user: 'guest', 
                                            err: true, 
                                            errMessage: 'An error was encountered. Pleas try again.' 
                                        }) 
                                    );
                                    console.log('An error was encountered. Pleas try again.');

                                }else{

                                    if(isMatch)
                                        response.end( 
                                            JSON.stringify({ 
                                                success: isMatch, 
                                                user: user, 
                                                err: false 
                                            }) 
                                        );
                                    else
                                        response.end( 
                                            JSON.stringify({ 
                                                success: isMatch, 
                                                user: user, 
                                                err: true, 
                                                errMessage: 'Incorrect Password' 
                                            }) 
                                        );
                                }
                            });
                        }
                    });
                }
            }else
            if(request.url.substring(0, 7) === '/signup'){

                var fullBody = '';

                request.on('data', function(chunk) {
                    fullBody += chunk.toString();
                });

                request.on('end', function(){
                    createUser( JSON.parse(fullBody) );
                });

                function createUser( data ){

                    // create a user a new user
                    var newUser = new User({
                        email: data.email,
                        username: data.user,
                        password: data.pass,
                        userType: userTypes['guest']
                    });
                     
                    // save user to database
                    newUser.save(function(err) {
                        if (err){
                            var errMess = 'Username or email already in use. Please try a different one.';
                            console.log(errMess);
                            response.end(
                                JSON.stringify({   
                                    success: false, 
                                    user: '', 
                                    err: true, 
                                    errMessage: errMess
                                })
                            );
                        }else{
                            response.end(
                                JSON.stringify({ 
                                    success: true, 
                                    user: data.user, 
                                    err: false 
                                })
                            );
                        }
                    });
                }
            }else
            if(request.url.substring(0, 11) === '/adminsetup'){
               
                var fullBody = '';

                request.on('data', function(chunk) {
                    fullBody += chunk.toString();
                });

                request.on('end', function(){
                    createUser( JSON.parse(fullBody) );
                });

                // create a user a new user
                function createUser( data ){

                    var newUser = new User({
                        email: data.email,
                        username: data.user,
                        password: data.pass,
                        userType: userTypes['admin']
                    });

                    // save user to database

                    User.find({'userType': userTypes['admin']}, function(err, docs){

                        var noAdmin = docs.length === 0;

                        if(noAdmin){

                            newUser.save(function(err) {
                                if (err){
                                    var errMess = 'Account could not be created.' ;
                                    console.log(errMess);
                                    response.end(
                                        JSON.stringify({   
                                            success: false, 
                                            username: '', 
                                            err: true, 
                                            errMessage:errMess
                                        })
                                    );
                                }else{
                                    console.log('here');
                                    response.end(
                                        JSON.stringify({ 
                                            success: true, 
                                            username: data.user, 
                                            err: false 
                                        })
                                    );
                                }
                            });

                        }else{
                            var errMess = 'Cannot create duplicate admin account.';
                            console.log(errMess);
                            response.end(
                                JSON.stringify({   
                                    success: false, 
                                    username: '', 
                                    err: true, 
                                    errMessage:errMess
                                })
                            );
                        }
                    });
                }
            }

    }
    
});

server.listen(8000, '127.0.0.1', function() {
	console.log((new Date()) + ' Server is listening on port 8000');
});

var mimes = {
    'css':  'text/css',
    'js':   'text/javascript',
    'html': 'text/html',
    'ico':  'image/vnd.microsoft.icon'
};