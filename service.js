const { workerData, parentPort, isMainThread } = require("worker_threads");

/**
 * Any JS code in a synchronous way
 * without blocking the "main thread"
 */

parentPort.on("message", message => {
  parentPort.postMessage({ message_incoming: message });
  if (message === "exit") {
    parentPort.close();
  }
});

parentPort.postMessage({ start_message: workerData, isMainThread });
