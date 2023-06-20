const mongoose = require('mongoose');


const RequestSchema = new mongoose.Schema({
    email: String,
    suggestion: String
})

const Suggestion = mongoose.model('suggestion', RequestSchema);


module.exports = Suggestion