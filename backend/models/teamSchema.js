const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

const trainingSchema = new Schema({
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

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
  roster: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    }
  ],
  logoLink: {
    type: String,
    default:
      'https://cdn.nba.com/teams/uploads/sites/1610612738/2022/05/celtics_secondary.svg'
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
  },
  trainings: [trainingSchema],
  messages: [messageSchema]
});

const Team = mongoose.model('Team', teamSchema, 'Teams');

module.exports = Team;
