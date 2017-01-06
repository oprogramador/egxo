import NotFoundError from 'egxo/errors/NotFoundError';
import createBasePersonClass from 'egxo/tests/helpers/createBasePersonClass';
import expect from 'egxo/tests/expect';

const createPersonClass = () => {
  const BasePerson = createBasePersonClass();

  class Person extends BasePerson {
  }

  return Person;
};

const testIDataManager = (IDataManagerClass) => {
  describe('IDataManager', () => {
    describe('#find', () => {
      it('rejects with NotFoundError for non-existent id', () => {
        const Person = createPersonClass();

        const manager = new IDataManagerClass({
          classes: {
            Person,
          },
        });

        return expect(manager.find('non-existent-id')).to.be.rejectedWith(NotFoundError);
      });

      it('retrieves from cache', () => {
        const Person = createPersonClass();

        const manager = new IDataManagerClass({
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

        const manager = new IDataManagerClass({
          classes: {
            Person,
          },
        });

        const alice = new Person({ name: 'Alice' });

        expect(manager.isDirty(alice)).to.be.true();
      });

      it('returns true for updated object', () => {
        const Person = createPersonClass();

        const manager = new IDataManagerClass({
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

        const manager = new IDataManagerClass({
          classes: {
            Person,
          },
        });

        const alice = new Person({ name: 'Alice' });

        return manager.save(alice)
          .then(() => expect(manager.isDirty(alice)).to.be.false());
      });
    });

    it('works with class identifier');

    it('saves dirty referenced objects');

    it('stores and retrieves', () => {
      const Person = createPersonClass();

      const manager = new IDataManagerClass({
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
};

export default testIDataManager;
