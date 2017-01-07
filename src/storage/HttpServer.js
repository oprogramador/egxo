import IDataReceiver from 'egxo/storage/IDataReceiver';
import bodyParser from 'body-parser';
import express from 'express';
import retrieveFromNextManagers from 'egxo/storage/retrieveFromNextManagers';

const _listener = Symbol('listener');
const _nextManagers = Symbol('nextManagers');
const _sendToNextManagers = Symbol('sendToNextManagers');
const _retrieveFromNextManagers = Symbol('retrieveFromNextManagers');

class HttpServer {
  static getInterfaces() {
    return [
      IDataReceiver,
    ];
  }

  constructor({ port }) {
    const app = express()
      .use(bodyParser.json())
      .post('/object', (req, res) => {
        const data = req.body;
        this[_sendToNextManagers](data)
          .then(() => res.send(data));
      })
      .get('/object/:id', (req, res) => {
        const id = req.params.id;

        this[_retrieveFromNextManagers](id)
          .then(data => res.send(data));
      });

    this[_listener] = app.listen(port);
    this[_nextManagers] = [];
  }

  [_sendToNextManagers](data) {
    return Promise.resolve(this[_nextManagers].map(manager => manager.saveRawData(data)));
  }

  [_retrieveFromNextManagers](id) {
    return retrieveFromNextManagers(id, this[_nextManagers]);
  }

  close() {
    this[_listener].close();
  }

  addNext(manager) {
    this[_nextManagers].push(manager);
  }
}

export default HttpServer;
