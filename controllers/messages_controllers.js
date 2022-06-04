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
module.exports = router;