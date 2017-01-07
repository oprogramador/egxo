import HttpServer from 'egxo/storage/HttpServer';
import HttpStatus from 'http-status';
import expect from 'egxo/tests/expect';
import request from 'supertest-as-promised';
import sinon from 'sinon';
import testInterfaces from 'egxo/tests/helpers/testInterfaces';

const createManager = () => {
  const port = 1234;
  const manager = new HttpServer({ port });

  return manager;
};

let server;

describe('HttpServer', () => {
  testInterfaces(HttpServer, createManager);

  describe('POST', () => {
    const preparePost = () => {
      const port = 1235;
      server = new HttpServer({ port });
      const data = {
        className: 'Person',
        id: 'foo-id',
        values: {
          name: 'Alice',
        },
      };
      const manager = {
        saveRawData: sinon.stub().resolves(),
      };
      server.addNext(manager);

      const postRequest = request(`http://localhost:${port}`)
        .post('/object')
        .send(data);

      return {
        data,
        manager,
        postRequest,
      };
    };

    it('sends data to next manager', () => {
      const { postRequest, data, manager } = preparePost();

      return postRequest
        .then(() => {
          expect(manager.saveRawData).to.be.calledOnce();
          expect(manager.saveRawData).to.be.calledWithExactly(data);
        });
    });

    it('returns the same data', () => {
      const { postRequest, data } = preparePost();

      return postRequest
        .expect(data);
    });

    it('returns OK status', () => {
      const { postRequest } = preparePost();

      return postRequest
        .expect(HttpStatus.OK);
    });

    afterEach('close server', () => server.close());
  });

  describe('GET', () => {
    const prepareGet = () => {
      const port = 1235;
      server = new HttpServer({ port });
      const id = 'foo-object-id';
      const data = {
        className: 'Person',
        id,
        values: {
          name: 'Bob',
        },
      };
      const manager = {
        findRawData: sinon.stub().rejects(),
      };
      manager.findRawData.withArgs(id).resolves(data);
      server.addNext(manager);

      const getRequest = request(`http://localhost:${port}`)
        .get(`/object/${id}`);

      return {
        data,
        getRequest,
        manager,
      };
    };

    it('retrieves data from next manager', () => {
      const { getRequest, data } = prepareGet();

      return getRequest
        .expect(data);
    });

    it('returns OK status', () => {
      const { getRequest } = prepareGet();

      return getRequest
        .expect(HttpStatus.OK);
    });

    afterEach('close server', () => server.close());
  });
});
