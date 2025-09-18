const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
    model:{type:mongoose.Schema.Types.ObjectId, ref:'Model'},
    buyer:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    amount:Number,
    stripeSessionId:String,
    status:{type:String, enum:['pending','success','failed'], default:'pending'},
    createdAt:{type:Date, default:Date.now}
});
module.exports = mongoose.model('Payment',PaymentSchema);
