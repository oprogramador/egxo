import IDataManager from 'egxo/storage/IDataManager';
import IDataReceiver from 'egxo/storage/IDataReceiver';
import IDataSender from 'egxo/storage/IDataSender';
import testIDataManager from 'egxo/tests/unit/storage/testIDataManager';
import testIDataReceiver from 'egxo/tests/unit/storage/testIDataReceiver';
import testIDataSender from 'egxo/tests/unit/storage/testIDataSender';

const interfaceTestsMap = {
  [IDataManager]: testIDataManager,
  [IDataReceiver]: testIDataReceiver,
  [IDataSender]: testIDataSender,
};

export default interfaceTestsMap;
