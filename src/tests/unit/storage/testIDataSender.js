import NotFoundError from 'egxo/errors/NotFoundError';
import expect from 'egxo/tests/expect';

const testIDataManager = (createManager) => {
  describe('IDataSender', () => {
    it('stores raw data and retrieves object', () => {
      const manager = createManager();

      const data = {
        className: 'Person',
        id: 'foo-id',
        values: {
          name: 'Alice',
        },
      };

      return expect(manager.saveRawData(data)).to.be.fulfilled();
    });

    it('rejects with NotFoundError for not found object', () => {
      const manager = createManager();
      const id = 'non-existent-id';

      return expect(manager.findRawData(id)).to.be.rejectedWith(NotFoundError);
    });
  });
};

export default testIDataManager;
