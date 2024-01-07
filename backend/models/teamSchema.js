const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  conference: {
    type: String,
    enum: ['western', 'eastern'],
    required: true
  },
  roster: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  }],
  logoLink: {
    type: String
  },
  statistics: {
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    }
  }
});

const Team = mongoose.model('Team', teamSchema, 'Teams');

module.exports = Team;
