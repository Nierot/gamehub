const app = require('express')();
const settings = require('./settings.json');


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.listen(settings.port, () => {
    console.log(`Listening on http://localhost:${settings.port}`)
});