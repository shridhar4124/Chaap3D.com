const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    password:String,
    createdAt:{type:Date,default:Date.now}
});
module.exports = mongoose.model('User',UserSchema);
