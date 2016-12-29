import ArangoSerializer from 'egxo/serializer/ArangoSerializer';
import { db } from 'egxo/servicesManager';
import runSerializerBasicTests from
  'egxo/tests/integration/serializer/helpers/runSerializerBasicTests';

describe('ArangoSerializer', () => {
  runSerializerBasicTests(() => new ArangoSerializer({ db }));
});
