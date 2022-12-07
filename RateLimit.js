class RateLimit {
  constructor() {
    this._promises = []; // { promiseId, promise, startedAt }
  }

  call = (promiseId, callback, params) => {
    let request;
    const index = this._promises.findIndex(
      (item) => item.promiseId === promiseId
    );
    if (index >= 0) request = this._promises[index];
    return new Promise((resolve) => {
      if (request) {
        resolve(request.promise);
      } else {
        const promise = callback(...params).finally(() => {
          this._promises = this._promises.filter((promise) => {
            promise.promiseId !== promiseId;
          });
        });
        if (request) {
          this._promises[index] = {
            ...request,
            promise,
            startedAt: Date.now(),
          };
        } else {
          this._promises.push({ promiseId, promise, startedAt: Date.now() });
        }
        resolve(promise);
      }
    });
  };
}

const instance = new RateLimit();
Object.freeze(RateLimit);

module.exports = instance;
