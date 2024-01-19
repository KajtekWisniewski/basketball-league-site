const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const DataHandler = require('../classes/databaseHandler');
const utilHandler = new DataHandler();
const TeamHandler = require('../classes/teamHandler');
const teamHandler = new TeamHandler();
const Team = require('../models/teamSchema');
const Player = require('../models/PlayerSchema');
const Match = require('../models/matchSchema');
const MatchHandler = require('../classes/matchHandler');
const matchHandler = new MatchHandler();

router.use(bodyParser.json());

function parseStartDate(dateString) {
  const year = parseInt(dateString.split('-')[0], 10);
  const month = parseInt(dateString.split('-')[1], 10) || 1;
  const day = parseInt(dateString.split('-')[2], 10) || 1;

  return new Date(year, month - 1, day);
}

function parseEndDate(dateString) {
  const year = parseInt(dateString.split('-')[0], 10);
  const month = parseInt(dateString.split('-')[1], 10) || 12;
  const day = parseInt(dateString.split('-')[2], 10) || 31;

  return new Date(year, month - 1, day + 1);
}

// router.get('/search', async (req, res) => {
//   const { q } = req.query;

//   try {
//     const teamsResults = await Team.find({ name: { $regex: new RegExp(q, 'i') } });
//     const playersResults = await Player.find({ name: { $regex: new RegExp(q, 'i') } });

//     const matchesResults = await Match.find({
//       date: {
//         $gte: parseStartDate(q),
//         $lt: parseEndDate(q)
//       }
//     }).populate({
//       path: 'opponents',
//       populate: [
//         {
//           path: 'team',
//           model: 'Team'
//         }
//       ]
//     });

//     const searchResults = [
//       ...teamsResults.map((team) => ({
//         flag: 'Team',
//         id: team._id,
//         ...team.toObject()
//       })),
//       ...playersResults.map((player) => ({
//         flag: 'Player',
//         id: player._id,
//         ...player.toObject()
//       })),
//       ...matchesResults.map((match) => ({
//         flag: 'Match',
//         id: match._id,
//         ...match.toObject()
//       }))
//     ];

//     res.json(searchResults);
//   } catch (error) {
//     console.error('Error during search:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/search', async (req, res) => {
  const { q } = req.query;

  try {
    const teamsResults = await Team.find({ name: { $regex: new RegExp(q, 'i') } });
    const playersResults = await Player.find({ name: { $regex: new RegExp(q, 'i') } });

    let matchesResults = [];

    const startDate = parseStartDate(q);
    const endDate = parseEndDate(q);
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      matchesResults = await Match.find({
        date: {
          $gte: startDate,
          $lt: endDate
        }
      }).populate({
        path: 'opponents',
        populate: [
          {
            path: 'team',
            model: 'Team'
          }
        ]
      });
    }

    //no w skrocie to nie dziala ale juz trudno. narazie nie bedzie tej funkcjonalnosci
    const matchesResultsByTeam = await Match.find({
      'opponents.0.team.name': {
        $regex: new RegExp(q, 'i')
      }
    }).populate({
      path: 'opponents',
      populate: [
        {
          path: 'team',
          model: 'Team'
        }
      ]
    });

    const searchResults = [
      ...teamsResults.map((team) => ({
        flag: 'Team',
        id: team._id,
        ...team.toObject()
      })),
      ...playersResults.map((player) => ({
        flag: 'Player',
        id: player._id,
        ...player.toObject()
      })),
      ...matchesResults.map((match) => ({
        flag: 'Match',
        id: match._id,
        ...match.toObject()
      })),
      ...matchesResultsByTeam.map((match) => ({
        flag: 'Match',
        id: match._id,
        ...match.toObject()
      }))
    ];

    if (q !== '') {
      res.json(searchResults);
    }
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//collection size
router.get('/count/:model', async (req, res) => {
  const { model } = req.params;

  try {
    const count = await utilHandler.countDocuments(require(`../models/${model}Schema`));
    res.json({ count });
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//amount of documents from specified key value pair eg /util/count/player/team/boston-celtics
router.get('/count/:model/:field/:value', async (req, res) => {
  const { model, field, value } = req.params;

  try {
    const condition = { [field]: value };
    const count = await utilHandler.countDocuments(
      require(`../models/${model}Schema`),
      condition
    );
    res.json({ count });
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

//convert badly formatted database names for teams:
router.get('/convertTeamNames', async (req, res) => {
  try {
    const results = await teamHandler.convertTeamNamesToLowerCase();
    res.json(results);
  } catch (error) {
    console.error('Error converting names', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
