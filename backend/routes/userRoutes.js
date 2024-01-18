const express = require('express');
const router = express.Router();
const UserHandler = require('../classes/userHandler');
const bodyParser = require('body-parser');
const userHandler = new UserHandler();
const DataHandler = require('../classes/databaseHandler');
const databaseHandler = new DataHandler();
const User = require('../models/userSchema');
const { generateToken } = require('../utils/generateToken');

router.use(bodyParser.json());

router.post('/register', async (req, res) => {
  try {
    const newUser = await userHandler.registerUser(req, res);
    res.status(201).json({ newUser, token: generateToken(newUser._id) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await userHandler.authUser(req, res);
    res.status(201).json({
      user,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.route('/profile').get(userHandler.protectMiddleware, userHandler.getUserProfile);

router.post('/profile/:id', async (req, res) => {
  try {
    //const protect = await userHandler.protectMiddleware(req, res);
    const updatedUser = await userHandler.updateUser(req, res);
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      team: updatedUser.team,
      pictureLink: updatedUser.pictureLink,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const players = await databaseHandler.getAllDocuments(User);
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await databaseHandler.deleteDocument(User, { _id: userId });
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error AAA' });
  }
});

module.exports = router;
