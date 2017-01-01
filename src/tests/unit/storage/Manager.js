import Manager from 'egxo/storage/Manager';
import expect from 'egxo/tests/expect';
import faker from 'faker';

describe('Manager', () => {
  describe('#save', () => {
    it('generates a not empty id');
    it('preserves id for objects saved before');
  });

  describe('#find', () => {
    it('rejects with NotFoundError for non-existent id');
    it('retrieves from cache');
    it('constructs object of right class');
  });

  it('sends data to next managers');
  it('works with class identifier');

  it('stores and retrieves', () => {
    class Person {
      constructor({ name }) {
        this.name = name;
        this.id = faker.random.uuid();
      }

      getValues() {
        return {
          name: this.name,
        };
      }

      getName() {
        return this.name;
      }

      getClassName() {
        return 'Person';
      }

      getId() {
        return this.id;
      }
    }

    const manager = new Manager({
      classes: {
        Person,
      },
    });

    const alice = new Person({ name: 'Alice' });

    return manager.save(alice)
      .then(() => manager.find(alice.getId()))
      .then((object) => {
        expect(object.getName()).to.equal('Alice');
      });
  });
});
