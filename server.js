require('./config/db.connection.js');
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');
const {PORT = 4000} = process.env;
const cors = require('cors');
const morgan = require('morgan');
const controllers = require('./controllers');
const socket = require('socket.io')

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'))
app.use(express.json())
app.use('/users', controllers.users);
app.use('/messages', controllers.messages);
app.use('/matches', controllers.matches);
app.use('/playlists', controllers.playlists);
app.get('/', (req, res)=>{
    res.send('helloworld');
})

const server = app.listen(PORT, ()=>console.log("You're listening on port " + PORT))
const io = socket(server, {
    cors : {
        origin : 'http://localhost:4000',
        credentials: true,
    },
})
global.onlineUsers = new Map()
io.on('connection', (socket) => {
    global.chatSoket = socket;
    socket.on('add-user', (userId) => {
        conlineUsers.set(userId, socket.id);
    })
    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-recieve', data.msg);
        }
    });
}); 

