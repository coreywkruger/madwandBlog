'use strict';

angular.module('blogApp')
  .controller('AdminstuffCtrl', [ '$scope', '$location', 'Mainsvc', function ($scope, $location, Mainsvc) {
    
    $scope.users = Mainsvc.users;
    $scope.getUsers = function(){
    	Mainsvc.getUsers(function(posts){
    		Mainsvc.users = $scope.users = posts;
    	});
    };
    $scope.getUsers();
  }]);
