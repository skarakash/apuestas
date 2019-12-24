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
    ss: {
        type: Number,
        required: true
    },
    scores: {
        type: Object
    },
    odds: {
        type: Object,
        required: true
    },
});

MatchSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Matches', MatchSchema, 'Stats');