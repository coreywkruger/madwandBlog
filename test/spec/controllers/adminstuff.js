'use strict';

describe('Controller: AdminstuffCtrl', function () {

  // load the controller's module
  beforeEach(module('blogApp'));

  var AdminstuffCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminstuffCtrl = $controller('AdminstuffCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
