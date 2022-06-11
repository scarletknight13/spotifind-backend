const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { Playlist } = require('../models');
const { findById } = require('../models/Message');


router.get('/', async (req, res) => {
    try {
        res.send('playlist');
    } catch (error) {
        res.status(400).json(error);
    }
})
router.put('/add', async (req, res) => {
    try {
        const user = await db.User.findById(req.body._id);
        const newPlaylist = [...req.body.playlist];
        console.log(newPlaylist, req.body._id);
        await db.User.findByIdAndUpdate(req.body._id, {playlist: newPlaylist});
        res.json({message: 'Success'});
    } 
    catch (error) {
        res.json({message: 'Failed', error : error}); 
    }
})
module.exports = router;