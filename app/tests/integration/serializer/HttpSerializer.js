import ArangoSerializer from 'egxo/serializer/ArangoSerializer';
import HttpSerializer from 'egxo/serializer/HttpSerializer';
import Serializer from 'egxo/serializer/Serializer';
import createApp from 'egxo/routing/createApp';
import { db } from 'egxo/servicesManager';
import runSerializerBasicTests from
  'egxo/tests/integration/serializer/helpers/runSerializerBasicTests';

let listener;
const port = 1234;
const url = `http://localhost:${port}`;

describe('HttpSerializer', () => {
  beforeEach('create app', () => {
    const serializerImplementation = new ArangoSerializer({ db });
    const serializer = new Serializer({
      serializerImplementation,
    });
    const app = createApp({
      serializer,
    });
    listener = app.listen(port);
  });

  afterEach('destroy app', () => {
    listener.close();
  });

  runSerializerBasicTests(() => new HttpSerializer({ url }));
});
