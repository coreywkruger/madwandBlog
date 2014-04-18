'use strict';

angular.module('blogApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/editor', {
        templateUrl: 'views/editor.html',
        controller: 'EditorCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'LoginCtrl'
      })
      .when('/adminsetup', {
        templateUrl: 'views/adminsetup.html',
        controller: 'LoginCtrl'
      })
      .when('/adminstuff', {
        templateUrl: 'views/adminstuff.html',
        controller: 'AdminstuffCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
