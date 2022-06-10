const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2:{ 
        type: mongoose.Types.ObjectId,
        ref : 'User',
        required: true
    },
    messages: [{
        type: mongoose.Types.ObjectId,
        ref: 'Message'
    }]
},
    {timestamps: true}
);
const Match = mongoose.model('Match', MatchSchema)
module.exports = Match;