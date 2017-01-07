import expect from 'egxo/tests/expect';

const testIDataManager = (createManager) => {
  describe('IDataReceiver', () => {
    it('provides addNext method', () => {
      const manager = createManager();

      expect(() => manager.addNext({})).to.not.throw();
    });
  });
};

export default testIDataManager;
