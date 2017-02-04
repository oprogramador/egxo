import { DataManager, HttpClient } from 'egxo/index';
import directDataManager from 'egxo/storage/DataManager';
import directHttpClient from 'egxo/storage/HttpClient';
import directHttpServer from 'egxo/storage/HttpServer';
import expect from 'egxo/tests/expect';

describe('index', () => {
  afterEach('clear global window', () => {
    delete global.window;
  });

  afterEach('clear require cache', () => {
    delete require.cache[require.resolve('egxo/index')];
  });

  it('returns HttpServer when not in browser', () => {
    // eslint-disable-next-line global-require
    const HttpServer = require('egxo/index').HttpServer;

    expect(HttpServer).to.equal(directHttpServer);
  });

  it('does not return createApp when in browser', () => {
    global.window = {};
    // eslint-disable-next-line global-require
    const HttpServer = require('egxo/index').HttpServer;

    expect(HttpServer).to.be.undefined();
  });

  it('returns HttpClient', () => {
    expect(HttpClient).to.equal(directHttpClient);
  });

  it('returns DataManager', () => {
    expect(DataManager).to.equal(directDataManager);
  });
});
