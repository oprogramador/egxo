import NotFoundError from 'egxo/errors/NotFoundError';
import expect from 'egxo/tests/expect';
import retrieveFromNextManagers from 'egxo/storage/retrieveFromNextManagers';
import sinon from 'sinon';

describe('retrieveFromNextManagers', () => {
  describe('#find', () => {
    it('rejects with the last error when all managers reject', () => {
      const errorA = new Error();
      const errorB = new Error();
      const managerA = {
        findRawData: sinon.stub().rejects(errorA),
      };
      const managerB = {
        findRawData: sinon.stub().rejects(errorB),
      };
      const id = 'foo-id';

      return expect(retrieveFromNextManagers(id, [managerA, managerB])).to.be.rejectedWith(errorB);
    });

    it('rejects with NotFoundError when there are no managers', () => {
      const id = 'foo-id';

      return expect(retrieveFromNextManagers(id, [])).to.be.rejectedWith(NotFoundError);
    });

    it('calls findRawData with id for each manager', () => {
      const managerA = {
        findRawData: sinon.stub().rejects(new Error()),
      };
      const managerB = {
        findRawData: sinon.stub().rejects(new Error()),
      };
      const id = 'foo-id';

      return retrieveFromNextManagers(id, [managerA, managerB])
        .catch(() => {
          expect(managerA.findRawData).to.be.calledOnce();
          expect(managerA.findRawData).to.be.calledWithExactly(id);
          expect(managerB.findRawData).to.be.calledOnce();
          expect(managerB.findRawData).to.be.calledWithExactly(id);
        });
    });

    it('retrieves from second manager when the first one rejects', async () => {
      const data = {
        className: 'Person',
        id: 'bob-id',
        values: {
          name: 'Bob',
        },
      };
      const managerA = {
        findRawData: sinon.stub().rejects(new Error()),
      };
      const managerB = {
        findRawData: sinon.stub().resolves(data),
      };
      const id = 'foo-id';

      const result = await retrieveFromNextManagers(id, [managerA, managerB]);

      expect(result).to.deep.equal(data);
    });

    it('retrieves from third manager when two first ones reject', async () => {
      const data = {
        className: 'Person',
        id: 'bob-id',
        values: {
          name: 'Bob',
        },
      };
      const managerA = {
        findRawData: sinon.stub().rejects(new Error()),
      };
      const managerB = {
        findRawData: sinon.stub().rejects(new Error()),
      };
      const managerC = {
        findRawData: sinon.stub().resolves(data),
      };
      const id = 'foo-id';

      const result = await retrieveFromNextManagers(id, [managerA, managerB, managerC]);

      expect(result).to.deep.equal(data);
    });

    it('retrieves from first manager when it resolves', async () => {
      const data = {
        className: 'Person',
        id: 'cindy-id',
        values: {
          name: 'Cindy',
        },
      };
      const managerA = {
        findRawData: sinon.stub().resolves(data),
      };
      const managerB = {
        findRawData: sinon.stub().resolves({}),
      };
      const id = 'foo-id';

      const result = await retrieveFromNextManagers(id, [managerA, managerB]);

      expect(result).to.deep.equal(data);
    });

    it('retrieves when there is only one manager and it resolves', async () => {
      const data = {
        className: 'Person',
        id: 'dave-id',
        values: {
          name: 'Dave',
        },
      };
      const managerA = {
        findRawData: sinon.stub().resolves(data),
      };
      const id = 'foo-id';

      const result = await retrieveFromNextManagers(id, [managerA]);

      expect(result).to.deep.equal(data);
    });
  });
});
