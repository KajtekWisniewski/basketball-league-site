const express = require('express');
const router = express.Router();
const Player = require('../models/PlayerSchema');
const bodyParser = require('body-parser');
const DataHandler = require('../classes/databaseHandler');
const databaseHandler = new DataHandler();
const AggregationHandler = require('../classes/aggregationHandler');
const playerAggregationHandler = new AggregationHandler();
const multer = require('multer');
const fs = require('fs');

router.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', async (req, res) => {
  try {
    const newPlayerData = req.body;
    const addedPlayer = await databaseHandler.addDocument(Player, newPlayerData);
    res.status(201).json(addedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const players = await databaseHandler.getAllDocuments(Player);
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/teamless', async (req, res) => {
  try {
    const players = await databaseHandler.getDocumentsByField(
      Player,
      'team',
      'teamless'
    );
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/allids', async (req, res) => {
  try {
    const players = await databaseHandler.getAllDocuments(Player);
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/calcage', async (req, res) => {
  try {
    const playersWithAge = await playerAggregationHandler.calculateAge(Player);
    res.json(playersWithAge);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const playerId = req.params.id;
  const updateData = req.body;
  try {
    const updatedPlayer = await databaseHandler.patchDocument(
      Player,
      { _id: playerId },
      updateData
    );
    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const playerId = req.params.id;
  try {
    const updateStatsForPlayer = await playerAggregationHandler.updatePlayerStatistics2(
      playerId
    );
    const retrievedPlayer = await databaseHandler.getSingleDocument(Player, playerId);
    res.json(retrievedPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Didnt find such player' });
  }
});

router.delete('/:id', async (req, res) => {
  const playerId = req.params.id;

  try {
    const deletedPlayer = await databaseHandler.deleteDocument(Player, {
      _id: playerId
    });
    res.json(deletedPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const fileContent = req.file.buffer.toString('utf8');

    const result = await databaseHandler.importDataFromFile(Player, fileContent);

    res.send('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).send(error.message);
  }
});

router.get('/updateStats/:id', async (req, res) => {
  const playerId = req.params.id;

  try {
    const updatedStats = await playerAggregationHandler.updatePlayerStatistics2(
      playerId
    );
    res.json({ message: 'player stats updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while aggregating player stats' });
  }
});

router.get('/p/:teamName', async (req, res) => {
  const { teamName } = req.params;

  try {
    const players = await databaseHandler.getDocumentsByField(Player, 'team', teamName);
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//array of player-ids from specific team, more of a util for populating database
router.get('/team/:teamName/players', async (req, res) => {
  try {
    const { teamName } = req.params;

    const playerIds = await databaseHandler.getSpecificDocumentValuesByField(
      Player,
      'team',
      teamName,
      '_id'
    );

    res.json(playerIds);
  } catch (error) {
    console.error('Error fetching player IDs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
