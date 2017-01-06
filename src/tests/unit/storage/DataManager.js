import DataManager from 'egxo/storage/DataManager';
import interfaceTestsMap from 'egxo/tests/interfaceTestsMap';

describe('DataManager', () => {
  DataManager.getInterfaces().forEach((interfaceSymbol) => {
    interfaceTestsMap[interfaceSymbol](DataManager);
  });
});
