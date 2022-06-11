const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { Match } = require('../models');
const { populate } = require('../models/Message');
const mongoose = require('mongoose');


router.get('/', async (req, res) => {
    try {
        res.send('match');
    } catch (error) {
        res.status(400).json(error);
    }
})
router.put('/:id', async (req, res) => {
    try {
        console.log(req.body);
        const Match = await db.Match.findByIdAndDelete(req.params.id);
        const user1 = await db.User.findOne({username : req.body.user1.username});
        const user2 = await db.User.findOne({username : req.body.user2.username});
        const user1Matches = user1.matches;
        const user2Matches = user2.matches;
        const newMatches = user1Matches.filter(match => !match.equals(req.params.id));
        const newMatches2 = user2Matches.filter(match => !match.equals(req.params.id));
        await db.User.findByIdAndUpdate(user1._id, {matches: newMatches});  
        await db.User.findByIdAndUpdate(user2._id, {matches: newMatches2});              
    } 
    catch (error) {
        console.log(error);
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
router.get('/isMatch/:likedUser/:currentUser', async (req, res) => {
    try {
        const likedUser = await db.User.findOne({username: req.params.likedUser});
        const currentUser = await db.User.findOne({username: req.params.currentUser});
        const likedUserLikes = likedUser.likes;
        let flag = false;
        for(let i = 0; i < likedUserLikes.length; i++) {
            if(currentUser._id.toString() == likedUserLikes[i].toString() ){
                flag = true;
            }
        }
        
        if(flag){
            const user1PastMatches = likedUser.matches
            const user2PastMatches = currentUser.matches
            const match = {
                user1: likedUser._id,
                user2: currentUser._id
            }
            const newMatch = await db.Match.create(match);
            await db.User.findByIdAndUpdate(likedUser._id, {matches: [...user1PastMatches, newMatch._id]});
            await db.User.findByIdAndUpdate(currentUser._id, {matches: [...user2PastMatches, newMatch._id]});
        }
        res.json({reply: flag})
    } 
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
})
module.exports = router;