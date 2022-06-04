const mongoose = require('mongoose');
require('dotenv').config();
const {MONGODB_URI} = process.env
mongoose.connect(MONGODB_URI)

// connecting events
mongoose.connection
.on('open', () => console.log('you are connected!'))
.on('close', () => console.log('you are disconnected!'))
.on('error', (error) => console.log(error))