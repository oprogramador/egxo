import faker from 'faker';

const createBasePersonClass = () => class BasePerson {
  constructor({ name }, id) {
    this.name = name;
    this.id = id || faker.random.uuid();
  }

  getValues() {
    return {
      name: this.name,
    };
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;

    return this;
  }

  getClassName() {
    return 'Person';
  }

  getId() {
    return this.id;
  }
};

export default createBasePersonClass;
