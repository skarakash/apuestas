const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const GameSchema = new mongoose.Schema({
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
    sport_id: {
        type: String,
        required: true
    },
    ss: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    time_status: {
        type: String,
        required: true
    },
    league: {
        id: String,
        name: String,
        cc: String
    },
    stats: {
        last_10_mins_score: Array,
        possession: Array
    },
    events: {
        type: Object,
        required: true
    },
    ft: {
        type: Number,
        required: true
    },
    ht: {
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

GameSchema.post('insertMany', handleE11000);

GameSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Games', GameSchema);