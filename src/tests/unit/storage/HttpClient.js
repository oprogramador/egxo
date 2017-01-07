import HttpClient from 'egxo/storage/HttpClient';
import HttpStatus from 'http-status';
import express from 'express';
import testInterfaces from 'egxo/tests/helpers/testInterfaces';

const port = 1234;

const createManager = () => {
  const url = `http://localhost:${port}`;
  const manager = new HttpClient({ url });

  return manager;
};

let listener;

describe('HttpClient', () => {
  beforeEach('create server', () => {
    const app = express();
    app
      .post('/object', (req, res) => res.send({}))
      .get('/object/:id', (req, res) => res.status(HttpStatus.NOT_FOUND).end());
    listener = app.listen(port);
  });

  testInterfaces(HttpClient, createManager);

  afterEach('close port', () => {
    listener.close();
  });
});
