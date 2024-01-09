const express = require('express');
const router = express.Router();
const Team = require('../models/teamSchema');
const bodyParser = require('body-parser');
const DataHandler = require('../classes/databaseHandler');
const AggregationHandler = require('../classes/aggregationHandler');
const teamHandler = new DataHandler();
const teamAggregationHandler = new AggregationHandler();

router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const newTeamData = req.body;
    const addedTeam = await teamHandler.addDocument(Team, newTeamData);
    res.status(201).json(addedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const teams = await teamHandler.getAllDocuments(Team, 'roster');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const teamId = req.params.id;
  const updateData = req.body; 
  try {
    const updatedTeam = await teamHandler.patchDocument(Team, { _id: teamId }, updateData);
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const teamId = req.params.id;
  try {
    const retrievedTeam = await teamHandler.getSingleDocument(Team, teamId, 'roster')
    res.json(retrievedTeam);
  } catch (error) {
    res.status(500).json({error: 'Didnt find such team'});
  }
})

router.delete('/:id', async (req, res) => {
  const teamId = req.params.id;

  try {
    const deletedTeam = await teamHandler.deleteDocument(Team, { _id: teamId });
    res.json(deletedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/t/:conferenceOrDivision', async (req, res) => {
  const { conferenceOrDivision } = req.params;

  try {
    const teams = await teamHandler.getTeamsByConferenceOrDivision(Team, conferenceOrDivision);
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/calcwr', async (req, res) => {
  const { conferenceOrDivision } = req.params;

  try {
    const teamsWithWinPercentage = await teamAggregationHandler.calculateWinPercentage(TeamModel);
    res.json(teamsWithWinPercentage);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;