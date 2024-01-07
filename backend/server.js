require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
//const uri = `mongodb+srv://admin:${process.env.mongoPass}${process.env.mongoAtlasURL}`;
// wiadomo ze tego tu nie powinno byc XD ALE cos sie piepszy z dotenv
const uri = `mongodb+srv://admin:9VxocsGp0kOwa5pF@pzkoszcluster.ns9maab.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(uri, {
    dbName: 'pzkoszNBA'
});

const app = express();
app.use(cors());
const PORT = 3001

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

const playersRouter = require('./routes/playersRoutes');
app.use('/players', playersRouter);
const teamsRouter = require('./routes/teamsRoutes');
app.use('/teams', teamsRouter);

app.listen(PORT, () => console.log(`server started on ${PORT}`));

module.exports = app;



