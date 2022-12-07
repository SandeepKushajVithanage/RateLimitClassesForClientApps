const MAX_API_LIMIT_PER_MINUTE = 30;
const MINUTE = 1 * 60 * 1000;

class PromiseQueue {
  constructor() {
    this._queue = [];
    this._processing = null;
  }

  call = (callback, params) => {
    return new Promise((resolve, reject) => {
      this._queue.push({ callback, params, resolve, reject });
      if (!this._processing) this._process();
    });
  };

  _process = () => {
    const nextPromise = this._queue.shift();
    nextPromise
      .callback(...nextPromise.params)
      .then(nextPromise.resolve)
      .catch(nextPromise.reject);
    this._processing = setInterval(() => {
      if (this._queue.length) {
        const nextPromise = this._queue.shift();
        nextPromise
          .callback(...nextPromise.params)
          .then(nextPromise.resolve)
          .catch(nextPromise.reject);
      } else {
        clearInterval(this._processing);
        this._processing = null;
      }
    }, MINUTE / MAX_API_LIMIT_PER_MINUTE);
  };
}

const instance = new PromiseQueue();
Object.freeze(PromiseQueue);

module.exports = instance;
