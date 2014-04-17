'use strict';

angular.module('blogApp')
  .provider('Mainsvc', function Mainsvc() {
    	
    this.userStatus = {loggedIn:false, user:'guest', pass:''};

    this.$get = ['$http', function($http){

    	var self = this;

    	return {

    		userStatus: self.userStatus,

    		submit: function( user, pass, callback){
    			$http({
					method: 'POST',
					url: '/login',
					data: { user: user, pass: pass },
					headers: { 'Content-Type': 'application/json' }
				}).success(function (data, status, headers, config) { 
					
					self.userStatus.loggedIn = data.loggedIn;

					if(self.userStatus.loggedIn){
						self.userStatus.user = data.user;	
						self.userStatus.pass = data.pass;					
					}else{
						self.userStatus.user = 'guest';
						self.userStatus.pass = '';
					}
					callback(self.userStatus.loggedIn);
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
    			console.log(email,user,pass);
				$http({
					
					method: 'POST',
					url: '/signup',
					data: { email: email, user: user, pass: pass },
					headers: { 'Content-Type': 'application/json' }
					
				}).success(function (data, status, headers, config){ 
						
					if( data.userCreated ){

						self.userStatus.user = data.user;
						callback( data.loggedIn, data.errMessage );
					}else{

						self.currentUser.name = '';
						callback( data.loggedIn, data.errMessage );
					}
				});
			}
    	};
    }];
  });
