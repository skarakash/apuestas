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
    ht: {
        type: Number,
        required: true
    },
    league: {
        type: Object,
        required: true
    },
    mid: {
        type: Number,
        required: true
    },
    start: {
        type: Number,
        required: true
    },
    ss: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

MatchSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Matches', MatchSchema, 'Stats');