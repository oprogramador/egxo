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
});
