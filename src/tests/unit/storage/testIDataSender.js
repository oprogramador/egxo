import createBasePersonClass from 'egxo/tests/helpers/createBasePersonClass';
import expect from 'egxo/tests/expect';

const createPersonClass = () => {
  const BasePerson = createBasePersonClass();

  class Person extends BasePerson {
  }

  return Person;
};

const testIDataManager = (IDataManagerClass) => {
  describe('IDataSender', () => {
    it('stores object and retrieves raw data', () => {
      const Person = createPersonClass();

      const manager = new IDataManagerClass({
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
  });
};

export default testIDataManager;
