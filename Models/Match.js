const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const MatchSchema = new mongoose.Schema({
    away: {
        id: String,
        name: String,
        image_id: String,
        cc: String
    },
    home: {
        id: String,
        name: String,
        image_id: String,
        cc: String
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        type: String,
        required: true
    },
    league: {
        id: String,
        name: String,
        cc: String
    },
    ft: {
        type: Number,
        required: true
    },
    ht: {
        type: Number,
        required: true
    },
    preBookieTotal: {
        type: Number,
        required: true
    },
    htBookieTotal: {
        type: Number,
        required: true
    }
}, { emitIndexErrors: true });

const handleE11000 = function(error, res, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next();
    }
};

MatchSchema.post('insertMany', handleE11000);

MatchSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Matches', MatchSchema);