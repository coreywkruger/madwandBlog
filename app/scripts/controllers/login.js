'use strict';

angular.module('blogApp')
  .controller('LoginCtrl', [ '$scope', '$location', '$rootScope', 'Mainsvc', function ($scope, $location, $rootScope, Mainsvc) {
    $scope.userStatus = Mainsvc.userStatus;
    $scope.pageUser = '';
    $scope.pagePass = '';

    $scope.submit = function(user, pass){

   		Mainsvc.submit(user, pass, function(success){
   			
   			if(success.value){
   				$location.path('/editor');
   			}else{
   				$location.path('/login');
   			}
   			$scope.userStatus = Mainsvc.userStatus;
   			$rootScope.$apply();
   		});
    };

    $scope.accountInfo = {
    	user:'',
    	pass:'',
    	passConf:'',
    	email:''
    };

    $scope.signupStatus = {value:true, err:''};

    $scope.createAccount = function(){
    	$location.path('/signup');
    };

    $scope.signup = function(){

    	Mainsvc.signup(
    		$scope.accountInfo.email,
    		$scope.accountInfo.user, 
    		$scope.accountInfo.pass, 
    		function(success, err){
    			$scope.signupStatus.value = success;
    			$scope.signupStatus.err = err || '';
    		}
    	);
    };
  }]);
