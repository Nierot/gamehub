const app = require('express')();
const settings = require('./settings.json');
const bodyParser = require('body-parser');
const discord = require('./utils/discord');
const threads = require('./utils/threads');
const cors = require('cors');

let workers = {};

app.get('/', (req, res) => res.render('pages/index'));
app.get('/login', (req, res) => res.render('pages/login'))

app.get('/start/*', async (req, res) => {
    let game = req.url.split('/')[2];
    if (!settings.available_games.includes(game)) return res.sendStatus(400);
    console.log(`Starting an instance of ${game}`);
    threads.spawnInstance(settings.game_paths[game])
        .then(obj => {
            workers[obj.port] = {
                worker: obj.worker,
                dateCreated: new Date()
            }
            res.send(obj.port); // Reverse proxy
            console.log(workers);
        })
        .catch(err => {
            res.sendStatus(500);
            console.error(err);
        })
});

app.get('/discord/callback/success', async (req, res) => {
    let user = await discord.getUser(req.query.access_token);
    res.render('pages/discord', {
        id: user.id,
        username: user.username,
        email: user.email
    })
})

app.get('/discord/callback', (req, res) => res.sendFile('static/discord_redirect.html', { root: '.' }))
app.get('/discord', (req, res) => res.redirect(settings.discord_oauth_url))

app.use(bodyParser);
app.use(cors);
app.set('view engine', 'ejs');

app.listen(settings.port, () => {
    console.log(`Listening on http://localhost:${settings.port}`)
    //setInterval(() => console.log(workers), 5000);
});