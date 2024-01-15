const Team = require('../models/teamSchema')
const Player = require('../models/PlayerSchema')

class TeamHandler {

    async isPlayerInAnyRoster(playerId) {
        try {
          const teamsWithPlayer = await Team.find({ roster: playerId });
    
          return teamsWithPlayer.length > 0;
        } catch (error) {
          console.error('Error checking player in rosters:', error);
          throw error;
        }
      }

      async addExistingPlayerToRoster(teamId, playerId) {
        try {
          const isPlayerAlreadyInRoster = await this.isPlayerInAnyRoster(playerId);
    
          if (isPlayerAlreadyInRoster) {
            throw new Error('Player is already in a roster.');
          }
    
          const updatedTeam = await Team.findOneAndUpdate(
            { _id: teamId },
            { $addToSet: { roster: playerId } },
            { new: true }
          );
    
          return updatedTeam;
        } catch (error) {
          console.error('Error adding player to roster:', error);
          throw error;
        }
      }

    async getTeamsByConferenceOrDivision(conferenceOrDivision) {
        try {
            const teams = await Team.find({ $or: [{ conference: conferenceOrDivision }, { division: conferenceOrDivision }] }).populate('roster');
            return teams;
        } catch (error) {
            console.error('Error fetching teams by conference or division:', error);
            throw error;
        }
    }

    async removeFromRoster(teamId, playerId) {
        try {
          const updatedTeam = await Team.findOneAndUpdate(
            { _id: teamId },
            { $pull: { roster: playerId } },
            { new: true }
          );
    
          return updatedTeam;
        } catch (error) {
          console.error('Error removing player from roster:', error);
          throw error;
        }
      }

    async convertTeamNamesToLowerCase() {
    try {
        const teams = await Team.find();

        for (const team of teams) {
        const lowerCaseName = team.name.toLowerCase().replaceAll(" ", "-");
        await Team.findByIdAndUpdate(team._id, { $set: { name: lowerCaseName } });
        }
    } catch (error) {
        console.error('Error converting team names to lowercase:', error);
        throw error;
        }
    }

    async updatePlayerTeamById(playerId) {
        try {
          const teamsWithPlayer = await Team.find({ roster: playerId });
    
          if (teamsWithPlayer.length === 1) {
            const team = teamsWithPlayer[0];
            await Player.findByIdAndUpdate(playerId, { $set: { team: team.name } });
          } else {
            await Player.findByIdAndUpdate(playerId, { $set: { team: "teamless" } });
          }
        } catch (error) {
          console.error('Error updating player team by roster:', error);
          throw error;
        }
      }
    
    async assignRandomStatistics() {
        try {
          const teams = await Team.find(); 
      

          const totalGames = 30;
      
          const updatePromises = teams.map(async (team) => {
            const newWins = Math.floor(Math.random() * (totalGames + 1));
            const newLosses = totalGames - newWins;
      
            await Team.updateOne(
              { _id: team._id },
              {
                $set: {
                  'statistics.wins': newWins,
                  'statistics.losses': newLosses,
                },
              }
            );
          });
      
          await Promise.all(updatePromises);
      
          console.log('Random statistics assigned and saved successfully');
        } catch (error) {
          console.error('Error assigning random statistics:', error);
          throw error;
        }
      };

    async getTeamIdByPlayer(playerId) {
      try {
        const teamsWithPlayer = await Team.findOne({ roster: playerId });
    
        if (teamsWithPlayer) {
          return teamsWithPlayer._id; 
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error getting team ID by player roster:', error);
        throw error;
      }
    }
      
    

}

module.exports = TeamHandler;