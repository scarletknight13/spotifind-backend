const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender:{ 
        type: mongoose.Types.ObjectId,
        ref : 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
},
    {timestamps: true}
);
const Message = mongoose.model('Message', MessageSchema)
module.exports = Message;