const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    messages: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      body: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  });

const Chat = mongoose.model('Chat', chatSchema, 'Matches');

module.exports = Chat;