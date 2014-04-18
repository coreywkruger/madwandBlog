'use strict';

angular.module('blogApp')
  .provider('Mainsvc', function Mainsvc() {
    	
    this.userStatus = {   
        success: false, 
        user: 'guest', 
        err: false, 
        errMessage: '' 
    }
    
    this.posts = [];

    this.$get = ['$http', function($http){

    	var self = this;

    	return {

    		userStatus: self.userStatus,

    		posts: self.posts,

    		submit: function( user, pass, callback){

    			$http({
					method: 'POST',
					url: '/login',
					data: { user: user, pass: pass },
					headers: { 'Content-Type': 'application/json' }
				}).success(function (data, status, headers, config) { 

					self.userStatus.success = data.success;
					self.userStatus.user = data.user;
					self.userStatus.err = data.err;
					self.userStatus.errMessage = data.errMessage;

					if(self.userStatus.success){
						self.userStatus.user = data.user;	
						self.userStatus.pass = data.pass;					
					}else{
						self.userStatus.user = 'guest';
						self.userStatus.pass = '';
					}
					callback(self.userStatus.success);
				});
    		},

    		makePost: function( data, callback ){

    			$http({
					method: 'POST',
					url: '/post',
					data: data,
					headers: { 'Content-Type': 'application/json' }
				}).success(function (data, status, headers, config){
					callback(data);
				});
    		},

    		getPosts: function( callback ){

    			$http({
					method: 'GET',
					url: '/posts',
					data: { user:self.userStatus.user, pass:self.userStatus.pass },
					headers: { 'Content-Type': 'application/json' }
				}).success(function (data, status, headers, config) { 
					callback( data );
				});
    		},

    		signup: function( email, user, pass, callback){

				$http({
					
					method: 'POST',
					url: '/signup',
					data: { 
						email:email,
						user:user,
						pass:pass 
					},
					headers: { 'Content-Type': 'application/json' }
					
				}).success(function (data, status, headers, config){ 
						
					callback(data.success, data.err);
				});
			},

			setAdmin: function( email, user, pass, callback){

				$http({
					
					method: 'POST',
					url: '/adminsetup',
					data: { 
						email:email,
						user:user, 
						pass:pass 
					},
					headers: { 'Content-Type': 'application/json' }
					
				}).success(function (data, status, headers, config){ 

					callback(data.success, data.err);
				});
			},

			checkAdmin: function( email, user, pass, callback){

				$http({
					
					method: 'POST',
					url: '/checkadmin',
					data: { 
						user: user, 
						pass: pass,
						email: email 
					},
					headers: { 'Content-Type': 'application/json' }
				
				}).success(function (data, status, headers, config){
					console.log(data);
					callback(data.success);
				})
			}
    	};
    }];
  });
