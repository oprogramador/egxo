import SerializerFactory from 'egxo/serializer/SerializerFactory';
import isBrowser from 'egxo/env/isBrowser';

module.exports.SerializerFactory = SerializerFactory;

if (!isBrowser()) {
  // eslint-disable-next-line global-require
  const createApp = require('egxo/routing/createApp').default;

  module.exports.createApp = createApp;
}
