import ArangoSerializer from 'egxo/serializer/ArangoSerializer';
import HttpSerializer from 'egxo/serializer/HttpSerializer';
import NotFoundError from 'egxo/errors/NotFoundError';
import Serializer from 'egxo/serializer/Serializer';

const serializers = {
  ArangoSerializer,
  HttpSerializer,
};

export default {
  create({ implementationName, implementationParams, prototypes }) {
    const serializerImplementationClass = serializers[implementationName];

    if (typeof serializerImplementationClass === 'undefined') {
      throw new NotFoundError();
    }

    const serializerImplementation = new serializerImplementationClass(implementationParams);

    const serializer = new Serializer({
      prototypes,
      serializerImplementation,
    });

    return serializer;
  },
};
