#!/usr/bin/env node

var querystring = require('querystring');
var utils = require('util');
var http = require('http');
var fs = require('fs');
var urling = require('url');

//AUTHENTICATION STUFF
var mongoose = require('mongoose');
var User = require("./user-model.js");

var connStr = 'mongodb://localhost:27017/blogApr';
mongoose.connect(connStr, function(err) {
    if (err) console.log(err);//throw err;
    console.log('Successfully connected to MongoDB');
});
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

function comm( success, user, err, errMessage){
    return {
        success: success, 
        user: user, 
        err: err, 
        errMessage: errMessage
    };
}

function getBody(req, callback){

    var full = '';

    req.on('data', function(chunk) {
        full += chunk.toString();
    });

    req.on('end', function(){
        callback(full);
    });
}

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

                //response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(data);

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

            if(request.url.substring(0, 6) === '/login'){

                getBody(request, function(body){
                    compareUser(response, JSON.parse(body));
                });

                function compareUser( res, data ){

                    User.findOne({ username: data.user }, function(err, user) {
         
                        // test a matching password
                        if(user === null)
                            res.end(JSON.stringify(new comm(false, 'guest', true, 'User does not exist.')));
                        else
                            user.comparePassword(data.pass, function(err, isMatch){
                                if (err)
                                    res.end(JSON.stringify(new comm(false, 'guest', true, 'An error was encountered. Pleas try again.')));
                                else
                                    if(isMatch)
                                        res.end(JSON.stringify(new comm(isMatch, user, false, '')));
                                    else
                                        res.end(JSON.stringify(new comm(isMatch, user, true, 'Incorrect Password')));
                            });
                    });
                }
            }else
            if(request.url.substring(0, 7) === '/signup'){

                getBody(request, function(body){
                    createUser(response, JSON.parse(body));
                });

                function createUser( res, data ){

                    // create a user a new user
                    var newUser = new User({
                        email: data.email,
                        username: data.user,
                        password: data.pass,
                        userType: userTypes['guest']
                    });
                     
                    // save user to database
                    newUser.save(function(err) {
                        if (err)
                            res.end(JSON.stringify(new comm(false, '', true, 'Username or email already in use. Please try a different one.')));
                        else
                            res.end(JSON.stringify((true, data.user,  false, '')));
                    });
                }
            }else
            if(request.url.substring(0, 11) === '/adminsetup'){
               
                getBody(request, function(body){
                    createUser(response, JSON.parse(body));
                });

                // create a user a new user
                function createUser( res, data ){

                    var newUser = new User({
                        email: data.email,
                        username: data.user,
                        password: data.pass,
                        userType: userTypes['admin']
                    });

                    // save user to database

                    User.find({'userType': userTypes['admin']}, function(err, docs){

                        var noAdmin = docs.length === 0;

                        if(noAdmin)
                            newUser.save(function(err) {
                                if(err)
                                    res.end(JSON.stringify(new comm(false, '', true, 'Account could not be created.')));
                                else
                                    res.end(JSON.stringify(new comm(true, data.user, false, '')));
                            });
                        else
                            res.end(JSON.stringify(new comm(false, '', true, 'Cannot create duplicate admin account.')));
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