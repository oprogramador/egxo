import expect from 'egxo/tests/expect';

const testIDataManager = (createManager) => {
  describe('IDataReceiver', () => {
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
  });
};

export default testIDataManager;
