'use strict';

const Event = require('../event');
const Aggregate = require('../aggregate');

test('Events can be generated as a function of a created Aggregate', () => {
  var aggregate = Aggregate();
  aggregate.create();

  var eventType = 'test';
  var payload = { hello: 'world' };

  var event = Event(aggregate, eventType, payload);

  expect(event.id).not.toBeUndefined();
  expect(event.timestamp).not.toBeUndefined();
  expect(event.aggregateId).toEqual(aggregate.get('id'));
  expect(event.type).toEqual(eventType);
  expect(event.payload).toEqual(payload);
});

test('Events created for a new Aggregate should get their id from the payload', () => {
  var aggregate = Aggregate();

  var eventType = 'test';
  var payload = { id: 'test' };

  var event = Event(aggregate, eventType, payload);

  expect(event.id).not.toBeUndefined();
  expect(event.timestamp).not.toBeUndefined();
  expect(event.aggregateId).toEqual(payload.id);
  expect(event.type).toEqual(eventType);
  expect(event.payload).toEqual(payload);
});