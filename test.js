const app = require('express')();
const { parentPort } = require('worker_threads');

app.get('/', (req, res) => {
    res.send('oof');
});

app.get('/exit', (req, res) => {
    process.exit(0);
})

const listener = app.listen(0, () => {
    parentPort.postMessage(listener.address().port);
    console.log('Started a test server');
    console.log(`Listening on http://localhost:${listener.address().port}`)
});