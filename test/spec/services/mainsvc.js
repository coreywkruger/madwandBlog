'use strict';

describe('Service: Mainsvc', function () {

  // load the service's module
  beforeEach(module('blogApp'));

  // instantiate service
  var Mainsvc;
  beforeEach(inject(function (_Mainsvc_) {
    Mainsvc = _Mainsvc_;
  }));

  it('should do something', function () {
    expect(!!Mainsvc).toBe(true);
  });

});
