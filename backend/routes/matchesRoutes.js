const express = require('express');
const router = express.Router();
const Match = require('../models/matchSchema');
const bodyParser = require('body-parser');
const DataHandler = require('../classes/databaseHandler');
const matchHandler = new DataHandler();

router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const newMatchdata = req.body;
    const addedMatch = await matchHandler.addDocument(Match, newMatchdata);
    res.status(201).json(addedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const matches = await matchHandler.getAllDocumentsPopulated(Match,  {
        'opponents.team': 'opponents.players.player',
        'opponents.team.roster': '',
      });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const matchId = req.params.id;
  const updateData = req.body; 
  try {
    const updatedMatch = await matchHandler.patchDocument(Match, { _id: matchId }, updateData);
    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const matchId = req.params.id;
  try {
    const retrievedMatch = await matchHandler.getMatchWithPopulatedTeamsAndPlayers(Match, matchId)
    res.json(retrievedMatch);
  } catch (error) {
    res.status(500).json({error: 'Didnt find such team'});
  }
})

router.delete('/:id', async (req, res) => {
  const matchId = req.params.id;

  try {
    const deletedMatch = await matchHandler.deleteDocument(Match, { _id: matchId });
    res.json(deletedMatch);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;