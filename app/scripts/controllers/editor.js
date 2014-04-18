'use strict';

angular.module('blogApp')
  .controller('EditorCtrl', [ '$scope', '$location', '$rootScope', 'Mainsvc', function ($scope, $location, $rootScope, Mainsvc) {
    $scope.userStatus = Mainsvc.userStatus;
    $scope.posts = Mainsvc.posts;
   
    $scope.postData = {
    	title: '',
    	body: '',
    	signature: '',
    	data: ''
    };
    $scope.makePost = function(){
    	Mainsvc.makePost(
    		$scope.postData,
    		function(data){
    			/*Mainsvc.getPosts(function(data){
			    	Mainsvc.posts = getPage( data );
			    	$rootScope.$apply();
			    });*/
    			$location.path('/');
    		}
    	);
    };
    $scope.login = function(){
    	$location.path('/login');
    };
  }]);
