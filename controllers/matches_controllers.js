const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { Match } = require('../models');
const { populate } = require('../models/Message');


router.get('/', async (req, res) => {
    try {
        res.send('match');
    } catch (error) {
        res.status(400).json(error);
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const user = await db.User.findById(req.body.userId);
        const matches = user.matches;
        const newMaatches = matches.filter(match => match != req.params.id);
        await db.Match.findByIdAndDelete(req.params.id);
        await db.User.findByIdAndUpdate(req.body.userId, {matches: newMaatches});          
    } 
    catch (error) {
        res.status(400).json(error);
    }
})
router.get('/getmatches/:id', (req, res) => {
    db.User
    .findOne({_id: req.params.id })
    .populate({
        path: 'matches',
        populate: {
            path: 'user1'
        }
    })
    .populate({
        path: 'matches',
        populate: {
            path: 'user2',
        }
    })
    .populate({
        path: 'matches',
        populate: {
            path : 'messages',
            populate : {
                path : 'sender'
            }
        }
    })
    .populate({
        path: 'matches',
        populate: {
            path : 'messages',
            populate : {
                path : 'recipient'
            }
        }
    })
    .then((user) => {
        const newData = []
       for(let i of user.matches){
            const newMessages = []
            for(let j of i.messages){
                newMessages.push({recipient: j.recipient.username, sender: j.sender.username, content: j.content,})
            }
            newData.push({id : i._id, user1 : {username: i.user1.username, profilePic : i.user1.profilePic}, user2 : {username: i.user2.username, profilePic : i.user2.profilePic}, messages : newMessages})
       }
       res.json(newData); 
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err)})
})
router.post('/new', async (req, res) => {
    try {
        const user1 = await db.User.findOne({username: req.body.user1 }).populate('matches');
        const user2 = await db.User.findOne({username: req.body.user2 }).populate('matches');
        const user1PastMatches = user1.matches
        const user2PastMatches = user2.matches
        const match = {
            user1: user1._id,
            user2: user2._id
        }
        const newMatch = await db.Match.create(match);
        await db.User.findByIdAndUpdate(user1._id, {matches: [...user1PastMatches, newMatch._id]})
        await db.User.findByIdAndUpdate(user2._id, {matches: [...user2PastMatches, newMatch._id]})
        res.json({message : 'Success'})
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
   
})
router.get('/isMatch', async (req, res) => {
    try {
        const likedUser = await db.User.findById(req.body.likedUser);
        const found = likedUser.likes.find(element => element === currentUserId);
        res.json({response: found !== undefined});
    } 
    catch (error) {
        res.status(400).json(error);
    }
})
module.exports = router;