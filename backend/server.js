require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const uri = `mongodb+srv://admin:${process.env.mongoPass}${process.env.mongoAtlasURL}`;
//const uri = 'mongodb://localhost:27017';
const http = require('http');
const socketIo = require('socket.io');
const Match = require('./models/matchSchema');
const User = require('./models/userSchema');
const Team = require('./models/teamSchema');

mongoose.connect(uri, {
  dbName: `${process.env.mongoDBname}`
});

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
};

const app = express();
app.use(cors(corsOptions));
const PORT = 3001;

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('API Connected to database'));

const playersRouter = require('./routes/playersRoutes');
app.use('/players', playersRouter);
const teamsRouter = require('./routes/teamsRoutes');
app.use('/teams', teamsRouter);
const matchRouter = require('./routes/matchesRoutes');
app.use('/matches', matchRouter);
const utilRouter = require('./routes/utilRoutes');
app.use('/util', utilRouter);
const userRouter = require('./routes/userRoutes');
app.use('/users', userRouter);

const server = app.listen(PORT, () => console.log(`server started on ${PORT}`));
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (origin.startsWith('http://localhost:3000')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinCommentSection', async (matchId) => {
    socket.join(matchId);
    console.log(`Client joined match ${matchId}`);

    try {
      const match = await Match.findById(matchId).populate({
        path: 'comments',
        populate: { path: 'author', model: 'User' }
      });
      const initialComments = match.comments || [];
      socket.emit('initialComments', initialComments);
    } catch (error) {
      console.error('Error fetching initial comments:', error);
    }
  });

  socket.on('comment', async (matchId, commentData) => {
    //console.log(commentData);
    try {
      const updatedMatch = await Match.findByIdAndUpdate(
        matchId,
        { $push: { comments: commentData } },
        { new: true }
      ).populate({
        path: 'comments',
        populate: { path: 'author', model: 'User' }
      });

      io.to(matchId).emit('updatedComments', updatedMatch.comments);
    } catch (error) {
      console.error('Error saving comment and updating match:', error);
    }
  });

  socket.on('joinTeamChat', async (teamId) => {
    socket.join(teamId);
    console.log(`Client joined team ${teamId} chat`);

    try {
      const team = await Team.findById(teamId).populate({
        path: 'messages',
        populate: { path: 'author', model: 'User' }
      });
      const initialMessages = team.messages.slice(-20) || [];
      socket.emit('initialTeamMessages', initialMessages);
    } catch (error) {
      console.error('Error fetching initial team messages:', error);
      socket.emit('initialTeamMessages', []);
    }
  });

  socket.on('teamMessage', async (teamId, messageData) => {
    try {
      const team = await Team.findByIdAndUpdate(
        teamId,
        { $push: { messages: messageData } },
        { new: true }
      ).populate({
        path: 'messages',
        populate: { path: 'author', model: 'User' }
      });

      io.to(teamId).emit('updatedTeamMessages', team.messages.slice(-20));
    } catch (error) {
      console.error('Error saving team message and updating team:', error);
    }
  });

  socket.on('joinTrainingRoom', async (teamId) => {
    socket.join(`trainingRoom_${teamId}`);
    console.log(`Client joined training room for team ${teamId}`);

    try {
      const team = await Team.findById(teamId);
      socket.emit('initialTrainings', team.trainings || []);
    } catch (err) {
      console.error('Error fetching initial trainings:', err);
    }
  });

  socket.on('addTraining', async (teamId, newTraining) => {
    try {
      const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        { $push: { trainings: newTraining } },
        { new: true }
      );
      io.to(`trainingRoom_${teamId}`).emit('updatedTrainings', updatedTeam.trainings);
    } catch (err) {
      console.error('Error adding training:', err);
    }
  });

  socket.on('editTraining', async (teamId, updatedTraining) => {
    try {
      const updatedTeam = await Team.findOneAndUpdate(
        { _id: teamId, 'trainings._id': updatedTraining.id },
        { $set: { 'trainings.$': updatedTraining } },
        { new: true }
      );
      io.to(`trainingRoom_${teamId}`).emit('updatedTrainings', updatedTeam.trainings);
    } catch (err) {
      console.error('Error editing training:', err);
    }
  });

  socket.on('deleteTraining', async (teamId, trainingId) => {
    try {
      const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        { $pull: { trainings: { _id: trainingId } } },
        { new: true }
      );

      io.to(`trainingRoom_${teamId}`).emit('updatedTrainings', updatedTeam.trainings);
    } catch (error) {
      console.error('Error deleting training:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

module.exports = app;
