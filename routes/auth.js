const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req,res)=>{
    const {username,email,password} = req.body;
    const hashed = await bcrypt.hash(password,10);
    const user = new User({username,email,password:hashed});
    await user.save();
    res.json({msg:'User created'});
});

// Login
router.post('/login', async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({msg:'User not found'});
    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.status(400).json({msg:'Invalid password'});
    const token = jwt.sign({id:user._id},'SECRET_KEY',{expiresIn:'1d'});
    res.json({token,username:user.username, userId:user._id});
});

module.exports = router;
