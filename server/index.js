const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const scrapers = require('./scrapers');
const db = require('./db');

const port = 3000;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/creators', async (req, res) => {
    const creators = await db.getAllCreators();
    res.send(creators)
})

app.post('/creators', async (req, res) => {
    console.log(req.body)
    const channelData = await scrapers.scrapeChannel(req.body.channelURL)
    const creators = await db.insertCreator(channelData.name, channelData.avatarURL, req.body.channelURL)
    res.send(creators);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))