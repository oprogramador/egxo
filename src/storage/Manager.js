const _classes = Symbol('classes');
const _objects = Symbol('objects');
const _nextManagers = Symbol('nextManagers');
const _sendToNextManagers = Symbol('sendToNextManagers');

class Manager {
  constructor({ classes }) {
    this[_classes] = classes;
    this[_objects] = {};
    this[_nextManagers] = [];
  }

  save(object) {
    const id = object.getId();
    const values = object.getValues();
    const className = object.getClassName();
    const data = {
      className,
      id,
      values,
    };
    this[_objects][id] = data;
    this[_sendToNextManagers](data);

    return Promise.resolve();
  }

  [_sendToNextManagers](data) {
    this[_nextManagers].forEach(manager => manager.saveRawData(data));
  }

  saveRawData(data) {
    this[_objects][data.id] = data;

    return Promise.resolve();
  }

  find(id) {
    const objectWithMetadata = this[_objects][id];
    const constructor = this[_classes][objectWithMetadata.className];
    const object = new constructor(objectWithMetadata.values);

    return Promise.resolve(object);
  }

  addNext(manager) {
    this[_nextManagers].push(manager);
  }
}

export default Manager;
