class AggregationHandler {

    //team specific method
    async calculateWinPercentage(teamModel) {
        try {
          const result = await teamModel.aggregate([
            {
              $project: {
                name: 1,
                location: 1,
                conference: 1,
                logoLink: 1,
                statistics: {
                  wins: 1,
                  losses: 1,
                  winPercentage: {
                    $cond: {
                      if: { $eq: ['$statistics.losses', 0] },
                      then: 100,
                      else: {
                        $multiply: [
                          { $divide: ['$statistics.wins', { $add: ['$statistics.wins', '$statistics.losses'] }] },
                          100
                        ]
                      }
                    }
                  }
                }
              }
            }
          ]);
    
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
    
          return result;
        } catch (error) {
          console.error('Error calculating age:', error);
          throw error;
        }
      }

}

module.exports = AggregationHandler