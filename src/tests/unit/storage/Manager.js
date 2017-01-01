import Manager from 'egxo/storage/Manager';
import expect from 'egxo/tests/expect';
import faker from 'faker';

const createPersonClass = () => class Person {
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
};

describe('Manager', () => {
  describe('#find', () => {
    it('rejects with NotFoundError for non-existent id');
    it('retrieves from cache', () => {
      const Person = createPersonClass();

      const manager = new Manager({
        classes: {
          Person,
        },
      });

      const alice = new Person({ name: 'Alice' });

      return manager.save(alice)
        .then(() => manager.find(alice.getId()))
        .then((object) => {
          expect(object).to.equal(alice);
        });
    });
    it('constructs object of right class');
  });

  it('sends data to next managers', () => {
    const Person = createPersonClass();

    const managerA = new Manager({
      classes: {
        Person,
      },
    });
    const managerB = new Manager({
      classes: {
        Person,
      },
    });

    managerA.addNext(managerB);

    const alice = new Person({ name: 'Alice' });

    return managerA.save(alice)
      .then(() => managerB.find(alice.getId()))
      .then((object) => {
        expect(object.getName()).to.equal('Alice');
      });
  });

  it('retrieves from next managers');

  it('works with class identifier');

  it('stores and retrieves', () => {
    const Person = createPersonClass();

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
