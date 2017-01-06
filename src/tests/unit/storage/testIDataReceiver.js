import createBasePersonClass from 'egxo/tests/helpers/createBasePersonClass';
import expect from 'egxo/tests/expect';

const createPersonClass = () => {
  const BasePerson = createBasePersonClass();

  class Person extends BasePerson {
  }

  return Person;
};

const testIDataManager = (IDataManagerClass) => {
  describe('IDataReceiver', () => {
    it('stores raw data and retrieves object', () => {
      const Person = createPersonClass();

      const manager = new IDataManagerClass({
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
  });
};

export default testIDataManager;
