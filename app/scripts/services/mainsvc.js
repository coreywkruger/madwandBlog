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
    this.users = [];

    this.$get = ['$http', '$rootScope', function($http, $rootScope){

    	var self = this;

    	return {

    		userStatus: self.userStatus,

    		posts: self.posts,

    		users: self.users,

    		submit: function( data, method, callback){

    			$http({
					method: 'POST',
					url: '/' + method,
					data: data,
					headers: { 'Content-Type': 'application/json' }
				}).success(function (data, status, headers, config) { 
					self.userStatus = data;
					callback(data);
				});
    		},

    		getPosts: function(callback){

    			$http({
					method: 'GET',
					url: '/posts',
					data: { user:self.userStatus.user, pass:self.userStatus.pass },
					headers: { 'Content-Type': 'application/json' }
				}).success(function (data, status, headers, config) { 
					callback( data );
				});
    		},

    		getUsers: function(callback){

    			$http({
    				method: 'GET',
    				url: '/users',
    			}).success(function (data, status, headers, config){
    				callback(data);
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
