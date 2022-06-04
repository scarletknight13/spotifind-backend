const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { User } = require('../models');


 router.get('/', async (req, res) => {
    try {
        res.send('users');
    } catch (error) {
        res.status(400).json(error);
    }
})

 router.post('/register', async (req, res) => {
    const user = req.body;
    const takenUsername = await User.findOne({username: user.username});
    const takenEmail = await User.findOne({email: user.email})

    if (takenUsername || takenEmail){
        res.json({message: "Username or email has already been taken"})
    } else {
        user.password = await bcrypt.hash(req.body.password, 12);

        const dbUser = new User ({
            name: user.name,
            username: user.username.toLowerCase(),
            email: user.email.toLowerCase(),
            password: user.password,
        })
        dbUser.save();
        res.json({message: "Success"})
    }
})

router.post("/login", (req,res) => {
    
    const userLogin = req.body;
    
    User.findOne({username: userLogin.username})
    .then(dbUser => {
        if(!dbUser) {
            return res.json({
                message: "Invalid Username or Password"
            })
        }
        bcrypt.compare(userLogin.password, dbUser.password)
        .then(isCorrect => { 
            console.log(isCorrect)
            if(isCorrect) {
                const payload = {
                    id: dbUser._id,
                    username: dbUser.username,
                    // info in the JWT
                }
                jwt.sign(
                    payload,
                    "secret",
                    {expiresIn: 86400},
                    (err, token) => {
                        if(err) return res.json({message: err})
                        return res.json({
                            message: "Success",
                            token: "Bearer " + token,
                        })
                    }
                )
            } else {
                return res.json({
                    message: "Invalid Username or Passowrd"
                })
            }

        })
    })
})

function verifyJWT(req,res,next){
    const token = req.headers["x-access-token"]?.split(' ')[1]

    if(token) {
        jwt.verify(token, "secret", (err, decoded) => {
            if(err) return res.json({
                isLoggedIn: false,
                message: "Failed to Login"
            })
            req.user = {};
            req.user.id = decoded.id
            req.user.username =decoded.username
            next()
        })
    } else {
        res.json({message: "Incorrect Token", isLoggedIn: false})
    }
}

router.get("/isUserAuth", verifyJWT, (req,res) => {
    console.log(req.body);
    res.json({isLoggedIn: true, username: req.user.username})
})
router.post('/updateprofile/:id', async (req, res) => {
    const user = req.body;
    const takenUsername = await User.findOne({username: user.username});
    const takenEmail = await User.findOne({email: user.email})

    if (takenUsername || takenEmail){
        res.json({message: "Username or email has already been taken"})
    } 
    else {
        const currentUser = await db.User.findByIdAndUpdate(req.params.id, {
            username: user.username,
            email : user.email
        }) 
        res.json({message: "Success"})
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await db.User.findByIdAndDelete(req.params.id);
        res.json({message: 'Success'})
    } 
    catch (error) {
        res.status(400).json(error);
    }
})
router.put('/:id', async (req, res)=>{
    try{
        const updatedUser = await db.User.findByIdAndUpdate(req.params.id, req.body);
        res.json({message: 'Success'});
    }
    catch(error){
        res.status(400).json(error);
    }
})
module.exports = router;