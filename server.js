require('./config/db.connection.js');
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');
const {PORT = 4000} = process.env;
const cors = require('cors');
const morgan = require('morgan');
const controllers = require('./controllers');


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

app.listen(PORT, ()=>console.log("You're listening on port " + PORT))

