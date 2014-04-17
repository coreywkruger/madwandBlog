'use strict';

angular.module('blogApp')
  .controller('EditorCtrl', [ '$scope', '$location', 'Mainsvc', function ($scope, $location, Mainsvc) {
    $scope.userStatus = Mainsvc.userStatus;

    $scope.login = function(){
    	$location.path('/login');
    }
  }]);
