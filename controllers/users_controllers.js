const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { User } = require('../models');


router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, gender, age } = req.body;
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
          age,
          gender,
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
router.get('/userinfo/:id', async (req, res) =>{
  try {
    const currentUser = await db.User.findById(req.params.id);
    res.json(currentUser);
  }
  catch(error){
    console.log(error);
    res.status(400).json(error);
  }
})
router.put('/update', async (req, res) => {
  try {
      const user = await db.User.findByIdAndUpdate(req.body.id, req.body);
      res.json({message: 'Success'});
    } catch (error) {
      console.log(error);
      res.json({message: 'Failed to update user', error : error});
    }
})

router.get('/potentials/:id', async (req, res) => {
  try {
      console.log(req.params.id);
      const currentUser = await db.User.findById(req.params.id);
      const preferences = {...currentUser.preferences};
      let users;
      if(preferences.distance === 'global'){
        users = users = await db.User.find({$and : [{age : {$gte : preferences.ageMin}}, {age : {$lte : preferences.ageMax} }, {_id : {$ne: req.params.id} }, {gender : preferences.gender}] } ).select(['email', 'username', 'profilePic', 'playlist', 'age', 'gender', 'bio']); 
      }
      else{
         users = await db.User.find({$and : [{age : {$gte : preferences.ageMin}}, {age : {$lte : preferences.ageMax} }, {_id : {$ne: req.params.id} }, {gender : preferences.gender}, {zipcode: currentUser.zipcode}] } ).select(['email', 'username', 'profilePic', 'playlist', 'age', 'gender', 'bio']);
      }
      const usersCopy = [...users];
      const seen = {};
      let seenArtist = new Set();
      for(let i of currentUser.playlist){
        seenArtist.add(i.artist);
        seen[i.artist + i.name] = 1;
      }
      usersCopy.sort((a, b) => {
        let ascore = 0, bscore = 0;
        if(a){
          for(let i of a.playlist){
            let key = i.artist + i.name;
            if(seenArtist.has(i.artist))
              ascore += 10;
            if(key in seen){
              ascore += 50;
            }
          }
        }
        if(b){
          for(let i of b.playlist){
            let key = i.artist + i.name;
            if(seenArtist.has(i.artist))
              bscore += 10;
            if(key in seen){
              bscore += 50;
            }
          }
        }
        return bscore - ascore;
      });
      res.json(usersCopy);
  } catch (error) {
      console.error(error);
      res.status(400).json(error);
  }
})

module.exports = router;