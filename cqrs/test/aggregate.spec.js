'use strict';

var Aggregate = require('../aggregate');

let aggregate;
beforeEach(() => {
  aggregate = Aggregate();
});

test('new aggregate should have empty containers', () => {
  expect(aggregate._domainModel).toEqual({});
  expect(aggregate._events).toEqual([]);
  expect(aggregate._unsavedEvents).toEqual([]); 
});

test('aggregate should have a create method', () => {
  expect(aggregate.create).toBeDefined();
});

test('calling create on a new Aggregate should generate a create event and apply it', () => {
  aggregate.create();
  expect(aggregate._unsavedEvents).toHaveLength(1);
  expect(aggregate._domainModel.id).not.toBeUndefined();
});

test('calling create on an existing Aggregate should throw an Error', () => {
  aggregate.create();
  expect(aggregate.create.bind(aggregate)).toThrow('Aggregate has already been created.')
});

test('calling createEvent creates a new event of an arbitrary type', () => {
  var type = 'test';
  var payload = { hello: 'world' };

  aggregate.create();
  aggregate.createEvent(type, payload);

  var event = aggregate._unsavedEvents[1];

  expect(event.type).toEqual(type);
  expect(event.payload).toEqual(payload);
});

test('... but not for Aggregates that have not yet been created', () => {
  var type = 'test';
  var payload = { hello: 'world' };

  expect(aggregate.createEvent.bind(aggregate, type, payload)).toThrow('Aggregate has not yet been created.');
});

test('set should allow custom event handlers to set a field on _domainModel in response to an event', () => {
  var field = 'test';
  var value = 'value';
  aggregate.set(field, value);

  expect(aggregate._domainModel[field]).toEqual(value);
});

test('get allows for the retrieval of nested fields', () => {
  var field = 'test';
  var value = { hello: 'world' };
  aggregate.set(field, value);

  expect(aggregate.get(`${field}.hello`)).toEqual(value.hello);
});

test('getReadModel returns _domainModel with events applied', () => {
  aggregate.create();

  var readModel = aggregate.getReadModel();

  expect(readModel.id).toEqual(aggregate._unsavedEvents[0].payload.id);
});

test('onSave appends _unsavedEvents to _events and clears the former', () => {
  aggregate.create();

  expect(aggregate._events).toHaveLength(0);
  expect(aggregate._unsavedEvents).toHaveLength(1);

  aggregate.onSave();

  expect(aggregate._events).toHaveLength(1);
  expect(aggregate._unsavedEvents).toHaveLength(0);
});

test('getUnsavedEvents returns _unsavedEvents', () => {
  aggregate.create();

  var unsavedEvents = aggregate.getUnsavedEvents();

  expect(unsavedEvents).toEqual(aggregate._unsavedEvents);
  expect(unsavedEvents).toHaveLength(1);
});

test('restore should restore an Aggregate', () => {
  aggregate.create();
  aggregate.onSave();

  var restored = Aggregate();
  restored.restore(aggregate._events);

  expect(restored.getReadModel()).toEqual(aggregate.getReadModel());
});

test('...but not if that Aggregate has already been created', () => {
  aggregate.create();
  aggregate.onSave();

  var restored = Aggregate();
  restored.create();

  expect(restored.restore.bind(aggregate, aggregate._events)).toThrow('An Aggregate cannot be restored onto if it has already been created.')
});
