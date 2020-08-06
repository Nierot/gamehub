const app = require('express')();
const settings = require('./settings.json');
const bodyParser = require('body-parser');
const discord = require('./utils/discord');
const { Worker } = require('worker_threads');

let workers = {};

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
})

app.get('/start/*', async (req, res) => {
    let game = req.url.split('/')[2];
    if (!settings.available_games.includes(game)) return res.send('whats that');

    res.send(`Launching an instance of ${game}`);
    let worker = new Worker('./test.js');
    worker.on('message', msg => {
        workers[msg.toString()] = worker;
        console.log(workers);
    });
    worker.on('error', err => console.error(err));
    worker.on('exit', exitCode => console.log(`Worker has stopped with exit code: ${exitCode}`));
});

app.get('/discord/callback/success', async (req, res) => {
    let user = await discord.getUser(req.query.access_token);
    res.render('pages/discord', {
        id: user.id,
        username: user.username,
        email: user.email
    })
})

app.get('/discord/callback', (req, res) => {
    res.sendFile('static/discord_redirect.html', {
        root: '.'
    });
})

app.get('/discord', (req, res) => {
    res.redirect(settings.discord_oauth_url);
})

app.use(bodyParser);
app.set('view engine', 'ejs');

app.listen(settings.port, () => {
    console.log(`Listening on http://localhost:${settings.port}`)
    //setInterval(() => console.log(workers), 5000);
});