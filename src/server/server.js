const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const bodyParser = require('body-parser');

const socket = require('./socket');
const db = require('./db');


app.use(bodyParser.json({type:'application/json'}),cors());

socket.socketConfig(io);

const port = process.env.PORT || 3000;

app.post('/login', (req, res) => {
    db.connectDB('login', req, res);
})

app.get('/getChannels', (req, res) => {
    db.connectDB('getChannels', req, res);
})

app.get('/getChannelsByUser/:id', (req, res) => {
    db.connectDB('getChannels', req, res);
})

app.get('/getConversation/:id', (req, res) => {
    db.connectDB('getConversation', req, res);
})

app.post('/createChannel', (req, res) => {
    db.connectDB('createChannel', req, res);
})

app.post('/saveConversation', (req, res) => {
    db.connectDB('saveConversation', req, res);
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static(".../dist"));
}

server.listen(port, () => console.log(`Re-Chat listening on port ${port}!`))