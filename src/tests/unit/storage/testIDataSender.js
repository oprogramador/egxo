import createBasePersonClass from 'egxo/tests/helpers/createBasePersonClass';
import expect from 'egxo/tests/expect';

const testIDataManager = (createManager) => {
  describe('IDataSender', () => {
    it('stores object and retrieves raw data', () => {
      const manager = createManager();
      const Person = createBasePersonClass();
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
