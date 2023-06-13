const mongoose = require('mongoose');


const BuyerSchema = new mongoose.Schema({
    userId: String,
    manualId: String
})

const Buyer = mongoose.model('buyer', BuyerSchema);


module.exports = Buyer