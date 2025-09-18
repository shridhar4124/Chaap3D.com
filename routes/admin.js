const express = require('express');
const router = express.Router();
const Model = require('../models/Model');
const User = require('../models/User');
const Payment = require('../models/Payment');
const jwt = require('jsonwebtoken');

function adminAuth(req,res,next){
    const token = req.headers.authorization;
    if(!token) return res.status(401).json({msg:'No token'});
    try{
        const decoded = jwt.verify(token,'SECRET_KEY');
        if(decoded.id !== 'ADMIN_USER_ID') return res.status(403).json({msg:'Not admin'});
        req.user = decoded;
        next();
    }catch(err){ res.status(401).json({msg:'Invalid token'}); }
}

// Users
router.get('/users', adminAuth, async (req,res)=>res.json(await User.find()));

// Models
router.get('/models', adminAuth, async (req,res)=>res.json(await Model.find().populate('owner','username email')));

// Payments
router.get('/payments', adminAuth, async (req,res)=>res.json(await Payment.find().populate('buyer','username email').populate('model','name')));

module.exports = router;
