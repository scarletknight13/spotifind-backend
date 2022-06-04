const mongoose = require('mongoose')

const PlaylistSchema = new mongoose.Schema({
    data: [{
        type: String,
    }]
},
    {timestamps: true}
);
const Playlist = mongoose.model('Playlist', PlaylistSchema)
module.exports = Playlist;