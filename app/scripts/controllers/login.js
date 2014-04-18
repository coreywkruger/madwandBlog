'use strict';

angular.module('blogApp')
  .controller('LoginCtrl', [ '$scope', '$location', '$rootScope', 'Mainsvc', function ($scope, $location, $rootScope, Mainsvc) {
    $scope.userStatus = Mainsvc.userStatus;
    $scope.loginInfo = {
    	user:'',
    	pass:''
    };
	$scope.accountInfo = {
    	user:'',
    	pass:'',
    	passConf:'',
    	email:''
    };
    $scope.admin = Mainsvc.admin;

    $scope.submit = function(){

   		Mainsvc.submit(
   			{
   				user: $scope.loginInfo.user, 
   				pass: $scope.loginInfo.pass
   			}, 
   			'login',
   			function(data){
   				
   				Mainsvc.userStatus = data;
   				
	   			if(data.success)
	   				$location.path('/editor');
	   			else
	   				$location.path('/login');
	   		}
	   	);
	   	
    };

    $scope.createUser = function(){
    	$location.path('/signup');
    };

    $scope.createAdmin = function(){
    	$location.path('/adminsetup');
    };

    $scope.signup = function(){

    	Mainsvc.signup(
    		$scope.accountInfo.email,
    		$scope.accountInfo.user, 
    		$scope.accountInfo.pass, 
    		function(success, err){
    			$scope.authStatus.value = success;
    			$scope.authStatus.err = err || '';
    		}
    	);
    };

    $scope.setAdmin = function(){

    	Mainsvc.setAdmin(
    		$scope.accountInfo.email,
    		$scope.accountInfo.user, 
    		$scope.accountInfo.pass, 
    		function(success, err){
    			$scope.authStatus.value = success;
    			$scope.authStatus.err = err || '';
    			if($scope.authStatus.value){
    				$location.path('/login');
    			}
    		}
    	);
    };

  }]);
