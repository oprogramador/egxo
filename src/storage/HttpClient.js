import IDataSender from 'egxo/storage/IDataSender';
import NotFoundError from 'egxo/errors/NotFoundError';
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

  findRawData(id) {
    return request.get(`${this[_url]}/object/${id}`)
      .then(({ body }) => body)
      .catch(() => Promise.reject(new NotFoundError()));
  }
}

export default HttpClient;
