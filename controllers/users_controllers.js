const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { User } = require('../models');
const { findById, findByIdAndUpdate } = require('../models/Message');


router.get('/', async (req, res) => {
  try {
      const users = await db.User.find({}).select(['email', 'username', 'profilePic', 'playlist', 'age', 'gender']);
      res.json(users);
  } catch (error) {
      console.error(error);
      res.status(400).json(error);
  }
})
 router.post('/register', async (req, res) => {
    try {
        const { username, email, password, name } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck)
          return res.json({ msg: "Username already used", status: false });
        const emailCheck = await User.findOne({ email });
        if (emailCheck)
          return res.json({ msg: "Email already used", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          name,
          email,
          username,
          password: hashedPassword,
          age: 19,
          gender: 'Man',
        });
        delete user.password;
        return res.json({ status: true, user });
      } catch (error) {
        console.log(error);
        res.status(400).json(error);
      }
})

router.post("/login", async (req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
          return res.json({ msg: "Incorrect email or Password", status: false });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
          return res.json({ msg: "Incorrect email or Password", status: false });
        delete user.password;
        return res.json({ status: true, user });
      } catch (error) {
        res.status.json(error);
      }
})
router.post('/update', async (req, res) => {
    try {
      const user = findByIdAndUpdate(req.body.id, req.body);
      res.json({message: 'Success'});
    } catch (error) {
      res.json({message: 'Failed to update user', error : error});
    }
})

module.exports = router;