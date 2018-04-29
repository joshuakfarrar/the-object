'use strict';

const Persistor = require('../persistor');
const Aggregate = require('../aggregate');
const Driver = require('../driver');

var jestFn = jest.fn(() => {
  return new Promise((resolve, reject) => {
    return resolve([]);
  })
})

var driverSpec = {
  fetchEventsForAggregate: jestFn,
  saveEvents: jestFn
}

test('Persistor must be passed a valid driver', () => {
  expect(Persistor).toThrow('Driver is incomplete.')
});

test('restore must used the driver\'s fetchEventsForAggregate method to restore an aggregate', () => {
  var driver = Driver(driverSpec);

  var persistor = Persistor(driver);

  persistor.restore(Aggregate(), 'test');
  expect(driverSpec.fetchEventsForAggregate).toHaveBeenCalled();
})

test('save must used the driver\'s saveEvents method to restore an aggregate', () => {
  var driver = Driver(driverSpec);

  var persistor = Persistor(driver);

  persistor.save(Aggregate());
  expect(driverSpec.saveEvents).toHaveBeenCalled();
})