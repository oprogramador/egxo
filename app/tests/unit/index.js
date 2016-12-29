import directCreateApp from 'egxo/routing/createApp';
import directSerializerFactory from 'egxo/serializer/SerializerFactory';
import expect from 'egxo/tests/expect';

describe('index', () => {
  afterEach('clear global window', () => {
    delete global.window;
  });

  afterEach('clear require cache', () => {
    delete require.cache[require.resolve('egxo/index')];
  });

  it('returns SerializerFactory', () => {
    // eslint-disable-next-line global-require
    const SerializerFactory = require('egxo/index').SerializerFactory;

    expect(SerializerFactory).to.equal(directSerializerFactory);
  });

  it('returns createApp when not in browser', () => {
    // eslint-disable-next-line global-require
    const createApp = require('egxo/index').createApp;

    expect(createApp).to.equal(directCreateApp);
  });

  it('does not return createApp when in browser', () => {
    global.window = {};
    // eslint-disable-next-line global-require
    const createApp = require('egxo/index').createApp;

    expect(createApp).to.be.undefined();
  });
});
