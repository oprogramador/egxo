import uuid from 'uuid';

const _classes = Symbol('classes');
const _objects = Symbol('objects');

class Manager {
  constructor({ classes }) {
    this[_classes] = classes;
    this[_objects] = {};
  }

  save(object) {
    const id = uuid.v4();
    const values = object.getValues();
    const className = object.getClassName();
    this[_objects][id] = {
      className,
      id,
      values,
    };

    return Promise.resolve(id);
  }

  find(id) {
    const objectWithMetadata = this[_objects][id];
    const constructor = this[_classes][objectWithMetadata.className];
    const object = new constructor(objectWithMetadata.values);

    return Promise.resolve(object);
  }
}

export default Manager;
