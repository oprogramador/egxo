import Manager from 'egxo/storage/DataManager';
import createBasePersonClass from 'egxo/tests/helpers/createBasePersonClass';
import expect from 'egxo/tests/expect';

const createPersonClass = () => {
  const BasePerson = createBasePersonClass();

  class Person extends BasePerson {
  }

  return Person;
};

describe('DataManager integration', () => {
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

  it('retrieves raw data from next manager');
});
