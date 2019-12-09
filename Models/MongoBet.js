const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const BetSchema = new mongoose.Schema({
   '%': {
       type: Number,
       required: true
   },
    id: {
        type: String,
        required: true,
        unique: false
    },
    odds: {
        type: Number,
        required: true,
    },
    teams: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true,
    },
    result: {
        type: String,
    },
    added: {
        type: String,
        required: true,
    }
});

BetSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Bets', BetSchema);