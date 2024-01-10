class DatabaseHandler {

    async getAllDocuments(model, populateArray="") {
        try {
          const documents = await model.find().populate(populateArray);
          return documents;
        } catch (error) {
          console.error('Error fetching documents:', error);
          throw error;
        }
      }

    async patchDocument(model, identifier, updateData) {
      try {

        const allowedFields = Object.keys(model.schema.paths);
        const filteredUpdateData = {};
        Object.keys(updateData).forEach((field) => {
          if (allowedFields.includes(field)) {
            filteredUpdateData[field] = updateData[field];
          }
        });
  
        const document = await model.findOneAndUpdate(identifier, filteredUpdateData, { new: true });
        return document;
      } catch (error) {
        console.error('Error updating document:', error);
        throw error;
      }
    }

    async getSingleDocument(model, identifier, populateArray="") {
      try {
        const document = await model.findOne({ _id: identifier }).populate(populateArray);
        return document;
      } catch (error) {
        console.error('Error getting the document', error)
        throw error;
      }
    }

    async addDocument(model, data) {
      try {
        const { name } = data;
        const existingDocument = await model.findOne({ name });
        if (existingDocument) {
          throw new Error(`Document with name '${name}' already exists.`);
        }
          const newDocument = await model.create(data);
          return newDocument;
      } catch (error) {
        console.error('Error adding document:', error);
        throw error;
      }
    }

    async deleteDocument(model, identifier) {
      try {
        const deletedDocument = await model.findOneAndDelete(identifier);
        return deletedDocument;
      } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
      }
    }

    async getMatchWithPopulatedTeamsAndPlayers(model, matchId) {
      try {
        // Populate opponents array with teams and teams' players
        const populatedMatch = await this.getSingleDocument(model, matchId, 'opponents.team.opponents.players.player');
        return populatedMatch;
      } catch (error) {
        console.error('Error getting the match with populated teams and players', error);
        throw error;
      }
    }

    async getAllDocumentsPopulated(model, populateFields = {}) {
      try {
        const query = Object.entries(populateFields).reduce((q, [field, value]) => q.populate(field, value), model.find());
        const documents = await query.exec();
        return documents;
      } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
    }

    async getTeamsByConferenceOrDivision(model, conferenceOrDivision) {
      try {
        const teams = await model.find({ $or: [{ conference: conferenceOrDivision }, { division: conferenceOrDivision }] }).populate('roster');
        return teams;
      } catch (error) {
        console.error('Error fetching teams by conference or division:', error);
        throw error;
      }
    }

    async getDocumentsByField(model, fieldToSearch, valueToMatch) {
      try {
        const query = {};
        query[fieldToSearch] = valueToMatch;
  
        const documents = await model.find(query);
        return documents;
      } catch (error) {
        console.error(`Error fetching documents by ${fieldToSearch}:`, error);
        throw error;
      }
    }

    async countCollection(model) {
      try {
        const count = await model.countDocuments();
        return count;
      } catch (error) {
        console.error('Error counting documents:', error);
        throw error;
      }
    }

    async countDocuments(model, condition = {}) {
      try {
        const count = await model.countDocuments(condition);
        return count;
      } catch (error) {
        console.error('Error counting documents:', error);
        throw error;
      }
    }

    async getSpecificDocumentValuesByField(model, field, value, select = '') {
      try {
        const query = {};
        query[field] = value;
  
        const result = await model.find(query).select(select);
  
        return result;
      } catch (error) {
        console.error(`Error fetching documents by ${field}:`, error);
        throw error;
      }
    }

    
}

module.exports = DatabaseHandler;