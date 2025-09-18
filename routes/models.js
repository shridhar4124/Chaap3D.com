const express = require('express');
const router = express.Router();
const multer = require('multer');
const Model = require('../models/Model');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

// Multer storage
const storage = multer.diskStorage({
    destination: (req,file,cb)=>cb(null,'uploads/'),
    filename: (req,file,cb)=>cb(null, Date.now()+'-'+file.originalname)
});
const upload = multer({ storage });

// Auth middleware
function auth(req,res,next){
    const token = req.headers.authorization;
    if(!token) return res.status(401).json({msg:'No token'});
    try{
        const decoded = jwt.verify(token,'SECRET_KEY');
        req.user = decoded;
        next();
    }catch(err){ res.status(401).json({msg:'Invalid token'}); }
}

// Upload model
router.post('/upload', auth, upload.fields([{name:'stlFiles'},{name:'pdfFiles'}]), async (req,res)=>{
    const {name,type,category,price} = req.body;
    const stlFiles = req.files['stlFiles'] ? req.files['stlFiles'].map(f=>f.path) : [];
    const pdfFiles = req.files['pdfFiles'] ? req.files['pdfFiles'].map(f=>f.path) : [];
    const model = new Model({name,type,category,price:price||0,stlFiles,pdfFiles,owner:req.user.id});
    await model.save();
    res.json(model);
});

// Get all models
router.get('/', async (req,res)=>{
    const models = await Model.find();
    res.json(models);
});

// Stripe checkout
router.post('/buy/:id', auth, async (req,res)=>{
    const model = await Model.findById(req.params.id);
    if(!model) return res.status(404).json({msg:'Model not found'});
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:[{
            price_data:{
                currency:'usd',
                product_data:{name:model.name},
                unit_amount:model.price*100
            },
            quantity:1
        }],
        mode:'payment',
        success_url:'http://127.0.0.1:5500/success.html',
        cancel_url:'http://127.0.0.1:5500/cancel.html'
    });
    res.json({url:session.url});
});

module.exports = router;
