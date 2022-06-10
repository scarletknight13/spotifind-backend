const express = require('express')
const router = express.Router()
const db = require('../models');
const mongoose = require('mongoose');
router.put('/add', async (req, res) => {
    try {
        const user = await db.User.findById(req.body.userId);
        const likes = user.likes;
        const newLikes = [...likes, mongoose.Types.ObjectId(req.body.likedUserId)];
        console.log(newLikes);
        await db.User.findByIdAndUpdate(req.body.userId, {likes: newLikes});
        res.json({message: 'Success'});
    } 
    catch (error) {
        console.log(error)
        res.json({message: 'Success', error : error}); 
    }
})
module.exports = router;