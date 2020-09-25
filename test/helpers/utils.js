exports.waitForAWhile = (time, fn) => new Promise(resolve => setTimeout(() => resolve(fn()), time));
