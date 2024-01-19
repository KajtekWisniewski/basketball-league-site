const Match = require('../models/matchSchema');
const Team = require('../models/teamSchema');
const Player = require('../models/PlayerSchema');

class AggregationHandler {
  //team specific method
  async calculateWinPercentage(teamModel) {
    try {
      const result = await teamModel.aggregate([
        {
          $project: {
            ...Object.keys(teamModel.schema.paths).reduce((acc, field) => {
              acc[field] = 1;
              return acc;
            }, {}),
            'statistics.winPercentage': {
              $cond: {
                if: { $eq: ['$statistics.losses', 0] },
                then: 100,
                else: {
                  $multiply: [
                    {
                      $divide: [
                        '$statistics.wins',
                        { $add: ['$statistics.wins', '$statistics.losses'] }
                      ]
                    },
                    100
                  ]
                }
              }
            }
          }
        }
      ]);

      await Promise.all(
        result.map(async (doc) => {
          await teamModel.updateOne(
            { _id: doc._id },
            { $set: { 'statistics.winPercentage': doc.statistics.winPercentage } }
          );
        })
      );

      return result;
    } catch (error) {
      console.error('Error calculating win percentage:', error);
      throw error;
    }
  }

  //player specific method
  async calculateAge(playerModel) {
    try {
      const result = await playerModel.aggregate([
        {
          $project: {
            ...Object.keys(playerModel.schema.paths).reduce((acc, field) => {
              acc[field] = 1;
              return acc;
            }, {}),
            age: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), '$birthdate'] },
                  1000 * 60 * 60 * 24 * 365 // Milliseconds per year
                ]
              }
            }
          }
        }
      ]);

      await Promise.all(
        result.map(async (doc) => {
          await playerModel.updateOne({ _id: doc._id }, { $set: { age: doc.age } });
        })
      );

      return result;
    } catch (error) {
      console.error('Error calculating age:', error);
      throw error;
    }
  }

  async assignRandomStatistics(playerModel) {
    try {
      const players = await playerModel.find();

      const updatePromises = players.map(async (team) => {
        const newWins = Math.floor(Math.random() * (totalGames + 1));
        const newLosses = totalGames - newWins;

        await playerModel.updateOne(
          { _id: team._id },
          {
            $set: {
              'statistics.wins': newWins,
              'statistics.losses': newLosses
            }
          }
        );
      });

      await Promise.all(updatePromises);

      console.log('Random statistics assigned and saved successfully');
    } catch (error) {
      console.error('Error assigning random statistics:', error);
      throw error;
    }
  }

  // DO PRZEROBIENIA !!!!
  async updatePlayerStatistics2(playerId) {
    try {
      const player = await Player.findById(playerId);

      if (!player) {
        console.error('Player not found');
        return;
      }

      const matches = await Match.find({ 'opponents.players.player': playerId });

      const aggregatedStatistics = matches.reduce(
        (accumulator, match) => {
          match.opponents.forEach((opponent) => {
            opponent.players.forEach((playerStats) => {
              if (playerStats.player.toString() === playerId) {
                accumulator.rebounds += playerStats.matchStatistics.rebounds;
                accumulator.points += playerStats.matchStatistics.points;
                accumulator.foulsCommitted +=
                  playerStats.matchStatistics.foulsCommitted;
                accumulator.freeThrowsMade +=
                  playerStats.matchStatistics.freeThrowsMade;
                accumulator.freeThrowPercentage +=
                  playerStats.matchStatistics.freeThrowPercentage / matches.length;
              }
            });
          });

          return accumulator;
        },
        {
          gamesPlayed: matches.length,
          rebounds: 0,
          points: 0,
          foulsCommitted: 0,
          freeThrowsMade: 0,
          freeThrowPercentage: 0
        }
      );

      player.statistics = aggregatedStatistics;

      await player.save();

      //console.log('Player statistics updated successfully');
    } catch (error) {
      console.error('Error updating player statistics:', error);
    }
  }
}

module.exports = AggregationHandler;
