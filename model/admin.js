const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');


const AdminSchema = new mongoose.Schema({
    email: String,
    accountBalance: Number,
    password: String,
})

module.exports = mogoose.model('admin', AdminSchema);