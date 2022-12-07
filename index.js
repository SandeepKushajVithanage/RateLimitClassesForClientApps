const PromiseRateLimit = require("./PromiseRateLimit");
const PromiseQueue = require("./PromiseQueue");
const PromiseRLQueue = require("./PromiseRLQueue");

console.log("hello world", new Date().toISOString());

const promise = async (id) =>
  await new Promise((resolve) => {
    console.log(`${id} Promise started at ${new Date().toISOString()}`);
    setTimeout(() => {
      console.log(`${id} Promise finished at ${new Date().toISOString()}`);
      resolve(`${id} Promise resolved at ${new Date().toISOString()}`);
    }, 10 * 1000);
  });

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const testPromise = async () => {
  for (let index = 0; index < 100; index++) {
    // PromiseRateLimit.call("uniqueIdForPromise", promise, [index])
    // PromiseQueue.call(promise, [index])
    PromiseRLQueue.call(promise, [index])
      .then(console.log)
      .catch((error) => console.log(error.message));

    await snooze(3 * 1000);
  }
};

testPromise();
