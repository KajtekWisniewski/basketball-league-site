require('dotenv').config();

const express = require('express');
const router = express.Router();
const Player = require('../models/playerSchema');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/players', async (req, res) => {
    try {

    } catch (error) {
        console.error("players_get_error:", error.message)
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;