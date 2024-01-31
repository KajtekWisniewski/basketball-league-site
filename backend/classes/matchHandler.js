const Match = require('../models/matchSchema');
const Team = require('../models/teamSchema');
const Player = require('../models/PlayerSchema');

class MatchesHandler {
  async getPopulatedMatches(playedBool) {
    try {
      const populatedMatch = await Match.find({ played: playedBool }).populate({
        path: 'opponents',
        populate: [
          {
            path: 'players',
            populate: {
              path: 'player',
              model: 'Player'
            }
          },
          {
            path: 'team',
            model: 'Team'
            // populate: {
            //     path: 'roster',
            //     model: 'Player'
            // }
          }
        ]
      });
      return populatedMatch;
    } catch (error) {
      console.error('error populating matches', error);
      throw error;
    }
  }

  async getSinglePopulatedMatch(identifier) {
    try {
      const populatedMatch = await Match.findOne({ _id: identifier }).populate({
        path: 'opponents',
        populate: [
          {
            path: 'players',
            populate: {
              path: 'player',
              model: 'Player'
            }
          },
          {
            path: 'team',
            model: 'Team'
            // populate: {
            //     path: 'roster',
            //     model: 'Player'
            // }
          }
        ]
      });
      return populatedMatch;
    } catch (error) {
      console.error('error populating matches', error);
      throw error;
    }
  }

  async addMatch(data) {
    try {
      const team1 = data.opponents[0].team;
      const team2 = data.opponents[1].team;
      if (team1 === team2) {
        throw new Error('A team cant play itself');
      }
      const newDocument = await Match.create(data);
      return newDocument;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  async assignRandomPlayerStatistics() {
    try {
      const matches = await Match.find();

      const updatePromises = matches.map(async (match) => {
        const updatedOpponents = match.opponents.map(async (opponent) => {
          const updatedPlayers = opponent.players.map(async (playerId) => {
            const player = await Player.findById(playerId);

            const newPlayerStatistics = {
              rebounds: Math.floor(Math.random() * 21),
              points: Math.floor(Math.random() * 31),
              foulsCommitted: Math.floor(Math.random() * 6),
              freeThrowsMade: Math.floor(Math.random() * 11),
              freeThrowPercentage: Math.random() * (101 - 60) + 60
            };

            await Player.updateOne(
              { _id: playerId },
              { $set: { statistics: newPlayerStatistics } }
            );
          });

          await Promise.all(updatedPlayers);
        });

        await Promise.all(updatedOpponents);
      });

      await Promise.all(updatePromises);

      console.log('Random player statistics assigned and saved successfully');
    } catch (error) {
      console.error('Error assigning random player statistics:', error);
      throw error;
    }
  }

  async updatePlayerTotalStatistics() {
    try {
      const totalPlayerStatistics = await Match.aggregate([
        {
          $unwind: '$opponents'
        },
        {
          $unwind: '$opponents.players'
        },
        {
          $lookup: {
            from: 'players',
            localField: 'opponents.players',
            foreignField: '_id',
            as: 'player'
          }
        },
        {
          $unwind: '$player'
        },
        {
          $group: {
            _id: '$player._id',
            rebounds: { $sum: '$player.statistics.rebounds' },
            points: { $sum: '$player.statistics.points' },
            foulsCommitted: { $sum: '$player.statistics.foulsCommitted' },
            freeThrowsMade: { $sum: '$player.statistics.freeThrowsMade' },
            freeThrowPercentage: { $avg: '$player.statistics.freeThrowPercentage' }
          }
        }
      ]);

      // Update the total statistics for each player in the database
      await Promise.all(
        totalPlayerStatistics.map(async (playerStats) => {
          const playerId = playerStats._id;
          delete playerStats._id; // Remove the _id field before updating

          await Player.updateOne(
            { _id: playerId },
            { $set: { totalStatistics: playerStats } }
          );
        })
      );

      console.log('Player total statistics updated successfully');
    } catch (error) {
      console.error('Error updating player total statistics:', error);
      throw error;
    }
  }

  async findPlayerMatches(playerId) {
    try {
      const player = await Player.findById(playerId);

      if (!player) {
        console.error('Player not found');
        return;
      }

      const matches = await Match.find({ 'opponents.players.player': playerId });
      const sortedMatches = matches.sort((a, b) => b.date - a.date);
      const matchesIds = sortedMatches.map((match) => match._id);
      return matchesIds;
    } catch (error) {
      console.error('Error finding player matches', error);
    }
  }
}

module.exports = MatchesHandler;
