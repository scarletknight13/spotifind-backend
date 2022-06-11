const express = require('express')
const router = express.Router()
const db = require('../models');
const mongoose = require('mongoose');
router.put('/add', async (req, res) => {
    try {
        console.log(req.body);
        const user = await db.User.findOne({username: req.body.user});
        const likedUser = await db.User.findOne({username: req.body.likedUser})
        const likes = user.likes;
        const newLikes = [...likes, likedUser._id];
        user.likes = newLikes;
        user.save();
        res.json({message: 'Success'});
    } 
    catch (error) {
        console.log(error)
        res.json({message: 'Success', error : error}); 
    }
})
module.exports = router;