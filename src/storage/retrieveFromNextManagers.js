import NotFoundError from 'egxo/errors/NotFoundError';

const retrieveFromNextManagers = (id, managers) => {
  if (managers.length < 1) {
    return Promise.reject(new NotFoundError());
  }

  return managers[0].findRawData(id)
    .catch((error) => {
      if (managers.length > 1) {
        return retrieveFromNextManagers(id, managers.slice(1));
      }

      throw error;
    });
};

export default retrieveFromNextManagers;
