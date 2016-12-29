import NotFoundError from 'egxo/errors/NotFoundError';
import SerializerFactory from 'egxo/serializer/SerializerFactory';
import { db } from 'egxo/servicesManager';
import expect from 'egxo/tests/expect';

describe('SerializerFactory', () => {
  describe('#create', () => {
    it('creates working serializer', () => {
      class Person {
        constructor() {
          this.id = 'foo';
          this.name = 'John';
          this.surname = 'Smith';
        }
        getName() {
          return this.name;
        }
        getSurname() {
          return this.surname;
        }
        setName(name) {
          this.name = name;
        }
      }
      const serializer = SerializerFactory.create({
        implementationName: 'ArangoSerializer',
        implementationParams: {
          db,
        },
        prototypes: {
          Person: Person.prototype,
        },
      });
      const object = new Person();

      const serializableObject = serializer.create(object);
      const anotherSerializableObject = serializer.create(object);

      return serializableObject.save()
        .then(() => {
          anotherSerializableObject.setName('Vanessa');

          return anotherSerializableObject.save();
        })
        .then(() => serializableObject.reload())
        .then(() => {
          expect(serializableObject.getId()).to.equal('foo');
          expect(serializableObject.getName()).to.equal('Vanessa');
          expect(serializableObject.getSurname()).to.equal('Smith');
        });
    });

    it('throws NotFoundError for non-existing serializer', () => {
      class Person {
        constructor() {
          this.id = 'foo';
          this.name = 'John';
          this.surname = 'Smith';
        }
        getName() {
          return this.name;
        }
        getSurname() {
          return this.surname;
        }
        setName(name) {
          this.name = name;
        }
      }
      expect(() => SerializerFactory.create({
        implementationName: 'non-existing',
        implementationParams: {
          db,
        },
        prototypes: {
          Person: Person.prototype,
        },
      })).to.throw(NotFoundError);
    });
  });
});
