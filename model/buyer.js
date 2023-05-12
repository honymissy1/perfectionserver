const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');


const BuyerSchema = new mongoose.Schema({
    userId: String,
    manualId: String
})

const Buyer = mogoose.model('buyer', BuyerSchema);


module.exports = Buyer