'use strict';

angular.module('blogApp')
  .controller('MainCtrl', ['$scope', '$location', '$rootScope', 'Mainsvc', function ($scope, $location, $rootScope, Mainsvc) {

    $scope.userStatus = Mainsvc.userStatus;
    $scope.paginate = {value:false, page:0, quant:1, limit:4, nums:[]};
    $scope.posts = Mainsvc.posts;

    Mainsvc.getPosts(function(data){
    	Mainsvc.posts = $scope.posts = $scope.getPage( data );
    });

    $scope.getPage = function( postsAll ){
    	
    	var list = [];

    	if(postsAll.length > $scope.paginate.limit){
    		for (var i = 0; i < $scope.paginate.limit; i++) {
    			var ind = $scope.paginate.limit * $scope.paginate.page + i;
    			if(ind < postsAll.length) 
    				list.push( postsAll[ind] );
    		};
    	}else{
    		list = postsAll;
    	}
    	$scope.paginate.quant = Math.ceil(postsAll.length / $scope.paginate.limit);
    	$scope.paginate.nums = [];
    	for (var i = 0; i < $scope.paginate.quant ; i++) {
    		$scope.paginate.nums.push(i + 1);
    	};
    	return list;
    };

    $scope.navPage = function( pageNum ){
    	$scope.paginate.page = pageNum - 1;
    	Mainsvc.getPosts(function(data){
	    	$scope.posts = $scope.getPage( data );
	    });
    };
    $scope.login = function(){
    	$location.path('/login');
    };
    $scope.post = function(){
    	if($scope.userStatus.success){
    		$location.path('/editor');
    	}else{
    		$location.path('login');
    	}
    }
  }]);
