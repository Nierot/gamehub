const app = require('express')();
const settings = require('./settings.json');
const DiscordOauth2 = require('discord-oauth2');
const bodyParser = require('body-parser');
const discord = require('./utils/discord');

const oauth = new DiscordOauth2({
    clientId: settings.discord_client_id,
    clientSecret: settings.discord_client_secret,
    redirectUri: settings.redirect_uri
})

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
})

app.get('/discord/callback/success', async (req, res) => {
    await discord.getUserID(req.query.access_token);
    res.json(await discord.getUser(req.query.access_token))
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
});