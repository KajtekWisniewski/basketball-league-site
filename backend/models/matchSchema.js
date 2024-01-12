const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  matchStatistics: {
    rebounds: {
        type: Number,
        default: 0
      },
      points: {
        type: Number,
        default: 0
      },
      foulsCommitted: {
        type: Number,
        default: 0
      },
      freeThrowsMade: {
        type: Number,
        default: 0
      },
      freeThrowPercentage: {
        type: Number,
        default: 0
      }
  }
});

const opponentSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  players: [playerSchema]
});

const matchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  played: {
    type: Boolean,
    required: true
  },
  opponents: [opponentSchema]
});

const Match = mongoose.model('Match', matchSchema, 'Matches');

module.exports = Match;
