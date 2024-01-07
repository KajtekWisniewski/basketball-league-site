const express = require('express');
const router = express.Router();
const Team = require('../models/teamSchema');
const bodyParser = require('body-parser');
const DataHandler = require('../classes/databaseHandler');
const teamHandler = new DataHandler();

router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const newPlayerData = req.body;
    const addedPlayer = await teamHandler.addDocument(Team, newPlayerData);
    res.status(201).json(addedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const players = await teamHandler.getAllDocuments(Team);
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const playerId = req.params.id;
  const updateData = req.body; 
  try {
    const updatedPlayer = await teamHandler.patchDocument(Team, { _id: playerId }, updateData);
    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const playerId = req.params.id;
  try {
    const retrievedPlayer = await teamHandler.getSingleDocument(Team, playerId)
    res.json(retrievedPlayer);
  } catch (error) {
    res.status(500).json({error: 'Didnt find such player'});
  }
})

router.delete('/:id', async (req, res) => {
  const playerId = req.params.id;

  try {
    const deletedPlayer = await teamHandler.deleteDocument(Team, { _id: playerId });
    res.json(deletedPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;