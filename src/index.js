import DataManager from 'egxo/storage/DataManager';
import HttpClient from 'egxo/storage/HttpClient';
import isBrowser from 'egxo/env/isBrowser';

if (!isBrowser()) {
  // eslint-disable-next-line global-require
  const HttpServer = require('egxo/storage/HttpServer').default;

  module.exports.HttpServer = HttpServer;
}

export {
  HttpClient,
  DataManager,
};
