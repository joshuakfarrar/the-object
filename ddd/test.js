/*
Let's use our library!

First, we'll create some Aggregates.
*/

const { Journal } = require('./');

// var kropotkin =
//   Journal.Author().create()
//     .setName('Pyotr Kropotkin');

// var bread =
//   Journal.Entry().create()
//     .setTitle('The Conquest of Bread')
//     .addAuthor(kropotkin)
//     .setBody(`We, in civilized societies, are rich. Why then are the many poor? Why this painful drudgery for the masses? Why, even to the best paid workman, this uncertainty for the morrow, in the midst of all the wealth inherited from the past, and in spite of the powerful means of production, which could ensure comfort to all in return for a few hours of daily toil?`);

// var nozick =
//   Journal.Author().create()
//     .setName('Robert Nozick');

// var anarchy =
//   Journal.Entry().create()
//     .setTitle('Anarchy, State, and Utopia')
//     .addAuthor(nozick)
//     .setBody(`The traditional proposals for the important individuating characteristic connected with moral constraints are the following: sentient and self-conscious; rational (capable of using abstract concepts, not tied to responses to immediate stimuli); possessing free will; being a moral agent capable of guiding its behavior by moral principles and capable of engaging in mutual limitation of conduct; having a soul.`);

// function prettyPrint(aggregate) {
//   aggregate.applyEvents(); // domain model hasn't been constructed until now; we can control when we pay the costs of applying events!
//   console.log(`${aggregate.get('title')}\n-----`);
//   console.log(aggregate.getReadModel());
//   console.log();
//   console.log(aggregate._unsavedEvents);
//   console.log();
// }

// prettyPrint(anarchy);
// prettyPrint(bread);

/*
These are not persisted, which is fine; from these we can construct a view of reality.

Though event handlers here simply modify state, event handlers are functions that can
  do anything, really, including reach out to other systems in order to pull in
  external information that could be necessary for the re-construction of state;
  possible from another aggregate.

Theoretically, the Journal could also be an Aggregate:

var journal = Journal().create();

journal.addEntry(entry);
journal.getContributors(); // returns a List[Author]
journal.getLastPublishedEntry(); // returns entry

var advertisement = Advertising.Advertisement().create();

Services can be used to handle actions that do not need to manipulate state:

var ps = Services.PasswordService().sendPasswordResetEmail(user);

By encapsulating our domain logic in this way, interacting with our system, via API
or CLI, becomes trivial: just `require` your domain, and you're off!

Want to swap out Express for Hapi? Your domain logic isn't tied to your Express middlewares!

Risks:

  - Might we ensure that an Aggregate can only be persisted if we have already persisted
      Aggregates it references, in order to prevent a situation from occuring where an
      aggregate references an aggregate that cannot be restored from its events?

Your domain can be replayed from its events! Some risk and overhead introduced, but we gain flexibility!
*/

var entry = Journal.Entry();
entry.create();
entry.setTitle('hello');
entry.setBody('we\'re doing it live');
entry.setTitle('hello world');

var author = Journal.Author();
author.create();
author.setName('Joshua K. Farrar');

entry
  .addAuthor(author)
  .addAuthor(author)
  .removeAuthor(author)
  .addAuthor(author);

console.log()
console.log("Entry");
console.log("-----")
console.log(entry._domainModel);

console.log();
console.log("Author");
console.log("------")
console.log(author._domainModel);

const { Persistor } = require('cqrs');
const Driver = require('cqrs-driver-knex');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./dev.sqlite3"
  }
});

var persistor = Persistor(Driver(knex));

persistor.save(entry)
  .then(aggregate => {
    persistor.restore(Journal.Entry(), aggregate.get('id'))
      .then(restored => {
        console.log();
        console.log("Entry: Restored");
        console.log("---------------");
        console.log(restored.getReadModel());
        // console.log();
        // console.log(restored._events);

        knex.destroy();
      });
  });
