const { Worker, isMainThread } = require("worker_threads");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'INPUT> '
});

function runService(workerData) {
  /**
   * We create new Worker
   * @see https://nodejs.org/api/worker_threads.html#worker_threads_new_worker_filename_options
   * @type {module:worker_threads.Worker}
   */
  const worker = new Worker("./service.js", { workerData });
  /**
   * Send message to Worker
   */

  /**
   * React on incoming messages
   */
  worker.on("message", incoming => console.log(incoming));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code => console.log(`Worker stopped with exit code ${code}`));

  setTimeout(() => worker.postMessage("I executes only in 1s"), 1000);
  return worker
}

(async function main() {
  /**
   * We are inside MainThread management process
   * and runService (subRoutines ===>)
   */
  console.log({ isMainThread });
  const workerPool = [];
  try {
    rl.prompt();
    rl.on('line', (line) => {
      switch (line) {
        case 'start':
          /**
           * We start our service
           */
          const worker = runService("let's begin");
          workerPool.push(worker)
          rl.prompt();
          break;
        case 'tag':
          console.log('tag')
          rl.prompt();
          break;
        case 'exit':
          process.exit(0)
          break;
        default:
          if (workerPool.length) {
            workerPool[0].postMessage(line)
          }
          rl.prompt();
      }
    })
  } catch (e) {
    console.error(e)
  }
})()
