import IDataManager from 'egxo/storage/IDataManager';
import NotFoundError from 'egxo/errors/NotFoundError';
import _ from 'lodash';

const _classes = Symbol('classes');
const _objects = Symbol('objects');
const _nextManagers = Symbol('nextManagers');
const _sendToNextManagers = Symbol('sendToNextManagers');
const _retrieveFromNextManagers = Symbol('retrieveFromNextManagers');
const _createRawData = Symbol('createRawData');
const _findSync = Symbol('findSync');

class Manager {
  static getInterfaces() {
    return [
      IDataManager,
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
    const objectWithMetadata = this[_findSync](id);

    return objectWithMetadata.rawData;
  }

  [_sendToNextManagers](data) {
    return Promise.resolve(this[_nextManagers].map(manager => manager.saveRawData(data)));
  }

  [_retrieveFromNextManagers](id) {
    return Promise.all(this[_nextManagers].map(
      manager => manager.find(id)
        .catch((error) => {
          if (error instanceof NotFoundError) {
            return null;
          }
          throw error;
        })
    ))
      .then(objects => objects.find(object => object));
  }

  saveRawData(rawData) {
    const constructor = this[_classes][rawData.className];
    const object = new constructor(rawData.values);
    this[_objects][rawData.id] = {
      object,
      rawData,
    };

    return Promise.resolve();
  }

  find(id) {
    return Promise.resolve()
      .then(() => this[_findSync](id))
      .then(objectWithMetadata => objectWithMetadata.object)
      .catch((error) => {
        if (error instanceof NotFoundError && this[_nextManagers].length > 0) {
          return this[_retrieveFromNextManagers](id);
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

export default Manager;
