const _classes = Symbol('classes');
const _objects = Symbol('objects');
const _nextManagers = Symbol('nextManagers');
const _sendToNextManagers = Symbol('sendToNextManagers');
const _createRawData = Symbol('createRawData');

class Manager {
  constructor({ classes }) {
    this[_classes] = classes;
    this[_objects] = {};
    this[_nextManagers] = [];
  }

  save(object) {
    this[_objects][object.getId()] = object;
    const data = this[_createRawData](object);
    this[_sendToNextManagers](data);

    return Promise.resolve();
  }

  [_createRawData](object) {
    const data = {
      className: object.getClassName(),
      id: object.getId(),
      values: object.getValues(),
    };

    return data;
  }

  [_sendToNextManagers](data) {
    this[_nextManagers].forEach(manager => manager.saveRawData(data));
  }

  saveRawData(data) {
    const constructor = this[_classes][data.className];
    const object = new constructor(data.values);
    this[_objects][data.id] = object;

    return Promise.resolve();
  }

  find(id) {
    const object = this[_objects][id];

    return Promise.resolve(object);
  }

  addNext(manager) {
    this[_nextManagers].push(manager);
  }
}

export default Manager;
