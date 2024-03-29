const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  countryOfOrigin: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  team: {
    type: String,
    required: true,
    default: 'teamless'
  },
  position: {
    type: String,
    required: true
  },
  teamNumber: {
    type: Number,
    required: true
  },
  pictureLink: {
    type: String,
    default: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627885.png"
  },
  fantasyScore: {
    type: Number,
    default: 0
  },
  statistics: {
    gamesPlayed: {
      type: Number,
      default: 0
    },
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

const Player = mongoose.model('Player', playerSchema, 'Players');

module.exports = Player;
