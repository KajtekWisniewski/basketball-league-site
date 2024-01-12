const Team = require('../models/teamSchema')

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

      async addToRoster(teamId, playerId) {
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
    

}

module.exports = TeamHandler;