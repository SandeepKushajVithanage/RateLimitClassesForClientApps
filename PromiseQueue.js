class PromiseQueue {
  constructor() {
    this._queue = [];
    this._processing = false;
  }

  call = (callback, params) => {
    return new Promise((resolve, reject) => {
      this._queue.push({ callback, params, resolve, reject });
      if (!this._processing) this._process();
    });
  };

  _process = () => {
    const nextPromise = this._queue.shift();
    this._processing = true;
    nextPromise
      .callback(...nextPromise.params)
      .then(nextPromise.resolve)
      .catch(nextPromise.reject)
      .finally(() => {
        this._processing = false;
        if (this._queue.length) this._process();
      });
  };
}

const instance = new PromiseQueue();
Object.freeze(PromiseQueue);

module.exports = instance;
