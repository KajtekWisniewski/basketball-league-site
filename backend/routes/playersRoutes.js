require('dotenv').config();

const express = require('express');
const router = express.Router();
const Player = require('../models/playerSchema');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res) => {

    try {
      const { name } = req.body;

      const existingPlayer = await Player.findOne({ name });
      if (existingPlayer) {
        return res.status(400).json({ message: 'Player with the same name already exists' });
      }
  
      const newPlayer = new Player({
        name: req.body.name,
        age: req.body.age,
        birthdate: new Date(req.body.birthdate),
        countryOfOrigin: req.body.countryOfOrigin,
        height: req.body.height,
        team: req.body.team,
        position: req.body.position,
        teamNumber: req.body.teamNumber,
        pictureLink: req.body.pictureLink,
        fantasyScore: req.body.fantasyScore,
        statistics: {
          gamesPlayed: req.body.statistics.gamesPlayed,
          rebounds: req.body.statistics.rebounds,
          points: req.body.statistics.points,
          foulsCommitted: req.body.statistics.foulsCommitted,
          freeThrowsMade: req.body.statistics.freeThrowsMade,
          freeThrowPercentage: req.body.statistics.freeThrowPercentage,
        },
      });
  
      const savedPlayer = await newPlayer.save();
  
      res.status(201).json(savedPlayer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

module.exports = router;