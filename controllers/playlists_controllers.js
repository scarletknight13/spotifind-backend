const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { Playlist } = require('../models');


router.get('/', async (req, res) => {
    try {
        res.send('playlist');
    } catch (error) {
        res.status(400).json(error);
    }
})
module.exports = router;