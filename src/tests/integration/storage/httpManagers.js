import HttpClient from 'egxo/storage/HttpClient';
import HttpServer from 'egxo/storage/HttpServer';
import Manager from 'egxo/storage/DataManager';
import createBasePersonClass from 'egxo/tests/helpers/createBasePersonClass';
import expect from 'egxo/tests/expect';

let server;

describe('HTTP managers', () => {
  afterEach('close server', () => server.close());

  const prepareManagers = () => {
    const Person = createBasePersonClass();

    const clientManager = new Manager({
      classes: {
        Person,
      },
    });
    const port = 1234;
    const client = new HttpClient({ url: `http://localhost:${port}` });
    server = new HttpServer({ port });
    const serverManager = new Manager({
      classes: {
        Person,
      },
    });
    clientManager.addNext(client);
    server.addNext(serverManager);

    const alice = new Person({ name: 'Alice' });

    return {
      alice,
      clientManager,
      serverManager,
    };
  };

  it('sends data to server', () => {
    const { clientManager, serverManager, alice } = prepareManagers();

    return clientManager.save(alice)
      .then(() => serverManager.find(alice.getId()))
      .then((object) => {
        expect(object.getName()).to.equal('Alice');
      });
  });

  it('retrieves data from server', () => {
    const { clientManager, serverManager, alice } = prepareManagers();

    return serverManager.save(alice)
      .then(() => clientManager.find(alice.getId()))
      .then((object) => {
        expect(object.getName()).to.equal('Alice');
      });
  });

  it.skip('updates data from server', () => {
    const { clientManager, serverManager, alice } = prepareManagers();

    return clientManager.save(alice)
      .then(() => clientManager.find(alice.getId()))
      .then((object) => {
        expect(object.getName()).to.equal('Alice');
      })
      .then(() => serverManager.find(alice.getId()))
      .then((serverAlice) => {
        serverAlice.setName('Alice2');

        return serverManager.save(serverAlice);
      })
      .then(() => clientManager.find(alice.getId()))
      .then((object) => {
        console.log(object.getName());
        expect(object.getName()).to.equal('Alice2');
      });
  });
});
