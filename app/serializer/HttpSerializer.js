import HTTPStatus from 'http-status';
import NotFoundError from 'egxo/errors/NotFoundError';
import request from 'superagent-bluebird-promise';

const privates = Symbol('privates');

export default class HttpSerializer {
  constructor({ url }) {
    this[privates] = {
      url,
    };
  }

  configure() {
    return Promise.resolve();
  }

  save(object) {
    return request.post(`${this[privates].url}/object`)
      .send(object);
  }

  reload(id) {
    return request.get(`${this[privates].url}/object/${id}`)
      .then(({ body }) => body)
      .catch(error => Promise.reject(error.status === HTTPStatus.NOT_FOUND ? new NotFoundError() : error));
  }
}
