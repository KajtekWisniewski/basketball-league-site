const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const DataHandler = require('../classes/databaseHandler');
const utilHandler = new DataHandler();

router.use(bodyParser.json());

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