const express = require('express');
const router = express.Router();
const Team = require('../models/teamSchema');
const bodyParser = require('body-parser');
const DataHandler = require('../classes/databaseHandler');
const AggregationHandler = require('../classes/aggregationHandler');
const TeamHandler = require('../classes/teamHandler')
const genericHandler = new DataHandler();
const teamAggregationHandler = new AggregationHandler();
const teamHandler = new TeamHandler();


router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const newTeamData = req.body;
    const addedTeam = await genericHandler.addDocument(Team, newTeamData);
    res.status(201).json(addedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const teams = await genericHandler.getAllDocuments(Team, 'roster');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/calcwr', async (req, res) => {

  try {
    const teamsWithWinPercentage = await teamAggregationHandler.calculateWinPercentage(Team);
    res.json(teamsWithWinPercentage);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const teamId = req.params.id;
  const updateData = req.body; 
  try {
    const updatedTeam = await genericHandler.patchDocument(Team, { _id: teamId }, updateData);
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const teamId = req.params.id;
  try {
    const retrievedTeam = await genericHandler.getSingleDocument(Team, teamId, 'roster')
    res.json(retrievedTeam);
  } catch (error) {
    res.status(500).json({error: 'Didnt find such team'});
  }
})

router.delete('/:id', async (req, res) => {
  const teamId = req.params.id;

  try {
    const deletedTeam = await genericHandler.deleteDocument(Team, { _id: teamId });
    res.json(deletedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/t/:conferenceOrDivision', async (req, res) => {
  const { conferenceOrDivision } = req.params;

  try {
    const teams = await teamHandler.getTeamsByConferenceOrDivision(conferenceOrDivision);
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:teamId/changeRoster', async (req, res) => {
  const { teamId } = req.params;
  const { playerId } = req.body;

  try {
    if (!playerId) {
      return res.status(400).json({ error: 'PlayerId is required in the request body.' });
    }

    const updatedTeam = await teamHandler.addToRoster(teamId, playerId);
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Player already in a roster' });
  }
});

router.delete('/:teamId/changeRoster', async (req, res) => {
  const { teamId } = req.params;
  const { playerId } = req.body;

  try {
    if (!playerId) {
      return res.status(400).json({ error: 'PlayerId is required in the request body.' });
    }

    const updatedTeam = await teamHandler.removeFromRoster(teamId, playerId);
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;