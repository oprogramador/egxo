import IDataManager from 'egxo/storage/IDataManager';
import IDataReceiver from 'egxo/storage/IDataReceiver';
import IDataSender from 'egxo/storage/IDataSender';
import NotFoundError from 'egxo/errors/NotFoundError';
import _ from 'lodash';
import retrieveFromNextManagers from 'egxo/storage/retrieveFromNextManagers';

const _classes = Symbol('classes');
const _objects = Symbol('objects');
const _nextManagers = Symbol('nextManagers');
const _sendToNextManagers = Symbol('sendToNextManagers');
const _retrieveFromNextManagers = Symbol('retrieveFromNextManagers');
const _createRawData = Symbol('createRawData');
const _findSync = Symbol('findSync');

class DataManager {
  static getInterfaces() {
    return [
      IDataManager,
      IDataReceiver,
      IDataSender,
    ];
  }

  constructor({ classes }) {
    this[_classes] = classes;
    this[_objects] = {};
    this[_nextManagers] = [];
  }

  save(object) {
    const rawData = this[_createRawData](object);

    return this[_sendToNextManagers](rawData)
      .then(() => {
        this[_objects][object.getId()] = {
          object,
          rawData,
        };
      });
  }

  [_createRawData](object) {
    const data = {
      className: object.getClassName(),
      id: object.getId(),
      values: object.getValues(),
    };

    return data;
  }

  findRawData(id) {
    try {
      const objectWithMetadata = this[_findSync](id);

      return Promise.resolve(objectWithMetadata.rawData);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  [_sendToNextManagers](data) {
    return Promise.all(this[_nextManagers].map(manager => manager.saveRawData(data)));
  }

  [_retrieveFromNextManagers](id) {
    return retrieveFromNextManagers(id, this[_nextManagers])
      .then(rawData => this.saveRawData(rawData));
  }

  saveRawData(rawData) {
    const constructor = this[_classes][rawData.className];
    const object = new constructor(rawData.values, rawData.id);
    this[_objects][rawData.id] = {
      object,
      rawData,
    };

    return Promise.resolve(object);
  }

  find(id) {
    return this[_retrieveFromNextManagers](id)
      .catch((error) => {
        if (error instanceof NotFoundError) {
          return this[_findSync](id).object;
        }
        throw error;
      });
  }

  [_findSync](id) {
    const objectWithMetadata = this[_objects][id];

    if (!_.isUndefined(objectWithMetadata)) {
      return objectWithMetadata;
    }

    throw new NotFoundError();
  }

  addNext(manager) {
    this[_nextManagers].push(manager);
  }

  isDirty(object) {
    try {
      const oldObject = this[_findSync](object.getId());
      const currentData = JSON.stringify(this[_createRawData](object));
      const oldData = JSON.stringify(oldObject.rawData);

      return currentData !== oldData;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return true;
      }

      throw error;
    }
  }
}

export default DataManager;
