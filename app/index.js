import isBrowser from 'egxo/env/isBrowser';

if (!isBrowser()) {
  // eslint-disable-next-line global-require
  const createApp = require('egxo/routing/createApp').default;

  module.exports.createApp = createApp;
}
