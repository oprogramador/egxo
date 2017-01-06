import HttpRequester from 'egxo/storage/HttpRequester';
import express from 'express';
import testInterfaces from 'egxo/tests/helpers/testInterfaces';

const port = 1234;

const createManager = () => {
  const url = `http://localhost:${port}`;
  const manager = new HttpRequester({ url });

  return manager;
};

let listener;

describe('HttpRequester', () => {
  beforeEach('create server', () => {
    const app = express();
    app.post('/object', (req, res) => res.send());
    listener = app.listen(port);
  });

  testInterfaces(HttpRequester, createManager);

  afterEach('close port', () => {
    listener.close();
  });
});
