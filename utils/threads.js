const { Worker } = require('worker_threads');

module.exports = {
    spawnInstance: modulePath => {
        return new Promise((resolve, reject) => {
            let worker = new Worker(`${modulePath}`);
            worker.on('message', msg => {
                resolve({ 'worker': worker, 'port': msg.toString()})
            });
            worker.on('error', err => reject(err));
            worker.on('exit', exitCode => console.log(`Worker has stopped with exit code: ${exitCode}`));
        })

    }
}