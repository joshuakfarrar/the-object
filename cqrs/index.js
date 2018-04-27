function Event(type, payload) {
  this.type = type;
  this.payload = payload;
}

module.exports = {
  Aggregate: require('./aggregate'),
  Event: Event
}
