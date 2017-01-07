import IDataSender from 'egxo/storage/IDataSender';
import request from 'superagent-bluebird-promise';

const _url = Symbol('url');

class HttpClient {
  static getInterfaces() {
    return [
      IDataSender,
    ];
  }

  constructor({ url }) {
    this[_url] = url;
  }

  saveRawData(rawData) {
    return request.post(`${this[_url]}/object`).send(rawData);
  }
}

export default HttpClient;
