import IDataReceiver from 'egxo/storage/IDataReceiver';
import request from 'superagent-bluebird-promise';

const _url = Symbol('url');

class HttpRequester {
  static getInterfaces() {
    return [
      IDataReceiver,
    ];
  }

  constructor({ url }) {
    this[_url] = url;
  }

  saveRawData(rawData) {
    return request.post(`${this[_url]}/object`).send(rawData);
  }
}

export default HttpRequester;
