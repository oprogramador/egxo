import Manager from 'egxo/storage/Manager';
import NotFoundError from 'egxo/errors/NotFoundError';
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

  setName(name) {
    this.name = name;

    return this;
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
    it('rejects with NotFoundError for non-existent id', () => {
      const Person = createPersonClass();

      const manager = new Manager({
        classes: {
          Person,
        },
      });

      return expect(manager.find('non-existent-id')).to.be.rejectedWith(NotFoundError);
    });

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

  describe('#isDirty', () => {
    it('returns true for new object', () => {
      const Person = createPersonClass();

      const manager = new Manager({
        classes: {
          Person,
        },
      });

      const alice = new Person({ name: 'Alice' });

      expect(manager.isDirty(alice)).to.be.true();
    });

    it('returns true for updated object', () => {
      const Person = createPersonClass();

      const manager = new Manager({
        classes: {
          Person,
        },
      });

      const alice = new Person({ name: 'Alice' });

      return manager.save(alice)
        .then(() => alice.setName('alice2'))
        .then(() => expect(manager.isDirty(alice)).to.be.true());
    });

    it('returns false for saved object', () => {
      const Person = createPersonClass();

      const manager = new Manager({
        classes: {
          Person,
        },
      });

      const alice = new Person({ name: 'Alice' });

      return manager.save(alice)
        .then(() => expect(manager.isDirty(alice)).to.be.false());
    });
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

  it('sends data to indirect next managers');

  it('retrieves from next managers', () => {
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

    return managerB.save(alice)
      .then(() => managerA.find(alice.getId()))
      .then((object) => {
        expect(object.getName()).to.equal('Alice');
      });
  });

  it('retrieves from indirect next managers');

  it('retrieves from multiple next managers');

  it('works with class identifier');

  it('saves dirty referenced objects');

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

  it('stores raw data and retrieves object', () => {
    const Person = createPersonClass();

    const manager = new Manager({
      classes: {
        Person,
      },
    });

    const data = {
      className: 'Person',
      id: 'foo-id',
      values: {
        name: 'Alice',
      },
    };

    return manager.saveRawData(data)
      .then(() => manager.find('foo-id'))
      .then((object) => {
        expect(object.getName()).to.equal('Alice');
      });
  });

  it('stores object and retrieves raw data', () => {
    const Person = createPersonClass();

    const manager = new Manager({
      classes: {
        Person,
      },
    });

    const alice = new Person({ name: 'Alice' });

    return manager.save(alice)
      .then(() => manager.findRawData(alice.getId()))
      .then((data) => {
        expect(data).to.deep.equal({
          className: 'Person',
          id: alice.getId(),
          values: {
            name: 'Alice',
          },
        });
      });
  });

  it('retrieves raw data from next manager');
});
