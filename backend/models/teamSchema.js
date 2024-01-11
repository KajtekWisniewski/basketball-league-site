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
  division: {
    type: String,
    enum: ['atlantic', 'central', 'southeast', 'northwest', 'pacific', 'southwest']
  },
  roster: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  }],
  logoLink: {
    type: String,
    default: "https://cdn.nba.com/teams/uploads/sites/1610612738/2022/05/celtics_secondary.svg"
  },
  statistics: {
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    },
    winPercentage: {
      type: Number,
      default: 100
    }
  }
});

const Team = mongoose.model('Team', teamSchema, 'Teams');

module.exports = Team;
