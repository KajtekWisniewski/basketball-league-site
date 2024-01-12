const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const DataHandler = require('../classes/databaseHandler');
const utilHandler = new DataHandler();
const TeamHandler = require('../classes/teamHandler')
const teamHandler = new TeamHandler();

router.use(bodyParser.json());

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
      const count = await utilHandler.countDocuments(require(`../models/${model}Schema`), condition);
      res.json({ count });
    } catch (error) {
      console.error('Error counting documents:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;

//convert badly formatted database names for teams:
router.get('/convertTeamNames', async (req,res) => {
  try {
    const results = await teamHandler.convertTeamNamesToLowerCase()
    res.json(results)
  } catch (error) {
    console.error('Error converting names', error);
    res.status(500).json({error: 'Internal server error'});
  }
})