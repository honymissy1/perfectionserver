const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    userId: String,
    activated: false
})


module.exports = mogoose.model('user', UserSchema);