const Match = require('../models/matchSchema');

class MatchesHandler {

    async getPopulatedMatches() {
        try {
            const populatedMatch = await Match.find().populate({
                path:'opponents',
                populate: [{
                    path: 'players',
                    populate: {
                        path: 'player',
                        model: 'Player'
                    }
                }, {
                    path: 'team',
                    model: 'Team',
                    // populate: {
                    //     path: 'roster',
                    //     model: 'Player'
                    // }
                }],
                });
            return populatedMatch
        } catch (error) {
            console.error('error populating matches', error);
            throw error;
            }
        };
    
    async getSinglePopulatedMatch(identifier) {
        try {
            const populatedMatch = await Match.findOne({ _id: identifier }).populate({
                path:'opponents',
                populate: [{
                    path: 'players',
                    populate: {
                        path: 'player',
                        model: 'Player'
                    }
                }, {
                    path: 'team',
                    model: 'Team',
                    // populate: {
                    //     path: 'roster',
                    //     model: 'Player'
                    // }
                }],
                });
            return populatedMatch
        } catch (error) {
            console.error('error populating matches', error);
            throw error;
            }
        };

    async addMatch(data) {
        try {
            const newDocument = await Match.create(data);
            return newDocument;
        } catch (error) {
            console.error('Error adding document:', error);
            throw error;
        }
        }

}

module.exports = MatchesHandler;