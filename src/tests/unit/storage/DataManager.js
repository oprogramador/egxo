import DataManager from 'egxo/storage/DataManager';
import createBasePersonClass from 'egxo/tests/helpers/createBasePersonClass';
import testInterfaces from 'egxo/tests/helpers/testInterfaces';

const createManager = () => {
  const Person = createBasePersonClass();
  const manager = new DataManager({
    classes: {
      Person,
    },
  });

  return manager;
};

describe('DataManager', () => {
  testInterfaces(DataManager, createManager);
});
