const mongoose = require('mongoose');
const ModelSchema = new mongoose.Schema({
    name:String,
    type:String,
    category:String,
    price:Number,
    stlFiles:[String],
    pdfFiles:[String],
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    approved:{type:Boolean, default:true},
    createdAt:{type:Date,default:Date.now}
});
module.exports = mongoose.model('Model',ModelSchema);
