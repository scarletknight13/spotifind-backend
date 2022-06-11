const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { Message } = require('../models');

router.get('/', async (req, res) => {
    try {
        res.send('message');
    } catch (error) {
        res.status(400).json(error);
    }
})
router.post('/new', async (req, res) => {
    try {
        console.log(req.body);
        const sender = await db.User.findOne({username: req.body.sender})
        const recipient = await db.User.findOne({username: req.body.recipient});
        req.body.sender = sender._id
        req.body.recipient = recipient._id;
        const newMessage = await db.Message.create(req.body);
        console.log(sender)
        let match = await db.Match.findOne({user1: sender._id, user2: recipient._id});
        if(!match)
            match = await db.Match.findOne({user1: recipient._id, user2 : sender._id})
        const pastMessages = match.messages
        await db.Match.findByIdAndUpdate(match._id, {messages: [...pastMessages, newMessage._id]} )
        res.json({message : 'Success'})
    } catch (error) {
        console.log(error);
        req.error = error;
    }
})
module.exports = router;