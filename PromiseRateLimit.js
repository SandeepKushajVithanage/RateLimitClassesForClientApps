const DEFAULT_RATE_LIMIT = 30 * 1000;

class PromiseRateLimit {
  constructor() {
    this.promises = []; // { promiseId, promise, startedAt }
  }

  call = (promiseId, callback, params, timeGap = DEFAULT_RATE_LIMIT) => {
    let request;
    const index = this.promises.findIndex(
      (item) => item.promiseId === promiseId
    );
    if (index >= 0) request = this.promises[index];
    return new Promise((resolve) => {
      if (request && request.startedAt + timeGap >= Date.now()) {
        return resolve(request.promise);
      }
      const promise = callback(...params);
      if (request) {
        this.promises[index] = {
          ...request,
          promise,
          startedAt: Date.now(),
        };
      } else {
        this.promises.push({ promiseId, promise, startedAt: Date.now() });
      }
      resolve(promise);
    });
  };
}

const instance = new PromiseRateLimit();
Object.freeze(PromiseRateLimit);

module.exports = instance;
